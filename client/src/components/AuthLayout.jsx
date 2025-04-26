const AuthLayout = ({ title, children, footer }) => (
    <div className="h-full p-6 flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">{title}</h2>
        {children}
        {footer && <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-5">{footer}</div>}
      </div>
    </div>
  );
  
  export default AuthLayout;
  