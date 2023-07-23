import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import "./css/Products.css"

import "alertifyjs/build/css/alertify.css";
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';

import { MdOutlineFavorite } from 'react-icons/md';
import { Input } from 'reactstrap';
import { BiSearchAlt } from 'react-icons/bi';
import { HiFilter } from 'react-icons/hi';
import { Dropdown } from 'semantic-ui-react';



const Products = () => {

    const [data, setData] = useState([]);
    const [copydata, setCopydata] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchtext, setSearchText] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {

        axios.get("https://localhost:5001/api/ProductList")
            .then((result) => { setData(result.data.listproducts); })
            .catch((error) => console.log(error));


        axios.get("https://localhost:5001/api/CategoryList")
            .then((result) => { setCategories(result.data.map((category) => ({ text: category, value: category }))) })
            .catch((error) => console.log(error));



    }, []);


    const addProduct = (item) => {

        if (!localStorage.getItem('user')) {
            navigate("/login")
            return;
        }


        const data = {
            id: item.id,
            name: " ",
            image: " ",
            price: item.price,
            category:" "
        }

        axios.post("https://localhost:5001/api/AddProduct", data)
            .then((result) => {
                if (result.data.statusCode === 200) {
                    alertify.success(result.data.statusMessage);
                }
                else {
                    alertify.success(result.data.statusMessage);
                }
            })
            .catch((error) => {
                console.log(error.message)
            });
    }


    const addFavorite = (id) => {

        if (!localStorage.getItem('user')) {
            navigate("/login")
            return;
        }

        axios.post(`https://localhost:5001/api/AddFavorite?id=${id}`)
            .then((result) => {
                if (result.data.statusCode === 200) {
                    alertify.success(result.data.statusMessage);
                }
                else {
                    alertify.error(result.data.statusMessage);
                }
            })
            .catch((error) => {
                console.log(error.message)
            });

    }

    const handleCategory = (e, { value }) => {

        axios.get(`https://localhost:5001/api/GetByCategory?category=${value}`)
            .then((result) => {
                if (result.data.statusCode === 200) {
                    setData(result.data.listproducts);
                }
                else {
                    alertify.error(result.data.statusMessage);
                }
            })
            .catch((error) => {
                alertify.error(error.message)
            });


    }


    const handleSearchText=() => {
        
    }

    return (
        <div style={{ display: "flex" }}>

            <div style={{ width: "15%", position: "fixed" }}>

                <div style={{ marginTop: "20px" }}>
                    <h3 style={{ fontSize: "15px", textAlign: "center" }}>Search Book</h3>
                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <BiSearchAlt style={{ fontSize: "30px" }} />
                        <Input style={{ marginRight: "3px" }}
                            type="search"
                            onChange={handleSearchText}
                        />
                    </div>
                </div>

                <div style={{ marginTop: "50px" }}>
                    <h5 style={{ textAlign: "center" }} >Category</h5>

                    <div style={{ display: "flex", marginTop: "10px" }}>
                        <HiFilter style={{ fontSize: "30px" }} />
                        <Dropdown
                            required
                            fluid
                            selection
                            options={categories}
                            placeholder='Select Category'
                            onChange={handleCategory}
                        />


                    </div>






                </div>


            </div>

            <div className='products'>

                {
                    data && data.length > 0 ?
                        data.map((product) => {
                            return (
                                <Fragment>
                                    <div className='card'>
                                        <div>
                                            <img className='product-image' src={product.image} alt="foto" />
                                        </div>

                                        <div>
                                            <h3 className='product-name'>{product.name}</h3>
                                        </div>

                                        <div>
                                            <h3 className='product-name' style={{fontSize:"10px",marginTop:"3px"}}>{product.category}</h3>
                                        </div>

                                        <div className='product-price'>
                                            $ {product.price}
                                        </div>

                                        <div>
                                            <button className='product-add-button' onClick={() => addProduct(product)}>Add to Cart</button>
                                        </div>

                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <button className='product-fav-button' onClick={() => addFavorite(product.id)}><MdOutlineFavorite /></button>
                                        </div>


                                    </div>
                                </Fragment>
                            )
                        }) : "No Book For This Category"

                }

            </div>
        </div>
    )
}

export default Products;
