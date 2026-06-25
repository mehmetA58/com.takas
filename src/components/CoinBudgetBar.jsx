import { motion, AnimatePresence } from 'framer-motion'
import { moneyFormat } from '../helper'
import { useLanguage } from '../context/LanguageContext'

function CoinBudgetBar({ money, total }) {
  const { t } = useLanguage()
  const remaining = money - total
  const pct = (remaining / money) * 100

  const barColor =
    pct > 50 ? 'bg-brand-gold' : pct > 25 ? 'bg-orange-400' : 'bg-brand-sakla'

  const isEmpty = remaining === 0

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-xs font-bold flex items-center justify-center select-none">
          ß
        </span>
        {isEmpty ? (
          <span className="text-brand-sakla font-semibold text-sm">
            {t('coinBar.empty')}
          </span>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.span
              key={remaining}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-brand-dark font-semibold text-sm whitespace-nowrap"
            >
              {t('coinBar.remaining', { amount: moneyFormat(remaining) })}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <div className="w-28 sm:w-36 h-1 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default CoinBudgetBar
