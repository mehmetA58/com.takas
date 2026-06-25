import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMarket } from '../context/MarketContext'
import { useLanguage } from '../context/LanguageContext'

function XIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

const EMPTY = { title: '', price: '', image: '', categoryIndex: 0, description: '' }

function AddProductModal({ isOpen, onClose }) {
  const { addListing } = useMarket()
  const { t, ta } = useLanguage()
  const categories = ta('modal.categories')

  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [imgError, setImgError] = useState(false)

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.name === 'image') setImgError(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.price || !form.image.trim()) {
      setError(t('modal.errorRequired'))
      return
    }
    const price = Number(form.price)
    if (isNaN(price) || price <= 0) {
      setError(t('modal.errorPrice'))
      return
    }
    try {
      addListing({
        title: form.title,
        price,
        image: form.image,
        category: categories[Number(form.categoryIndex)],
        description: form.description,
      })
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setForm(EMPTY)
        onClose()
      }, 1400)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClose = () => {
    setForm(EMPTY)
    setError('')
    setDone(false)
    onClose()
  }

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
            onClick={handleClose}
          />

          <motion.div
            key="modal"
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white z-50 flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 flex-shrink-0">
              <h2 className="font-bold text-xl text-brand-dark">{t('modal.title')}</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-stone-100 text-brand-muted transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {done ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="text-6xl"
                >
                  🎉
                </motion.div>
                <h3 className="text-xl font-bold text-brand-dark">{t('modal.successTitle')}</h3>
                <p className="text-brand-muted text-sm">{t('modal.successDesc')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t('modal.productName')} <span className="text-brand-sakla">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder={t('modal.productNamePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t('modal.category')}
                  </label>
                  <select
                    name="categoryIndex"
                    value={form.categoryIndex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm bg-white"
                  >
                    {categories.map((c, i) => (
                      <option key={i} value={i}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t('modal.price')} <span className="text-brand-sakla">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-brand-gold text-sm">ß</span>
                    <input
                      name="price"
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={handleChange}
                      placeholder={t('modal.pricePlaceholder')}
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm"
                    />
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t('modal.imageUrl')} <span className="text-brand-sakla">*</span>
                  </label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder={t('modal.imageUrlPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm"
                  />
                  {form.image && !imgError && (
                    <div className="mt-2 w-full aspect-video rounded-xl overflow-hidden bg-stone-100">
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    </div>
                  )}
                  {imgError && (
                    <p className="mt-1 text-xs text-brand-sakla">{t('modal.imageError')}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1.5">
                    {t('modal.description')}{' '}
                    <span className="text-brand-muted font-normal">{t('modal.descriptionNote')}</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t('modal.descriptionPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm resize-none"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-orange-700 transition-colors text-sm"
                >
                  {t('modal.submit')}
                </motion.button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddProductModal
