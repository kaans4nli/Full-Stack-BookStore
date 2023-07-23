import React, { Fragment, useEffect, useState } from 'react';
import "./css/Cart.css"
import axios from 'axios';
import { FaArrowCircleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Cart = () => {

    const [data, setData] = useState([]);

    const totalPrice = data?data.reduce((price, item) => price + item.amount * item.price, 0):0;

    const navigate = useNavigate();


    useEffect(() => {

        if (!localStorage.getItem('user')) {
            navigate("/login");
            return;
        }

        axios.get("https://localhost:5001/api/CartList")
            .then((result) => { setData(result.data.listproducts); })
            .catch((error) => console.log(error));

    }, []);

    const deleteProduct = (id) => {

        axios.delete(`https://localhost:5001/api/${id}`)
            .then((result) => {
                setData(data.filter(item => item.id !== id))
            })

            .catch((error) => console.log(error));
    }


    const handlePlus = async (item) => {
        const bookExist = data.find((book) => book.id === item.id);
        if (bookExist) {

            setData(data.map((book) => book.id === item.id ? { ...bookExist, amount: bookExist.amount + 1 } : book));
            await axios.put("https://localhost:5001/api/UpdateCart", { id: bookExist.id, amount: bookExist.amount + 1, price: bookExist.price })
                .then((result) => {
                    console.log(result.data.statusMessage);
                })
                .catch((error) => console.log(error));

        }

    }

    const handleMinus = (item) => {
        const bookExist = data.find((book) => book.id === item.id);
        if (bookExist.amount === 1) {
            setData(data.filter((book) => book.id !== item.id));
            deleteProduct(item.id);

        }
        else {
            setData(data.map((book) =>
                book.id === item.id
                    ? { ...bookExist, amount: bookExist.amount - 1 }
                    : book
            )
            );
            axios.put("https://localhost:5001/api/UpdateCart", { id: bookExist.id, amount: bookExist.amount - 1, price: bookExist.price });

        }

    }


    const handleGoPayment = () => {

        let user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate("/login");
        }
        else {
            navigate("/payment");
        }

    }

    return (
        <div className='cartpage'>
            <div className="cartpage-header">Cart Items</div>

            {data && data.length > 0 ?

                data.map((item) =>
                (
                    <div key={item.id} className='cart'>

                        <img className='cart-image' src={item.image} alt="photo" />

                        <div>
                            <h3 className='cart-name'>{item.name}</h3>

                            <div className='cart-price'>
                                ${item.price}
                            </div>
                        </div>

                        <div className='cart-function'>
                            <button className='cart-add-button' onClick={() => handlePlus(item)}>+</button>
                            <div className='amount-text'>{item.amount}</div>
                            <button className='cart-remove-button' onClick={() => handleMinus(item)}>-</button>
                        </div>

                        <div className='sum-price'>
                            Total : {item.amount * item.price}
                        </div>


                    </div>
                )

                ) : <div className="cartpage-empty">No Book Here</div>
            }

            <div className='total-price'>
                Total Price   :
                <span>${totalPrice}</span>
            </div>

            {data && data.length > 0 ?
                <div >
                    <button className="cart-payment-button" onClick={() => handleGoPayment()}>Go To Payment <FaArrowCircleRight className='icon' /></button>
                </div>
                :null
            }

        </div>
    )
}

export default Cart;
