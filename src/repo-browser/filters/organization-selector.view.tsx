import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { pipe } from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import { debounce } from "lodash";
import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import { searchOrganizations } from "../repo-browser.service";
import { Organization } from "../repo-browser.types";
import { GithubApiService } from "../github-api.service";

export interface OrganizationSelectorProps {
  selectOrganization: (i?: Organization) => void;
  apiService: GithubApiService;
}

export const OrganizationSelector: FC<OrganizationSelectorProps> = ({ selectOrganization, apiService }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [organizations, setOrganizations] = useState<ReadonlyArray<Organization>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onInputChange = debounce((e: React.SyntheticEvent, value: string) => {
    setIsLoading(true);
    pipe(
      searchOrganizations({ orgName: value, apiService }),
      TE.fold(
        (e) => {
          enqueueSnackbar(`Failed to load organizations: ${e}`);
          return TE.right(void 0);
        },
        ({ organizations }) => {
          setOrganizations(organizations);
          return TE.right(void 0);
        },
      ),
      TE.map(() => setIsLoading(false)),
    )();
  }, 400);
  return (
    <Autocomplete
      disableClearable
      options={organizations}
      getOptionLabel={(org) => org.name}
      filterOptions={(x) => x}
      onInputChange={onInputChange}
      onChange={(e, v) => selectOrganization(v)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={isLoading}
      noOptionsText="Type to search github organizations"
      renderInput={(params) => (
        <TextField
          {...params}
          label="Organization"
          required
          InputProps={{ ...params.InputProps }}
          size="small"
        />
      )}
    />
  ); 
};

export default OrganizationSelector;
