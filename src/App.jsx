import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import AboutMe from './components/AboutMe';
import ContactMe from './components/ContactMe';
import FDSFooter from './components/FDSFooter';
import Blog from './components/Blog';
import Resume from './components/Resume';
import React, { useEffect } from "react";
import { initGA, logPageView } from "./components/Tracker";

function App() {
  useEffect(() => {
    initGA();
    logPageView();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Route for the main page */}
        <Route
          path="/portfolio"
          element={
            <main className="container">
              <AboutMe />
              <ContactMe />
              <Footer />
              <FDSFooter />
            </main>
          }
        />
        {/* Route for the blog page */}
        <Route
          path="/blog"
          element={
            <main>
              <Blog />
            </main>
          }
        />
        {/* Route for the blog page */}
        <Route
          path="/resume"
          element={<Resume />}
        />
      </Routes>
    </Router>
  );
}

export default App;
