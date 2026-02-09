import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { get, post } from "../../services/API";
import { TextField, CircularProgress, Backdrop, Autocomplete } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2 , Eye} from "lucide-react";
import { Dialog, DialogTitle, DialogContent,IconButton,DialogActions} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function EmployeeCategory() {
  const [navOpen, setNavOpen] = useState(true);
  const [employeeCategories, setEmployeeCategories] = useState([]);
  const [category_name, setCategoryName] = useState("");
  const [configuration_detail, setConfigurationDetail] = useState("");
  const [loading, setLoading] = useState(false);
  let configDets= ["Half Paid","Not Paid","Free"];
  

  const userId = "7";

  useEffect(() => {
    fetchEmployeeCategory();
  }, []);

  // Fetch entity
  async function fetchEmployeeCategory() {
    setLoading(true);
    try {
      const res = await get("/employeecategory/getEmployeeCategory");
      console.log("====>",res);
      if(res.length==0){
        throw new Error('No data!')
      }
      setEmployeeCategories(res);
    } catch (err) {
      toast.error(`Failed to fetch employee category: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new company
  async function createNewEmployeeCategory() {
    if (!category_name||!configuration_detail) return;
    setLoading(true);
    try {
      const reqBody = { configuration_detail: configuration_detail,category_name:category_name};
      await post("/employeecategory/createEmployeeCategory", reqBody);
      toast.success("Employee Category created successfully!");
      setConfigurationDetail("");
      setCategoryName("");
      await fetchEmployeeCategory();
    } catch (err) {
      toast.error("Failed to create company");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

   async function handleDeleteEmployeeCategory(id) {
        setLoading(true);
        try {
        await post("/employeecategory/deleteEmployeeCategory", { id });
        toast.success("Employee Category deleted successfully!");
        await fetchEmployeeCategory();
        } catch (err) {
        toast.error("Failed to delete employee category");
        console.error(err);
        } finally {
        setLoading(false);
        }
   }

 

  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "category_name",
      headerName: "Category Name",
      width: 200,
      editable: false, // enable inline editing
    },
    {
      field: "configuration_detail",
      headerName: "Configuration Detail",
      width: 200,
      editable: false, // enable inline editing
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
              onClick={() => handleDeleteEmployeeCategory(params.id)}
            />
          ],
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
            Master &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Employee Category</span>
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
                label="Employee Category"
                variant="outlined"
                required
                value={category_name}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <Autocomplete
                options={configDets}
                value={configuration_detail}
                onChange={(event, newValue) => {
                  setConfigurationDetail(newValue);
                }}
                sx={{ width: 300 }}   // 👈 width here
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Configuration Details"
                    variant="outlined"
                    required
                  />
                )}
              />

              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewEmployeeCategory}
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
                rows={employeeCategories}
                columns={columns}
                pageSize={10}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row, index) => row.id || index}
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
