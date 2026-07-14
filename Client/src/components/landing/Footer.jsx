
const Footer = () => {
  return (
    <footer className="bg-themeBg-paper dark:bg-black border-t border-themeBorder pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold text-lg">P</div>
              <span className="text-xl font-bold text-themeText tracking-wide">
                ZEN <span className="font-normal text-themeText-secondary">PARK</span>
              </span>
            </div>
            <p className="text-themeText-secondary text-sm leading-relaxed mb-6">
              The premium valet parking solution providing secure, efficient, and luxurious vehicle management.
            </p>
          </div>

          <div>
            <h4 className="text-themeText font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Home</a></li>
              <li><a href="#about" className="text-themeText-secondary hover:text-primary transition-colors text-sm">About Us</a></li>
              <li><a href="#services" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Services</a></li>
              <li><a href="#pricing" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-themeText font-bold mb-6">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-themeText-secondary hover:text-primary transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#contact" className="text-themeText-secondary hover:text-primary transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-themeText font-bold mb-6">Newsletter</h4>
            <p className="text-themeText-secondary text-sm mb-4">Subscribe to get updates on new locations and offers.</p>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-themeBg border border-themeBorder rounded-l-lg px-4 py-2 text-sm text-themeText focus:outline-none focus:border-primary w-full" />
              <button className="bg-primary text-black font-bold px-4 rounded-r-lg hover:bg-primary-dark transition-colors">
                GO
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-themeBorder pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-themeText-secondary text-sm">© {new Date().getFullYear()} ZenPark Valet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
