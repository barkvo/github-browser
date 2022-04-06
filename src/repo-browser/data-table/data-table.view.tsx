import React, { FC, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { pipe } from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import { Repository } from "../repo-browser.types";
import Stack from '@mui/material/Stack';

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'openIssuesAmount',
    headerName: 'Open issues',
    flex: 0.3,
  },
  {
    field: 'starsAmount',
    headerName: 'Stars',
    flex: 0.3,
  },
];

interface DataTableProps {
  data: ReadonlyArray<Repository>;
  isLoading?: boolean;
}

const CustomTableOverlay: (text: string) => FC = (text) => () => (
  <Stack height="100%" alignItems="center" justifyContent="center">
    {text}
  </Stack>
)

const DataTable: FC<DataTableProps> = ({ data, isLoading }) => {
  return (
    <div style={{ height: 400, width: '100%', opacity: isLoading ? 0.5 : 1 }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={15}
        rowsPerPageOptions={[5, 10, 15, 20]}
        loading={isLoading}
        disableColumnFilter={true}
        hideFooterPagination={isLoading}
        disableColumnMenu={isLoading}
        disableSelectionOnClick={true}
        components={{
          NoRowsOverlay: CustomTableOverlay("No repositories found"),
        }}
      />
    </ div>
  );
};

export default DataTable;