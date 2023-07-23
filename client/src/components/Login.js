import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Login.css';

import axios from 'axios';
import "alertifyjs/build/css/alertify.css";
import alertify from 'alertifyjs';
import { useEffect } from 'react';

const Login = ({setFlag}) => {

    const initialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({ initial: "" });
    const [isSubmit, setIsSubmit] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/")
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
    };

    useEffect(() => {
        setIsSubmit(false);
        setMessage("");

        if (Object.keys(formErrors).length === 0) {
            callAxios(formValues);
        }
    }, [formErrors]);

    const callAxios = async (formValues) => {

        await axios.post("https://localhost:5001/account/login", formValues)
            .then((result) => {

                if (result.data.statusCode === 200) {

                    let data = { firstName: result.data.firstName, lastName: result.data.lastName, email: result.data.email ,telephone: result.data.telephone}
                    localStorage.setItem("user", JSON.stringify(data));
                    localStorage.removeItem("admin"); 
                    setIsSubmit(true);
                    setFlag(true);
                    navigate("/");

                }
                else {
                    setMessage(result.data.statusMessage);
                }
            })
            .catch((error) => {
                alertify.danger(error);
            });
    }


    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }

        console.log(errors)
        return errors;
    };



    return (
        <div className="logincontainer">

            {isSubmit ? (
                <div className="ui message success">Signed in successfully</div>
            ) : (
                ""
            )}

            {message ? (<div className="ui red message">{message}</div>) : ("")}


            <form className='loginform' onSubmit={handleSubmit}>
                <h1>Login Form</h1>
                <div className="ui divider"></div>
                <div className="ui form">

                    <div className="field">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formValues.email}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <p>{formErrors.email}</p>

                    <div className="field">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formValues.password}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <p className='warning'>{formErrors.password}</p>
                    <button className="fluid ui button blue">Submit</button>

                    <div className='createaccount'>
                        <label>Not registered? </label>
                        <Link to="/Register">Create an account</Link>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default Login;
