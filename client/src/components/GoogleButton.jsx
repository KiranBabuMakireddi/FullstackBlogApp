import { GoogleLogo } from 'phosphor-react';

const GoogleButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
  >
    <GoogleLogo size={20} weight="fill" className="text-red-500" />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Continue with Google</span>
  </button>
);

export default GoogleButton;
