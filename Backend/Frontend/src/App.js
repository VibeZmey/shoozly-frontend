
import { useEffect, useState } from 'react';
import './App.css';
import './variables.css'
import { useTelegram } from './components/hooks/useTelegram';
import Header from './components/UI/Header/Header';
import ProductCard from './components/UI/ProductCard/ProductCard';
import CartDrawerButton from './components/UI/CartDrawerButton/CartDrawerButton';
import CartDrawerModuleWindow from './components/UI/CartDrawerModuleWindow/CartDrawerModuleWindow';
import { useApi } from './components/hooks/useApi.js'
import AdminModal from './components/UI/AdminModal/AdminModal.jsx'



function App() {
  //Кастомные Хуки
  const {tg} = useTelegram();

  const {
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
  createCategory,
  } = useApi();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [cartItems, setCartItems] = useState([])

  const [selectedCat, setSelectedCat] = useState(null)

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  //Остальные хуки
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    tg.ready();
  }, [tg, fetchProducts, fetchCategories]);

  
  //Функции
  

  const clearCart = () => {
    setCartItems([])
  }

  const addToCart = (product) => {
    setCartItems((prevItem) => {
      const itemInCart = prevItem.find((item) => item.id === product.id)

      if (itemInCart) {
        return prevItem.map((item) => 
        item.id === product.id
        ? {...item, qty: item.qty + 1}
        : item
        )
      }

      return [...prevItem, {...product, qty: product.qty ?? 1}]
    })
  }
  
  const qtyIncrease = (productId) => {
      setCartItems(prev => prev.map(item => 
        item.id === productId 
        ? {...item, qty: item.qty + 1} 
        : item)
      )
  }

  const qtyDecrease = (productId) => {
      setCartItems(prev => prev.map
        (item => 
        item.id === productId 
        ? {...item, qty: item.qty - 1} 
        : item)
        .filter(item => item.qty > 0))
  }
  
  const totalCost = cartItems.reduce((sum, item) => {return sum + item.price * item.qty}, 0)

  const totalQty = cartItems.reduce((sum, item) => {return sum + item.qty}, 0)

  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
      setFilteredProducts(products.filter(card => card.categoryId === selectedCat));
  }, [selectedCat, products]);

  

  

  return (
    <div className="App">

      <CartDrawerModuleWindow 
      visible = {isDrawerOpen}
      setVisible={setIsDrawerOpen}
      items = {cartItems}
      qtyIncrease={qtyIncrease}
      qtyDecrease={qtyDecrease}
      totalCost = {totalCost}
      clearCart={clearCart}/>

      <Header 
      selectedCat={selectedCat}
      setSelectedCat={setSelectedCat}
      categories= {categories}/>

      <div className='showcase'>
        {filteredProducts && filteredProducts.map(item => (
        <ProductCard key={item.Id} item={item} onAddToCart={addToCart}/>
        ))}
      </div>
      



      <div className="bottom-controls">
          <button
            className="admin-toggle-btn"
            onClick={() => setIsAdminOpen(true)}
          >
            +
          </button>
      </div>


      <CartDrawerButton 
      onClick={() => setIsDrawerOpen(!isDrawerOpen)} 
      isOpen={isDrawerOpen} 
      totalQty = {totalQty} 
      totalCost={totalCost}/>

      {isAdminOpen && <AdminModal
        visible={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        loading={loading}
        error={error}
        onCreateProduct={createProduct}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onDeleteCategory={deleteCategory}
        onCreateCategory={createCategory}/>}

    </div>
  );
}

export default App;
