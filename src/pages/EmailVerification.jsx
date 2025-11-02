import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const message = location.state?.message || 'Please check your email for the verification code.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.verifyEmail(verificationCode);
      
      toast.success(data.message || 'Email verified successfully!');
      
      // Redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed. Please check your code.';
      
      if (error.response?.status === 410) {
        toast.error('Verification code has expired. Please request a new one.');
      } else if (error.response?.status === 404) {
        toast.error('Invalid verification code. Please try again.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    toast.info('Resend code feature coming soon!');
    // TODO: Implement resend code API when available
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            {email && (
              <p className="mt-2 text-sm text-gray-500">
                We sent a code to <span className="font-medium text-primary-600">{email}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="verificationCode"
                name="verificationCode"
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                className="input-field text-center text-2xl tracking-widest font-mono"
                placeholder="ABC123XYZ"
                maxLength={9}
                disabled={loading}
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                Enter the 9-character code from your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResendCode}
                className="text-primary-600 hover:text-primary-700 font-medium"
                type="button"
              >
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;
