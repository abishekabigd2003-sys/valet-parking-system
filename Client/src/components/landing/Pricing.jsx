import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '../Button';

const plans = [
  {
    name: 'Hourly Rate',
    price: '₹500',
    period: '/hour',
    features: ['Secure Parking', 'Basic Exterior Wash (+₹1,000)', 'Covered Parking'],
    popular: false,
  },
  {
    name: 'Daily Pass',
    price: '₹3,500',
    period: '/day',
    features: ['Secure Parking', 'Complimentary Exterior Wash', 'Premium Covered Spot', 'Multiple Entry/Exit'],
    popular: true,
  },
  {
    name: 'Monthly VIP',
    price: '₹45,000',
    period: '/month',
    features: ['Reserved Spot', 'Full Detail Wash Weekly', 'Priority Retrieval', '24/7 Access', 'Dedicated Account Manager'],
    popular: false,
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-themeBg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-themeText mb-4">Transparent <span className="text-primary">Pricing</span></h2>
          <p className="text-themeText-secondary max-w-2xl mx-auto">Choose the plan that fits your parking needs. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 rounded-2xl border ${
                plan.popular ? 'bg-themeBg-paper border-primary shadow-2xl shadow-primary/10 transform md:-translate-y-4' : 'bg-themeBg-paper dark:bg-black border-themeBorder'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-medium text-themeText mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-themeText">{plan.price}</span>
                <span className="text-themeText-secondary">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-themeText-secondary">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className={`w-full ${plan.popular ? 'bg-primary text-black' : 'bg-themeBg text-themeText border border-themeBorder'}`}>
                Choose Plan
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
