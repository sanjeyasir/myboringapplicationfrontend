import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { get } from "../../services/API";
import MDButton from "components/MDButton";
import { ToastContainer, toast } from "react-toastify";


const EntityPopup = ({ open, onClose, assignedEntities, onSave }) => {
  
  const [entities, setEntities] = useState([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    // Preselect assigned entities
    const ids = assignedEntities.map((d) => d.Entity.id);
    setSelectedEntityIds(ids);
  }, [assignedEntities]);

  // Fetch all entities
  async function fetchEntities() {
    setLoading(true);
    try {
      const res = await get("/entity/getEntity");
      setEntities(res);
    } catch (err) {
      console.error("Failed to fetch entities", err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Entity Name", width: 200 },
  ];

  const rows = entities.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Select Entity
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: 400 }}>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", marginBottom:'10px' }}>

            <MDButton onClick={() => onSave(selectedEntityIds)} color="secondary" variant="outlined" style={{marginRight:'10px'}}>
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
            selectionModel={selectedEntityIds}
            onSelectionModelChange={(newSelection) => {
              setSelectedEntityIds(newSelection);
            }}
          />
        )}
       
      </DialogContent>
    </Dialog>
  );
};

export default EntityPopup;
