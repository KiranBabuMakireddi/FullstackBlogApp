import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

const TwitterLogo = React.lazy(() => import('phosphor-react/src/icons/TwitterLogo'));
const GithubLogo = React.lazy(() => import('phosphor-react/src/icons/GithubLogo'));
const LinkedinLogo = React.lazy(() => import('phosphor-react/src/icons/LinkedinLogo'));

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 dark:bg-gray-900 text-white py-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        {/* Left Section */}
        <div className="flex flex-col items-center sm:items-start mb-6 sm:mb-0">
          <h2 className="text-2xl font-bold mb-2 text-center sm:text-left">Blog Website</h2>
          <p className="text-sm text-gray-400 text-center sm:text-left max-w-xs">
            A simple blog website built with React, showcasing various projects and articles.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center sm:text-left mb-6 sm:mb-0">
          <Link to="/home" className="text-gray-300 hover:text-gray-100 transition-colors">
            Home
          </Link>
          <Link to="/projects" className="text-gray-300 hover:text-gray-100 transition-colors">
            Projects
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-gray-100 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-gray-100 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Social Links */}
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <Suspense fallback={<div className="w-5 h-5 rounded-full bg-gray-600 animate-pulse" />}>
            <a
              href="https://x.com/KiranMakireddi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-300 hover:text-gray-100 transition-colors"
            >
              <TwitterLogo size={24} weight="fill" />
            </a>
            <a
              href="https://github.com/KiranBabuMakireddi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-300 hover:text-gray-100 transition-colors"
            >
              <GithubLogo size={24} weight="fill" />
            </a>
            <a
              href="https://www.linkedin.com/in/makireddi-kiran-babu-41234b201"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-300 hover:text-gray-100 transition-colors"
            >
              <LinkedinLogo size={24} weight="fill" />
            </a>
          </Suspense>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-700 dark:bg-gray-800 text-center py-4 text-sm text-gray-400 mt-6">
        <p>© 2025 Blog Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
