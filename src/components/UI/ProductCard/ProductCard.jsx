import React from 'react'
import styles from './ProductCard.module.css'

const ProductCard = ({item, onAddToCart}) => {
  return (
    <div className={styles.card}>
        <div className={styles.card__img}>
            {item.imageUrl ? (<img src={item.imageUrl} alt={item.name} />) : (<span>none</span>)}
        </div>
        <div className={styles.card__content}>
            <span className={styles.card__title}>
                {item.name}
            </span>
            
            <span className={styles.card__price}>
                {item.price}
            </span>
            <button 
            className={styles.buy__btn} 
            onClick={() => onAddToCart(item)}>
            Add
            </button>
        </div>
    </div>
  )
}

export default ProductCard