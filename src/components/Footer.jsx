
export default function Footer() {
    const currentYear = new Date().getFullYear();


    return (
        <div className="site-footer">
            <img className="footer-logo" src="./src/assets/jf_logo.png" />
            <p>&copy; All Rights Reserved {currentYear}</p>
            <div className="icon-tray">
                <ul className="icon-list">              
                    <li className="linkedin">
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src="./src/assets/linkedin.png" alt="LinkedIn" />
                        </a>
                    </li>
                    <li className="github">
                        <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
                            <img src="./src/assets/github.png" alt="GitHub" />
                        </a>
                    </li>
                    <li className="resy">
                        <a href="https://www.resy.com" target="_blank" rel="noopener noreferrer">
                            <img src="./src/assets/file-alt.svg" alt="Resy" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
