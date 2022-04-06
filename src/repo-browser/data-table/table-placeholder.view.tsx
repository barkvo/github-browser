import * as colors from "@mui/material/colors";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";

const TablePlaceholder: React.FC = () => {
  return (
    <Container sx={{
      backgroundColor: colors.lightBlue[50],
      height: 300,
      marginTop: "10px",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      opacity: 0.5,
    }}>
      <Typography variant="subtitle1" component="div" gutterBottom>
        Select an organization to start browsing repositories!
      </Typography>
    </Container>
  );
}

export default TablePlaceholder;
