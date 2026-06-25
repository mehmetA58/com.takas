import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import CoinBudgetBar from './CoinBudgetBar'

function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function Navbar({ total, basket, setCartOpen, onLoginClick, onProfileClick, onAddProductClick }) {
  const { user, logout } = useAuth()
  const { lang, toggle, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const itemCount = basket.reduce((s, i) => s + i.amount, 0)
  const money = user ? user.coins : 1000

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-glass border-b border-stone-200'
          : 'bg-brand-light'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2 select-none flex-shrink-0">
          <span className="text-2xl font-extrabold text-brand-orange leading-none">ß</span>
          <span className="text-xl font-bold text-brand-dark tracking-tight">TakasLA</span>
        </div>

        {/* Coin Budget Bar */}
        <div className="flex-1 flex justify-center">
          <CoinBudgetBar money={money} total={total} />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-muted hover:text-brand-dark border border-stone-200 hover:border-stone-400 transition-all select-none"
            aria-label="Switch language"
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>

          {user ? (
            <>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onAddProductClick}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-orange text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
              >
                <PlusIcon />
                {t('nav.addProduct')}
              </motion.button>

              {/* User avatar / dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className="w-9 h-9 rounded-full bg-brand-orange text-white font-bold text-sm flex items-center justify-center hover:bg-orange-700 transition-colors select-none"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-stone-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="font-semibold text-brand-dark text-sm truncate">{user.name}</p>
                        <p className="text-xs text-brand-muted truncate">{user.email}</p>
                        <p className="text-xs font-semibold text-brand-gold mt-1">
                          {t('nav.balance', { coins: user.coins })}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => { setUserMenuOpen(false); onProfileClick() }}
                          className="w-full text-left px-4 py-2.5 text-sm text-brand-dark hover:bg-stone-50 transition-colors"
                        >
                          {t('nav.profile')}
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); onAddProductClick() }}
                          className="w-full text-left px-4 py-2.5 text-sm text-brand-dark hover:bg-stone-50 transition-colors sm:hidden"
                        >
                          {t('nav.addProduct')}
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); logout() }}
                          className="w-full text-left px-4 py-2.5 text-sm text-brand-sakla hover:bg-red-50 transition-colors"
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onLoginClick}
              className="px-4 py-2 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-stone-800 transition-colors"
            >
              {t('nav.login')}
            </motion.button>
          )}

          {/* Cart */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-xl text-brand-dark hover:bg-stone-100 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBagIcon />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
