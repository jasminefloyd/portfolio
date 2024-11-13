import profilePic from '../assets/me_ph.png';

export default function AboutMe() {
    return (

        <div className="about-section">
            <div className="about-textarea">
                <h1>Hey! I&apos;m Jasmine 👋🏽</h1>
                <p>Lorem ipsum dolor sit amet consectetur. Nunc augue lorem facilisi ac lorem. Quam scelerisque vulputate proin blandit proin nisl magna sagittis turpis.</p>
                <div className="btn-area">
                    <a href="https://www.linkedin.com/in/jasmine-floyd/" class="btnA">LinkedIn</a>
                    <a href="#" class="btnB">Resume</a>
                </div>
            </div>
            <div className="biz-card">
                <img src={profilePic} />
            </div> 
        </div>
    )
}