import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import GoogleButton from '../components/GoogleButton';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up with:', form);
  };

  const handleGoogleSignIn = () => {
    console.log('Continue with Google clicked');
  };

  return (
    <AuthLayout
      title="Create an Account"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField label="Username" name="username" value={form.username} onChange={handleChange} />
        <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        <PrimaryButton type="submit">Sign Up</PrimaryButton>
      </form>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        <span className="mx-2 text-sm text-gray-500 dark:text-gray-400">or</span>
        <hr className="flex-grow border-gray-300 dark:border-gray-600" />
      </div>

      <GoogleButton onClick={handleGoogleSignIn} />
    </AuthLayout>
  );
};

export default SignUp;
