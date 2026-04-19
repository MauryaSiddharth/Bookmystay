import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';

const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <header className="bg-blue-800 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-white tracking-tight hover:text-gray-200 transition"
        >
          BookMyStay
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="text-blue-600 bg-white px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;