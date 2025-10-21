import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { get } from "../../services/API";
import MDButton from "components/MDButton";
import { ToastContainer, toast } from "react-toastify";

const PlantPopup = ({ open, onClose, assignedPlants, onSave }) => {
  const [plants, setPlants] = useState([]);
  const [selectedPlantIds, setSelectedPlantIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlants();
  }, []);

  useEffect(() => {
    // Preselect assigned plants
    const ids = assignedPlants.map((d) => d.Plant.id);
    setSelectedPlantIds(ids);
  }, [assignedPlants]);

  // Fetch all plants
  async function fetchPlants() {
    setLoading(true);
    try {
        const res = await get("/plant/getPlant");
        setPlants(res);
    } catch (err) {
        toast.error("Failed to fetch plant");
        console.error(err);
    } finally {
        setLoading(false);
    }
  }
  
  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Plant Name", width: 200 },
  ];

  const rows = plants.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Select Plants
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ height: 400 }}>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", marginBottom:'10px' }}>

            <MDButton onClick={() => onSave(selectedDeptIds)} color="secondary" variant="outlined" style={{marginRight:'10px'}}>
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
            selectionModel={selectedPlantIds}
            onSelectionModelChange={(newSelection) => {
              setSelectedPlantIds(newSelection);
            }}
          />
        )}
       
      </DialogContent>
    </Dialog>
  );
};

export default PlantPopup;