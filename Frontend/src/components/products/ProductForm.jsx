import { useState, useEffect } from 'react'

const ProductForm = ({ initialData, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    countInStock: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price || '',
        description: initialData.description || '',
        image: initialData.image || '',
        category: initialData.category || '',
        countInStock: initialData.countInStock || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Product Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Price
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300 resize-none"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Image URL
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Stock Quantity
        </label>
        <input
          type="number"
          name="countInStock"
          value={formData.countInStock}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#0A2540] border border-[#1E3A8A] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6200] focus:border-transparent transition-all duration-300"
          required
          min="0"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#FF6200] to-[#FF3D00] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : 'Save Product'}
      </button>
    </form>
  )
}

export default ProductForm