import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid } from "@mui/x-data-grid";
import { get , post} from "../../services/API";
import { TextField, Box, Button } from "@mui/material";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Chip } from "@mui/material";
import DepartmentPopup from "../userlist/departmentPopup"; // popup component we created earlier
import InfoIcon from "@mui/icons-material/Info"; // or any icon you want
import departmentIcon from "../../assets/images/department_icon.png";
import EntityPopup from "./entityPopup";
import PlantPopup from "./plantPopup";
import ModuleRolePopup from "./moduleRolePopup";
import { ToastContainer, toast } from "react-toastify";


export default function UserList() {
  const [navOpen, setNavOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const userId = "7";

  const [userDetailId, setUserDetailId] = useState("");
 

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await get("/users/getUsers");

        console.log("=====>res ", res);
        setUsers(res);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  // Department Popup configuration
  const [popupOpenDepartment, setPopupOpenDepartment] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleDeptClick = (departments, id) => {
    setSelectedDepartments(departments); // pass current user's departments
    setUserDetailId(id);
    setPopupOpenDepartment(true); // open popup
  };

  // const handlePopupSaveDepartment = (selectedIds) => {
  //   console.log("Selected department IDs:", selectedIds);
  //   setPopupOpenDepartment(false);
  // };

  // Create new user
  async function handlePopupSaveDepartment(selectedIds){
    setLoading(true);
    try {
      console.log("Selected department IDs:", selectedIds);
      console.log("Selected User Detail ID", userDetailId);
      let reqBody = { 
                      userId: userDetailId,
                      departments: selectedIds,
                      created_by: userId
                    };

      await post("/users/updateDepartmentUser", reqBody);
      toast.success("Department updated successfully!");
      setRoleName("");
      await fetchUsers();
      setPopupOpenDepartment(false);
    } catch (err) {
      toast.error("Failed to update department");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  // Entity Popup configuration

  const [popupOpenEntity, setPopupOpenEntity] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState([]);

  const handleEntityClick = (entities) => {
    setSelectedEntities(entities); // pass current user's entities
    setPopupOpenEntity(true); // open popup
  };

  const handlePopupSaveEntity = (selectedIds) => {
    console.log("Selected entity IDs:", selectedIds);
    setPopupOpenEntity(false);
  };

  // Plant Popup configuration

  const [popupOpenPlant, setPopupOpenPlant] = useState(false);
  const [selectedPlants, setSelectedPlants] = useState([]);

  const handlePlantClick = (plants) => {
    setSelectedPlants(plants); // pass current user's entities
    setPopupOpenPlant(true); // open popup
  };

  const handlePopupSavePlant = (selectedIds) => {
    console.log("Selected plant IDs:", selectedIds);
    setPopupOpenPlant(false);
  };

  // Module Role Popup configuration

  const [popupOpenModuleRole, setPopupOpenModuleRole] = useState(false);
  const [selectedModuleRole, setSelectedModuleRole] = useState([]);

  const handleModuleRoleClick = (plants) => {
    setSelectedModuleRole(plants); // pass current user's entities
    setPopupOpenModuleRole(true); // open popup
  };

  const handlePopupSaveModuleRole = (selectedIds) => {
    console.log("Selected module role IDs:", selectedIds);
    setPopupOpenModuleRole(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "active_status",
      headerName: "Active Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "password_status",
      headerName: "Password Status",
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      field: "departments",
      headerName: "Departments",
      width: 250,
      renderCell: (params) => {
        const deptNames = params.value.map((d) => d.Department.name).join(", ");
        const displayText = deptNames.length > 15 ? `${deptNames.slice(0, 15)}...` : deptNames;

        return (
          <Box
            onClick={() => handleDeptClick(params.value, params.row.id)}
            sx={{
              width: "100%",
              px: 1,
              py: 0.5,
              bgcolor: "#ffecb2", // soft color fill
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            

            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayText}
            </span>

            <InfoIcon fontSize="small" />
            
            
          </Box>
        );
      },
    },
    {
      field: "entities",
      headerName: "Entities",
      width: 250,
      renderCell: (params) => {
        const entityNames = params.value.map((d) => d.Entity.name).join(", ");
        const displayText = entityNames.length > 15 ? `${entityNames.slice(0, 15)}...` : entityNames;

        return (
          <Box
            onClick={() => handleEntityClick(params.value)}
            sx={{
              width: "100%",
              px: 1,
              py: 0.5,
              bgcolor: "#C5DCF1", // soft color fill
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            

            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayText}
            </span>

            
            <InfoIcon fontSize="small"/>

           
            
          </Box>
        );
      },
    },
    {
      field: "plants",
      headerName: "Plants",
      width: 250,
      renderCell: (params) => {
        const plantNames = params.value.map((d) => d.Plant.name).join(", ");
        const displayText = plantNames.length > 15 ? `${plantNames.slice(0, 15)}...` : plantNames;

        return (
          <Box
            onClick={() => handlePlantClick(params.value)}
            sx={{
              width: "100%",
              px: 1,
              py: 0.5,
              bgcolor: "#C5DCF1", // soft color fill
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            

            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayText}
            </span>

            
            <InfoIcon fontSize="small"/>

           
            
          </Box>
        );
      },
    },
    {
      field: "userRoles",
      headerName: "Module Roles",
      width: 300,
      renderCell: (params) => {
        const roleNames = params.value
          .map((d) => `${d.ModuleRole.Module.module_name} - ${d.ModuleRole.Role.role_name}`)
          .join(", ");

        // Shorten text if too long
        const displayText = roleNames.length > 25 ? `${roleNames.slice(0, 25)}...` : roleNames;

        return (
          <Box
            onClick={() => handleModuleRoleClick(params.value)}
            sx={{
              width: "100%",
              px: 1,
              py: 0.5,
              bgcolor: "#E0F7FA", // soft teal fill
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayText}
            </span>
            <InfoIcon fontSize="small" />
          </Box>
        );
      },
    },
    { field: "joinedDate", headerName: "Joined Date", width: 150 },
    { field: "permanentDate", headerName: "Permanent Date", width: 150 },
    { field: "employeeId", headerName: "Employee ID", width: 150 },
    { field: "created_at", headerName: "Created At", width: 150 },
    { field: "created_by", headerName: "Created By", width: 150 },
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
                Users &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>User List</span>
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

           <DepartmentPopup
              open={popupOpenDepartment}
              onClose={() => setPopupOpenDepartment(false)}
              assignedDepartments={selectedDepartments}
              onSave={handlePopupSaveDepartment}
            />

            <EntityPopup
              open={popupOpenEntity}
              onClose={() => setPopupOpenEntity(false)}
              assignedEntities={selectedEntities}
              onSave={handlePopupSaveEntity}
            />

           <PlantPopup
              open={popupOpenPlant}
              onClose={() => setPopupOpenPlant(false)}
              assignedPlants={selectedPlants}
              onSave={handlePopupSavePlant}
            />

            <ModuleRolePopup
              open={popupOpenModuleRole}
              onClose={() => setPopupOpenModuleRole(false)}
              assignedModuleRole={selectedModuleRole}
              onSave={handlePopupSaveModuleRole}
            />

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