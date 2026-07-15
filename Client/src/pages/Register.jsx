import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CarFront, Lock, Mail, User, Phone } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  // Explicitly passing 'Customer' since users cannot select their role during registration.
  const [role] = useState('Customer');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    // Validations
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (mobileNumber && !/^\+?[0-9]{10,15}$/.test(mobileNumber)) return setError('Invalid mobile number format.');

    setLoading(true);
    const res = await register(name, email, password, role, mobileNumber);
    if (res.success) {
      setSuccessMsg('Registration successful! Please check your email to verify your account.');
      // Optionally redirect after a few seconds, or let them click a button
      setTimeout(() => navigate('/'), 3000);
    } else {
      setError(res.message);
    }
    
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-themeBg">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
              <CarFront className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-themeText mb-2">Create Account</h1>
            <p className="text-themeText-secondary text-sm text-center">Sign up to access the Valet Management System</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-lg mb-6 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-3 top-[38px] w-5 h-5 text-themeText-secondary" />
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-[38px] w-5 h-5 text-themeText-secondary" />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@zenpark.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Phone className="absolute left-3 top-[38px] w-5 h-5 text-themeText-secondary" />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="1234567890"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-[38px] w-5 h-5 text-themeText-secondary" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          {/* OR Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-grow border-t border-themeBorder"></div>
            <span className="flex-shrink-0 mx-4 text-themeText-secondary text-sm">OR</span>
            <div className="flex-grow border-t border-themeBorder"></div>
          </div>

          {/* Google Sign-In */}
          <div className="flex justify-center w-full">
            <Button 
               onClick={handleGoogleSignIn} 
               variant="outline" 
               className="w-full flex items-center justify-center gap-2 border-themeBorder text-themeText hover:bg-themeBg-paper"
               disabled={loading}
               type="button"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-themeText-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
