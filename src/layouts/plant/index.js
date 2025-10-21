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

export default function Plant() {
  const [navOpen, setNavOpen] = useState(true);
  const [plant, setPlant] = useState([]);
  const [name, setName] = useState("");
  const [plant_code, setPlantCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);

  const userId = "7";

  useEffect(() => {
    fetchPlant();
  }, []);

  // Fetch entity
  async function fetchPlant() {
    setLoading(true);
    try {
      const res = await get("/plant/getPlant");
      console.log("====>",res);
      if(res.length==0){
        throw new Error('No data!')
      }
      setPlant(res);
    } catch (err) {
      toast.error(`Failed to fetch plant: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new plant
  async function createNewPlant() {
    if (!name ||!plant_code) return;
    setLoading(true);
    try {
      const reqBody = { name: name, plant_code:plant_code, created_by: userId };
      await post("/plant/createPlant", reqBody);
      toast.success("Plant created successfully!");
      setName("");
      setPlantCode("");
      await fetchPlant();
    } catch (err) {
      toast.error("Failed to create entity");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update entity inline
  async function handleRowEditCommit(params) {
    const { id, field, value } = params; // destructure

    // Find the current row in state
    const currentRow = plant.find(p => p.id === id);
    if (!currentRow) return;

    // Build full payload with updated value
    const reqBody = {
      id,
      created_by: userId,
      name: field === "name" ? value : currentRow.name,
      plant_code: field === "plant_code" ? value : currentRow.plant_code,
      // add more fields here if needed
    };

    setLoading(true);
    try {
      await post("/plant/updatePlant", reqBody);
      toast.success("Plant updated successfully!");
      await fetchPlant(); // refresh data
    } catch (err) {
      toast.error("Failed to update plant");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  async function handleDeletePlant(id) {
    setLoading(true);
    try {
      await post("/plant/deletePlant", { id });
      toast.success("Plant deleted successfully!");
      await fetchPlant();
    } catch (err) {
      toast.error("Failed to delete plant");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewLogs = async (id) => {
        setOpen(true); // open popup
        setLoading(true);
        try {
          const table_name = "tbl_plant";
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
      field: "plant_code",
      headerName: "Plant Code",
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
          onClick={() => handleDeletePlant(params.id)}
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
            Users &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Plant</span>
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
                label="Name"
                variant="outlined"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Plant Code"
                variant="outlined"
                required
                value={plant_code}
                onChange={(e) => setPlantCode(e.target.value)}
              />
              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewPlant}
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
                rows={plant}
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
              Entity Logs
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
