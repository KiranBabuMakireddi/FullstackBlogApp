import React from 'react';
import Header from './Header';
import Footer from './Footer';


const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Always show header */}
      <main className="flex-grow">
        {children} {/* Page content goes here */}
      </main>
      <Footer /> {/* Always show footer */}
    </div>
  );
};

export default Layout;
