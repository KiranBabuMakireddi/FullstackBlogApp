import React, { useState } from 'react';
import { Link } from 'react-router-dom'
const X = React.lazy(() => import('phosphor-react/src/icons/X'));
const List = React.lazy(() => import('phosphor-react/src/icons/List'));
const Moon = React.lazy(() => import('phosphor-react/src/icons/Moon'));
const Sun = React.lazy(() => import('phosphor-react/src/icons/Sun'));
const MagnifyingGlass = React.lazy(() => import('phosphor-react/src/icons/MagnifyingGlass'));
import { useTheme } from '../context/ThemeContext'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { darkMode, toggleDarkMode } = useTheme()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4 gap-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          <Link to="/">Blog Website</Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 pl-10 focus:outline-none"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Nav links - Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="nav-link">Home</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center space-x-4 ml-auto md:ml-0">
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden text-gray-800 dark:text-white focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <List size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-6 pb-4 space-y-4">
          {/* Search - Mobile */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 pl-10 focus:outline-none"
            />
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300"
            />
          </div>

          {/* Nav Links - Mobile */}
          <Link to="/home" onClick={closeMenu} className="block nav-link">Home</Link>
          <Link to="/projects" onClick={closeMenu} className="block nav-link">Projects</Link>
          <Link to="/about" onClick={closeMenu} className="block nav-link">About</Link>
        </div>
      )}
    </header>
  )
}

export default Header
