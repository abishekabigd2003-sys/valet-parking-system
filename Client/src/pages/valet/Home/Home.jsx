import Navbar from '../../../components/landing/Navbar.jsx'
import Hero from '../../../components/landing/Hero.jsx'
import Features from '../../../components/landing/Features.jsx'
import Services from '../../../components/landing/Services.jsx'
import Pricing from '../../../components/landing/Pricing.jsx'
import Testimonials from '../../../components/landing/Testimonials.jsx'
import Contact from '../../../components/landing/Contact.jsx'
import Footer from '../../../components/landing/Footer.jsx'
import './Home.css'

export default function Home() {
  return (
    <div className="dark">
      <div className="home-page relative min-h-screen overflow-x-clip bg-themeBg text-themeText">
        <div className="pointer-events-none fixed inset-0 z-0 bg-grain" aria-hidden="true" />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Services />
          <Pricing />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
