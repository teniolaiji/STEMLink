import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</p>
        <p className="text-gray-600 mt-2 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn-primary"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
