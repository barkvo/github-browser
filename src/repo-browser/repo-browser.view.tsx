import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { pipe } from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import { toJS } from "mobx";
import { observer } from "mobx-react";
import React, { FC, useState } from "react";
import { DataTable, TablePlaceholder } from "./data-table";
import { Filters } from "./filters";
import { GithubApiService } from "./github-api.service";
import { loadAllRepositories } from "./repo-browser.service";
import { RepoBrowserStore } from "./repo-browser.store";
import { Organization, RepoBrowserStore as RepoBrowserStoreInterface } from "./repo-browser.types";

const ErrorAlert: FC<{ text: string; retryAction: () => void }> = ({ text, retryAction }) => {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={retryAction}>
          Try again
        </Button>
      }
      sx={{ marginBottom: "20px" }}
    >
      {text}
    </Alert>
  );
};

interface RepoBrowserState {
  repoBrowserStore: RepoBrowserStoreInterface;
  apiService: GithubApiService;
}

const RepoBrowser: FC = observer(() => {
  const [{ repoBrowserStore, apiService }] = useState<RepoBrowserState>({
    repoBrowserStore: new RepoBrowserStore(),
    apiService: new GithubApiService(),
  });
  const loadRepositories = () => {
    if (!repoBrowserStore.selectedOrganization) {
      return;
    }
    repoBrowserStore.setRepositoriesLoading({ isLoading: true });
    pipe(
      loadAllRepositories({ organization: repoBrowserStore.selectedOrganization.name, apiService }),
      TE.fold(
        (e) => {
          repoBrowserStore.setRepositoriesLoading({ isLoading: false, error: e+"" });
          return TE.right(void 0);
        },
        ({ repositories }) => {
          repoBrowserStore.setRepositories(repositories);
          repoBrowserStore.setRepositoriesLoading({ isLoading: false });
          return TE.right(void 0);
        },
      ),
    )();
  };
  const selectOrganizationHandler = (org?: Organization) => {
    repoBrowserStore.setSelectedOrganization(org);
    loadRepositories();
  }
  const repositoriesLoadErrorMessage = repoBrowserStore.repositoriesLoadingError && (
    <ErrorAlert
      text={`Ouch! Error occured while loading repositories: ${repoBrowserStore.repositoriesLoadingError}`}
      retryAction={loadRepositories}
    />
  );
  const dataTableContent = repoBrowserStore.selectedOrganization ? (
    <DataTable
      data={toJS(repoBrowserStore.filteredRepositories)}
      isLoading={repoBrowserStore.repositoriesLoading}
    />
  ) : <TablePlaceholder />;
  return (
    <React.Fragment>
      <Box sx={{ width: '100%', marginTop: "20px" }}>
        <Typography variant="h4" component="div" gutterBottom>
          Github browser
        </Typography>
      </Box>
      <Filters
        selectOrganization={selectOrganizationHandler}
        selectedOrganization={repoBrowserStore.selectedOrganization}
        setOpenIssuesFrom={(openIssuesFrom) => repoBrowserStore.setRepositoryFilters({ openIssuesFrom })}
        openIssuesTo={repoBrowserStore.repositoryFilters.openIssuesTo}
        setOpenIssuesTo={(openIssuesTo) => repoBrowserStore.setRepositoryFilters({ openIssuesTo })}
        openIssuesFrom={repoBrowserStore.repositoryFilters.openIssuesFrom}
        setRepoName={(repoName) => repoBrowserStore.setRepositoryFilters({ repoName })}
        apiService={apiService}
      />
      {repositoriesLoadErrorMessage}
      {dataTableContent}
    </React.Fragment>
  );
});

export default RepoBrowser;