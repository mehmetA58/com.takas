import { createContext, useContext, useState, useEffect } from 'react'
import { getListings, saveListings, getUsers, saveUsers } from '../utils/storage'
import { useAuth } from './AuthContext'

const MarketContext = createContext(null)

export function MarketProvider({ children }) {
  const [listings, setListings] = useState([])
  const { user, updateCoins } = useAuth()

  useEffect(() => {
    setListings(getListings())
  }, [])

  const addListing = ({ title, price, image, category, description }) => {
    if (!user) throw new Error('Giriş yapmanız gerekiyor.')
    const listing = {
      id: `lst_${Date.now()}`,
      title: title.trim(),
      price: Number(price),
      image: image.trim(),
      category,
      description: description?.trim() || '',
      sellerId: user.id,
      sellerName: user.name,
      global_ratings: '5.0 out of 5',
      createdAt: new Date().toISOString(),
    }
    const updated = [listing, ...listings]
    saveListings(updated)
    setListings(updated)
    return listing
  }

  const removeListing = (id) => {
    const updated = listings.filter(l => l.id !== id)
    saveListings(updated)
    setListings(updated)
  }

  // Process purchase for all items in basket.
  // platformProducts = static products.json array
  // basket = [{ id, amount }]
  // Returns { ok: bool, msg?: string, cost?: number }
  const purchase = (basket, platformProducts) => {
    if (!user) return { ok: false, msg: 'Satın almak için giriş yapın.' }

    const allProducts = [
      ...platformProducts.map(p => ({ ...p, isListing: false })),
      ...listings.map(l => ({ ...l, isListing: true })),
    ]

    let cost = 0
    const listingsToBuy = []

    for (const item of basket) {
      const p = allProducts.find(x => String(x.id) === String(item.id))
      if (!p) continue
      if (p.isListing && p.sellerId === user.id) {
        return { ok: false, msg: `"${p.title}" kendi ilanınız — satın alamazsınız.` }
      }
      cost += p.price * item.amount
      if (p.isListing) listingsToBuy.push(p)
    }

    if (user.coins < cost) {
      return { ok: false, msg: `Yetersiz coin. Gereken: ${cost} ß — Bakiye: ${user.coins} ß` }
    }

    // Deduct from buyer
    updateCoins(-cost)

    // Credit sellers + remove sold listings
    if (listingsToBuy.length > 0) {
      const soldIds = listingsToBuy.map(l => l.id)
      let users = getUsers()
      listingsToBuy.forEach(listing => {
        users = users.map(u =>
          u.id === listing.sellerId ? { ...u, coins: u.coins + listing.price } : u
        )
      })
      saveUsers(users)

      const remaining = listings.filter(l => !soldIds.includes(l.id))
      saveListings(remaining)
      setListings(remaining)
    }

    return { ok: true, cost }
  }

  return (
    <MarketContext.Provider value={{ listings, addListing, removeListing, purchase }}>
      {children}
    </MarketContext.Provider>
  )
}

export const useMarket = () => useContext(MarketContext)
