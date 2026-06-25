import { motion } from 'framer-motion'
import { moneyFormat } from '../helper'
import { useLanguage } from '../context/LanguageContext'

function CartItem({ item, product }) {
  const { t } = useLanguage()

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-brand-dark text-sm truncate">{product.title}</p>
        <p className="text-xs text-brand-muted mt-0.5">
          {moneyFormat(product.price)} ß {t('cartItem.perUnit')}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <span className="text-brand-orange font-bold text-sm">×{item.amount}</span>
        <p className="text-xs text-brand-muted mt-0.5">
          {moneyFormat(product.price * item.amount)} ß
        </p>
      </div>
    </motion.li>
  )
}

export default CartItem
