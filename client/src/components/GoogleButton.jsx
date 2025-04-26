import { GoogleLogo } from 'phosphor-react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase'; // Make sure you have initialized Firebase here
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess } from '../redux/user/userSlice';

const GoogleButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          googlePhotoUrl: result.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/home'); // or wherever you want to go after sign-in
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      <GoogleLogo size={20} weight="fill" className="text-red-500" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
        Continue with Google
      </span>
    </button>
  );
};

export default GoogleButton;
