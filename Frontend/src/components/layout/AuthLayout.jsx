import { Link } from 'react-router-dom'

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-auth">
    <div className="hidden lg:flex relative overflow-hidden bg-gradient-hero items-center justify-center p-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-orange/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-amber/10 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10 max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-cta flex items-center justify-center shadow-glow-orange">
            <span className="text-white font-bold">MG</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">Mero<span className="text-brand-orange">Gadget</span></span>
        </div>
        <h2 className="text-4xl font-bold text-text-primary leading-tight mb-4">
          Premium Electronics,<br />
          <span className="bg-gradient-to-r from-brand-orange to-brand-orange-dark bg-clip-text text-transparent">Delivered Fast</span>
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8">
          Join thousands of tech enthusiasts who trust MeroGadget for genuine products, secure checkout, and expert support.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[['100+', 'Products'], ['10K+', 'Users'], ['4.9★', 'Rating']].map(([v, l]) => (
            <div key={l} className="card-premium p-4 text-center">
              <div className="text-xl font-bold text-text-primary">{v}</div>
              <div className="text-xs text-text-muted mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-cta flex items-center justify-center">
            <span className="text-white font-bold text-sm">MG</span>
          </div>
          <span className="text-xl font-bold text-text-primary">Mero<span className="text-brand-orange">Gadget</span></span>
        </div>
        <div className="card-premium p-8 mb-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
            {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
)

export default AuthLayout
