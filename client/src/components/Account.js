import React, { useEffect, useState } from 'react'
import { Button, Card, Input, Label, Modal, ModalBody } from 'reactstrap';
import { BsFillTelephoneFill, BsPersonBoundingBox } from 'react-icons/bs';
import { IoMdPerson } from 'react-icons/io';
import { GrMail } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import alertify from 'alertifyjs';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';



const Account = ({ setFlag }) => {

    const [user, setUser] = useState("");
    const [modal, setModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {


        if (localStorage.getItem('user')) {
            let user = JSON.parse(localStorage.getItem('user'));
            setUser(user);

        }
        else if (localStorage.getItem("admin")) {
            let user = JSON.parse(localStorage.getItem('admin'));
            setUser(user);
        }
        else {
            navigate("/login");
        }

    }, []);


    const Logout = () => {

        axios.get("https://localhost:5001/api/Payment/Logout")
            .then((result) => {
                if (result.data.statusCode === 200) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('admin');
                    setUser("");
                    setModal(true);
                    setFlag(false);

                    setTimeout(() => { navigate("/"); }, 2000);
                }
            }
            )
            .catch((error) => {
                alertify.error(error.message);
            });

    }

    return (
        <div style={{ display: 'flex', justifyContent: "center" }}>
            <Card style={{ width: '18rem' }}>

                <div style={{ display: 'flex', justifyContent: "center" }}>
                    <BsPersonBoundingBox style={{ fontSize: '50px', justifyContent: "center" }} />
                </div>
                <h3 style={{ textAlign: "center" }}>My Account</h3>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <IoMdPerson style={{ marginRight: "5px" }} />
                    <Input
                        disabled
                        value={user.firstName + " " + user.lastName}
                    />
                </div>

                {
                    !localStorage.getItem("admin") ?
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <BsFillTelephoneFill style={{ marginRight: "5px" }} />
                            <Input
                                disabled
                                value={user.telephone}

                            />
                        </div>
                        : ""
                }

                <div style={{ display: "flex", alignItems: "center" }}>
                    <GrMail style={{ marginRight: "5px" }} />
                    <Input
                        disabled
                        value={user.email}

                    />
                </div>

                <Button style={{ backgroundColor: "red" }} onClick={Logout}>
                    Log Out
                </Button>

            </Card>


            <Modal isOpen={modal} centered fade  >
                <ModalBody style={{ color: "green", textAlign: "center" }}>
                    Logged Out Successfully <FaCheck />
                </ModalBody>
            </Modal>


        </div>
    )
}

export default Account;
