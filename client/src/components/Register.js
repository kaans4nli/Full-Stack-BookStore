import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./css/Register.css";

import "alertifyjs/build/css/alertify.css";
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const initialValues = { firstname: "", lastname: "", telephone: "", email: "", password: "", confirmpassword: "" };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({ initial: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
    };

    useEffect(() => {
        
        if (Object.keys(formErrors).length === 0) {
            callAxios(formValues);
        }
    }, [formErrors]);

    const callAxios = async (formValues) => {

        await axios.post("https://localhost:5001/account/register", formValues)
            .then((result) => {

                if (result.data.statusCode === 200) {
                    alertify.success(result.data.statusMessage)
                    
                    navigate("/login");
                }
                else {
                    console.log("alertify");
                    alertify.error(result.data.statusMessage);
                }
            })
            .catch((error) => {
                alertify.error(error);
            });
    }




    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!values.firstname) {
            errors.firstname = "First Name is required!";
        }
        if (!values.lastname) {
            errors.lastname = "Last Name is required!";
        }
        if (!values.telephone) {
            errors.telephone = "Last Name is required!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }

        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 5) {
            errors.password = "Password must be more than 4 characters";
        }
        if (!(values.confirmpassword === values.password)) {
            errors.confirmpassword = "Password does not match"
        }

        return errors;
    };

    return (
        <div className="registercontainer">

            <form className='registerform' onSubmit={handleSubmit}>
                <h1>Registration Form</h1>
                <div className="ui divider"></div>
                <div className="ui form">

                    <div className="field">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstname"
                            placeholder="First Name"
                            value={formValues.firstname}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.firstname}</p>

                    <div className="field">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Last Name"
                            value={formValues.lastname}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.lastname}</p>

                    <div className="field">
                        <label>Telephone</label>
                        <input
                            type="text"
                            name="telephone"
                            placeholder="Telephone"
                            value={formValues.telephone}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.telephone}</p>

                    <div className="field">
                        <label>Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={formValues.email}
                            onChange={handleChange}
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
                            onChange={handleChange}
                        />
                    </div>
                    <p className='message'>{formErrors.password}</p>

                    <div className="field">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmpassword"
                            placeholder="Confirm Password"
                            value={formValues.confirmpassword}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.confirmpassword}</p>


                    <button className="fluid ui button blue">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default Register;
