import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component="img" style={{ height: "100%", width: "100%" }} image={product.image} />
      <CardContent>
        <Typography gutterBottom component="div">
          {product.name}
        </Typography>
        <Typography gutterBottom component="div">
          <h2>${product.cost}</h2>
          <Rating value={product.rating} readOnly />
        </Typography>
        <CardActions className="card-actions" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Button
            className="card-button"
            fullWidth
            startIcon={<AddShoppingCartOutlined />}
            variant="contained"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
