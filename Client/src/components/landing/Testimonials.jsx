import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'James Harrington',
    role: 'Business Executive',
    initials: 'JH',
    rating: 5,
    text: "Absolutely flawless experience every single time. I drop my car at the entrance and by the time I'm done with my meeting, it's already waiting for me. ZenPark has completely changed how I handle parking.",
    color: 'from-yellow-500/20 to-yellow-900/10',
  },
  {
    name: 'Sophia Reyes',
    role: 'Frequent Traveler',
    initials: 'SR',
    rating: 5,
    text: "I use the airport valet every week and the service is consistently outstanding. The app booking is seamless and the staff treats your car like it's their own. Wouldn't trust anyone else.",
    color: 'from-amber-500/20 to-amber-900/10',
  },
  {
    name: 'Marcus Chen',
    role: 'Hotel Guest',
    initials: 'MC',
    rating: 5,
    text: "The car was returned spotless with a complimentary wash I didn't even ask for. That level of attention to detail is rare. ZenPark has genuinely set a new standard for premium valet.",
    color: 'from-yellow-400/20 to-orange-900/10',
  },
  {
    name: 'Natalie Brooks',
    role: 'Restaurant Owner',
    initials: 'NB',
    rating: 5,
    text: "I recommended ZenPark to my entire family after using it at the Beverly Hills location. Professional, punctual, and always a pleasure. The monthly VIP plan is worth every penny.",
    color: 'from-yellow-600/20 to-yellow-950/10',
  },
  {
    name: 'David Okafor',
    role: 'Medical Professional',
    initials: 'DO',
    rating: 5,
    text: "As a doctor with unpredictable hours, having my car ready the moment I step out is a game-changer. The real-time status updates keep me informed. Brilliant service.",
    color: 'from-amber-400/20 to-amber-950/10',
  },
  {
    name: 'Laura Sinclair',
    role: 'Event Planner',
    initials: 'LS',
    rating: 5,
    text: "I've used ZenPark for dozens of corporate events and they've never missed a beat. The staff is polished, the process is smooth, and my clients are always impressed. Five stars every time.",
    color: 'from-yellow-300/20 to-yellow-900/10',
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-0.5 mb-4">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-28 bg-themeBg overflow-hidden">
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
            What Our Clients Say
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-themeText mb-4">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-themeText-secondary max-w-2xl mx-auto">
            From business executives to frequent travelers — our clients experience the ZenPark difference every day.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group relative bg-themeBg-paper border border-themeBorder rounded-2xl p-7 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Gradient glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                {/* Stars */}
                <StarRating count={t.rating} />

                {/* Text */}
                <p className="text-themeText-secondary leading-relaxed text-sm mb-6">
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-themeBorder">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-600 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-themeText font-semibold text-sm">{t.name}</p>
                    <p className="text-themeText-secondary text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '50,000+', label: 'Happy Clients' },
            { value: '4.98 / 5', label: 'Average Rating' },
            { value: '12+', label: 'Locations' },
            { value: '99.8%', label: 'On-time Retrieval' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center bg-themeBg-paper border border-themeBorder rounded-2xl py-7 px-4 hover:border-primary/20 transition-colors"
            >
              <p className="text-3xl font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="text-themeText-secondary text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
