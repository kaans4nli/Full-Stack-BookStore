import axios from 'axios';
import React, { useEffect } from 'react'

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { BsFillCartPlusFill } from 'react-icons/bs';
import { TiMinus } from 'react-icons/ti';
import alertify from 'alertifyjs';

const Favorite = () => {

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        if (!localStorage.getItem('user')) {
            navigate("/login");
        }

        axios.get("https://localhost:5001/api/FavoriteList")
            .then((result) => { setData(result.data.listproducts) })
            .catch((error) => console.log(error));

    }, []);

    const deleteProduct = (id) => {

        axios.post(`https://localhost:5001/api/DeleteFavorite?id=${id}`)
            .then((result) => {
                setData(data.filter(item => item.id !== id))
            })
            .catch((error) => console.log(error));
    }



    const addCart = (item) => {
        const Data = {
            id: item.id,
            name: " ",
            image: " ",
            price: item.price,
            category:" "
        }


        axios.post("https://localhost:5001/api/AddProduct", Data)
            .then((result) => {
                if (result.data.statusCode === 200) {
                    setData(data.filter(book => book.id !== item.id));
                    alertify.success(result.data.statusMessage);
                    deleteProduct(item.id);
                }
                else {
                    alertify.success(result.data.statusMessage);
                }
            })
            .catch((error) => {
                console.log(error.message)
            });
    }


    return (
        <div className='cartpage'>
            <div className="cartpage-header">Favorite Items</div>

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

                        <div style={{ width: "50%", display: "flex", justifyContent: "space-around" }}>

                            <Button color="danger" onClick={() => deleteProduct(item.id)}>
                                <TiMinus />
                            </Button>

                            <Button color="success" onClick={()=>addCart(item)}>
                                <BsFillCartPlusFill />
                            </Button>



                        </div>

                    </div>
                )

                ) : <div className="cartpage-empty">No Book Here</div>
            }




        </div>
    )
}

export default Favorite;



/*  


                            <Button color="danger" onClick={deleteFavorite(item.id)}>
                               <AiOutlineMinusSquare/>
                           </Button>

                           */