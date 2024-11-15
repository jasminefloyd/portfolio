import Footer from './components/Footer'
import Header from './components/Header'
import AboutMe from './components/AboutMe'
import ContactMe from './components/ContactMe'
import FDSFooter from './components/FDSFooter'
import Blog from './components/Blog'




function App() {

  return (
    <>
      <main className='container'>
        <Header />
        <AboutMe />
        <ContactMe />
        <Footer />
        <FDSFooter />
      </main>

      <main>
        <Blog />
      </main>
    </>

    
  )
}

export default App