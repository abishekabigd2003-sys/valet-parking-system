import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  SquareParking,
  Menu,
  X,
  MapPin,
  CalendarDays,
  ChevronDown,
  Ticket,
  Loader2,
} from 'lucide-react'
import { createBooking } from '../api/client.js'
import './Splash.css'

const LOCATIONS = ['Los Angeles Parking', 'Downtown Metro Garage', 'Airport Terminal Valet', 'Beverly Hills Plaza']
const NAV_LINKS = ['Home', 'About us', 'Plan', 'Testimonials']

const emptyForm = {
  location: LOCATIONS[0],
  vehicleType: 'Sedan',
  vehicleNumber: '',
  checkInDate: '',
  checkInTime: '09:00',
  checkOutDate: '',
  checkOutTime: '09:00',
  promoCode: '',
}

export default function Splash() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('Home')
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleBook(e) {
    e.preventDefault()
    if (!form.checkInDate || !form.checkOutDate) {
      setError('Select both check-in and check-out dates.')
      return
    }
    setError('')
    setStatus('submitting')
    try {
      await createBooking(form)
      setStatus('success')
      setForm(emptyForm)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not complete your booking.')
    }
  }

  return (
    <div className="splash">
      <div className="splash__backdrop" aria-hidden="true">
        <img
          className="splash__image"
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2400&auto=format&fit=crop"
          alt=""
        />
        <div className="splash__scrim" />
      </div>

      <header className="splash-nav">
        <a href="#home" className="splash-nav__brand">
          <span className="splash-nav__mark">
            <SquareParking size={18} strokeWidth={2.5} />
          </span>
          <span className="splash-nav__wordmark">
            VALET<span>PARK</span>
          </span>
        </a>

        <nav className="splash-nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className={`splash-nav__link ${active === link ? 'is-active' : ''}`}
              onClick={() => setActive(link)}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="splash-nav__actions">
          <button className="splash-btn splash-btn--outline splash-nav__login">Login</button>
          <button
            className="splash-nav__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="splash-nav__mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                className="splash-nav__mobile-link"
                onClick={() => {
                  setActive(link)
                  setMenuOpen(false)
                }}
              >
                {link}
              </a>
            ))}
            <button className="splash-btn splash-btn--solid">Login</button>
          </div>
        )}
      </header>

      <main id="home" className="splash-hero">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="splash-hero__eyebrow"
        >
          Welcome to
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="splash-hero__title"
        >
          <span className="splash-hero__title-accent">VALET</span> PARK
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="splash-hero__subtitle"
        >
          Reserve secure valet parking in seconds. Hand off your keys and let our
          professional team take it from there — tracked, insured, ready when you are.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          onSubmit={handleBook}
          className="splash-book"
        >
          <div className="splash-book__title">
            <Ticket size={16} />
            Book Now
          </div>

          <div className="splash-book__fields">
            <label className="splash-field splash-field--location">
              <span className="splash-field__label">Select Location</span>
              <span className="splash-field__control">
                <MapPin size={15} className="splash-field__icon" />
                <select
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="splash-field__chevron" />
              </span>
            </label>

            <label className="splash-field">
              <span className="splash-field__label">Check In</span>
              <span className="splash-field__row">
                <span className="splash-field__control splash-field__control--date">
                  <CalendarDays size={15} className="splash-field__icon" />
                  <input
                    type="date"
                    value={form.checkInDate}
                    onChange={(e) => update('checkInDate', e.target.value)}
                  />
                </span>
                <span className="splash-field__control splash-field__control--time">
                  <input
                    type="time"
                    value={form.checkInTime}
                    onChange={(e) => update('checkInTime', e.target.value)}
                  />
                  <ChevronDown size={14} className="splash-field__chevron" />
                </span>
              </span>
            </label>

            <label className="splash-field">
              <span className="splash-field__label">Check Out</span>
              <span className="splash-field__row">
                <span className="splash-field__control splash-field__control--date">
                  <CalendarDays size={15} className="splash-field__icon" />
                  <input
                    type="date"
                    value={form.checkOutDate}
                    onChange={(e) => update('checkOutDate', e.target.value)}
                  />
                </span>
                <span className="splash-field__control splash-field__control--time">
                  <input
                    type="time"
                    value={form.checkOutTime}
                    onChange={(e) => update('checkOutTime', e.target.value)}
                  />
                  <ChevronDown size={14} className="splash-field__chevron" />
                </span>
              </span>
            </label>

            <label className="splash-field">
              <span className="splash-field__label">
                Promo Code <em>(optional)</em>
              </span>
              <span className="splash-field__control">
                <input
                  type="text"
                  placeholder=""
                  value={form.promoCode}
                  onChange={(e) => update('promoCode', e.target.value.toUpperCase())}
                />
              </span>
            </label>

            <button type="submit" className="splash-btn splash-btn--solid splash-book__submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? <Loader2 size={16} className="splash-spin" /> : 'Book Now'}
            </button>
          </div>

          <div className="splash-book__status" aria-live="polite">
            {error && <span className="is-error">{error}</span>}
            {status === 'success' && <span className="is-success">Booking confirmed — a valet is on the way.</span>}
          </div>
        </motion.form>
      </main>
    </div>
  )
}
