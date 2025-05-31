import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:5000";
    const [food_list, setFoodList] = useState([]);
    const [menu_list, setMenuList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = food_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {}
        }
        return totalAmount;
    };
const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    const data = response.data.data;
    console.log("Fetched food items:", data); // 👈 check this in browser console
    setFoodList(data);

    const categories = ["All"];
    data.forEach(item => {
        if (item.category && !categories.includes(item.category)) {
            categories.push(item.category);
        }
    });

    const categoryImages = {
        "All": "/images/all.png",
        "Breakfast": "/images/breakfast.png",
        "Sandwich": "/images/sandwich.png",
        "Protien Rich & Non Veg": "/images/nonveg.png",
        "Healthy Bowls & Shakes": "/images/bowls.png",
        "Maggi Specials": "/images/maggi.png",
        "Beverages": "/images/beverages.png",
        "chinese": "/images/chinese.png",
        "Italian": "/images/italian.png",
    };

    const menuListFormatted = categories.map(cat => ({
        menu_name: cat,
        menu_image: categoryImages[cat] || "/images/default.png"
    }));

    console.log("Generated menu list:", menuListFormatted); // 👈 confirm it's generating right
    setMenuList(menuListFormatted);
};


    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData({ token: localStorage.getItem("token") });
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
