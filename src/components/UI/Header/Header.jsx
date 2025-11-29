import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react'
import styles from './Header.module.css'
import "swiper/css";


const Header = ({categories, selectedCat, onChangeCat}) => {

  

  return (
    <header className={styles.header}>
      <Swiper 
      className={styles.catSwiper}
      spaceBetween={16}
      slidesPerView={1.1}
      centeredSlides={true}
      loop={true}
      onSlideChange={(swiper) => {
        const index = swiper.realIndex
        const cat = categories[index]
        if (cat) {
          onChangeCat(cat.id)
        }
      }}
      >
          {categories.map(cat => (
            <SwiperSlide key={cat.id} className={styles.catSlide}>
              <button
              type='button'
              className={`${styles.cat__btn} ${selectedCat === cat.id ? styles.cat__btn_active : ''}`}>
                {cat.label}
              </button>
              </SwiperSlide>
          ))}
      </Swiper>
    </header>
  )
}

export default Header