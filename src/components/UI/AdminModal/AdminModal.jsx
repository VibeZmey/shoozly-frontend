import React, { useState, useEffect } from "react";
import styles from './Admin.module.css'

const emptyProduct = {
  id: null,
  title: "",
  price: "",
  cat: "",
};

const AdminModal = ({
  visible,
  onClose,
  products,
  categories,
  loading,
  error,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteCategory,
}) => {
  const [formProduct, setFormProduct] = useState(emptyProduct);
  const [isEditMode, setIsEditMode] = useState(false);

  // При открытии модалки сбрасываем форму
  useEffect(() => {
    if (visible) {
      setFormProduct(emptyProduct);
      setIsEditMode(false);
    }
  }, [visible]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = (product) => {
    setFormProduct({
      id: product.id,
      title: product.title,
      price: product.price,
      cat: product.cat,
    });
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formProduct.title,
      price: Number(formProduct.price),
      cat: formProduct.cat,
    };

    if (isEditMode && formProduct.id != null) {
      await onUpdateProduct(formProduct.id, payload);
    } else {
      await onCreateProduct(payload);
    }

    setFormProduct(emptyProduct);
    setIsEditMode(false);
  };

  const handleDeleteProduct = async (id) => {
    await onDeleteProduct(id);
  };

  const handleDeleteCategoryClick = async (id) => {
    await onDeleteCategory(id);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Admin panel</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {loading && <div className={styles.info}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.content}>
          {/* Лист товаров */}
          <div className={styles.products}>
            <h3>Products</h3>
            <ul className={styles.productList}>
              {products?.map((p) => (
                <li key={p.id} className={styles.productItem}>
                  <div>
                    <span>{p.title}</span>
                    <span className={styles.muted}>
                      {p.price} · cat: {p.cat}
                    </span>
                  </div>
                  <div className={styles.productActions}>
                    <button
                      onClick={() => handleEditClick(p)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Форма продукта */}
          <div className={styles.form}>
            <h3>{isEditMode ? "Edit product" : "Create product"}</h3>
            <form onSubmit={handleSubmit} className={styles.formBody}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={formProduct.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  name="price"
                  value={formProduct.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  name="cat"
                  value={formProduct.cat}
                  onChange={handleChange}
                  required
                />
                {/* позже можно заменить на select по categories */}
              </label>

              <button type="submit">
                {isEditMode ? "Save" : "Create"}
              </button>
            </form>
          </div>
        </div>

        {/* Категории */}
        <div className={styles.categories}>
          <h3>Categories</h3>
          <ul className={styles.categoryList}>
            {categories?.map((c) => (
              <li key={c.id} className={styles.categoryItem}>
                <span>{c.name || c.title || c.cat}</span>
                <button
                  onClick={() => handleDeleteCategoryClick(c.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {/* Редактирование/создание категорий можно будет добавить отдельно */}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
