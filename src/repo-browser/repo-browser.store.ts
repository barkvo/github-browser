import { isFinite, isUndefined } from "lodash";
import { makeAutoObservable } from "mobx";
import {
  Organization,
  Repository,
  RepoBrowserStore as RepoBrowserStoreInterface,
  RepositoryFilters,
} from "./repo-browser.types";

export class RepoBrowserStore implements RepoBrowserStoreInterface {
  constructor() {
    makeAutoObservable(this);
  }

  public selectedOrganization?: Organization;

  public setSelectedOrganization = (value?: Organization) => {
    this.selectedOrganization = value;
  };

  public repositoriesLoading: boolean = false;
  public repositoriesLoadingError?: string;

  public setRepositoriesLoading = ({ isLoading, error }: { isLoading: boolean; error?: string }) => {
    this.repositoriesLoading = isLoading;
    this.repositoriesLoadingError = error;
  };

  public repositories: ReadonlyArray<Repository> = [];

  public setRepositories = (repositories: ReadonlyArray<Repository>) => {
    this.repositories = repositories;
  };

  public repositoryFilters: RepositoryFilters = {};

  public setRepositoryFilters = (filters: RepositoryFilters) => {
    this.repositoryFilters = { ...this.repositoryFilters, ...filters };
  };

  public get filteredRepositories() {
    const { repoName, openIssuesFrom, openIssuesTo } = this.repositoryFilters;
    return this.repositories
      .filter((r) => !!repoName ? r.name.includes(repoName) : true)
      .filter((r) => !isUndefined(openIssuesFrom) && isFinite(openIssuesFrom) ? r.openIssuesAmount >= openIssuesFrom : true)
      .filter((r) => !isUndefined(openIssuesTo) && isFinite(openIssuesTo) ? r.openIssuesAmount <= openIssuesTo : true);
  }

}
