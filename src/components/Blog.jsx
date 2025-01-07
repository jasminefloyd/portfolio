import FDSFooter from "./FDSFooter";
import Footer from "./Footer";
import ContactMe from "./ContactMe";
import BlogCard from "./BlogCard";
import BlogCardMini from "./BlogCardMini";

export default function Blog() {
    return (
        <div className="blog-page" id="blog-page">
            <div className="hero-section">
                <h1>Blog + Podcast Space Name</h1>
                <p>This space is currently under construction while I 🧠🌩️ some great topics. 
                    Feel free to drop me a message if you have any suggestions  </p>
            </div>
            <div className="main-area">
                <div className="profile-blog">
                    <BlogCard />
                </div>
                <div className="side-rail">
                    <BlogCardMini />
                    <BlogCardMini />
                    <BlogCardMini />
                </div>
            </div>
            <ContactMe />
            <Footer />
            <FDSFooter /> 
        </div>
    )
}