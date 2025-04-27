import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const User = lazy(() => import('phosphor-react').then(module => ({ default: module.User })));
const SignOut = lazy(() => import('phosphor-react').then(module => ({ default: module.SignOut })));
const FileText = lazy(() => import('phosphor-react').then(module => ({ default: module.FileText })));
const Users = lazy(() => import('phosphor-react').then(module => ({ default: module.Users })));
const Chats = lazy(() => import('phosphor-react').then(module => ({ default: module.Chats })));
const ChartPieSlice = lazy(() => import('phosphor-react').then(module => ({ default: module.ChartPieSlice })));
const List = lazy(() => import('phosphor-react').then(module => ({ default: module.List })));
const X = lazy(() => import('phosphor-react').then(module => ({ default: module.X })));

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    console.log('hii');
  };

  const linkClasses = (isActive) =>
    `flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200
     hover:bg-blue-100 dark:hover:bg-blue-900
     ${isActive 
      ? 'bg-blue-200 dark:bg-blue-800 font-semibold text-black dark:text-white'
      : 'text-blue-700 dark:text-blue-400'
    }`;

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden p-4">
        <button onClick={() => setIsOpen(true)}>
          <Suspense fallback={<div>...</div>}>
            <List size={32} color='#22af95'/>
          </Suspense>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-20 md:top-0 left-0 h-full w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-56`}>
        
        {/* Top bar inside Sidebar (only mobile) */}
        <div className="p-4 flex justify-between items-center md:hidden">
          <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">Menu</h2>
          <button onClick={() => setIsOpen(false)}>
            <Suspense fallback={<div>...</div>}>
              <X size={28} color='red' />
            </Suspense>
          </button>
        </div>

        {/* Sidebar links */}
        <div className="flex flex-col gap-2 p-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <Suspense fallback={<div className="animate-pulse h-5 bg-blue-300 rounded-md" />}>
            {currentUser && currentUser.isAdmin && (
              <Link
                to="/dashboard?tab=dash"
                className={linkClasses(tab === 'dash' || !tab)}
                onClick={() => setIsOpen(false)}
              >
                <ChartPieSlice size={20} />
                <span>Dashboard</span>
              </Link>
            )}

            <Link
              to="/dashboard?tab=profile"
              className={linkClasses(tab === 'profile')}
              onClick={() => setIsOpen(false)}
            >
              <User size={20} />
              <div className="flex flex-col">
                <span>Profile</span>
                <span className="text-xs text-blue-500 dark:text-blue-400">
                  {currentUser.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </Link>

            {currentUser.isAdmin && (
              <>
                <Link
                  to="/dashboard?tab=posts"
                  className={linkClasses(tab === 'posts')}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText size={20} />
                  <span>Posts</span>
                </Link>

                <Link
                  to="/dashboard?tab=users"
                  className={linkClasses(tab === 'users')}
                  onClick={() => setIsOpen(false)}
                >
                  <Users size={20} />
                  <span>Users</span>
                </Link>

                <Link
                  to="/dashboard?tab=comments"
                  className={linkClasses(tab === 'comments')}
                  onClick={() => setIsOpen(false)}
                >
                  <Chats size={20} />
                  <span>Comments</span>
                </Link>
              </>
            )}

            <button
              onClick={() => {
                handleSignout();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 text-left w-full text-blue-700 dark:text-blue-400"
            >
              <SignOut size={20} />
              <span>Sign Out</span>
            </button>
          </Suspense>
        </div>
      </div>
    </>
  );
}
