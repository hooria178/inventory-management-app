"use client";
import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Bungee } from "next/font/google";
import "../globals.css";

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bungee",
});

const theme = createTheme({
  typography: {
    fontFamily: bungee.style.fontFamily, // Override the default font family
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    let inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });

    // Sort the inventory list alphabetically by name
    inventoryList.sort((a, b) => a.name.localeCompare(b.name));

    setInventory(inventoryList);
    setFilteredInventory(inventoryList); // Set filteredInventory initially
  };

  // Update the addItem function
  const addItem = async (itemName, quantity = 1) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      if (typeof currentQuantity === "number") {
        await setDoc(docRef, { quantity: currentQuantity + quantity });
      }
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };

  // Update the removeItem function
  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      if (typeof currentQuantity === "number") {
        if (currentQuantity > 1) {
          await setDoc(docRef, { quantity: currentQuantity - 1 });
        } else {
          await deleteDoc(docRef);
        }
      }
    }
    await updateInventory();
  };

  // Ensure handleSearchTermChange properly filters and sets filtered inventory
  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    filterInventory(newSearchTerm);
  };

  const filterInventory = (searchTerm) => {
    const filtered = inventory.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Calculate total number of items
  const totalItems = inventory.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Box padding={{ xs: 2, md: 10 }}>
      {/* Title */}
      <ThemeProvider theme={theme}>
        <Typography
          className="bungee"
          sx={{
            marginBottom: 3,
            fontSize: { xs: "1.5rem", md: "2rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Pantry Tracker
        </Typography>
      </ThemeProvider>

      {/* Search Bar, Add New Item Button, and Total Items Bubble */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderBottom: "2px solid #ddd",
          paddingBottom: 2,
          marginBottom: 5,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          {/* Total Items Bubble */}
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "30px",
                padding: { xs: "5px 10px", md: "10px 20px" },
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" color="#333">
                Total Items: {totalItems}
              </Typography>
            </Box>
          </ThemeProvider>

          {/* Search Box */}
          <TextField
            variant="outlined"
            placeholder="Search Inventory..."
            value={searchTerm}
            onChange={handleSearchTermChange}
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              color: "black",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "box-shadow 0.3s ease",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                "& fieldset": {
                  borderColor: "#ccc",
                  borderRadius: "20px",
                },
                "&:hover fieldset": {
                  borderColor: "#888",
                },
                "&.Mui-focused": {
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                  "& fieldset": {
                    borderColor: "#555",
                  },
                },
              },
              width: { xs: "100%", md: "auto" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img
                    src="https://icons.veryicon.com/png/o/miscellaneous/monochrome-icon-1/search-521.png"
                    alt="Search"
                    width="30"
                    height="30"
                  />
                </InputAdornment>
              ),
            }}
          />

          <ThemeProvider theme={theme}>
            {/* Add New Item Button */}
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
          </ThemeProvider>
        </Stack>
      </Box>

      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={{ xs: "90%", sm: 400 }}
          bgcolor="white"
          border="none"
          borderRadius="50px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">Add Item</Typography>

          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          />

          <TextField
            variant="outlined"
            fullWidth
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          />

          <Button
            variant="contained"
            onClick={() => {
              if (itemName && quantity > 0) {
                addItem(itemName, quantity);
                setItemName("");
                setQuantity(1);
                handleClose();
              }
            }}
            sx={{
              borderRadius: "30px",
              padding: "10px 20px",
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      {/* Inventory Items Section */}
      <Stack spacing={2} marginTop={5}>
        <AnimatePresence>
          {filteredInventory.map(({ name, quantity }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={2}
                borderRadius="20px"
                boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                sx={{
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
                  },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                  <Typography variant="h6" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>
                <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                  <Typography variant="h6" color="#333">
                    Quantity: {quantity}
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>
    </Box>
  );
}
