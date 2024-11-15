import FDSFooter from "./FDSFooter";
import Footer from "./Footer";
import ContactMe from "./ContactMe";
import Header from "./Header";
import BlogCard from "./BlogCard";
import BlogCardMini from "./BlogCardMini";

export default function Blog() {
    return (
        <div className="blog-page" id="blog-page">
            <Header />
            <div className="hero-section">
                <h1>Blog + Podcast Space Name</h1>
                <p>Lorem ipsum dolor sit amet consectetur 
                    adipiscing elit semper dalar elementum tempus 
                    hac tellus libero accumsan. </p>
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