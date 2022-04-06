import TextField from '@mui/material/TextField';
import { isFinite, isUndefined } from "lodash";
import React, { ChangeEventHandler, FC, useEffect, useState } from "react";

export interface OpenIssuesFromFilterProps {
  openIssuesTo?: number;
  setOpenIssuesFrom: (i?: number) => void;
}

export const OpenIssuesFromFilter: FC<OpenIssuesFromFilterProps> = ({ openIssuesTo, setOpenIssuesFrom }) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => setValue(event.target.value);
  useEffect(() => {
    const isEmpty = isUndefined(value) || !value.length;
    const parsedValue = parseInt(value || "", 10);
    const isValidNumber = isFinite(parsedValue);
    const isValidWithOpenIssuesTo = !isUndefined(openIssuesTo) && isFinite(openIssuesTo) ? parsedValue < openIssuesTo : true; 
    const isValid = isEmpty || (isValidNumber && isValidWithOpenIssuesTo);
    setIsValid(isValid);
    setOpenIssuesFrom(!isValid || isEmpty ? undefined : parsedValue);
  }, [value, openIssuesTo, setOpenIssuesFrom]);
  return (
    <TextField
      error={!isValid}
      helperText={!isValid && "Number, lower than 'Open issues to'"}
      label="Open issues from"
      onChange={onChange}
      value={value}
      size="small"
    />
  );
};

export default OpenIssuesFromFilter;
