import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid } from "@mui/x-data-grid";
import { get, post} from "../../services/API";
import { TextField, Box, Button } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Autocomplete } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer, toast } from "react-toastify";


export default function Users() {
  const [navOpen, setNavOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [moduleRoles, setModuleRoles] = useState([]);
  const [entity, setEntity] = useState([]);
  const [plant, setPlant] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEntities, setSelectedEntities] = useState([]); // store array of selected IDs
  const [selectedPlants, setSelectedPlants] = useState([]); // store array of selected IDs
  const [selectedDepartments, setSelectedDepartments] = useState([]); // store array of selected IDs
  const [selectedModuleRoles, setSelectedModuleRole] = useState([]); // store array of selected IDs
  const [selectedDesignation, setSelectedDesignation] = useState(""); // store array of selected IDs

  const [joinedDate, setJoinedDate] = useState();
  const [permanentDate, setPermanentDate] = useState();

  const userId = "7";

  useEffect(() => {

     mainCall();
    
    
  }, []);


  async function mainCall(){
      setLoading(true);
      try{

          fetchModuleRoles();
          fetchEntity();
          fetchPlant();
          fetchDepartments();
          fetchDesignations();


  
      }catch(err){
          toast.error("Something went wrong!");
          console.error(err);
      }
      finally {
        setLoading(false);
      }
  }

  // Create new user
  async function createNewUser() {
    if (!roleName) return;
    setLoading(true);
    try {
      const reqBody = { role_name: roleName, created_by: userId };
      await post("/users/createUser", reqBody);
      toast.success("Role created successfully!");
      setRoleName("");
      await fetchUsers();
    } catch (err) {
      toast.error("Failed to create role");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  // Fetch module roles
  async function fetchModuleRoles() {
    setLoading(true);
    try {
        const res = await get("/moduleRoles/getModuleRoles");
        setModuleRoles(res);
    } catch (err) {
        toast.error("Failed to fetch module roles");
        console.error(err);
    } finally {
        setLoading(false);
    }
  }

  // Fetch entity
  async function fetchEntity() {
    setLoading(true);
    try {
      const res = await get("/entity/getEntity");
      setEntity(res);
    } catch (err) {
      toast.error("Failed to fetch entity");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch plant
  async function fetchPlant() {
    setLoading(true);
    try {
      const res = await get("/plant/getPlant");
      setPlant(res);
    } catch (err) {
      toast.error("Failed to fetch plant");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  
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

  // Fetch designations
  async function fetchDesignations() {
    setLoading(true);
    try {
      const res = await get("/designation/getDesignations");
      setDesignations(res);
    } catch (err) {
      toast.error("Failed to fetch roles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Create new user
  async function createNewUser() {
      if (!name || !email || !password ||!employeeId){
        throw new Error("Name/ Email/ Password/ Employee Id Details not provided")
      }
      setLoading(true);
      try {
        let reqBody={
          name:name,
          email:email,
          password:password,
          employeeId:employeeId,
          phone:phone,
          entity:selectedEntities,
          plant:selectedPlants,
          departments:selectedDepartments,
          moduleRole:selectedModuleRoles,
          designation:selectedDesignation,
          joinedDate: joinedDate ? joinedDate.format('YYYY-MM-DD') : null,
          permanentDate: permanentDate ? permanentDate.format('YYYY-MM-DD') : null,
          created_by: userId
        }

        console.log("======> came to this point of creation user", reqBody)

        await post("/users/createUser", reqBody);
        toast.success("User created successfully!");
       
      } catch (err) {
        toast.error("Failed to create user");
        console.error(err);
      } finally {
        setLoading(false);
      }
  }
  



  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "status", headerName: "Status", width: 100, renderCell: (params) => (params.value ? "Active" : "Inactive") },
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
                Users &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>User Creation</span>
                
            </MDTypography>

             <MDTypography variant="caption" color="textSecondary">
                      <p>Default password: NewUser@123A</p>
                </MDTypography>
             

          

          <div
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "24px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            {/* First Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <TextField label="Username" variant="outlined" required fullWidth value={name} onChange={(e) => setName(e.target.value)} />
              <TextField label="Useremail" variant="outlined" required fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField label="Employee Id" variant="outlined" required fullWidth value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
              <TextField label="Password" variant="outlined" required fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Second Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <TextField label="Phone" variant="outlined" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />

              {/* Entity Autocomplete */}
              <Autocomplete
                  multiple
                  options={entity}
                  getOptionLabel={(option) => option.name || ""}
                  value={entity.filter((e) => selectedEntities.includes(e.id))}
                  onChange={(event, values) => setSelectedEntities(values.map(v => v.id))}
                  renderInput={(params) => <TextField {...params} label="Entity"/>}
                  ChipProps={{ sx: { whiteSpace: "nowrap" } }}
                  sx={{
                    "& .MuiAutocomplete-tags": {
                      display: "flex",
                      overflowX: "auto",      // allow horizontal scrolling
                      flexWrap: "nowrap",     // prevent wrapping
                      gap: "4px",
                      maxHeight: "56px",
                      alignItems: "center",
                      width: "calc(2 * 100%)", // adjust width to show ~2 chips
                    },
                    "& .MuiAutocomplete-tag": {
                      flex: "0 0 auto",       // prevent chip from shrinking
                    },
                  }}
                />


              {/* Plant Autocomplete */}
              <Autocomplete
                multiple
                options={plant}
                getOptionLabel={(option) => option.name || ""}
                value={plant.filter((e) => selectedPlants.includes(e.id))}
                onChange={(event, values) => setSelectedPlants(values.map(v => v.id))}
                renderInput={(params) => <TextField {...params} label="Plant"/>}
                ChipProps={{ sx: { whiteSpace: "nowrap" } }}
                sx={{
                  "& .MuiAutocomplete-tags": {
                    display: "flex",
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    gap: "4px",
                    maxHeight: "56px",
                    alignItems: "center",
                  },
                }}
              />

              {/* Departments Autocomplete */}
              <Autocomplete
                multiple
                options={departments}
                getOptionLabel={(option) => option.name || ""}
                value={departments.filter((e) => selectedDepartments.includes(e.id))}
                onChange={(event, values) => setSelectedDepartments(values.map(v => v.id))}
                renderInput={(params) => <TextField {...params} label="Departments"/>}
                ChipProps={{ sx: { whiteSpace: "nowrap" } }}
                sx={{
                  "& .MuiAutocomplete-tags": {
                    display: "flex",
                    overflowX: "auto",
                    flexWrap: "nowrap",
                    gap: "4px",
                    maxHeight: "56px",
                    alignItems: "center",
                  },
                }}
              />
            </div>


            {/* Third Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >

              {/* Module Role Autocomplete */}
              <Autocomplete
                  multiple
                  options={moduleRoles}
                  getOptionLabel={(option) => `${option.module_name}-${option.role_name}` || ""}
                  value={moduleRoles.filter((e) => selectedModuleRoles.includes(e.id))}
                  onChange={(event, values) => setSelectedModuleRole(values.map(v => v.id))}
                  renderInput={(params) => <TextField {...params} label="Module Role" />}
                  ChipProps={{ sx: { whiteSpace: "nowrap" } }}
                  sx={{
                    "& .MuiAutocomplete-tags": {
                      display: "flex",
                      overflowX: "auto",      // allow horizontal scrolling
                      flexWrap: "nowrap",     // prevent wrapping
                      gap: "4px",
                      maxHeight: "56px",
                      alignItems: "center",
                      width: "calc(2 * 100%)", // adjust width to show ~2 chips
                    },
                    "& .MuiAutocomplete-tag": {
                      flex: "0 0 auto",       // prevent chip from shrinking
                    },
                  }}
                />

             {/* Designation Autocomplete (Single Select) */}
            <Autocomplete
              options={designations}
              getOptionLabel={(option) => option.designation_name || ""}
              value={designations.find((e) => e.id === selectedDesignation) || null}
              onChange={(event, value) => setSelectedDesignation(value ? value.id : null)}
              renderInput={(params) => <TextField {...params} label="Designation" />}
              sx={{
                "& .MuiAutocomplete-inputRoot": {
                  height: "56px",  // keep consistent with other fields
                },
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* Joined Date */}
              <DatePicker
                label="Joined Date"
                value={joinedDate} // state variable
                onChange={(newValue) => setJoinedDate(newValue)}
                inputFormat="YYYY-MM-DD"   // display format
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              {/* Permanent Date */}
              <DatePicker
                label="Permanent Date"
                value={permanentDate} // state variable
                onChange={(newValue) => setPermanentDate(newValue)}
                inputFormat="YYYY-MM-DD"   // display format
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>




              {/* Submit Button */}
              <MDButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ height: "56px" }}
                onClick={createNewUser}
              >
                Submit
              </MDButton>


            </div>

            
          </div>



          
        </main>

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
        
      </div>
    </div>
  );
}
