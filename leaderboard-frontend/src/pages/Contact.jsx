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
        <Form className={"contactForm"}>
            <Form.Group className="mb-3" controlId="formGroupName">
                <Form.Label>Input Name and Tagline</Form.Label>
                <Form.Control type="text" placeholder="Name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTag">
                <InputGroup>
                    <InputGroup.Text>#</InputGroup.Text>
                <Form.Control type="text" placeholder="Tag" />
                </InputGroup>
            </Form.Group>
        </Form>
    );
}

export default Contact;
