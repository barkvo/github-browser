import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { Repository } from "../repo-browser.types";

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

const CustomTableOverlay: (text: string) => React.FC = (text) => () => (
  <Stack height="100%" alignItems="center" justifyContent="center">
    {text}
  </Stack>
)

const DataTable: React.FC<DataTableProps> = ({ data, isLoading }) => {
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