

export default function BlogCard() {
    return (
        <div className="blog-card" id="blog-card">
            <img className="blog-img" src="./src/assets/placeholder.png" />
            <h1 className="blog-title">Blog Title</h1>
            <p className="blog-snippet">Lorem ipsum dolor sit amet consecte tur adipiscing 
                elit semper dalaracc lacus vel facilisis volutpat 
                est velitolm. Lorem ipsum dolor sit amet consecte 
                tur adipiscing elit semper dalaracc lacus vel 
                facilisis volutpat est velitolm. Lorem ipsum 
                dolor sit amet...</p>
            <div className="learn-more">
                <img className="locked" src="./src/assets/Password.png" />
                <a href="">Learn more ➞</a>
            </div>  
        </div>
    )
}