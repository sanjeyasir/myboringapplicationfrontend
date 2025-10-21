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
import { Autocomplete } from "@mui/material";

export default function ModuleRoles() {
  const [navOpen, setNavOpen] = useState(true);
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [moduleRoles, setModuleRoles] = useState([]);
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [roleId, setRoleId] = useState(null);


  const userId = "7";

  useEffect(() => {
    mainCall();
    
  }, []);

  async function mainCall(){
    setLoading(true);
    try{
        fetchModules();
        fetchRoles();
        fetchModuleRoles();

    }catch(err){
        toast.error("Something went wrong!");
        console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  // Fetch modules
  async function fetchModules() {
    setLoading(true);
    try {
      const res = await get("/modules/getModules");
      setModules(res);
    } catch (err) {
      toast.error("Failed to fetch modules");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch roles
  async function fetchRoles() {
    setLoading(true);
    try {
        const res = await get("/roles/getRoles");
        setRoles(res);
    } catch (err) {
        toast.error("Failed to fetch roles");
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

  // Create new module role
  async function createNewModuleRole() {
    if (!moduleId|| !roleId) return;
    setLoading(true);
    try {
      const reqBody = { module_id: moduleId, role_id: roleId, created_by: userId };
      await post("/moduleRoles/createModuleRoles", reqBody);
      toast.success("Module roles created successfully!");
      await fetchModuleRoles();
    } catch (err) {
      toast.error("Failed to create module role");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Update role inline
  async function handleRowEditCommit(row) {
    setLoading(true);
    try {
        if(!row.module_id|| !row.role_id){return;}
        const reqBody = {
            id: row.id,                 // moduleRole id
            module_id: row.module_id,   // always present
            role_id: row.role_id,       // always present
            created_by: userId,
        };

        await post("/moduleRoles/updateModuleRoles", reqBody);

        toast.success("Module role updated successfully!", {
        style: { backgroundColor: "#4caf50", color: "#fff" },
        });

        await fetchModules();
        await fetchRoles();
    } catch (err) {
        toast.error("Failed to update module role");
        console.error(err);
    } finally {
        setLoading(false);
    }
  }  

  // Delete module
  async function handleDeleteModuleRole(id) {
    setLoading(true);
    try {
      await post("/moduleRoles/deleteModuleRole", { id });
      toast.success("Module Role deleted successfully!");
      await fetchUsers();
    } catch (err) {
      toast.error("Failed to delete module role");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewLogs = async (id) => {
    setOpen(true); // open popup
    setLoading(true);
    try {
      const table_name = "tbl_module_role";
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

  const [rowModesModel, setRowModesModel] = useState({});

  // Custom editable Autocomplete for Module
  function ModuleEditCell(props) {
  const { id, value, field, row } = props;
  const selectedModule = modules.find((m) => m.id === value) || null;

  return (
    <Autocomplete
      options={modules}
      getOptionLabel={(option) => option.module_name || ""}
      value={selectedModule}
      onChange={async (e, newValue) => {
        const newModuleId = newValue ? newValue.id : null;

        // update the row with both module_id and role_id
        const updatedRow = {
          ...row,
          module_id: newModuleId,
          role_id: row.role_id, // preserve role_id
        };

        console.log("Updating row:", updatedRow);

        // Update DataGrid cell state
        props.api.setEditCellValue({
          id,
          field: "module_id",
          value: newModuleId,
        });

        // Call API with full row
        await handleRowEditCommit(updatedRow);
      }}
      renderInput={(params) => <TextField {...params} label="Module" />}
      sx={{ width: "100%" }}
    />
  );
  }


  function RoleEditCell(props) {
        const { id, value, field, row } = props;
        const selectedRole = roles.find((r) => r.id === value) || null;

        return (
            <Autocomplete
            options={roles}
            getOptionLabel={(option) => option.role_name || ""}
            value={selectedRole}
            onChange={async (e, newValue) => {
                const newRoleId = newValue ? newValue.id : null;

                const updatedRow = {
                ...row,
                role_id: newRoleId,
                module_id: row.module_id, // preserve module_id
                };

                console.log("Updating row:", updatedRow);

                props.api.setEditCellValue({
                id,
                field: "role_id",
                value: newRoleId,
                });

                await handleRowEditCommit(updatedRow);
            }}
            renderInput={(params) => <TextField {...params} label="Role" />}
            sx={{ width: "100%" }}
            />
        );
   }

  // Columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "module_id",
      headerName: "Module Name",
      width: 200,
      editable: true,
      renderEditCell: (params) => <ModuleEditCell {...params} />,
      valueGetter: (params) => {
        const module = modules.find((m) => m.id === params.value);
        return module ? module.module_name : "";
      },
    },
    {
      field: "role_id",
      headerName: "Role Name",
      width: 200,
      editable: true,
      renderEditCell: (params) => <RoleEditCell {...params} />,
      valueGetter: (params) => {
        const role = roles.find((r) => r.id === params.value);
        return role ? role.role_name : "";
      },
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
          onClick={() => handleDeleteModuleRole(params.id)}
          
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
            Users &gt; <span style={{ fontWeight: "bold", color: "#111827" }}>Module Role Creation</span>
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
                {/* Module Autocomplete */}
                <Autocomplete
                    options={modules} // [{id, module_name}, ...]
                    getOptionLabel={(option) => option.module_name || ""}
                    onChange={(event, value) => {
                    setModuleId(value ? value.id : null);
                    }}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                    <TextField {...params} label="Module" required />
                    )}
                />

                {/* Role Autocomplete */}
                <Autocomplete
                    options={roles} // [{id, role_name}, ...]
                    getOptionLabel={(option) => option.role_name || ""}
                    onChange={(event, value) => {
                    setRoleId(value ? value.id : null);
                    }}
                    sx={{ width: 200 }}
                    renderInput={(params) => (
                    <TextField {...params} label="Role" required />
                    )}
                />

            <MDButton
                type="button"
                variant="contained"
                color="primary"
                style={{ width: "150px" }}
                onClick={createNewModuleRole}
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
                rows={moduleRoles}
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
              Module Role Logs
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