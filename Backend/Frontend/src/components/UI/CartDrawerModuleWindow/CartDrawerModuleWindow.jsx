import React from 'react'
import styles from './CardDrawerModuleWindow.module.css'
import { useTelegram } from '../../hooks/useTelegram'



const CartDrawerModuleWindow = ({children, visible, setVisible, items, qtyDecrease, qtyIncrease, clearCart}) => {

  const {username, photo} = useTelegram()

  const rootClasses = [styles.module_window]
  if (visible) {
    rootClasses.push(styles.active)
  }

  return (
    <div 
    className={rootClasses.join(' ')} 
    onClick={() => setVisible(false)}>
      <div 
      className={styles.cart_content} 
      onClick={(e) => e.stopPropagation()}>
        <div className={styles.cart_topShadow}/>
        <div className={styles.user_info}>
          {photo && <img 
          src={photo} 
          alt = 'user_photo' 
          className={styles.user_photo}/>} 
          <span 
          className={styles.user_name}>
            {username || 'Пользователь'}
          </span> 
        </div>
        <hr className={styles.cart_divider}/>
        <div className={styles.cart_list}>
        {items.map(item => 
          (
            <div className={styles.line} key={item.id}>
              <span className={styles.line_title}>{item.name}</span>

              <div className={styles.qty_control}>
                  <button 
                className={styles.qty_btn} 
                onClick={() => {qtyDecrease(item.id)}}>
                  {'<'}
                </button>

                <span className={styles.qty_value}>{item.qty}</span>

                <button 
                className={styles.qty_btn} 
                onClick={() => {qtyIncrease(item.id)}}>
                  {'>'}
                </button>
              </div>

              

              <span className={styles.line_price}>
                {item.price * item.qty}$
              </span>
            </div>))}
        </div>
        <button className={styles.clear_btn} 
        onClick={() => clearCart()}>
          Clear all
          </button>
      </div>
    </div>
  )
}

export default CartDrawerModuleWindow