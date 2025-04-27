import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState, lazy, Suspense } from "react";
import { useTheme } from "../context/ThemeContext"; // <-- Import ThemeContext

// Lazy load icons
const CaretDown = lazy(() =>
  import("phosphor-react").then((m) => ({ default: m.CaretDown }))
);
const Sun = lazy(() =>
  import("phosphor-react").then((m) => ({ default: m.Sun }))
);
const Moon = lazy(() =>
  import("phosphor-react").then((m) => ({ default: m.Moon }))
);
const MagnifyingGlass = lazy(() =>
  import("phosphor-react").then((m) => ({ default: m.MagnifyingGlass }))
);

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { darkMode, toggleDarkMode } = useTheme(); // <-- use ThemeContext
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center text-xl font-semibold whitespace-nowrap dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Kiran Makireddi
        </span>
        <span className="ml-2">Blog</span>
      </Link>
  
      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="hidden lg:flex items-center relative"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
          aria-label="Search"
        />
        <Suspense fallback={null}>
          <MagnifyingGlass
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
            size={20}
          />
        </Suspense>
      </form>
  
      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Mobile search button */}
        <button
          onClick={() => navigate(`/search?searchTerm=${searchTerm}`)}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
          aria-label="Search"
        >
          <Suspense fallback={null}>
            <MagnifyingGlass className="text-gray-700 dark:text-gray-200" size={24} />
          </Suspense>
        </button>
  
        {/* Theme toggle button */}
        <button
          onClick={toggleDarkMode}
          className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
          aria-label="Toggle theme"
        >
          <Suspense fallback={null}>
            {darkMode ? (
              <Moon className="text-gray-700 dark:text-gray-200" size={24} />
            ) : (
              <Sun className="text-gray-700 dark:text-yellow-300" size={24} />
            )}
          </Suspense>
        </button>
  
        {/* User dropdown */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <img
                src={currentUser.profilePicture}
                alt="User avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <Suspense fallback={null}>
                <CaretDown className="text-gray-700 dark:text-gray-200" size={16} />
              </Suspense>
            </button>
  
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-20 transition-colors duration-300">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  @{currentUser.username}
                  <div className="text-xs truncate">{currentUser.email}</div>
                </div>
                <Link
                  to="/dashboard?tab=dash"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard?tab=profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity duration-300 focus:outline-none"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  
    {/* Desktop nav links */}
    <nav className="hidden lg:flex justify-center gap-8 p-2">
      {[
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ].map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium hover:underline transition-colors duration-300 ${
            location.pathname === link.path
              ? "underline text-indigo-600"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  </header>
  

  );
}
