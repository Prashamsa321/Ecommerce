const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-3'
  }
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${sizes[size]} border-[#007AFF] border-t-transparent`}></div>
    </div>
  )
}

export default LoadingSpinner