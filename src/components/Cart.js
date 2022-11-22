import { AddOutlined, RemoveOutlined, ShoppingCart, ShoppingCartOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let arr = [];
  cartData?.forEach((cartItem) => {
    let product = productsData.find((product) => product._id === cartItem.productId);
    if (product) {
      product["qty"] = cartItem.qty;
    }
    arr.push(product);
  });
  return arr;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  const initialValue = 0;
  const total = items.reduce(
    (accumulator, currentValue) => accumulator + currentValue.cost * currentValue.qty,
    initialValue
  );
  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleQuantity, isReadOnly }) => {
  if (!isReadOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={(e) => handleQuantity(value, "remove")}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value.qty}
        </Box>
        <IconButton size="small" color="primary" onClick={(e) => handleQuantity(value, "add")}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem">Qty: {value.qty}</Box>
      </Stack>
    );
  }
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  let history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items?.map((item) => {
          return (
            <Box key={item._id} display="flex" alignItems="flex-start" padding="1rem">
              <Box className="image-container">
                <img src={item.image} alt={item.name} width="100%" height="100%" />
              </Box>
              <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
                <div>{item.name}</div>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <ItemQuantity value={item} handleQuantity={handleQuantity} isReadOnly={isReadOnly} />
                  <Box padding="0.5rem" fontWeight="700">
                    ${item.cost}
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}

        <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total">
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push({ pathname: "/checkout" })}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart" display="flex" flexDirection="column" alignItems="flex-start" padding="1rem">
          <h2>Order Details</h2>
          <Box padding="0.5rem 0" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box color="#3C3C3C">Products</Box>
            <Box color="#3C3C3C">{items.length}</Box>
          </Box>
          <Box padding="0.5rem 0" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box color="#3C3C3C">Subtotal</Box>
            <Box color="#3C3C3C">${getTotalCartValue(items)}</Box>
          </Box>
          <Box padding="0.5rem 0" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box color="#3C3C3C">Shipping Charges</Box>
            <Box color="#3C3C3C">$0</Box>
          </Box>
          <Box padding="0.5rem 0" display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box color="#3C3C3C" fontWeight="700">
              Total
            </Box>
            <Box color="#3C3C3C" fontWeight="700">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
