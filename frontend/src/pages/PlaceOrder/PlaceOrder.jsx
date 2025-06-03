import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
    const [paymentMethod, setPaymentMethod] = useState("counter"); // "counter" or "online"
    const [data, setData] = useState({
        name: "",
        phone: ""
    });

    const { getTotalCartAmount, token, food_list, cartItems, url, setCartItems, currency } = useContext(StoreContext);
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = { ...item, quantity: cartItems[item._id] };
                orderItems.push(itemInfo);
            }
        });

        const orderData = {
            userInfo: data,
            items: orderItems,
            amount: getTotalCartAmount(),
        };

        if (paymentMethod === "online") {
            try {
                const response = await axios.post(`${url}/api/payment/phonepe`, orderData, { headers: { token } });
                if (response.data.success) {
                    window.location.replace(response.data.redirect_url);
                } else {
                    toast.error("Payment Failed");
                }
            } catch (err) {
                toast.error("Payment error");
            }
        } else {
            try {
                const response = await axios.post(`${url}/api/order/placecod`, orderData, { headers: { token } });
                if (response.data.success) {
                    toast.success("Order placed! Pay at counter.");
                    navigate('/myorders');
                    setCartItems({});
                } else {
                    toast.error("Something went wrong");
                }
            } catch (err) {
                toast.error("Error placing order");
            }
        }
    };

    useEffect(() => {
        if (!token) {
            toast.error("Please sign in to place an order");
            navigate('/cart');
        } else if (getTotalCartAmount() === 0) {
            navigate('/cart');
        }
    }, [token]);

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Pickup Information</p>
                <input type="text" name='name' onChange={onChangeHandler} value={data.name} placeholder='Your name' required />
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone number' required />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                    <hr />
                    <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount()}</b></div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPaymentMethod("counter")} className="payment-option">
                        <img src={paymentMethod === "counter" ? assets.checked : assets.un_checked} alt="" />
                        <p>Pay at Counter</p>
                    </div>
                    <div onClick={() => setPaymentMethod("online")} className="payment-option">
                        <img src={paymentMethod === "online" ? assets.checked : assets.un_checked} alt="" />
                        <p>Online (PhonePe)</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>
                    {paymentMethod === "counter" ? "Place Order" : "Pay & Order"}
                </button>
            </div>
        </form>
    );
};

export default PlaceOrder;
