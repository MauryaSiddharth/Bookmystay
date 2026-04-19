import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="bg-blue-800">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo */}
        <span className="text-2xl md:text-3xl text-white font-bold tracking-tight">
          BookMyStay
        </span>

        {/* Links */}
        <div className="flex gap-6 text-white font-medium">
          <Link to="/privacy" className="hover:underline hover:text-blue-200 transition">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline hover:text-blue-200 transition">
            Terms of Service
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Footer