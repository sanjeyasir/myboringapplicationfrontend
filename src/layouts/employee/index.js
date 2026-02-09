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

export default function Employee() {
  const [navOpen, setNavOpen] = useState(true);
  
  const [employee, setEmployee] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeID, setEmployeeID] = useState("");

  const [employeeCategories, setEmployeeCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [configurationDetail, setConfigurationDetail] = useState("");
  const [loading, setLoading] = useState(false);

  const [section, setSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);


  useEffect(() => {
    fetchEmployee();
    fetchEmployeeCategory();
    fetchSection();
    fetchCompany();
  }, []);

  // Fetch employee details
  async function fetchEmployee() {
    setLoading(true);
    try {
      const res = await get("/employee/getEmployee");
      if(res.length==0){
        throw new Error('No data!')
      }
      setEmployee(res);
    } catch (err) {
      toast.error(`Failed to fetch plant: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch employee category details
  async function fetchEmployeeCategory() {
    setLoading(true);
    try {
      const res = await get("/employeecategory/getEmployeeCategory");

      if (!res || res.length === 0) {
        throw new Error("No data!");
      }

      setEmployeeCategories(res);

    } catch (err) {
      toast.error(`Failed to fetch employee category: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  // Fetch section details
  async function fetchSection() {
    setLoading(true);
    try {
      const res = await get("/section/getSection");
      if(res.length==0){
        throw new Error('No data!')
      }
      setSection(res);
    } catch (err) {
      toast.error(`Failed to fetch plant: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

   // Fetch company details
  async function fetchCompany() {
    setLoading(true);
    try {
      const res = await get("/company/getCompany");
      if(res.length==0){
        throw new Error('No data!')
      }
      setCompany(res);
    } catch (err) {
      toast.error(`Failed to fetch company: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new plant
  async function createNewEmployee() {
    
    setLoading(true);
    try {
      if (!employeeName ||!employeeID ||!selectedSection || !selectedCompany || !selectedCategory || !configurationDetail){
        throw new Error("Something went wrong!")
      }
      const reqBody = { employee_name: employeeName, employee_id: employeeID, section: selectedSection.section, company: selectedCompany.company, category_employment: selectedCategory.category_name, created_by: "Admin",status:"active" };
     

      await post("/employee/createEmployee", reqBody);
      toast.success("Employee created successfully!");
      setEmployeeName("");
      setEmployeeID("");
      await fetchEmployee();
    } catch (err) {
      toast.error("Failed to create employee details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }



  async function handleDeleteEmployee(id) {
    setLoading(true);
    try {
      await post("/employee/deleteEmployee", { id });
      toast.success("Employee deleted successfully!");
      await fetchEmployee();
    } catch (err) {
      toast.error("Failed to delete plant");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "employee_id",
      headerName: "Employee ID",
      width: 200,
      editable: false, // enable inline editing
    },
    {
      field: "employee_name",
      headerName: "Employee Name",
      width: 200,
      editable: false, // enable inline editing
    },

    {
      field: "category_employment",
      headerName: "Category Employment",
      width: 200,
      editable: false, // enable inline editing
    },

    {
      field: "company",
      headerName: "Company",
      width: 200,
      editable: false, // enable inline editing
    },

    {
      field: "section",
      headerName: "Section",
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
          onClick={() => handleDeleteEmployee(params.id)}
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
            Master &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Employee Information</span>
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
                label="Employee ID"
                variant="outlined"
                required
                sx={{ width: 150 }}
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
              />

              <TextField
                label="Employee Name"
                variant="outlined"
                required
                sx={{ width: 150 }}
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />


              <Autocomplete
                options={employeeCategories}
                value={selectedCategory}
                getOptionLabel={(option) => option.category_name || ""}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue);

                  if (newValue) {
                    setConfigurationDetail(newValue.configuration_detail);
                    console.log("Selected ID:", newValue.id);
                    console.log("Configuration Detail:", newValue.configuration_detail);
                  } else {
                    setConfigurationDetail("");
                  }
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Category"
                    variant="outlined"
                    required
                  />
                )}
              />


              <Autocomplete
                options={section}
                value={selectedSection}
                getOptionLabel={(option) => option.section || ""}
                onChange={(event, newValue) => {
                  setSelectedSection(newValue);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Section"
                    variant="outlined"
                    required
                  />
                )}
              />

              <Autocomplete
                options={company}
                value={selectedCompany}
                getOptionLabel={(option) => option.company || ""}
                onChange={(event, newValue) => {
                  setSelectedCompany(newValue);
                }}
                sx={{ width: 150 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee Company"
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
                onClick={createNewEmployee}
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
                rows={employee}
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
