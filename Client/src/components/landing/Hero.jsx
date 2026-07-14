import { motion } from 'framer-motion';
import BookingCard from './BookingCard';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[95vh] flex flex-col pt-32 pb-48 px-6">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Dark Parking Garage"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-themeBg via-themeBg to-transparent opacity-80"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 flex-1">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="flex flex-col justify-center"
        >
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-primary font-bold mb-4 tracking-widest uppercase text-sm"
          >
            Welcome to
          </motion.p>
          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg"
          >
            <span className="text-primary">ZEN</span> PARK
          </motion.h1>
          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed drop-shadow-md"
          >
            Premium valet parking experience. Book your parking slot in seconds and let our professional team take care of your vehicle with utmost security.
          </motion.p>
        </motion.div>
      </div>

      {/* Booking Card Positioned Absolutely or Relatively based on design */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-6">
        <div className="max-w-6xl mx-auto">
          <BookingCard />
        </div>
      </div>
    </section>
  );
};

export default Hero;
