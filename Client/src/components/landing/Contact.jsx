import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (800) 327-5387',
    sub: 'Mon – Sun, 6 am – midnight',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support@zenpark.io',
    sub: 'We reply within 2 hours',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: '2100 S Sepulveda Blvd',
    sub: 'Los Angeles, CA 90025',
  },
];

const emptyForm = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    // Simulate network call — swap for real API post when backend is ready
    await new Promise((r) => setTimeout(r, 1400));
    setStatus('sent');
    setForm(emptyForm);
  }

  return (
    <section id="contact" className="py-28 bg-themeBg">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-sm font-bold tracking-[0.2em] uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-themeText mb-4">
            We're <span className="text-primary">Here</span> for You
          </h2>
          <p className="text-themeText-secondary max-w-2xl mx-auto">
            Have a question, special request, or feedback? Reach out and our team will get back to you promptly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Left — Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
              <div
                key={label}
                className="group flex items-start gap-5 bg-themeBg-paper border border-themeBorder rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-themeText-secondary uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-themeText font-semibold">{value}</p>
                  <p className="text-themeText-secondary text-sm mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Hours box */}
            <div className="bg-gradient-to-br from-primary/10 to-yellow-900/5 border border-primary/20 rounded-2xl p-6 mt-2">
              <p className="text-primary font-bold text-sm uppercase tracking-wider mb-4">Operating Hours</p>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '6:00 AM – 12:00 AM' },
                  { day: 'Saturday – Sunday', hours: '7:00 AM – 11:00 PM' },
                  { day: 'Public Holidays', hours: '8:00 AM – 10:00 PM' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-themeText-secondary">{day}</span>
                    <span className="text-themeText font-medium">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-themeBg-paper border border-themeBorder rounded-2xl p-8 relative overflow-hidden">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-primary mb-5" />
                  <h3 className="text-2xl font-bold text-themeText mb-2">Message Sent!</h3>
                  <p className="text-themeText-secondary mb-6">Thanks for reaching out. We'll get back to you within 2 hours.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-themeText mb-6">Send Us a Message</h3>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-themeText-secondary uppercase tracking-wider">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="bg-themeBg border border-themeBorder rounded-lg px-4 py-3 text-sm text-themeText placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-themeText-secondary uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="bg-themeBg border border-themeBorder rounded-lg px-4 py-3 text-sm text-themeText placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-themeText-secondary uppercase tracking-wider">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Booking inquiry, feedback, etc."
                      className="bg-themeBg border border-themeBorder rounded-lg px-4 py-3 text-sm text-themeText placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-themeText-secondary uppercase tracking-wider">Message *</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className="bg-themeBg border border-themeBorder rounded-lg px-4 py-3 text-sm text-themeText placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-lg transition-colors duration-200 text-sm"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
