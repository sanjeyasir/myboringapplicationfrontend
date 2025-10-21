import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MUI Components
import Card from "@mui/material/Card";

// Custom Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout & Images
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/background_image_eco_soln.jpg";
import iconPNG from "assets/images/hayleysfibre.png";
import hayleysPNG from "assets/images/hayleyslogo.png";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/dashboard");
  };

  return (
    <BasicLayout image={bgImage}>

      <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
        >
          <Card
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              width: "350px",
              background: "rgba(255, 255, 255, 0.5)", // transparent white
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop:'25px',
              marginBottom:'50px'
            }}
        >
      

          <MDBox textAlign="center" py={2}>
            {/* <img src={hayleysPNG} style={{width:'100%', height:'100px', marginTop:'10px'}}> */}
            {/* </img> */}
            <MDTypography
              variant="h5"
              fontWeight="bold"
              color="white"
              sx={{ letterSpacing: "1px", marginTop:'30px' }}
            >
              HELLO WORLD:)
            </MDTypography>
            <MDTypography
              variant="subtitle1"
              color="white"
              sx={{ opacity: 0.8 }}
            >
              Boring Application
            </MDTypography>

            {/* Divider line */}
            <MDBox
              mt={2}
              mx="auto"
              sx={{
                width: "80%",
                height: "1.5px",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            />
          </MDBox>

          <MDBox pt={3} pb={3} px={4} width="100%">
            <MDBox component="form" role="form">
              <MDBox mb={3}>
                <MDInput
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    sx: {
                      color: "white", // typed text
                    },
                  }}
                  sx={{
                    "& .MuiFormLabel-root": {
                      color: "rgba(255,255,255,0.7)", // label color
                    },
                    "& .MuiOutlinedInput-root": {
                      fieldset: { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
              </MDBox>

              <MDBox mb={3}>
                <MDInput
                  type="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    sx: {
                      color: "white", // typed text
                    },
                  }}
                  sx={{
                    "& .MuiFormLabel-root": {
                      color: "rgba(255,255,255,0.7)", // label color
                    },
                    "& .MuiOutlinedInput-root": {
                      fieldset: { borderColor: "rgba(255,255,255,0.3)" },
                      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
              </MDBox>

              <MDBox mt={3} mb={2}>
                <MDButton
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "16px",
                    background: "rgba(255,255,255,0.9)",
                    color: "#000",
                    "&:hover": { background: "rgba(255,255,255,1)" },
                  }}
                  onClick={handleSignIn}
                >
                   <MDTypography
                      variant="subtitle1"
                     
                    >
                      Sign In
                    </MDTypography>
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>



        </Card>

      </MDBox>
      
    </BasicLayout>
  );
}

export default Basic;


