import { motion } from 'framer-motion';
import { KeySquare, Car, Sparkles } from 'lucide-react';

const services = [
  {
    icon: <KeySquare className="w-10 h-10 text-primary" />,
    title: 'Valet Parking',
    desc: 'Classic drop-off and pick-up service right at the entrance.'
  },
  {
    icon: <Sparkles className="w-10 h-10 text-primary" />,
    title: 'Car Wash & Detail',
    desc: 'Get your car washed and detailed while it is parked with us.'
  },
  {
    icon: <Car className="w-10 h-10 text-primary" />,
    title: 'Long-term Parking',
    desc: 'Secure long-term storage for frequent travelers.'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-themeBg-paper">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-themeText mb-4">Our <span className="text-primary">Services</span></h2>
            <p className="text-themeText-secondary">Beyond just parking, we offer a range of premium automotive services to keep your vehicle in perfect condition.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-themeBg p-10 border border-themeBorder hover:border-primary/30 transition-all"
            >
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-block p-4 bg-themeBg-paper dark:bg-black rounded-2xl">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-themeText mb-4">{service.title}</h3>
                <p className="text-themeText-secondary">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
