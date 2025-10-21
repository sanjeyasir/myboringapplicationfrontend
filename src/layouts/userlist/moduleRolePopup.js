import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { get } from "../../services/API";
import MDButton from "components/MDButton";
import { ToastContainer, toast } from "react-toastify";

const ModuleRolePopup = ({ open, onClose, assignedModuleRole, onSave }) => {
  const [moduleRole, setModuleRoles] = useState([]);
  const [selectedModuleRoleIds, setSelectedModuleRoleIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModuleRoles();
  }, []);

  useEffect(() => {
    const ids = assignedModuleRole.map((d) => d.ModuleRole.id);
    setSelectedModuleRoleIds(ids);
  }, [assignedModuleRole]);

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


  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Module Role Name", width: 200 },
  ];


  const rows = moduleRole.map((d) => ({
    id: d.id,
    name: `${d.module_name} - ${d.role_name}`
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Select Module Roles
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: 400 }}>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", marginBottom:'10px' }}>

            <MDButton onClick={() => onSave(selectedModuleRoleIds)} color="secondary" variant="outlined" style={{marginRight:'10px'}}>
                        Save
            </MDButton>
          
            
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            selectionModel={selectedModuleRoleIds}
            onSelectionModelChange={(newSelection) => {
              setSelectedModuleRoleIds(newSelection);
            }}
          />
        )}
       
      </DialogContent>
    </Dialog>
  );
};

export default ModuleRolePopup;

