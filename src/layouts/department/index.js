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

export default function Department() {
  const [navOpen, setNavOpen] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [name, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const userId = "7";

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments
  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await get("/department/getDepartment");
      setDepartments(res);
    } catch (err) {
      toast.error("Failed to fetch departments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewLogs = async (id) => {
    setOpen(true); // open popup
    setLoading(true);
    try {
      const table_name = "tbl_department";
      const res = await get(`/logs/getLogs/${table_name}/${id}`);
      setLogs(res); // assuming res is an array of logs
    } catch (err) {
      toast.error("Failed to fetch logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setOpen(false);

  // Create new department
  async function createNewDepartment() {
    if (!name) return;
    setLoading(true);
    try {
      const reqBody = { name: name, created_by: userId };
      await post("/department/createDepartment", reqBody);
      toast.success("Department created successfully!");
      setDepartmentName("");
      await fetchDepartments();
    } catch (err) {
      toast.error("Failed to create department");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update role inline
  async function handleRowEditCommit(params) {
    const { id, field, value } = params;

    if (field === "name") {
      setLoading(true);
      try {
        const reqBody = { id, name: value, created_by: userId };
        await post("/department/updateDepartment", reqBody);
        // Success toast (fully green filled)
        toast.success("Department updated successfully!", {
          style: {
            backgroundColor: "#4caf50", // green fill
            color: "#fff",               // white text
          },
        });

        await fetchDepartments();
      } catch (err) {
        toast.error("Failed to update department");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }

  // Delete department
  async function handleDeleteDepartment(id) {
    setLoading(true);
    try {
      await post("/department/deleteDepartment", { id });
      toast.success("Department deleted successfully!");
      await fetchDepartments();
    } catch (err) {
      toast.error("Failed to delete department");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: true, // enable inline editing
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Trash2 color="red" />}
          label="Delete"
          onClick={() => handleDeleteDepartment(params.id)}
        />,
        <GridActionsCellItem
          icon={<Eye color="blue" />}
          label="View Logs"
          onClick={() => handleViewLogs(params.id)}
        />,
        
      ],
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
            marginTop: "60px",
            marginLeft: navOpen ? "250px" : "60px",
            transition: "margin-left 0.3s ease",
            padding: "20px",
            overflow: "auto",
            position: "relative",
          }}
        >
          <MDTypography variant="body2" color="textSecondary">
            Users &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Department</span>
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
                label="Role Name"
                variant="outlined"
                required
                value={name}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewDepartment}
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
                rows={departments}
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

          {/* Log Modal */}
          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Department Logs
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              {loading ? (
                <CircularProgress />
              ) : (
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={logs}
                    columns={[
                      { field: "id", headerName: "ID", width: 70 },
                      { field: "current", headerName: "Current", width: 200 },
                      { field: "previous", headerName: "Previous", width: 200 },
                      { field: "created_at", headerName: "Created At", width: 180 },
                      { field: "created_by", headerName: "Created By", width: 120 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                  />
                </div>
              )}
            </DialogContent>

            {/* Optional: Footer Close Button */}
            <DialogActions>
              <MDButton onClick={handleClose} color="primary" variant="outlined">
                Close
              </MDButton>
            </DialogActions>

          </Dialog>

        </main>
      </div>
    </div>
  );
}