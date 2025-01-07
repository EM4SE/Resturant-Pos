import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import DishCard from "./DishCard";
import "./Content.css";

const Content = ({ handleAddToOrder }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Utility function to create a delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const loadData = async () => {
      try {
        // First, fetch categories
        await fetchCategories();

        // Add a small delay before loading products
        await delay(30); // Delay for 300ms

        // Then, fetch products
        await fetchProducts();
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/category/getallcategories');
      const data = await response.json();

      if (data.code === "00") {
        const categoryNames = data.content.map((category) => category.name);
        // Add 'All' category at the beginning
        setCategories(['All', ...categoryNames]);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/getallproducts');
      const data = await response.json();

      if (data.code === "00") {
        const formattedProducts = data.content.map((product) => ({
          id: product.id,
          image: product.imagePath ? `http://localhost:8080/images/${product.imagePath}` : '',
          title: product.name,
          price: `$${product.price.toFixed(2)}`,
          description: product.description,
          category: product.category,
          availability: product.availability,
        }));

        setProducts(formattedProducts);
        setFilteredProducts(
          formattedProducts.filter((product) => product.availability === "true")
        );
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to load products");
    }
  };

  const handleCategoryClick = (category) => {
    let filtered = products.filter((product) => product.availability === "true");

    if (category !== 'All') {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  if (loading) return <div className="content">Loading products and categories...</div>;
  if (error) return <div className="content">{error}</div>;

  return (
    <div className="col-md-8 col-lg-9 content">
      <h2 className="content-title">Rest POS</h2>
      <p className="content-date">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>

      <Navbar 
        navItems={categories} 
        onCategoryClick={handleCategoryClick}
      />

      <div className="dish-cards-row">
        {filteredProducts.map((product) => (
          <DishCard 
            key={product.id} 
            dish={product} 
            onAddToOrder={handleAddToOrder} 
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          No products available in this category
        </div>
      )}
    </div>
  );
};

export default Content;
