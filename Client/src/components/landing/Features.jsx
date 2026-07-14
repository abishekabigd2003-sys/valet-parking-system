import { ShieldCheck, Clock, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Secure Parking',
    description: '24/7 CCTV surveillance and security personnel to ensure your vehicle is safe.',
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: 'Save Time',
    description: 'Drop your car at the entrance and let our professional valets handle the rest.',
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: 'Prime Locations',
    description: 'Available at top hotels, airports, and commercial centers across the city.',
  },
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: 'Premium Service',
    description: 'Experience luxury with our highly trained and courteous valet staff.',
  },
];

const Features = () => {
  return (
    <section id="about" className="py-24 bg-themeBg border-t border-themeBorder pt-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-themeText mb-4">Why Choose <span className="text-primary">Us</span></h2>
          <p className="text-themeText-secondary max-w-2xl mx-auto">
            We provide the most reliable and luxurious parking experience. Your convenience and vehicle's safety are our top priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-themeBg-paper border border-themeBorder p-8 rounded-2xl hover:border-primary/50 transition-colors group"
            >
              <div className="bg-themeBg/50 dark:bg-black/50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-themeText mb-3">{feature.title}</h3>
              <p className="text-themeText-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
