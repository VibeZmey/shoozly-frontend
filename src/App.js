
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
  //constants
  // const categories = [
  //   {id:'subs', label:'Subscriptions'},
  //   {id:'currency', label:'In-game currency'},
  //   {id:'vpn', label: 'VPN'},

  //   {id:'subs', label:'Subscriptions'},
  //   {id:'currency', label:'In-game currency'},
  //   {id:'vpn', label: 'VPN'},
  //   ]
  
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
  } = useApi();

  //Кастомные Хуки
  const {tg} = useTelegram();

  //UseState only
  const [cards, setCards] = useState([
    {id: 1, title: 'test213123124', price: 1234, cat: 'subs'},
    {id: 2, title: 'test1', price: 11, cat: 'vpn'},
    {id: 3, title: 'test2', price: 134, cat: 'currency'},
    {id: 4, title: 'test3', price: 1434, cat: 'subs'},
    {id: 5, title: 'test4', price: 14, cat: 'vpn'},
    {id: 6, title: 'test', price: 1234, cat: 'vpn'},
    {id: 7, title: 'test', price: 1234, cat: 'currency'},
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [cartItems, setCartItems] = useState([])

  const [selectedCat, setSelectedCat] = useState('Subscriptions')

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

  const filteredCards = cards.filter(card => card.cat === selectedCat)

  

  

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
      onChangeCat={setSelectedCat}
      categories= {categories}/>

      <div className='showcase'>
        {products && products.map(item => (
        <ProductCard key={item.id} item={item} />
        ))}
      </div>
      <pre>{JSON.stringify(products, null, 2)}</pre>



      <div className="bottom-controls"/>
          <button
            className="admin-toggle-btn"
            onClick={() => setIsAdminOpen(true)}
          >
            +
          </button>

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
        onDeleteCategory={deleteCategory}/>}

    </div>
  );
}

export default App;
