import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

const Layout: FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </React.Fragment>
  );
}

export default Layout;
