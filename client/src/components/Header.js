import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./css/Header.css";

import { ImEnter } from 'react-icons/im';
import { IoMdPerson } from 'react-icons/io';
import { MdOutlineFavorite } from 'react-icons/md';


const Header = ({setFlag,flag}) => {


    useEffect(() => {

        if (localStorage.getItem('user')) {
            setFlag(true);
        }

    }, [flag]);

    return (
        <header className="header">

            <div>
                <h1>
                    <Link to="/" className="logo">Book Shop </Link>
                </h1>
            </div>

            <div className="header-links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                </ul>

                <ul>
                    <li>
                        {flag ? (<Link to="/account"><IoMdPerson style={{ fontSize: "22px" }} /></Link>) : <Link to="/login"> <ImEnter /> </Link>}
                    </li>
                </ul>

                <ul>
                    <li>
                        <Link to="/favorite" >
                            <MdOutlineFavorite style={{ fontSize: "22px" }} />
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li>
                        <Link to="/cart" className="icon-cart">
                            <i className="fas fa-shopping-cart" />
                        </Link>
                    </li>
                </ul>
            </div>
        </header >
    );
};

export default Header;
