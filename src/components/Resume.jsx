import React, { useEffect } from 'react';

export default function Resume() {
    useEffect(() => {
        // Use the public folder path for the PDF
        const resumeUrl = "portfolio/resume.pdf"; // Ensure the PDF is in the public folder
        window.open(resumeUrl, '_blank');
    }, []);

    return (
        <div>
            <h1>Resume is opening in a new tab...</h1>
            <p>
                If it doesn't open automatically, <a href="portfolio/resume.pdf" target="_blank" rel="noopener noreferrer">click here</a> to view it.
            </p>
        </div>
    );
}