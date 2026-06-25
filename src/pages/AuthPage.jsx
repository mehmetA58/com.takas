import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

function AuthPage({ defaultTab = 'login', onSuccess, onBack }) {
  const [tab, setTab] = useState(defaultTab)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { t } = useLanguage()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name.trim()) throw new Error(t('auth.errorNameRequired'))
        if (form.password.length < 6) throw new Error(t('auth.errorPasswordLength'))
        await register(form.name, form.email, form.password)
      }
      onSuccess?.()
    } catch (err) {
      // Map known backend messages to localized ones
      let msg = err.message
      if (msg.includes('e-posta zaten') || msg.includes('already in use')) msg = t('auth.errorEmailTaken')
      if (msg.includes('hatalı') || msg.includes('Incorrect')) msg = t('auth.errorCredentials')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => { setTab(t); setError('') }

  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-brand-muted hover:text-brand-dark mb-8 transition-colors text-sm font-medium"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('auth.backToMarket')}
        </button>

        <div className="bg-white rounded-3xl shadow-card-hover p-8">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl font-extrabold text-brand-orange leading-none">ß</span>
            <span className="text-2xl font-bold text-brand-dark tracking-tight">TakasLA</span>
          </div>

          <h1 className="text-xl font-bold text-brand-dark mb-1">
            {tab === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h1>
          <p className="text-sm text-brand-muted mb-6">
            {tab === 'login' ? t('auth.continueSubtitle') : t('auth.signupSubtitle')}
          </p>

          {/* Tabs */}
          <div className="flex rounded-xl bg-stone-100 p-1 mb-6">
            {[['login', t('auth.loginTab')], ['register', t('auth.registerTab')]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === key
                    ? 'bg-white text-brand-dark shadow-sm'
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  {t('auth.nameLabel')}
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t('auth.namePlaceholder')}
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                {t('auth.emailLabel')}
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                {t('auth.passwordLabel')}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={tab === 'register' ? t('auth.passwordPlaceholder') : t('auth.passwordCurrentPlaceholder')}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-brand-dark text-sm transition-all"
                required
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
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-orange-700 transition-colors disabled:opacity-60 text-sm"
            >
              {loading
                ? t('auth.loadingButton')
                : tab === 'login'
                ? t('auth.loginButton')
                : t('auth.registerButton')}
            </motion.button>

            {tab === 'register' && (
              <p className="text-xs text-brand-muted text-center">
                {t('auth.coinGiftNote', { amount: '1.000' })}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage
