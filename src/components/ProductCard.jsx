import { motion, AnimatePresence } from 'framer-motion'
import { moneyFormat } from '../helper'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

function StarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-brand-gold">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function ProductCard({ product, total, money, basket, setBasket, onLoginRequired }) {
  const { user } = useAuth()
  const { t } = useLanguage()

  const basketItem = basket.find(item => String(item.id) === String(product.id))
  const isListing = !!product.sellerId
  const isOwn = isListing && user && product.sellerId === user.id
  const canAfford = total + product.price <= money

  const addBasket = () => {
    if (!user) { onLoginRequired?.(); return }
    const existing = basket.find(item => String(item.id) === String(product.id))
    if (existing) {
      existing.amount += 1
      setBasket([...basket.filter(item => String(item.id) !== String(product.id)), existing])
    } else {
      setBasket([...basket, { id: product.id, amount: 1 }])
    }
  }

  const removeBasket = () => {
    const current = basket.find(item => String(item.id) === String(product.id))
    const rest = basket.filter(item => String(item.id) !== String(product.id))
    current.amount -= 1
    setBasket(current.amount === 0 ? rest : [...rest, current])
  }

  const ratingNum = parseFloat(product.global_ratings)
  const addDisabled = isOwn || !canAfford

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`group relative bg-brand-surface rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden ${
        addDisabled && !basketItem ? 'opacity-60' : ''
      }`}
    >
      {/* Listing badge */}
      {isListing && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            isOwn
              ? 'bg-brand-gold/90 text-white'
              : 'bg-white/90 backdrop-blur-sm text-brand-dark'
          }`}>
            {isOwn ? t('card.myListing') : product.sellerName}
          </span>
        </div>
      )}

      {/* In-basket badge */}
      <AnimatePresence>
        {basketItem && basketItem.amount > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center shadow-md"
          >
            {basketItem.amount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23e7e5e4"/><text x="50%25" y="50%25" font-size="36" text-anchor="middle" dominant-baseline="middle" fill="%2378716c">📦</text></svg>`
          }}
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-brand-dark text-base leading-snug">{product.title}</h3>

        {product.description && (
          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{product.description}</p>
        )}

        <div className="flex items-center gap-1">
          <StarIcon />
          <span className="text-xs text-brand-muted font-medium">
            {isNaN(ratingNum) ? product.global_ratings : ratingNum.toFixed(1)}
          </span>
          {product.category && (
            <>
              <span className="text-stone-300 mx-1">·</span>
              <span className="text-xs text-brand-muted">{product.category}</span>
            </>
          )}
        </div>

        <div className="text-brand-orange font-bold text-lg mt-auto pt-1">
          {moneyFormat(product.price)} ß
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          {isOwn ? (
            <div className="flex-1 py-2 rounded-xl text-sm font-semibold text-center bg-stone-100 text-brand-muted select-none">
              {t('card.ownListing')}
            </div>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.94 }}
                disabled={!basketItem}
                onClick={removeBasket}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-brand-sakla disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                {t('card.remove')}
              </motion.button>

              <span className="w-8 text-center font-bold text-brand-dark text-sm">
                {(basketItem && basketItem.amount) || 0}
              </span>

              <motion.button
                whileTap={{ scale: 0.94 }}
                disabled={addDisabled}
                onClick={addBasket}
                className="flex-1 py-2 rounded-xl text-sm font-semibold text-white bg-brand-orange hover:bg-orange-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {!user
                  ? t('card.loginRequired')
                  : !canAfford
                  ? t('card.noCoin')
                  : t('card.add')}
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
