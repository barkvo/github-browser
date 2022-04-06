import TextField from "@mui/material/TextField";
import React from "react";

export interface RepoNameFilterProps {
  setRepoName: (i?: string) => void;
}

export const RepoNameFilter: React.FC<RepoNameFilterProps> = ({ setRepoName }) => {
  return (
    <TextField
      label="Repository name"
      onChange={(event) => setRepoName(event.target.value)}
      size="small"
    />
  );
};

export default RepoNameFilter;
