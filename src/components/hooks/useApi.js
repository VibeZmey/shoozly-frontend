import { useState, useCallback } from "react";

const API_URL = "https://example.com/api"; // TODO: поменяй на свой бэкенд

export function useApi() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ====== PRODUCTS ======

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (productData) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          throw new Error(`Failed to create product: ${res.status}`);
        }

        // Вариант 1: заново тянуть все товары
        await fetchProducts();

        // Вариант 2 (альтернатива): взять ответ и добавить в стейт
        // const newProduct = await res.json();
        // setProducts((prev) => [...prev, newProduct]);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to create product");
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (id, productData) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!res.ok) {
          throw new Error(`Failed to update product: ${res.status}`);
        }

        await fetchProducts();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to update product");
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Failed to delete product: ${res.status}`);
        }

        await fetchProducts();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to delete product");
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  // ====== CATEGORIES ======

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/categories/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Failed to delete category: ${res.status}`);
        }

        await fetchCategories();
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to delete category");
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteCategory,
  };
}
