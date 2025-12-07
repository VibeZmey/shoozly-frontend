// src/api/ApiService.js
const API_BASE = ""; // Поменяй на свой домен/localhost

export default class ApiService {
  // ====== PRODUCTS ======

  static async getProducts() {
    const res = await fetch(`${API_BASE}/api/Product`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    return res.json(); // -> массив продуктов
  }

  static async createProduct(payload) {
    const formData = new FormData();
    formData.append("Name", payload.Name);
    formData.append("CategoryId", payload.CategoryId);
    formData.append("Price", payload.Price);
    if (payload.Image) {
      formData.append("Image", payload.Image); // File объект напрямую
    }

    const res = await fetch(`${API_BASE}/api/Product`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to create product: ${res.status}`);
    }
    return res.json();
  }

  static async updateProduct(payload) {
    const formData = new FormData();
    formData.append("Id", payload.Id);
    formData.append("Name", payload.Name);
    formData.append("Price", String(payload.Price));
    formData.append("CategoryId", payload.CategoryId);
    if (payload.Image) {
      formData.append("Image", payload.Image);
    }
    
    const res = await fetch(`${API_BASE}/api/Product`, {
      method: "PUT",
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`Failed to update product: ${res.status}`);
    }
    return res.json(); // -> обновлённый продукт
  }

  static async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/api/Product/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete product: ${res.status}`);
    }
    return true;
  }

  // ====== CATEGORIES ======

  static async getCategories() {
    const res = await fetch(`${API_BASE}/api/Category`);
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }
    return res.json(); // ожидаем [{ id, name }, ...]
  }

  static async createCategory({ Name }) {
    console.log({Name})
    const res = await fetch(`${API_BASE}/api/Category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name }),
    });
    if (!res.ok) {
      throw new Error(`Failed to create category: ${res.status}`);
    }
    return res.json();
  }

  static async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/api/Category/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(`Failed to delete category: ${res.status}`);
    }
    return true;
  }
}
