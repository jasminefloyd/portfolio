export default function ContactMe() {
    return (
        <div className="contact-section" id="contact-section">
            <h1>Get in touch with me</h1>
            <form>
                <fieldset>Name</fieldset>
                <fieldset>Email Address</fieldset>
                <fieldset className="form-message">Message</fieldset>
                <button>Contact Me</button>
            </form>
        </div>
    )
}