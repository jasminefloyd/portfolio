import linkedinLogo from '../assets/linkedin.png';
import githubLogo from '../assets/github.png';
import resumeLogo from '../assets/file-alt.svg';
import bizLogo from '../assets/jf_logo.png'


export default function Footer() {
    const currentYear = new Date().getFullYear();


    return (
        <div className="site-footer">
            <img className="footer-logo" src={bizLogo} />
            <p>&copy; All Rights Reserved {currentYear}</p>
            <div className="icon-tray">
                <ul className="icon-list">              
                    <li className="linkedin">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src={linkedinLogo} alt="LinkedIn" />
                        </a>
                    </li>
                    <li className="github">
                        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                            <img src={githubLogo} alt="GitHub" />
                        </a>
                    </li>
                    <li className="resy">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <img src={resumeLogo} alt="Resy" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
