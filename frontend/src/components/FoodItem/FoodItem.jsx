import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={url + "/images/" + image} alt="" />
            </div>

            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="rating" />
                </div>
                <p className="food-item-desc">{desc}</p>
                <div className="food-item-price-row">
                    <p className="food-item-price">{currency}{price}</p>

                    {!cartItems[id] ? (
                        <button className='add-to-cart-btn' onClick={() => addToCart(id)}>
                            Add to Cart
                        </button>
                    ) : (
                        <div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove" />
                            <p>{cartItems[id]}</p>
                            <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodItem;
