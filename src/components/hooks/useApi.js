// src/hooks/useApi.js
import { useState, useCallback } from "react";
import ApiService from '../../API/ApiService'

export function useApi() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getProducts();
      setProducts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getCategories();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);
        await ApiService.createProduct(payload);
        await fetchProducts();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const updateProduct = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);
        await ApiService.updateProduct(payload);
        await fetchProducts();
      } catch (e) {
        setError(e.message);
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
        await ApiService.deleteProduct(id);
        await fetchProducts();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts]
  );

  const createCategory = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);
        await ApiService.createCategory(payload);
        await fetchCategories();
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await ApiService.deleteCategory(id);
        await fetchCategories();
      } catch (e) {
        setError(e.message);
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
    createCategory,
    deleteCategory,
  };
}
