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

export default function Section() {
  const [navOpen, setNavOpen] = useState(true);
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  

  const userId = "7";

  useEffect(() => {
    fetchSection();
  }, []);

  // Fetch entity
  async function fetchSection() {
    setLoading(true);
    try {
      const res = await get("/section/getSection");
      console.log("====>",res);
      if(res.length==0){
        throw new Error('No data!')
      }
      setSections(res);
    } catch (err) {
      toast.error(`Failed to fetch section: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new company
  async function createNewSection() {
    if (!section) return;
    setLoading(true);
    try {
      const reqBody = { section:section};
      await post("/section/createSection", reqBody);
      toast.success("Section created successfully!");
      setSection("");
      await fetchSection();
    } catch (err) {
      toast.error("Failed to create section");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update entity inline
  async function handleRowEditCommit(params) {
    const { id, field, value } = params; // destructure

    // Find the current row in state
    const currentRow = sections.find(p => p.id === id);
    if (!currentRow) return;

    // Build full payload with updated value
    const reqBody = {
      id,
      section: field === "section" ? value : currentRow.section,
    };

    setLoading(true);
    try {
      await post("/section/updateSection", reqBody);
      toast.success("Section updated successfully!");
      await fetchSection(); // refresh data
    } catch (err) {
      toast.error("Failed to update section");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "section",
      headerName: "Section",
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
            Master &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Section</span>
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
                label="Section"
                variant="outlined"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
              
              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewSection}
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
                rows={sections}
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