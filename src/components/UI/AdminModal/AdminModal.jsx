// src/components/UI/AdminModal/AdminModal.jsx
import React, { useState, useEffect } from "react";
import styles from './Admin.module.css'

const emptyProduct = {
  id: null,
  name: "",
  price: "",
  categoryId: "",
  imageFile: null,
};

const emptyCategory = {
  name: "",
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
  onCreateCategory,
  onDeleteCategory,
}) => {
  const [formProduct, setFormProduct] = useState(emptyProduct);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formCategory, setFormCategory] = useState(emptyCategory);

  useEffect(() => {
    if (visible) {
      setFormProduct(emptyProduct);
      setIsEditMode(false);
      setFormCategory(emptyCategory);
    }
  }, [visible]);

  if (!visible) return null;

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setFormProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormProduct((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleEditClick = (product) => {
    setFormProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      imageFile: null, // картинку редактируем при необходимости
    });
    setIsEditMode(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: formProduct.id,
      name: formProduct.name.trim(),
      price: Number(formProduct.price),
      categoryId: formProduct.categoryId,
      image: formProduct.imageFile || undefined,
    };

    if (!payload.name || !payload.price || !payload.categoryId) return;

    if (isEditMode && payload.id) {
      await onUpdateProduct(payload);
    } else {
      await onCreateProduct(payload);
    }

    setFormProduct(emptyProduct);
    setIsEditMode(false);
  };

  const handleProductDelete = async (id) => {
    await onDeleteProduct(id);
    if (isEditMode && formProduct.id === id) {
      setFormProduct(emptyProduct);
      setIsEditMode(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const name = formCategory.name.trim();
    if (!name) return;

    await onCreateCategory({ name });
    setFormCategory(emptyCategory);
  };

  const handleCategoryDelete = async (id) => {
    await onDeleteCategory(id);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Управление магазином</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {loading && <div className={styles.info}>Загрузка…</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.content}>
          {/* Товары */}
          <div className={styles.products}>
            <h3>Товары</h3>
            <ul className={styles.productList}>
              {products?.map((p) => (
                <li key={p.id} className={styles.productItem}>
                  <div className={styles.productMain}>
                    <div className={styles.productText}>
                      <span className={styles.productName}>{p.name}</span>
                      <span className={styles.productMeta}>
                        {p.price} ₽ · cat: {p.categoryId}
                      </span>
                    </div>
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className={styles.productImage}
                      />
                    )}
                  </div>
                  <div className={styles.productActions}>
                    <button onClick={() => handleEditClick(p)}>Редакт.</button>
                    <button onClick={() => handleProductDelete(p.id)}>
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
              {(!products || products.length === 0) && (
                <li className={styles.emptyText}>Товаров пока нет</li>
              )}
            </ul>
          </div>

          {/* Форма товара */}
          <div className={styles.form}>
            <h3>{isEditMode ? "Редактировать товар" : "Создать товар"}</h3>
            <form
              onSubmit={handleProductSubmit}
              className={styles.formBody}
            >
              <label>
                Название
                <input
                  type="text"
                  name="name"
                  value={formProduct.name}
                  onChange={handleProductChange}
                  placeholder="Например, Netflix 1 мес."
                  required
                />
              </label>

              <label>
                Цена
                <input
                  type="number"
                  name="price"
                  value={formProduct.price}
                  onChange={handleProductChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </label>

              <label>
                Категория
                <select
                  name="categoryId"
                  value={formProduct.categoryId}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Изображение
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <span className={styles.hint}>
                  Если не выбирать файл при редактировании, останется старая
                  картинка.
                </span>
              </label>

              <button type="submit" className={styles.submitBtn}>
                {isEditMode ? "Сохранить" : "Создать"}
              </button>
            </form>
          </div>
        </div>

        {/* Категории */}
        <div className={styles.categories}>
          <div className={styles.categoriesHeader}>
            <h3>Категории</h3>
          </div>

          <ul className={styles.categoryList}>
            {categories?.map((c) => (
              <li key={c.id} className={styles.categoryItem}>
                <span>{c.name}</span>
                <button onClick={() => handleCategoryDelete(c.id)}>
                  Удалить
                </button>
              </li>
            ))}
            {(!categories || categories.length === 0) && (
              <li className={styles.emptyText}>
                Категорий пока нет, создайте первую.
              </li>
            )}
          </ul>

          <form
            onSubmit={handleCategorySubmit}
            className={styles.categoryForm}
          >
            <input
              type="text"
              value={formCategory.name}
              onChange={(e) =>
                setFormCategory({ name: e.target.value })
              }
              placeholder="Новая категория"
              required
            />
            <button type="submit">Добавить</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
