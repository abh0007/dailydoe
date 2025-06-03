import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency } = useContext(StoreContext)
    const navigate = useNavigate()

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];

        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] }
                orderItems.push(itemInfo)
            }
        })

        let orderData = {
            pickup: true,  // indicate pickup instead of delivery
            items: orderItems,
            amount: getTotalCartAmount(),
        }

        let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } })
        if (response.data.success) {
            navigate("/myorders")
            toast.success(response.data.message)
            setCartItems({})
        } else {
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order.")
            navigate('/cart')
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-right" style={{ margin: "auto" }}>
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount()}</b></div>
                    </div>
                </div>
                <div className="pickup-info">
                    <h2>Order Type</h2>
                    <p>Only <strong>Pick up from counter</strong> is available.</p>
                </div>
                <button className='place-order-submit' type='submit'>Place Order</button>
            </div>
        </form>
    )
}

export default PlaceOrder
