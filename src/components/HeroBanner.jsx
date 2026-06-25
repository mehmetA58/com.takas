import { motion } from 'framer-motion'
import products from '../products.json'
import { useLanguage } from '../context/LanguageContext'

const collageProducts = products.slice(0, 4)
const rotations = ['rotate-2', '-rotate-2', 'rotate-1', '-rotate-3']

function HeroBanner({ onCTA }) {
  const { t } = useLanguage()

  // Heading may contain a \n — render each line
  const headingLines = t('hero.heading').split('\n')

  return (
    <section className="bg-brand-light py-16 sm:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: Text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-block text-brand-orange text-xs font-bold tracking-widest uppercase mb-4">
              {t('hero.eyebrow')}
            </span>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-brand-dark leading-tight mb-6">
              {headingLines.map((line, i) => (
                <span key={i}>
                  {i === headingLines.length - 1
                    ? <span className="text-brand-orange">{line}</span>
                    : line}
                  {i < headingLines.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="text-lg text-brand-muted leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onCTA}
                className="px-6 py-3 rounded-2xl bg-brand-orange text-white font-semibold hover:bg-orange-700 transition-colors text-sm"
              >
                {t('hero.cta')}
              </motion.button>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-gold/10 border border-brand-gold/30">
                <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-xs font-extrabold flex items-center justify-center">ß</span>
                <span className="text-brand-gold font-semibold text-sm">{t('hero.gift')}</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Product Collage */}
          <div className="flex-1 hidden lg:grid grid-cols-2 gap-4 max-w-sm">
            {collageProducts.map((product, i) => (
              <motion.div
                key={product.id}
                className={`${rotations[i]} rounded-2xl overflow-hidden shadow-card-hover aspect-square`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.classList.add('bg-stone-200')
                  }}
                />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroBanner
