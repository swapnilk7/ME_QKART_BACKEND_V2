import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { CircularProgress, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const performAPICall = async () => {
    return await axios
      .get(`${config.endpoint}/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
        return res.data;
      })
      .catch((error) => {
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check if backend is running, reachable and return valid JSON / Check backend endpoint",
            {
              variant: "error",
            }
          );
        }
      });
  };

  const performSearch = async (text) => {
    setIsLoading(true);
    return await axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
        return res.data;
      })
      .catch((error) => {
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else if (error.response.status === 404) {
          setProducts([]);
          enqueueSnackbar("No products found", { variant: "warning" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check if backend is running, reachable and return valid JSON / Check backend endpoint",
            {
              variant: "error",
            }
          );
        }
      });
  };

  const debounce = (func, debounceTimeout = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, debounceTimeout);
    };
  };

  const debounceSearch = debounce(async (e) => await performSearch(e.target.value));

  useEffect(() => {
    async function fetchData() {
      await performAPICall();
    }
    fetchData();
    return () => {};
  }, []);

  return (
    <div>
      <Header hasHiddenAuthButtons={localStorage.getItem("username") ? "loggedIn" : "loggedOut"}>
        <Box className="search-desktop">
          <TextField
            size="small"
            placeholder="Search for items/categories"
            onChange={debounceSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search size="small" />
                </InputAdornment>
              ),
            }}
            style={{ minWidth: 300 }}
          />
        </Box>
      </Header>
      <Box className="search-mobile">
        <TextField
          size="small"
          fullWidth
          placeholder="Search for items/categories"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search size="small" />
              </InputAdornment>
            ),
          }}
          style={{ minWidth: 300 }}
        />
      </Box>

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span> to your door step
            </p>
          </Box>
        </Grid>
      </Grid>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
          <br />
          <Typography>Loading Products</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products && products.length > 0 ? (
            products.map((product) => {
              return (
                <Grid item xs={6} sm={6} md={4} lg={3} key={product._id} style={{ margin: "10px 0" }}>
                  <ProductCard product={product} />
                </Grid>
              );
            })
          ) : (
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                height: "50vh",
              }}
              xs={12}
            >
              <SentimentDissatisfied />
              <Typography>No Products Found</Typography>
            </Grid>
          )}
        </Grid>
      )}
      <Footer />
    </div>
  );
};

export default Products;
