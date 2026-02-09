import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { get, post } from "../../services/API";
import { TextField, CircularProgress, Backdrop } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 , Eye} from "lucide-react";
import { Dialog, DialogTitle, DialogContent,IconButton,DialogActions} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Company() {
  const [navOpen, setNavOpen] = useState(true);
  const [companys, setCompanys] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  

  const userId = "7";

  useEffect(() => {
    fetchCompany();
  }, []);

  // Fetch entity
  async function fetchCompany() {
    setLoading(true);
    try {
      const res = await get("/company/getCompany");
      console.log("====>",res);
      if(res.length==0){
        throw new Error('No data!')
      }
      setCompanys(res);
    } catch (err) {
      toast.error(`Failed to fetch company: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new company
  async function createNewCompany() {
    if (!company) return;
    setLoading(true);
    try {
      const reqBody = { company: company};
      await post("/company/createCompany", reqBody);
      toast.success("Company created successfully!");
      setCompany("");
      await fetchCompany();
    } catch (err) {
      toast.error("Failed to create company");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update entity inline
  async function handleRowEditCommit(params) {
    const { id, field, value } = params; // destructure

    // Find the current row in state
    const currentRow = companys.find(p => p.id === id);
    if (!currentRow) return;

    // Build full payload with updated value
    const reqBody = {
      id,
      company: field === "company" ? value : currentRow.company,
    };

    setLoading(true);
    try {
      await post("/company/updateCompany", reqBody);
      toast.success("Company updated successfully!");
      await fetchCompany(); // refresh data
    } catch (err) {
      toast.error("Failed to update company");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "company",
      headerName: "Company",
      width: 200,
      editable: true, // enable inline editing
    },
  ];

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Header navOpen={navOpen} systemName="Meal Management System" />

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            marginTop: "60px",
            marginLeft: navOpen ? "250px" : "60px",
            transition: "margin-left 0.3s ease",
            padding: "20px",
            overflow: "auto",
            position: "relative",
          }}
        >
          <MDTypography variant="body2" color="textSecondary">
            Master &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Company</span>
          </MDTypography>

          {/* Role creation form */}
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
              <TextField
                label="Company"
                variant="outlined"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              
              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewCompany}
              >
                Submit
              </MDButton>
            </div>
          </div>

          {/* DataGrid */}
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
                rows={companys}
                columns={columns}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row, index) => row.id || index}
                onCellEditCommit={handleRowEditCommit} // update on enter
              />
            </div>
          </div>

          {/* Loading Backdrop */}
          <Backdrop open={loading} style={{ color: "#fff", zIndex: 9999 }}>
            <CircularProgress color="inherit" />
          </Backdrop>

          {/* Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

         
        </main>
      </div>
    </div>
  );
}
