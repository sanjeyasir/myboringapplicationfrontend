import React, { useState } from "react";
import { Home, Box, Users, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar({ navOpen, setNavOpen }) {
  
  const [openParents, setOpenParents] = useState({}); // track open parent items

  const toggleParent = (label) => {
    setOpenParents((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Box size={20} />,
      label: "Master",
      children: [
        { label: "Employee", href: "/masteremployee" },
        { label: "Company", href: "/mastercompany" },
        { label: "Section", href: "/mastersection" },
        { label: "Employee Category", href: "/masteremployeecategory" },
      ],
    },
    {
      icon: <Box size={20} />,
      label: "Meal Allocations",
      children: [
        { label: "Create Meal Allocations", href: "/createmealallocations" },
        { label: "Meal Allocation Report", href: "/mealallocations" },
      ],
    },
  ];

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: navOpen ? "250px" : "60px",
        height: "100vh",
        background: "linear-gradient(180deg, #1f2937, #111827)",
        color: "white",
        overflowY: "auto", // enable scrolling
        whiteSpace: "nowrap",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
        boxShadow: "2px 0 6px rgba(0,0,0,0.3)",
      }}
    >
      {/* Toggle button */}
      <button
        style={{
          background: "transparent",
          color: "white",
          border: "none",
          cursor: "pointer",
          width: "100%",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: navOpen ? "flex-end" : "center",
          padding: "0 15px",
          fontSize: "18px",
        }}
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? "«" : "☰"}
      </button>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, flex: 1 }}>
        {menuItems.map((item, idx) => (
          <li key={idx} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                height: "50px",
                padding: "0 15px",
                transition: "background 0.2s",
                fontWeight: 500,
                fontSize: "15px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              onClick={() =>
                item.children
                  ? toggleParent(item.label)
                  : item.href && setNavOpen(false)
              }
            >
              {item.href && !item.children ? (
                <Link
                  to={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "white",
                    width: "100%",
                  }}
                >
                  {item.icon}
                  {navOpen && <span style={{ marginLeft: "15px" }}>{item.label}</span>}
                </Link>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  {navOpen && <span style={{ marginLeft: "15px" }}>{item.label}</span>}
                </div>
              )}

              {/* Expand/Collapse arrows */}
              {item.children && navOpen && (
                <span>
                  {openParents[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
            </div>

            {/* Child items */}
            {item.children && openParents[item.label] && navOpen && (
              <ul style={{ listStyle: "none", margin: 0, paddingLeft: "40px" }}>
                {item.children.map((child, cIdx) => (
                  <li
                    key={cIdx}
                    style={{ height: "40px", display: "flex", alignItems: "center" }}
                  >
                    <Link
                      to={child.href}
                      style={{
                        color: "white",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                      onClick={() => setNavOpen(false)} // optional: close sidebar on click
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );

}





