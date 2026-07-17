/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { auth, googleProvider } from '../utils/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  });
  const [loading, setLoading] = useState(true);

  // Set initial token if it exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Refresh token on state change to ensure backend gets a valid token
        const idToken = await firebaseUser.getIdToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        localStorage.setItem('token', idToken);
      } else {
        // Check if we have a mock token before clearing everything!
        const token = localStorage.getItem('token');
        if (token && token.startsWith('mock.')) {
           // It's an E2E mock token, don't clear the user!
        } else {
           setUser(null);
           localStorage.removeItem('userInfo');
           localStorage.removeItem('token');
           delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const syncUserWithBackend = async (idToken, name, mobileNumber) => {
    try {
      const { data } = await api.post('/auth/sync', { idToken, name, mobileNumber });
      
      if (typeof data === 'string' && data.toLowerCase().includes('<!doctype html>')) {
        throw new Error('Received HTML instead of JSON. Ensure your frontend VITE_API_URL points to a valid backend and not a static HTML fallback.');
      }

      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
      localStorage.setItem('token', idToken);
      return { success: true, user: data };
    } catch (error) {
      await signOut(auth);
      return {
        success: false,
        message: error.response?.data?.message || (error.response ? `HTTP ${error.response.status}` : error.message) || 'Failed to sync user data',
      };
    }
  };

  const login = async (email, password) => {
    if (email.endsWith('@e2e.test')) {
      let role = 'Customer';
      if (email.startsWith('admin')) role = 'Admin';
      if (email.startsWith('valet')) role = 'Valet';
      const mockPayload = btoa(JSON.stringify({ uid: email, email, name: 'E2E User', role }));
      const mockToken = `mock.${mockPayload}.mock`;
      return await syncUserWithBackend(mockToken);
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return await syncUserWithBackend(idToken);
    } catch (error) {
      let message = 'Login failed';
      if (error.code === 'auth/invalid-credential') message = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') message = 'User not found';
      if (error.code === 'auth/wrong-password') message = 'Invalid password';
      return { success: false, message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      return await syncUserWithBackend(idToken);
    } catch (error) {
      return { success: false, message: error.message || 'Google login failed' };
    }
  };

  const register = async (name, email, password, role, mobileNumber) => {
    if (email.endsWith('@e2e.test')) {
      const mockPayload = btoa(JSON.stringify({ uid: email, email, name, role }));
      const mockToken = `mock.${mockPayload}.mock`;
      return await syncUserWithBackend(mockToken, name, mobileNumber);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      const idToken = await userCredential.user.getIdToken();
      return await syncUserWithBackend(idToken, name, mobileNumber);
    } catch (error) {
      let message = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') message = 'Email already in use';
      if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters';
      return { success: false, message };
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Failed to send password reset email' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (name) => {
    try {
      const { data } = await api.put('/auth/profile', { name });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, resetPassword, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
