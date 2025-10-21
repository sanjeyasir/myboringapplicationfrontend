import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid } from "@mui/x-data-grid";
import { get } from "../../services/API";
import { TextField, Box, Button } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

export default function MasterCategory() {
  const [navOpen, setNavOpen] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await get("/users/getUsers");
        setUsers(res);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Role Name", width: 150 },
    { field: "created_at", headerName: "Created At", width: 150 },
    { field: "updated_at", headerName: "Updated At", width: 150 },
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
           <MDTypography variant="body2" color="textSecondary">
                Masters &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Category Creation</span>
            </MDTypography>



            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
                >
                <div
                    style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    width: "100%",
                    padding: "24px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    }}
                >
                    <TextField label="Role Name" variant="outlined" required />
                      <MDButton type="submit" variant="contained" color="primary" style={{width:'150px'}}>
                        Submit
                      </MDButton>
                </div>
            </div>


          
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                }}
                >

                <div
                    style={{
                    height: 400,
                    width: "100%",
                    padding: "16px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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

            </div>

        </main>
        
      </div>
    </div>
  );
}