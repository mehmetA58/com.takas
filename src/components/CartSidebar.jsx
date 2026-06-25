import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CartItem from './CartItem'
import { moneyFormat } from '../helper'
import { useAuth } from '../context/AuthContext'
import { useMarket } from '../context/MarketContext'
import { useLanguage } from '../context/LanguageContext'

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function CartSidebar({ isOpen, onClose, basket, setBasket, products, total, money, onLoginRequired }) {
  const { user } = useAuth()
  const { purchase } = useMarket()
  const { t } = useLanguage()
  const [purchaseError, setPurchaseError] = useState('')
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handlePurchase = () => {
    setPurchaseError('')
    if (!user) {
      onClose()
      onLoginRequired?.()
      return
    }
    setPurchasing(true)
    const platformOnly = products.filter(p => !p.sellerId)
    const result = purchase(basket, platformOnly)
    setPurchasing(false)
    if (result.ok) {
      setBasket([])
      onClose()
    } else {
      setPurchaseError(result.msg)
    }
  }

  const remaining = money - total

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            key="panel"
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-brand-surface z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 flex-shrink-0">
              <h2 className="font-bold text-xl text-brand-dark">{t('cart.title')}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-100 text-brand-muted transition-colors"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {basket.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-brand-muted">
                  <span className="text-5xl">🛍️</span>
                  <p className="font-semibold text-brand-dark">{t('cart.emptyTitle')}</p>
                  <p className="text-sm text-center leading-relaxed">{t('cart.emptyDesc')}</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <ul className="space-y-3">
                    {basket.map(item => {
                      const product = products.find(p => String(p.id) === String(item.id))
                      if (!product) return null
                      return <CartItem key={item.id} item={item} product={product} />
                    })}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {basket.length > 0 && (
              <div className="px-6 py-5 border-t border-stone-100 space-y-4 flex-shrink-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-brand-muted text-sm">{t('cart.total')}</span>
                    <span className="text-brand-dark font-bold text-2xl">{moneyFormat(total)} ß</span>
                  </div>
                  {user && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-brand-muted text-sm">{t('cart.remainingBalance')}</span>
                      <span className={`text-sm font-semibold ${remaining < 0 ? 'text-brand-sakla' : 'text-brand-gold'}`}>
                        {moneyFormat(Math.max(0, remaining))} ß
                      </span>
                    </div>
                  )}
                </div>

                {purchaseError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {purchaseError}
                  </motion.div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-orange-700 transition-colors text-sm disabled:opacity-60"
                >
                  {!user
                    ? t('cart.loginToBuy')
                    : purchasing
                    ? t('cart.processing')
                    : t('cart.buyButton', { total: moneyFormat(total) })}
                </motion.button>

                <button
                  onClick={() => setBasket([])}
                  className="w-full py-2 text-sm text-brand-muted hover:text-brand-dark transition-colors font-medium"
                >
                  {t('cart.clearCart')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar
