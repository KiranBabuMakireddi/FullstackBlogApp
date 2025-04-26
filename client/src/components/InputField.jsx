const InputField = ({ label, type = 'text', placeholder, value, onChange, name }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-xl bg-white dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

  
  export default InputField;
  