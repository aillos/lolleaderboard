import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {FormLabel, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

function Add() {
    const [form, setForm] = useState({ name: '', tag: '' });
    const navigate = useNavigate();
    
    const navigateHome = () => {
        navigate('/');
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('api/sendMail/add', form);
            alert('Message sent!');
            setForm({ name: '', tag: '' });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    return (
        <Form className={"contactForm"} >
            <div className={"addButton"}>
                <div className="backButton backForm" onClick={navigateHome}>
                    <FontAwesomeIcon icon={faHome} className="backIcon"/>
                    Home
                </div>
                <div
                    className="backButton submitForm"
                    onClick={handleSubmit}
                    role="button"
                    tabIndex="0"
                >
                    <FontAwesomeIcon icon={faUserPlus} className={"backIcon"}/>
                    Add
                </div>

            </div>
            <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Control
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTag">
                <InputGroup>
                    <InputGroup.Text>#</InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Tag"
                        name="tag"
                        value={form.tag}
                        onChange={handleChange}
                    />
                </InputGroup>
            </Form.Group>
        </Form>
    );
}

export default Add;
