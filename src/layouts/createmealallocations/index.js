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
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function CreateMealAllocations() {
  const [navOpen, setNavOpen] = useState(true);
  const [mealAllocations, setMealAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateMeal, setDateMeal] = useState(null);
 

  const [section, setSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  
  

  function formatDateToYMD(date) {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  

  const userId = "7";

  useEffect(() => {
    fetchMealAllocations();
    fetchCompany();
    fetchSection();
  }, []);

  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  async function fetchMealAllocations() {
    setLoading(true);

    try {
        const today = getTodayDateString();

        const res = await get(
        `/mealallocations/getMealAllocations/${today}/${today}/NA/NA`
        );

        console.log("====>", res);

        if (!res || res.length === 0) {
        throw new Error("No data!");
        }

        setMealAllocations(res);
    } catch (err) {
        toast.error(`Failed to fetch section: ${err.message || err}`);
        console.error(err);
    } finally {
        setLoading(false);
    }
  }

  async function getEmployeeData() {
    setLoading(true);

    try {
      const from = formatDateToYMD(fromDate);
      const to = formatDateToYMD(toDate);

      if (!from || !to ) {
        throw new Error("Please select both From and To dates");
      }

      let companyVal;
      let sectionVal;

      if(selectedCompany==null){
        companyVal="NA";
      }else{
        companyVal=selectedCompany.company
      }

      if(selectedSection==null){
        sectionVal="NA";
      }else{
        sectionVal=selectedSection.section
      }

      console.log(sectionVal);
      console.log(companyVal);
      

      const res = await get(
        `/mealallocations/getMealAllocations/${from}/${to}/${companyVal}/${sectionVal}`
      );

      console.log("====>", res);

      if (!res || res.length === 0) {
        setMealAllocations([]);
        throw new Error("No data!");

      }
      setMealAllocations(res);
    } catch (err) {
      toast.error(`Failed to fetch meal allocations: ${err.message || err}`);
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

  // Fetch employee details
  async function fetchEmployeeCompany(sectionObj) {
        setLoading(true);
        try {
            const sectionName = sectionObj?.section || "NA";

            if (!selectedCompany?.company) {
            throw new Error("Company is not selected!");
            }

            const res = await get(
            `/employee/getEmployeeCompany/${selectedCompany.company}/${sectionName}`
            );

            if (!res || res.length === 0) {
                setEmployee([]);
                throw new Error("No data!");
            }

            setEmployee(res);
        } catch (err) {
            toast.error(`Error: ${err.message || err}`);
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
      field: "meal_type",
      headerName: "Meal Type",
      width: 200,
      editable: false, // enable inline editing
    },
    {
      field: "pay_category",
      headerName: "Pay Category",
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
      field: "date",
      headerName: "Date",
      width: 200,
      editable: false, // enable inline editing
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      editable: false, // enable inline editing
    },
  ];

  async function createNewMealAllocations() {
      
      setLoading(true);
      try {
        if (!selectedEmployee ||!selectedCompany ||!selectedSection ||!selectedMealTypes ||!dateMeal){
          throw new Error("Something went wrong!")
        }

        const res = await get(`/employeecategory/getEmployeeCategoryDetail/${selectedEmployee.category_employment}`);

        if(!res){
           throw new Error("Something went wrong!")
        }

        const reqBody = { 
                          employee_name: selectedEmployee.employee_name, 
                          employee_id: selectedEmployee.employee_id,
                          meal_type:selectedMealTypes,
                          section: selectedSection.section, 
                          status:"Ordered",
                          company: selectedCompany.company,
                          section:selectedSection.section,
                          pay_category:res.configuration_detail,
                          date:formatDateToYMD(dateMeal)
                        };

        await post("/mealallocations/createMealAllocations", reqBody);
        


       
        
        toast.success("Meal Allocations created successfully!");
       
        await fetchMealAllocations();
      } catch (err) {
        toast.error("Failed to create employee details");
        console.error(err);
      } finally {
        setLoading(false);
      }
  }
  



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
            Meal Allocations &gt; <span style={{ fontWeight: "bold", color: "#111827" }}> Create Meal Allocations</span>
          </MDTypography>


          
          
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                alignItems: "center",
              }}
            >

             <DatePicker
                label="Date"
                value={dateMeal}
                onChange={(newValue) => setDateMeal(newValue?.toDate())}
                renderInput={(params) => <TextField {...params} />}
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

             <Autocomplete
                options={section || []}
                value={selectedSection}
                getOptionLabel={(option) => option?.section || ""}
                onChange={(event, newValue) => {
                    setSelectedSection(newValue); // update state
                    if (newValue) {
                    fetchEmployeeCompany(newValue); // use newValue directly
                    } else {
                    // If user cleared selection
                    fetchEmployeeCompany({ section: "NA" });
                    }
                }}
                isOptionEqualToValue={(option, value) =>
                    option.section === value.section
                }
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
                options={employee}
                value={selectedEmployee}
                getOptionLabel={(option) => `${option.employee_id}-${option.employee_name}` || ""}
                onChange={(event, newValue) => {
                    setSelectedEmployee(newValue);
                }}
                sx={{ width: 200 }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Employee Details"
                    variant="outlined"
                    required
                />
                )}
            />

            <Autocomplete
                multiple
                options={mealTypes}
                value={selectedMealTypes}
                onChange={(event, newValue) => {
                    setSelectedMealTypes(newValue); // array of selected meal types
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                    <span
                        key={option}
                        {...getTagProps({ index })}
                        style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        borderRadius: "16px",
                        padding: "2px 8px",
                        marginRight: "4px",
                        fontSize: "0.875rem",
                        }}
                    >
                        {option}
                    </span>
                    ))
                }
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Select Meal Types"
                    placeholder="Choose meal type(s)"
                    />
                )}
                sx={{ width: 250 }}
                />

              
              

              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewMealAllocations}
              >
                Create Meal Allocations
              </MDButton>

              
            </div>
          </div>
        </LocalizationProvider>
          

         

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
                rows={mealAllocations}
                columns={columns}
                pageSize={100}
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