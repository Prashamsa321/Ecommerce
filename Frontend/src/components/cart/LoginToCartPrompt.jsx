// src/components/cart/LoginToCartPrompt.jsx
import { Link } from 'react-router-dom'

const LoginToCartPrompt = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-yellow-800 font-semibold">Login to add items to cart</h3>
          <p className="text-yellow-600 text-sm">Create an account or login to start shopping</p>
        </div>
        <Link 
          to="/login" 
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default LoginToCartPrompt