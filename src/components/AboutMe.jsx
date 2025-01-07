import profilePic from '../assets/me_ph.png';

export default function AboutMe() {
    return (

        <div className="about-section">
            <div className="about-textarea">
                <h1>Hey! I&apos;m Jasmine 👋🏽</h1>
                <p>I’m passionate about solving users’ problems and building products that improve the experience of the people who use them. <br></br><br></br>I'm a thinker, tinkerer, novice react engineer, and sports lover!</p>
                <div className="btn-area">
                    <a href="https://www.linkedin.com/in/jasmine-floyd/" class="btnA">LinkedIn</a>
                    <a href="/portfolio/resume.pdf" class="btnB">Resume</a>
                </div>
            </div>
            <div className="biz-card">
                <img src={profilePic} />
            </div> 
        </div>
    )
}