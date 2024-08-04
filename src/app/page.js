"use client";
import { Box, Typography, Button } from "@mui/material";
import "./introduction.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Introduction() {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      router.push("./dashboard");
    }, 1000); // Adjust timing to match your animation duration
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="90%"
        maxWidth="400px"
        borders="2px solid #000"
        boxShadow={0}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: "translate(0, 0)", // No need for translation, centered using flexbox
        }}
      >
        <Typography
          variant="h1"
          className="bungee"
          fontWeight="bold"
          textAlign="center"
          marginBottom="20px"
          sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "10rem" } }} // Responsive font size
        >
          Pantry Tracker
        </Typography>
        <Button
          variant="contained"
          onClick={handleClick}
          className={`bungee bubble-button ${isClicked ? "popped" : ""}`}
          sx={{
            backgroundColor: isClicked ? "gray" : "white",
            color: isClicked ? "white" : "black",
            border: "1px solid #ccc",
            padding: "8px 16px", // Smaller padding for a smaller button
            fontSize: "10px", // Smaller font size
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            width: "90%", // Full width on small screens
            maxWidth: "200px", // Smaller max width on larger screens
            alignSelf: "center", // Center button within box
          }}
        >
          Enter
        </Button>
      </Box>
    </Box>
  );
}
