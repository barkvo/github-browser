import TextField from '@mui/material/TextField';
import { isFinite, isUndefined } from "lodash";
import React, { ChangeEventHandler, FC, useEffect, useState } from "react";

export interface OpenIssuesToFilterProps {
  openIssuesFrom?: number;
  setOpenIssuesTo: (i?: number) => void;
}

export const OpenIssuesToFilter: FC<OpenIssuesToFilterProps> = ({ openIssuesFrom, setOpenIssuesTo }) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => setValue(event.target.value);
  useEffect(() => {
    const isEmpty = isUndefined(value) || !value.length;
    const parsedValue = parseInt(value || "", 10);
    const isValidNumber = isFinite(parsedValue);
    const isValidWithOpenIssuesTo = !isUndefined(openIssuesFrom) && isFinite(openIssuesFrom) ? parsedValue > openIssuesFrom : true; 
    const isValid = isEmpty || (isValidNumber && isValidWithOpenIssuesTo);
    setIsValid(isValid);
    setOpenIssuesTo(!isValid || isEmpty ? undefined : parsedValue);
  }, [value, openIssuesFrom, setOpenIssuesTo]);
  return (
    <TextField
      error={!isValid}
      helperText={!isValid && "Number, greater than 'Open issues from'"}
      label="Open issues to"
      onChange={onChange}
      value={value}
      size="small"
    />
  );
};

export default OpenIssuesToFilter;
