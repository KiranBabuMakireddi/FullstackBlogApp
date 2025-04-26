import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Lazy load icons
const Eye = React.lazy(() => import('phosphor-react/src/icons/Eye'));
const EyeSlash = React.lazy(() => import('phosphor-react/src/icons/EyeSlash'));

// Lazy load components
const AuthLayout = React.lazy(() => import('../components/AuthLayout'));
const InputField = React.lazy(() => import('../components/InputField'));
const PrimaryButton = React.lazy(() => import('../components/PrimaryButton'));
const GoogleButton = React.lazy(() => import('../components/GoogleButton'));

// Loading Spinner
const LoadingIndicator = () => (
  <div
    className="w-8 h-8 border-4 border-t-4 border-gray-300 dark:border-gray-600 border-solid rounded-full animate-spin"
    aria-live="assertive"
    aria-busy="true"
  ></div>
);

// Fallback Loading UI
const FallbackLoading = () => (
  <div className="flex justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-gray-200 dark:bg-gray-800 bg-opacity-80 z-50">
    <div className="text-center">
      <LoadingIndicator />
      <div className="text-xl text-gray-800 dark:text-gray-300 mt-4">Loading...</div>
    </div>
  </div>
);

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        '/api/auth/signin',
        form,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // Enable cookie support
        }
      );

      const { toast } = await import('react-toastify');
      await import('react-toastify/dist/ReactToastify.css');
      toast.success('Signin successful!');
      setTimeout(() => navigate('/home'), 1500);
    } catch (error) {
      const msg = error.response?.data?.message || 'Signin failed. Please try again.';
      const { toast } = await import('react-toastify');
      await import('react-toastify/dist/ReactToastify.css');
      toast.error(msg);
      console.error('Signin error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Continue with Google clicked');
    // Add Google sign-in logic here
  };

  const renderLoadingButton = (buttonText) => (
    <>
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoadingIndicator />
          <span className="text-sm text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      ) : (
        buttonText
      )}
    </>
  );

  return (
    <React.Suspense fallback={<FallbackLoading />}>
      <AuthLayout
        title="Sign In to Your Account"
        footer={
          <>
            Don&apos;t have an account?{' '}
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <div className="relative">
            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 bottom-[2px] p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              style={{ width: '40px', height: '40px' }}
            >
              {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
            </button>
          </div>
          <PrimaryButton type="submit" disabled={loading} className="relative">
            {renderLoadingButton('Sign In')}
          </PrimaryButton>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        <GoogleButton onClick={handleGoogleSignIn} disabled={loading} className="relative">
          {renderLoadingButton('Continue with Google')}
        </GoogleButton>
      </AuthLayout>
    </React.Suspense>
  );
};

export default SignIn;
