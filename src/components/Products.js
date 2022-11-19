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
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
import "./Products.css";

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");

  const performAPICall = async () => {
    await axios
      .get(`${config.endpoint}/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
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
    await axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else if (error.response.status === 404) {
          setProducts([]);
          setIsLoading(false);
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

  const handleAddToCart = async (item, action) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
    } else {
      let obj = {};
      if (isItemInCart(cartItems, item._id) && action !== undefined) {
        if (action === "add") {
          obj = { productId: item._id, qty: item.qty + 1 };
        } else if (action === "remove") {
          obj = { productId: item._id, qty: item.qty - 1 };
        }
        let response = await axios.post(`${config.endpoint}/cart`, obj, {
          headers: { Authorization: "Bearer " + token },
        });
        setCartItems(response.data);
      } else if (!isItemInCart(cartItems, item._id) && !action) {
        obj = { productId: item._id, qty: 1 };
        let response = await axios.post(`${config.endpoint}/cart`, obj, {
          headers: { Authorization: "Bearer " + token },
        });
        setCartItems(response.data);
      } else {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {
          variant: "warning",
        });
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let headers = { headers: { Authorization: "Bearer " + token } };
      let response = await axios.get(`${config.endpoint}/cart`, headers);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let isPresent = items.some((item) => item.productId === productId);
    return isPresent;
  };

  useEffect(() => {
    let isCancelled = true;
    if (isCancelled) {
      async function fetchData() {
        await performAPICall();
        let items = await fetchCart(token);
        setCartItems(items);
      }
      fetchData();
    }
    return () => {
      isCancelled = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Header hasHiddenAuthButtons={token ? "loggedIn" : "loggedOut"}>
        <Box className="search-desktop">
          <TextField
            size="small"
            placeholder="Search for items/categories"
            onChange={debounceSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
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
          onChange={debounceSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          style={{ minWidth: 300 }}
        />
      </Box>

      <Grid container>
        <Grid item xs={12} md={token ? 9 : 12} className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span> to your door step
            </p>
          </Box>
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
                      <ProductCard product={product} handleAddToCart={handleAddToCart} />
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
        </Grid>
        {token && (
          <Grid item xs={12} md={3} style={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              items={generateCartItemsFrom(cartItems, products)}
              products={products}
              handleQuantity={handleAddToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
