import Footer from './components/Footer'
import Header from './components/Header'
import AboutMe from './components/AboutMe'
// import Outside from './components/Outside'
import ContactMe from './components/ContactMe'
import FDSFooter from './components/FDSFooter'




function App() {

  return (
    <main className='container'>
      <Header />
      <AboutMe />
      {/* <Outside /> */}
      <ContactMe />
      <Footer />
      <FDSFooter />
    </main>
  )
}

export default App