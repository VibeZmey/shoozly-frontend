import React from 'react'
import styles from './CartDrawerButton.module.css'

const CartDrawerButton = ({totalCost,totalQty,isOpen ,children, ...props}) => {

  let title = 'Go to cart'

  if (totalQty) {
    title += `(${totalQty})`
  }

  if (isOpen) {
    title = 'Buy ' 
    if (totalCost) {
      title += `${totalCost}$`
    }
  }
  const btnClass = isOpen ? `${styles.cart__btn} ${styles.cart__btn_active}` : styles.cart__btn

  return (
    <button {...props} className={btnClass}>{title}</button>
  )
}

export default CartDrawerButton