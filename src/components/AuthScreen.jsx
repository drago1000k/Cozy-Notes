import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen({ setMascotState }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, loginWithGoogle } = useAuth();

  const handleFocus = () => setMascotState('curious');
  const handleBlur = () => setMascotState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setMascotState('wave');
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
      setMascotState('shake');
      setTimeout(() => setMascotState('idle'), 1500);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      setMascotState('wave');
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      setMascotState('shake');
      setTimeout(() => setMascotState('idle'), 1500);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-20" style={{ perspective: '1000px' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="bg-[#faf5ef] rounded-2xl p-8 shadow-2xl relative border border-orange-100"
          style={{ width: 360, transformStyle: 'preserve-3d', backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }}
        >
          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-handwriting font-bold text-amber-900 mb-1">
              {isLogin ? 'Welcome Back' : 'Create Passport'}
            </h2>
            <p className="text-sm text-amber-700/70 font-semibold uppercase tracking-wider">
              Cozy Productivity Space
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-start gap-2 text-red-600 text-sm border border-red-100">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/60" size={18} />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-amber-100 rounded-xl outline-none focus:border-amber-400 focus:bg-white transition-all text-amber-900 font-semibold"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/60" size={18} />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full pl-10 pr-4 py-3 bg-white/50 border-2 border-amber-100 rounded-xl outline-none focus:border-amber-400 focus:bg-white transition-all text-amber-900 font-semibold"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="mt-2 w-full py-3 rounded-xl font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
            >
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-amber-200"></div>
            <span className="text-xs font-bold text-amber-400 uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-amber-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="mt-6 w-full py-3 bg-white border-2 border-amber-100 rounded-xl font-bold text-amber-800 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Login
          </button>

          <p className="mt-8 text-center text-sm font-semibold text-amber-700/80">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-amber-600 font-bold hover:text-amber-800 transition-colors"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
