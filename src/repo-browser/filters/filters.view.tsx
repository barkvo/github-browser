import Box from "@mui/material/Box";
import { observer } from "mobx-react";
import React from "react";
import OpenIssuesFromFilter, { OpenIssuesFromFilterProps } from "./open-issues-from-filter.view";
import OpenIssuesToFilter, { OpenIssuesToFilterProps } from "./open-issues-to-filter.view";
import OrganizationSelector, { OrganizationSelectorProps } from "./organization-selector.view";
import RepoNameFilter, { RepoNameFilterProps } from "./repo-name-filter.view";
import { GithubApiService } from "../github-api.service";
import { Organization } from "../repo-browser.types";

type FiltersProps = OrganizationSelectorProps & RepoNameFilterProps & OpenIssuesFromFilterProps & OpenIssuesToFilterProps & {
  selectedOrganization?: Organization;
  apiService: GithubApiService;
}

const Filters: React.FC<FiltersProps> = observer(({
  selectOrganization,
  selectedOrganization,
  setRepoName,
  openIssuesTo,
  setOpenIssuesFrom,
  openIssuesFrom,
  setOpenIssuesTo,
  apiService,
}) => {
  const secondaryFiltersVisible = !!selectedOrganization;
  return (
    <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { marginTop: 1, marginBottom: 1, marginRight: 2, width: '25ch' },
          marginBottom: 1,
        }}
        noValidate
        autoComplete="off"
      >
        <OrganizationSelector selectOrganization={selectOrganization} apiService={apiService} />
        {
          secondaryFiltersVisible && (
            <React.Fragment>
              <RepoNameFilter setRepoName={setRepoName} />
              <OpenIssuesFromFilter openIssuesTo={openIssuesTo} setOpenIssuesFrom={setOpenIssuesFrom}/>
              <OpenIssuesToFilter openIssuesFrom={openIssuesFrom} setOpenIssuesTo={setOpenIssuesTo}/>
            </React.Fragment>
          )
        }
      </Box>
  );
});

export default Filters;