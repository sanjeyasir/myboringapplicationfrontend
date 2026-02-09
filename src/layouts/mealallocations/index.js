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

export default function MealAllocations() {
  const [navOpen, setNavOpen] = useState(true);
  const [mealAllocations, setMealAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [section, setSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [company, setCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  

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
    {
          field: "actions",
          headerName: "Actions",
          type: "actions",
          width: 100,
          getActions: (params) => [
            <GridActionsCellItem
              icon={<Trash2 color="red" />}
              label="Delete"
              onClick={() => handleDeleteMealAllocations(params.id)}
            />,
          ],
    },
  ];



  async function downloadMealAllocationsExcel() {
    if (!mealAllocations || mealAllocations.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const columns = [
      { key: "id", label: "ID" },
      { key: "employee_id", label: "Employee ID" },
      { key: "employee_name", label: "Employee Name" },
      { key: "meal_type", label: "Meal Type" },
      { key: "pay_category", label: "Pay Category" },
      { key: "company", label: "Company" },
      { key: "section", label: "Section" },
      { key: "date", label: "Date" },
      { key: "status", label: "Status" },
    ];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Meal Allocations");

    // Add Header Row
    const headerRow = sheet.addRow(columns.map(c => c.label));

    // Apply header style
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" }
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add data rows
    mealAllocations.forEach(row =>
      sheet.addRow(columns.map(c => row[c.key] ?? ""))
    );

    // Auto width
    sheet.columns.forEach(col => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        const val = cell.value ? cell.value.toString() : "";
        if (val.length > maxLength) maxLength = val.length;
      });
      col.width = maxLength + 5;
    });

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Meal_Allocations_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

   async function handleDeleteMealAllocations(id) {
      setLoading(true);
      try {
        await post("/mealallocations/deleteMealAllocations", { id });
        toast.success("Meal Allocations deleted successfully!");
        await fetchMealAllocations();
      } catch (err) {
        toast.error("Failed to delete meal allocations");
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
            Meal Allocations &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Meal Allocation Report</span>
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
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue?.toDate())}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue?.toDate())}
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

              
              

              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={getEmployeeData}
              >
                Submit
              </MDButton>

              <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={downloadMealAllocationsExcel}
              >
                Download
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