import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import {InputGroup} from "react-bootstrap";

function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('api/sendMail', form);
            alert('Message sent!');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    return (
        <Form>
            <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
                <InputGroup>
                    <InputGroup.Text>#</InputGroup.Text>
                <Form.Control type="email" placeholder="Enter email" />
                </InputGroup>
            </Form.Group>
        </Form>
    );
}

export default Contact;
