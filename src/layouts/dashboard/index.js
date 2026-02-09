import React, { useState, useEffect } from "react";
import Navbar from "../globalcomponents/navBar";
import Header from "../globalcomponents/header";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { get, post } from "../../services/API";


export default function Dashboard() {
  const [navOpen, setNavOpen] = useState(true);
  const [mealAllocations, setMealAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // CSS styles as JS objects
  const styles = {
    container: {
      display: "flex",
      flexWrap: "nowrap",      // horizontal scroll
      overflowX: "auto",       // horizontal scroll
      overflowY: "auto",       // vertical scroll
      padding: "10px",
      gap: "10px",
      maxHeight: "400px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
    },
    card: {
      minWidth: "250px",
      flex: "0 0 auto",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
      transition: "transform 0.2s",
    },
    ordered: {
      backgroundColor: "#d1ffd6", // greenish
    },
    otherStatus: {
      backgroundColor: "#fff3d6", // yelloish
    },
  };


  function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }
  
  useEffect(() => {
    fetchMealAllocations();
  }, []);

  const MealAllocationsCard = ({ mealAllocations }) => {
    // Container that allows wrapping
    const containerStyle = {
      display: "flex",
      flexWrap: "wrap",       // allow cards to wrap to next line
      overflowY: "auto",      // vertical scroll if needed
      gap: 10,
      padding: 10,
      maxHeight: 400,         // fixed container height
      border: "1px solid #ccc",
      borderRadius: 10,
      backgroundColor: "#f9f9f9",
    };

    // Card style
    const cardStyle = (status) => ({
      width: 250,            // fixed width
      minHeight: 180,        // minimum height, grows with content
      padding: 10,
      borderRadius: 10,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      backgroundColor: status === "Ordered" ? "#d1ffd6" : "#fff3d6",
      fontSize: 12,
      overflowWrap: "break-word", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    });

    const nameStyle = { fontSize: 14, fontWeight: "bold", marginBottom: 5 };

    return (
      <div style={containerStyle}>
        {mealAllocations.map((meal) => (
          <div key={meal.id} style={cardStyle(meal.status)}>
            <div style={nameStyle}>{meal.employee_name}</div>
            <div>Company: {meal.company}</div>
            <div>Section: {meal.section}</div>
            <div>Date: {meal.date}</div>
            <div>Meal Type: {meal.meal_type}</div>
            <div>Pay Category: {meal.pay_category}</div>
            <div>Status: {meal.status}</div>            
          </div>
        ))}
      </div>
    );
  };



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

        console.log("===>", res)



        setMealAllocations(res);
    } catch (err) {
        toast.error(`Failed to fetch section: ${err.message || err}`);
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
        <Header navOpen={navOpen} systemName="Meal Management System" />
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
         

          <h2>Meal Allocations</h2>
          <MealAllocationsCard mealAllocations={mealAllocations} />
          

          
        </main>
      </div>
      

      <div>sds</div>
    </div>
  );
}





