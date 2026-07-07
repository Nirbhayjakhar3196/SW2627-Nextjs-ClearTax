const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded">
      {message}
    </div>
  );
};

export default ErrorBanner;