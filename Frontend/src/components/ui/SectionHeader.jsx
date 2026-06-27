import { motion } from 'framer-motion'

const SectionHeader = ({ badge, title, subtitle, align = 'center' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
  >
    {badge && (
      <span className="badge-new mb-4 inline-flex">{badge}</span>
    )}
    <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{title}</h2>
    {subtitle && (
      <p className={`mt-3 text-text-secondary text-lg max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>
    )}
  </motion.div>
)

export default SectionHeader
