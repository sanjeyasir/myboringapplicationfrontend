import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

// Utility to generate random users
const generateRandomUsers = (num = 20) => {
  const names = ["Alice", "Bob", "Charlie", "David", "Eve", "Fiona", "George"];
  const domains = ["example.com", "mail.com", "test.org"];
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)],
    email: `${names[Math.floor(Math.random() * names.length)].toLowerCase()}@${
      domains[Math.floor(Math.random() * domains.length)]
    }`,
    phone: `+1-202-555-${Math.floor(1000 + Math.random() * 9000)}`,
    status: Math.random() > 0.3,
    created_at: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
    updated_at: new Date(
      Date.now() - Math.floor(Math.random() * 5000000000)
    ).toLocaleDateString(),
  }));
};

export default function Dashboard() {
  const [navOpen, setNavOpen] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(generateRandomUsers(25));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.value ? (
          <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>Inactive</span>
        ),
    },
    { field: "created_at", headerName: "Created At", width: 150 },
    { field: "updated_at", headerName: "Updated At", width: 150 },
  ];

  // Dashboard summary cards
  const metrics = [
    { label: "Total Users", value: users.length, color: "#4caf50" },
    {
      label: "Active Users",
      value: users.filter((u) => u.status).length,
      color: "#2196f3",
    },
    {
      label: "Inactive Users",
      value: users.filter((u) => !u.status).length,
      color: "#f44336",
    },
    {
      label: "New Users Today",
      value: Math.floor(Math.random() * 10),
      color: "#ff9800",
    },
  ];

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header navOpen={navOpen} systemName="Asset Management System" />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            marginTop: "60px", // header height
            marginLeft: navOpen ? "250px" : "60px",
            transition: "margin-left 0.3s ease",
            padding: "20px",
            overflow: "auto",
          }}
        >
          {/* Metrics Cards */}
          <Grid container spacing={2} marginBottom={3}>
            {metrics.map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    borderLeft: `5px solid ${metric.color}`,
                    backgroundColor: "#f9f9f9",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    padding: "16px",
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      {metric.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={metric.color}>
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Users Table */}
          <div
            style={{
              height: 500,
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              backgroundColor: "#fff",
            }}
          >
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </main>
      </div>
    </div>
  );
}





