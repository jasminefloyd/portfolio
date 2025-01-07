import React, { useState } from 'react';

export default function ContactMe() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false); // Track form submission

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Google Form action URL
        const googleFormUrl = "https://docs.google.com/forms/d/1Ub-on-T42JiFn6CNfKIb5MNMB8mQSvpe-DYhosS8Mgk";

        // Map your form fields to Google Form input names
        const formBody = new URLSearchParams({
            "entry.2024539474": formData.name,  // Replace with your Google Form field ID for 'Name'
            "entry.459800907": formData.email, // Replace with your Google Form field ID for 'Email'
            "entry.214357436": formData.message, // Replace with your Google Form field ID for 'Message'
        });

        fetch(googleFormUrl, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody,
        })
            .then(() => {
                // Clear the form
                setFormData({
                    name: '',
                    email: '',
                    message: '',
                });
                // Show success message
                setFormSubmitted(true);
            })
            .catch((error) => console.error("Error submitting form:", error));
    };

    return (
        <div className="contact-section" id="contact-section">
            {formSubmitted ? (
                <div className="success-message">
                    <h1>Thank you!</h1>
                    <p>Your message has been sent. I'll get back to you soon.</p>
                </div>
            ) : (
                <div>
                    <h1>Get in touch with me</h1>
                    <form onSubmit={handleSubmit}>
                        <fieldset>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </fieldset>
                        <fieldset>
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </fieldset>
                        <fieldset className="form-message">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </fieldset>
                        <button type="submit">Contact Me</button>
                    </form>
                </div>
            )}
        </div>
    );
}
