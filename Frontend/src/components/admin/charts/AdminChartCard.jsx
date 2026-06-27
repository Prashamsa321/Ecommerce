const AdminChartCard = ({ title, subtitle, action, children, className = '' }) => (
  <div className={`admin-card p-5 sm:p-6 ${className}`}>
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        <h3 className="font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
)

export default AdminChartCard
