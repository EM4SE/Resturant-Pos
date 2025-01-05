import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import DishCard from "./DishCard";
import "./Content.css";

const navItems = [
  "Hot Dishes",
  "Cold Dishes",
  "Soup",
  "Grill",
  "Appetizer",
  "Dessert",
  "Drinks",
  "Snacks",
  "Salads",
  "Grilled Items",
];

const Content = ({ handleAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sortedNavItems = [...navItems].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/getallproducts');
      const data = await response.json();
      
      if (data.code === "00") {
        const formattedProducts = data.content.map(product => ({
          id: product.id,
          image: product.imagePath ? `http://localhost:8080/images/${product.imagePath}` : '',
          title: product.name,
          price: `$${product.price.toFixed(2)}`,
          description: product.description,
          category: product.category,
          availability: product.availability
        }));
        setProducts(formattedProducts);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content">Loading products...</div>;
  if (error) return <div className="content">{error}</div>;

  return (
    <div className="col-md-8 col-lg-9 content">
      <h2 className="content-title">Rest POS</h2>
      <p className="content-date">Tuesday, 2 Feb 2021</p>

      <Navbar navItems={sortedNavItems} />

      <div className="dish-cards-row">
        {products
          .filter(product => product.availability === "true")
          .map((product) => (
            <DishCard 
              key={product.id} 
              dish={product} 
              onAddToOrder={handleAddToOrder} 
            />
          ))}
      </div>
    </div>
  );
};

export default Content;