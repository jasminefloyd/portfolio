export default function AboutMe() {
    return (

        <div className="about-section">
            <div className="about-textarea">
                <h1>Hey! I&apos;m Jasmine 👋🏽</h1>
                <p>This is some text about me and what will display on the page</p>
                <div className="btn-area">
                    <button>LinkedIn</button>
                    <button>Resume</button>
                </div>
            </div>
            <div className="biz-card">
                <img src="./public/me_ph.png" />
            </div> 
        </div>
    )
}