import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Form, Col, Row, FormFeedback, ModalHeader, ModalBody, Modal } from 'reactstrap'
// import { Dropdown, Form } from 'semantic-ui-react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'semantic-ui-react';

import { HiShoppingBag } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';


import "./css/Payment.css"
import axios from 'axios';
import "alertifyjs/build/css/alertify.css";
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';


const Payment = () => {
  const [cityoptions, setCityoptions] = useState([
    { text: 'No Option', value: null },
  ]);

  const [monthoptions, setMonthoptions] = useState([
    { text: 'January', value: 'January' },
    { text: "February", value: "February" },
    { text: "March", value: "March" },
    { text: "April", value: "April" },
    { text: "May", value: "May" },
    { text: "June", value: "June" },
    { text: "July", value: "July" },
    { text: "August", value: "August" },
    { text: "September", value: "September" },
    { text: "October", value: "October" },
    { text: "November", value: "November" },
    { text: "December", value: "December" },

  ]);

  const [townoptions, setTownoptions] = useState("");

  const initialValues = { address: "", city: "", town: "", zip: "", cardnumber: "", cvc: "", month: "", year: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({ initial: "" });
  const [user, setUser] = useState("");
  const [totalprice, setTotalprice] = useState(0);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCityDropdown = async (e, { name, value }) => {
    setFormValues({ ...formValues, [name]: value.cityname });

    if (value) {

      await axios.get(`https://localhost:5001/api/Payment/GetTowns?id=${value.id}`)
        .then((result) => {
          if (result.data.statusCode === 200) {
            setTownoptions(result.data.townList.map((town) => ({ text: town.townName, value: town.townName })));
          }
          else {
            alertify.error(result.data.statusMessage);
          }

        })
        .catch((error) => {
          alertify.error(error.message);
        });
    }

  }

  const handleDropdown = (e, { name, value }) => {
    setFormValues({ ...formValues, [name]: value });
  }



  const handleSubmit = (e) => {
    e.preventDefault();

    if (totalprice > 0) {
      setFormErrors(validate(formValues));
    }
    else {
      alertify.error("You can not complete your payment with $0 ");
    }
  };


  useEffect(() => {

    let user = JSON.parse(localStorage.getItem('user'));
    setUser(user);

    axios.get("https://localhost:5001/api/Payment/GetCities")
      .then((result) => {
        if (result.data.statusCode === 200) {
          setCityoptions(result.data.cityList.map((city) => ({ key: city.id, text: city.cityName, value: { id: city.id, cityname: city.cityName } })));
        }
        else {
          alertify.error(result.data.statusMessage);
        }

      })
      .catch((error) => {
        alertify.error(error.message);
      });

    
      axios.get("https://localhost:5001/api/Payment/GetTotal")
        .then((result) => {
          setTotalprice(result.data);
        })
        .catch((error) => {
          alertify.error(error.message);
        });
    

  }, []);



  useEffect(() => {

    if (Object.keys(formErrors).length === 0 && totalprice > 0) {
      callAxios(formValues);
    }
  }, [formErrors]);


  const callAxios = async (formValues) => {

    await axios.post("https://localhost:5001/api/Payment/CompletePayment", { ...formValues, email: user.email })
      .then((result) => {

        if (result.data.statusCode === 200) {
          setModal(true);
          setTimeout(() => { navigate("/"); }, 2000);
        }
        else {
          console.log("alertify");
          alertify.error(result.data.statusMessage);
        }
      })
      .catch((error) => {
        alertify.error(error.message);
      });
  }


  const validate = (values) => {
    const errors = {};
    const cardregex = /^[0-9]{16}$/i;
    const cvcregex = /[0-9]{3}/i;
    const yearregex = /^2[0-9]{3}$/i;
    const zipregex = /^[0-9]*$/i;

    if (!values.address) {
      errors.address = "Address is required!";
    }
    if (!values.city) {
      errors.city = "City is required!";
    }
    if (!values.town) {
      errors.town = "Town is required!";
    }

    if (!values.zip) {
      errors.zip = "Zip is required!";
    } else if (!zipregex.test(values.zip)) {
      errors.zip = "This is not a valid Zip format!";
    }

    if (!values.cardnumber) {
      errors.cardnumber = "Card Number is required!";
    } else if (!cardregex.test(values.cardnumber)) {
      errors.cardnumber = "This is not a valid Card number format!";
      console.log(errors.cardnumber);
      console.log("hereeee");
    }

    if (!values.cvc) {
      errors.cvc = "CVC is required!";
    } else if (!cvcregex.test(values.cvc)) {
      errors.cvc = "This is not a valid CVC format!";
    }

    if (!values.month) {
      errors.month = "Month is required!";
    }

    if (!values.year) {
      errors.year = "Year is required!";
    } else if (!yearregex.test(values.year)) {
      errors.year = "This is not a valid Year format!";
    }

    return errors;
  };









  return (
    <div className='paymentpage' style={{ display: "flex" }}>


      <div style={{ marginLeft: "50px" }}>

        <Form style={{ borderRadius: "5px", marginTop: "10px", marginLeft: "10px", padding: "20px", boxShadow: "10px 10px 8px 10px" }}>

          <h4 style={{ borderBottom: "1px solid black" }}>Customer Information</h4>
          <Row style={{ marginTop: "10px" }}>
            <Col md={4}>
              <FormGroup >
                <Label for="firstname">
                  First Name
                </Label>
                <Input
                  disabled
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={user.firstName}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="lastname">
                  Last Name
                </Label>
                <Input
                  disabled
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={user.lastName}
                />
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label for="email">
                  Email
                </Label>
                <Input
                  disabled
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                />
              </FormGroup>
            </Col>
          </Row>

          <h4 style={{ borderBottom: "1px solid black" }}>Address Information</h4>
          <Row >
            <Col md={8}>
              <FormGroup style={{ marginTop: "10px" }}>
                <Label for="address">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Address Text"
                  required
                  onChange={handleChange}

                />
                <FormFeedback>{formErrors.address} </FormFeedback>



              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup style={{ marginTop: "10px" }}>
                <Label for="telephone">
                  Telephone
                </Label>
                <Input
                  id="telephone"
                  name="telephone"
                  placeholder="Telephone"
                  disabled
                  value={user.telephone}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <FormGroup>
                <Label for="city">
                  City
                </Label>
                <Dropdown
                  name="city"
                  required
                  id="city"
                  fluid
                  selection
                  options={cityoptions}
                  placeholder='Select City'
                  onChange={handleCityDropdown}
                />
                <FormFeedback>{formErrors.city} </FormFeedback>
              </FormGroup>
            </Col>
            <Col md={5}>
              <FormGroup>
                <Label for="town">
                  Town
                </Label>
                <Dropdown
                  name="town"
                  required
                  id="town"
                  fluid
                  selection
                  options={townoptions}
                  placeholder='Select Town'
                  onChange={handleDropdown}
                />
                <FormFeedback>{formErrors.town} </FormFeedback>
              </FormGroup>
            </Col>
            <Col md={2}>
              <FormGroup>
                <Label for="zip">
                  Zip
                </Label>
                <Input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  onChange={handleChange}

                />
                <FormFeedback>{formErrors.zip} </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>

        <Form style={{ borderRadius: "5px", marginTop: "40px", marginLeft: "10px", padding: "20px", boxShadow: "10px 10px 8px 10px" }}>

          <h4 style={{ borderBottom: "1px solid black" }}>Credit Card Information</h4>
          <Col md={6}>
            <FormGroup>
              <Label for="cardnumber">
                Card Number
              </Label>
              <Input
                id="cardnumber"
                name="cardnumber"
                placeholder="000000000000"
                required
                onChange={handleChange}

              />
              <FormFeedback>{formErrors.cardnumber} </FormFeedback>
            </FormGroup>
          </Col>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="cvc">
                  CVC
                </Label>
                <Input
                  id="cvc"
                  name="cvc"
                  placeholder="CVC"
                  required
                  onChange={handleChange}

                />
                <FormFeedback>{formErrors.cvc} </FormFeedback>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="month">
                  Month
                </Label>
                <Dropdown
                  id="month"
                  name="month"
                  fluid
                  selection
                  options={monthoptions}
                  placeholder='Month'
                  required
                  onChange={handleDropdown}
                />
                <FormFeedback>{formErrors.month} </FormFeedback>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="year">
                  Year
                </Label>
                <Input
                  id="year"
                  name="year"
                  type="text"
                  required
                  onChange={handleChange}

                />
                <FormFeedback>{formErrors.year} </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </Form>

      </div>
      <div style={{ width: "30%" }}>
        <Form style={{ borderRadius: "5px", marginTop: "10px", marginLeft: "100px", padding: "20px", boxShadow: "10px 10px 8px 10px" }}
          onSubmit={handleSubmit}
        >
          <Row>
            <HiShoppingBag style={{ fontSize: "60px", margin: "auto" }}></HiShoppingBag>
          </Row>

          <Row style={{ marginTop: "30px" }}>
            <Col md={12}>
              <h4 style={{ display: "flex", borderBottom: "1px solid black" }}>Total Price :  <span style={{ marginLeft: "auto" }}>${totalprice}</span></h4>
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Button color="success" style={{ padding: "10px", marginTop: "15px" }}>
              Complete Payment
            </Button>

          </Row>




        </Form>


      </div>

      <Modal isOpen={modal} centered fade >
        <ModalBody style={{ color: "green", textAlign: "center" }}>
          Payment Completed Successfully <FaCheck />
        </ModalBody>
      </Modal>

    </div>




















  )
}

export default Payment;






export function stripeCardNumberValidation(cardNumber) {
  const regexPattern = {
    MASTERCARD: /^5[1-5][0-9]{1,}|^2[2-7][0-9]{1,}$/,
    VISA: /^4[0-9]{2,}$/,
    AMERICAN_EXPRESS: /^3[47][0-9]{5,}$/,
    DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
    DINERS_CLUB: /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/,
    JCB: /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/
  };

  for (const card in regexPattern) {
    if (cardNumber.replace(/[^\d]/g, "").match(regexPattern[card])) {
      if (cardNumber) {
        return cardNumber &&
          /^[1-6]{1}[0-9]{14,15}$/i.test(
            cardNumber.replace(/[^\d]/g, "").trim()
          )
          ? ""
          : "Enter a valid Card";
      }
    }
  }
  return "Enter a valid Card";
}