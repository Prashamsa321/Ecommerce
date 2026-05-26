import ProductCard from './ProductCard'

const ProductList = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-[#111827] rounded-2xl overflow-hidden border border-[#1E3A8A] animate-pulse">
            <div className="h-48 bg-gradient-to-br from-[#0A2540] to-[#1E3A8A]"></div>
            <div className="p-5 space-y-3">
              <div className="h-5 bg-[#1E3A8A] rounded-lg w-3/4"></div>
              <div className="h-4 bg-[#1E3A8A] rounded-lg w-full"></div>
              <div className="h-4 bg-[#1E3A8A] rounded-lg w-1/2"></div>
              <div className="flex gap-2 pt-2">
                <div className="h-10 bg-[#1E3A8A] rounded-xl flex-1"></div>
                <div className="h-10 bg-[#1E3A8A] rounded-xl flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-[#111827] rounded-2xl border border-[#FF3B30]/30">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FF3B30]/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#FF3B30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[#FF3B30] font-medium">Error loading products: {error}</p>
        <p className="text-gray-400 text-sm mt-2">Please try again later</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-[#111827] rounded-2xl border border-[#1E3A8A]">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#1E3A8A]/30 rounded-full flex items-center justify-center">
          <span className="text-3xl">📦</span>
        </div>
        <p className="text-gray-300 font-medium">No products found</p>
        <p className="text-gray-400 text-sm mt-1">Check back later for new arrivals</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductList