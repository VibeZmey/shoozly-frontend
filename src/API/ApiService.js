// src/api/ApiService.js
const API_BASE = "https://example.com"; // Поменяй на свой домен/localhost

export default class ApiService {
  // ====== PRODUCTS ======

  static async getProducts() {
    const res = await fetch(`${API_BASE}/api/Product`);
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    return res.json(); // -> массив продуктов
  }

  static async createProduct({ name, price, categoryId, image }) {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", String(price));
    formData.append("CategoryId", categoryId);
    if (image) {
      formData.append("Image", image);
    }

    const res = await fetch(`${API_BASE}/api/Product`, {
      method: "POST",
      body: formData, // ВАЖНО: не ставим Content-Type вручную
    });
    if (!res.ok) {
      throw new Error(`Failed to create product: ${res.status}`);
    }
    return res.json(); // -> созданный продукт
  }

  static async updateProduct({ id, name, price, categoryId, image }) {
    const formData = new FormData();
    formData.append("Id", id);
    formData.append("Name", name);
    formData.append("Price", String(price));
    formData.append("CategoryId", categoryId);
    if (image) {
      formData.append("Image", image);
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

  static async createCategory({ name }) {
    const res = await fetch(`${API_BASE}/api/Category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
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
