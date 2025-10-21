import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { get } from "../../services/API";
import MDButton from "components/MDButton";
import { ToastContainer, toast } from "react-toastify";

const DepartmentPopup = ({ open, onClose, assignedDepartments, onSave }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptIds, setSelectedDeptIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Preselect assigned departments
    const ids = assignedDepartments.map((d) => d.Department.id);
    setSelectedDeptIds(ids);
  }, [assignedDepartments]);

  // Fetch all departments
  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await get("/department/getDepartment");
      setDepartments(res);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Department Name", width: 200 },
  ];

  const rows = departments.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Select Departments
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
            selectionModel={selectedDeptIds}
            onSelectionModelChange={(newSelection) => {
              setSelectedDeptIds(newSelection);
            }}
          />
        )}
       
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentPopup;

