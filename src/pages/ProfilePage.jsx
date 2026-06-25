import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useMarket } from '../context/MarketContext'
import { useLanguage } from '../context/LanguageContext'
import { moneyFormat } from '../helper'

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

function ProfilePage({ onBack, onAddProduct }) {
  const { user, logout } = useAuth()
  const { listings, removeListing } = useMarket()
  const { t } = useLanguage()

  const myListings = listings.filter(l => l.sellerId === user.id)
  const coinPct = Math.min((user.coins / 1000) * 100, 100)
  const barColor = coinPct > 50 ? 'bg-brand-gold' : coinPct > 25 ? 'bg-orange-400' : 'bg-brand-sakla'

  const handleLogout = () => { logout(); onBack() }

  return (
    <div className="min-h-screen bg-brand-light">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-brand-muted hover:text-brand-dark transition-colors text-sm font-medium"
          >
            <BackIcon /> {t('profile.backToMarket')}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-brand-orange">ß</span>
            <span className="text-lg font-bold text-brand-dark">TakasLA</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-brand-sakla font-medium hover:underline"
          >
            {t('profile.logout')}
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-card p-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-brand-dark truncate">{user.name}</h2>
              <p className="text-brand-muted text-sm truncate">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-brand-light">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-brand-gold text-white text-sm font-extrabold flex items-center justify-center">ß</span>
                <span className="text-sm font-medium text-brand-muted">{t('profile.coinBalance')}</span>
              </div>
              <span className="text-2xl font-extrabold text-brand-dark">{moneyFormat(user.coins)} ß</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${coinPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-xs text-brand-muted mt-1.5">{t('profile.startingBalance')}</p>
          </div>
        </motion.div>

        {/* My Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-brand-dark">
              {t('profile.myListings')}{' '}
              <span className="text-brand-muted font-normal text-base">({myListings.length})</span>
            </h3>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onAddProduct}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-semibold hover:bg-orange-700 transition-colors"
            >
              + {t('profile.newListing')}
            </motion.button>
          </div>

          {myListings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-10 text-center text-brand-muted">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-semibold text-brand-dark">{t('profile.emptyTitle')}</p>
              <p className="text-sm mt-1">{t('profile.emptyDesc')}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {myListings.map(listing => (
                  <motion.li
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-dark text-sm truncate">{listing.title}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-stone-100 text-brand-muted text-xs">
                        {listing.category}
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-brand-orange text-sm">{moneyFormat(listing.price)} ß</p>
                      <p className="text-xs text-brand-muted mt-0.5">{t('profile.salePrice')}</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeListing(listing.id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-brand-muted hover:text-brand-sakla transition-colors flex-shrink-0"
                      title={t('profile.removeTitle')}
                    >
                      <TrashIcon />
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

      </div>
    </div>
  )
}

export default ProfilePage
