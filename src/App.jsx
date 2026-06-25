import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MarketProvider, useMarket } from './context/MarketContext'
import { useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import HeroBanner from './components/HeroBanner'
import ProductCard from './components/ProductCard'
import CartSidebar from './components/CartSidebar'
import AddProductModal from './components/AddProductModal'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import platformProducts from './products.json'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

// Toast notification component
function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-2xl shadow-glass text-white font-semibold text-sm whitespace-nowrap ${
            toast.type === 'success' ? 'bg-brand-dark' : 'bg-brand-sakla'
          }`}
        >
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AppShell() {
  const { user } = useAuth()
  const { listings } = useMarket()
  const { t } = useLanguage()

  const [basket, setBasket] = useState([])
  const [total, setTotal] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [page, setPage] = useState('market') // 'market' | 'auth' | 'profile'
  const [authTab, setAuthTab] = useState('login')
  const [toast, setToast] = useState(null)

  // Combined product pool for total calculation
  const allProducts = [...platformProducts, ...listings]

  useEffect(() => {
    setTotal(
      basket.reduce((acc, item) => {
        const p = allProducts.find(x => String(x.id) === String(item.id))
        return p ? acc + p.price * item.amount : acc
      }, 0)
    )
  }, [basket, listings])

  // Clear basket items for products that no longer exist (e.g. sold listings)
  useEffect(() => {
    const valid = basket.filter(item =>
      allProducts.some(p => String(p.id) === String(item.id))
    )
    if (valid.length !== basket.length) setBasket(valid)
  }, [listings])

  const money = user ? user.coins : 1000

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openLogin = (tab = 'login') => {
    setAuthTab(tab)
    setPage('auth')
  }

  if (page === 'auth') {
    return (
      <>
        <AuthPage
          defaultTab={authTab}
          onSuccess={() => { setPage('market'); showToast(t('toast.welcome')) }}
          onBack={() => setPage('market')}
        />
        <Toast toast={toast} />
      </>
    )
  }

  if (page === 'profile') {
    return (
      <>
        <ProfilePage
          onBack={() => setPage('market')}
          onAddProduct={() => { setPage('market'); setAddProductOpen(true) }}
        />
        <AddProductModal
          isOpen={addProductOpen}
          onClose={() => setAddProductOpen(false)}
        />
        <Toast toast={toast} />
      </>
    )
  }

  return (
    <>
      <Navbar
        total={total}
        basket={basket}
        setCartOpen={setCartOpen}
        onLoginClick={() => openLogin('login')}
        onProfileClick={() => setPage('profile')}
        onAddProductClick={() => {
          if (!user) { openLogin('login'); return }
          setAddProductOpen(true)
        }}
      />

      <HeroBanner onCTA={() => user ? setAddProductOpen(true) : openLogin('register')} />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{t('market.allProducts')}</h2>
            <p className="text-brand-muted mt-1 text-sm">
              {t('market.productCount', { count: allProducts.length })}
              {listings.length > 0 && (
                <> · <span className="text-brand-orange font-medium">
                  {listings.length} {t('market.userListingBadge')}
                </span></>
              )}
            </p>
          </div>
          {!user && (
            <button
              onClick={() => openLogin('register')}
              className="text-sm text-brand-orange font-semibold hover:underline"
            >
              {t('market.signupCta')}
            </button>
          )}
        </div>

        {/* User listings section (pinned at top) */}
        {listings.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-widest mb-4">
              {t('market.userListingsSection')}
            </h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {listings.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  total={total}
                  money={money}
                  basket={basket}
                  setBasket={setBasket}
                  onLoginRequired={() => openLogin('login')}
                />
              ))}
            </motion.div>
            <div className="mt-8 border-t border-stone-200" />
            <h3 className="text-sm font-bold text-brand-muted uppercase tracking-widest mt-8 mb-4">
              {t('market.marketSection')}
            </h3>
          </div>
        )}

        {/* Platform products */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {platformProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              total={total}
              money={money}
              basket={basket}
              setBasket={setBasket}
              onLoginRequired={() => openLogin('login')}
            />
          ))}
        </motion.div>
      </main>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        basket={basket}
        setBasket={setBasket}
        products={allProducts}
        total={total}
        money={money}
        onLoginRequired={() => { setCartOpen(false); openLogin('login') }}
      />

      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      <Toast toast={toast} />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <AppShell />
      </MarketProvider>
    </AuthProvider>
  )
}

export default App
