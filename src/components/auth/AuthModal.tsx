import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User as UserIcon, Building, Phone, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { libraryService } from '../../services/libraryService';
import { User } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [phone, setPhone] = useState('');
  const [membershipId, setMembershipId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        if (mode === 'signup') {
          if (!name.trim() || !email.trim() || !password) {
            setError('Please fill in all mandatory fields.');
            setLoading(false);
            return;
          }
          if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
          }
          const newUser = libraryService.registerUser(name, email, department, phone);
          onSuccess(newUser);
          onClose();
        } else {
          // Sign in
          if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            setLoading(false);
            return;
          }
          // Match existing user or create/fallback
          const users = libraryService.getUsers();
          const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (found) {
            libraryService.setCurrentUser(found);
            onSuccess(found);
            onClose();
          } else {
            // Default demo sign-in for testing any email
            const fallbackUser = libraryService.loginAsDemo('member');
            fallbackUser.email = email;
            libraryService.setCurrentUser(fallbackUser);
            onSuccess(fallbackUser);
            onClose();
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Authentication failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  const handleQuickLogin = (role: 'member' | 'admin') => {
    setLoading(true);
    setTimeout(() => {
      const user = libraryService.loginAsDemo(role);
      onSuccess(user);
      setLoading(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-[#EAE7DF] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F4EE] hover:bg-[#EAE8E0] text-[#656157] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sparkles className="w-5 h-5 text-[#E06953]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1D1D1F]">
            {mode === 'signin' ? 'Welcome Back' : 'Join the Smart Library'}
          </h2>
          <p className="text-xs text-[#8A857A]">
            {mode === 'signin' 
              ? 'Sign in to access your borrowed books, holds, and AI assistant.'
              : 'Create your academic member profile to borrow physical titles.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex rounded-full bg-[#F5F4EE] p-1 mb-6 border border-[#E8E6DF]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              mode === 'signin' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#656157] hover:text-[#1D1D1F]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all ${
              mode === 'signup' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#656157] hover:text-[#1D1D1F]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#656157] mb-1">Full Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#8A857A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Harvey Vance"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#656157] mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#656157] mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-[#656157] mb-1">University / Member Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A857A] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@smartlib.edu"
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#656157] mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A857A] absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-[#8A857A] hover:text-[#1D1D1F]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#656157] mb-1">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm bg-[#F5F4EE] border border-[#DDD9CE] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1D1D1F]"
              />
            </div>
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between text-xs text-[#656157]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#1D1D1F]" />
                <span>Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => alert('For prototype testing, you can use either the Quick Persona buttons below or any demo email!')} 
                className="text-[#E06953] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1D1D1F] hover:bg-[#333336] text-white text-sm font-medium rounded-full transition-all shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Member Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Personas - Crucial for immediate testing */}
        <div className="mt-6 pt-6 border-t border-[#F0EEE6]">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A857A] text-center mb-3">
            Instant Demo Logins
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('member')}
              className="p-2.5 rounded-xl bg-[#F5F4EE] hover:bg-[#EAE8E0] text-left transition-all border border-[#E8E6DF] group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-[#E06953] text-white text-[10px] font-bold flex items-center justify-center">
                  M
                </div>
                <span className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#E06953]">
                  Harvey (Member)
                </span>
              </div>
              <p className="text-[10px] text-[#8A857A] leading-tight">
                Active loans, reservations & personal reading
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl bg-[#F5F4EE] hover:bg-[#EAE8E0] text-left transition-all border border-[#E8E6DF] group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-[#1D1D1F] text-white text-[10px] font-bold flex items-center justify-center">
                  <Shield className="w-3 h-3 text-[#E06953]" />
                </div>
                <span className="text-xs font-bold text-[#1D1D1F] group-hover:text-[#E06953]">
                  Dr. Vance (Admin)
                </span>
              </div>
              <p className="text-[10px] text-[#8A857A] leading-tight">
                Physical copies, barcode sync, fines & analytics
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
