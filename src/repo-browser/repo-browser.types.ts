export interface SearchOrganizationsRequest {
  q: string;
}

export interface OrganizationExternal {
  id: number;
  type: "Organization";
  login: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface SearchOrganizationsResponse {
  incomplete_results: boolean;
  items: ReadonlyArray<OrganizationExternal>;
  total_count: number;
}

export interface ListRepositoriesRequest {
  per_page: number;
  page: number;
}

export interface RepositoryExternal {
  id: string;
  name: string;
  stargazers_count: number;
  open_issues_count: number;
}

export type ListRepositoriesResponse = ReadonlyArray<RepositoryExternal>;

export interface Repository {
  id: string;
  name: string;
  starsAmount: number;
  openIssuesAmount: number;
}

export interface RepositoryFilters {
  repoName?: string
  openIssuesFrom?: number;
  openIssuesTo?: number;
}

export interface RepoBrowserStore {
  selectedOrganization?: Organization;
  setSelectedOrganization: (v?: Organization) => void;
  repositoriesLoading: boolean;
  repositoriesLoadingError?: string;
  setRepositoriesLoading: (v: { isLoading: boolean; error?: string }) => void;
  repositories: ReadonlyArray<Repository>;
  setRepositories: (v: ReadonlyArray<Repository>) => void;
  repositoryFilters: RepositoryFilters;
  setRepositoryFilters: (v: RepositoryFilters) => void;
  filteredRepositories: ReadonlyArray<Repository>;
}
