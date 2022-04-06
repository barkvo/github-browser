import { pipe } from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, mergeMap, reduce } from "rxjs/operators";
import { eitherToPromise } from "../core/fp-ts/eitherToPromise";
import { GithubApiService } from "./github-api.service";
import {
  ListRepositoriesRequest,
  ListRepositoriesResponse,
  OrganizationExternal,
  Organization,
  Repository,
  RepositoryExternal,
  SearchOrganizationsRequest,
  SearchOrganizationsResponse,
} from "./repo-browser.types";

const transformExternalOrganizations = (input: ReadonlyArray<OrganizationExternal>): ReadonlyArray<Organization> =>
  input.map((i) => ({ name: i.login, id: i.id }));

export const searchOrganizations = ({
  orgName,
  apiService,
}: {
  orgName: string;
  apiService: GithubApiService;
}): TE.TaskEither<
  Error,
  { orgName: string; organizations: ReadonlyArray<Organization> }
> => {
  return pipe(
    TE.right<never, SearchOrganizationsRequest>({ q: `${orgName} type:org` }),
    TE.chain((params) => apiService.get<SearchOrganizationsResponse>("/search/users", { params })),
    TE.map((result) => {
      return {
        orgName,
        organizations: transformExternalOrganizations(result.data.items),
      };
    })
  );
}

const transformExternalRepositories = (input: ReadonlyArray<RepositoryExternal>): ReadonlyArray<Repository> =>
  input.map(
    ({ id, name, stargazers_count, open_issues_count }) =>
      ({ id, name, starsAmount: stargazers_count, openIssuesAmount: open_issues_count })
  );

interface GetRepositoriesListResult {
  organization: string;
  page: number;
  perPage: number;
  repositories: ReadonlyArray<Repository>;
}

const getRepositoriesList = ({
  organization,
  page = 1,
  perPage = 100,
  apiService
}: {
  organization: string;
  page?: number;
  perPage?: number;
  apiService: GithubApiService;
}): TE.TaskEither<
  Error,
  GetRepositoriesListResult
> => {
  return pipe(
    TE.right<never, ListRepositoriesRequest>({ page, per_page: perPage }),
    TE.chain((params) => apiService.get<ListRepositoriesResponse>(`/orgs/${organization}/repos`, { params })),
    TE.map((result) => {
      return {
        organization,
        page,
        perPage,
        repositories: transformExternalRepositories(result.data),
      };
    })
  );
}

const iterateOverRepositoriesListApi = ({
  organization,
  perPage,
  pageLimit,
  apiService,
}: {
  organization: string;
  perPage: number;
  pageLimit: number;
  apiService: GithubApiService;
}): Observable<GetRepositoriesListResult> => {
  const paginationSubject = new BehaviorSubject<number>(1);
  return paginationSubject.pipe(
    mergeMap((page) => from(
      eitherToPromise(
        getRepositoriesList({ organization, page, perPage, apiService })
      )
    )),
    map((result) => {
      if (!result.repositories.length || result.page === pageLimit) {
        paginationSubject.complete();
      } else {
        paginationSubject.next(result.page + 1);
      }
      return result;
    }),
  );
}

interface LoadAllRepositoriesResult {
  organization: string;
  perPage: number;
  pageLimit: number;
  repositories: ReadonlyArray<Repository>;
}

export const loadAllRepositories = ({
  organization,
  perPage = 100,
  pageLimit = 3,
  apiService,
}: {
  organization: string;
  perPage?: number;
  pageLimit?: number;
  apiService: GithubApiService;
}): TE.TaskEither<Error, LoadAllRepositoriesResult> => {
  return pipe(
    TE.tryCatch<Error, ReadonlyArray<Repository>>(
      () => {
        return iterateOverRepositoriesListApi({ organization, perPage, pageLimit, apiService })
          .pipe(
            reduce<GetRepositoriesListResult, ReadonlyArray<Repository>>(
              (repos, chunk) => { return [...repos, ...chunk.repositories] },
              []
            ),
          )
          .toPromise() as Promise<ReadonlyArray<Repository>>;
      },
      (e) => new Error(`Repositories API error: ${e}`),
    ),
    TE.map((repositories) => {
      return {
        organization,
        perPage,
        pageLimit,
        repositories,
      };
    })
  )
}
