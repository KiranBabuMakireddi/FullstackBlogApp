const PrimaryButton = ({ children, type = 'button', onClick }) => (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition duration-200"
    >
      {children}
    </button>
  );
  
  export default PrimaryButton;
  