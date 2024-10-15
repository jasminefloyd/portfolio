export default function ContactMe() {
    return (
        <div className="contact-section">
            <div className="contact-left">
                <h1>Get in touch with me</h1>
            </div> 
            <div className="contact-right">
                <form>
                    <fieldset>Name</fieldset>
                    <fieldset>Email Address</fieldset>
                    <fieldset className="form-message">Message</fieldset>
                    <button>Contact Me</button>
                </form>
            </div> 
        </div>
    )
}