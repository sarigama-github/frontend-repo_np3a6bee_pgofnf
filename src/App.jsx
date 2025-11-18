import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Store, Shield, ScrollText, Home, Info, CreditCard } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <nav className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-900/70">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-emerald-500 grid place-items-center font-black">M</div>
            <div className="leading-tight">
              <p className="font-extrabold tracking-tight text-lg">MC HEROS</p>
              <p className="text-xs text-white/60">Minecraft Store</p>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link className="hover:text-emerald-400 transition flex items-center gap-2" to="/"><Home size={16}/> Home</Link>
            <Link className="hover:text-emerald-400 transition flex items-center gap-2" to="/shop"><Store size={16}/> Shop</Link>
            <Link className="hover:text-emerald-400 transition flex items-center gap-2" to="/rules"><ScrollText size={16}/> Rules</Link>
            <Link className="hover:text-emerald-400 transition flex items-center gap-2" to="/tos"><Shield size={16}/> TOS</Link>
            <Link className="hover:text-emerald-400 transition flex items-center gap-2" to="/checkout"><ShoppingCart size={16}/> Checkout</Link>
          </div>
        </div>
      </nav>
      {children}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-3 gap-8 text-sm text-white/70">
          <div>
            <p className="font-semibold text-white">MC HEROS</p>
            <p className="mt-2">A modern Minecraft web store for ranks, items, and more.</p>
          </div>
          <div>
            <p className="font-semibold text-white">Links</p>
            <ul className="mt-2 space-y-1">
              <li><Link className="hover:text-white" to="/rules">Rules</Link></li>
              <li><Link className="hover:text-white" to="/tos">Terms of Service</Link></li>
              <li><a className="hover:text-white" href="#">Privacy</a></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Join Server</p>
            <p className="mt-2">play.mcheros.net</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Hero() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.25),transparent_50%)]"/>
      <div className="max-w-6xl mx-auto px-4 py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">Rule the server with MC HEROS</h1>
            <p className="mt-4 text-white/70 text-lg">Grab ranks, kits, and powerful gear. Support the server and stand out.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/shop" className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold flex items-center gap-2"><Store size={18}/> Browse Shop</Link>
              <a href="#learn" className="px-5 py-3 rounded-lg border border-white/20 hover:border-white/40">Learn more</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 grid place-items-center text-white/60">
              <span className="text-6xl">⛏️</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function HomePage() {
  return (
    <Layout>
      <Hero />
      <section id="learn" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold">Why shop with us?</h2>
        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          {["Secure payments","Instant delivery","Trusted by players"].map((t,i)=>(
            <div key={i} className="p-5 rounded-xl border border-white/10 bg-white/5">
              <p className="font-semibold">{t}</p>
              <p className="text-white/70 text-sm mt-2">Our store is optimized for a smooth and safe checkout experience.</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

function ShopPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`)
        const data = await res.json()
        setItems(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(p => p.id === item.id)
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p)
      }
      return [...prev, { product_id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const subtotal = cart.reduce((s,i)=> s + i.price*i.quantity, 0)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Shop Items</h2>
          <Link to="/checkout" state={{cart}} className="flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-emerald-500 text-black"><ShoppingCart size={16}/> Cart • ${subtotal.toFixed(2)}</Link>
        </div>
        {loading ? (
          <p className="mt-8 text-white/70">Loading items...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {items.map((item) => (
              <div key={item.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col">
                <div className="aspect-video rounded-lg bg-slate-800 border border-white/10 grid place-items-center text-5xl">🛡️</div>
                <div className="mt-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-white/70 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <p className="font-bold">${item.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(item)} className="px-3 py-2 rounded-md bg-emerald-500 text-black text-sm">Add</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

function CheckoutPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const cart = history.state?.usr?.cart || []
  const subtotal = cart.reduce((s,i)=> s + i.price*i.quantity, 0)
  const [form, setForm] = useState({ email: '', name: '', ign: '', note: '' })

  const submitOrder = async () => {
    if (cart.length === 0) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_email: form.email,
          buyer_name: form.name,
          ign: form.ign,
          items: cart,
          note: form.note
        })
      })
      const data = await res.json()
      if (res.ok) {
        navigate(`/checkout/success?order=${data.id}`)
      } else {
        alert(data.detail || 'Something went wrong')
      }
    } catch (e) {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard size={20}/> Checkout</h2>
          <div className="mt-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input className="bg-white/5 border border-white/10 rounded-md px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input className="bg-white/5 border border-white/10 rounded-md px-3 py-2" placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
            </div>
            <input className="bg-white/5 border border-white/10 rounded-md px-3 py-2 w-full" placeholder="Minecraft IGN (optional)" value={form.ign} onChange={e=>setForm({...form,ign:e.target.value})} />
            <textarea className="bg-white/5 border border-white/10 rounded-md px-3 py-2 w-full" rows="4" placeholder="Notes" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
          </div>
          <button onClick={submitOrder} disabled={submitting||cart.length===0} className="mt-6 px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold disabled:opacity-50">{submitting? 'Placing order...' : 'Place order'}</button>
        </div>
        <div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="font-semibold">Order Summary</p>
            <div className="mt-4 space-y-3">
              {cart.length===0 ? (
                <p className="text-white/60">Your cart is empty.</p>
              ) : (
                cart.map((i,idx)=> (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span>{i.name} × {i.quantity}</span>
                    <span>${(i.price*i.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm text-white/70">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function SuccessPage() {
  const params = new URLSearchParams(location.search)
  const orderId = params.get('order')
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold">Thanks for your purchase!</h2>
        <p className="text-white/70 mt-2">Your order ID is {orderId}. You will receive an email shortly.</p>
        <Link to="/shop" className="inline-block mt-6 px-5 py-3 rounded-lg bg-emerald-500 text-black font-semibold">Continue Shopping</Link>
      </div>
    </Layout>
  )
}

function RulesPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-emerald">
        <h1>Server Rules</h1>
        <ol>
          <li>No cheating, exploiting, or hacking of any kind.</li>
          <li>Respect all players and staff. No harassment or hate speech.</li>
          <li>No griefing outside of allowed game modes.</li>
          <li>No advertising or spamming.</li>
          <li>Use common sense. Staff decisions are final.</li>
        </ol>
      </div>
    </Layout>
  )
}

function TOSPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert prose-emerald">
        <h1>Terms of Service</h1>
        <p>By purchasing from MC HEROS, you agree to the following terms:</p>
        <ul>
          <li>Digital items are delivered in-game and are non-refundable once delivered.</li>
          <li>Chargebacks and payment disputes will result in permanent bans.</li>
          <li>We reserve the right to modify items and ranks for balance.</li>
          <li>All purchases are subject to our server rules and guidelines.</li>
        </ul>
        <h3>Refund Policy</h3>
        <p>Contact support within 48 hours for issues with delivery. We do not guarantee refunds.</p>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/shop" element={<ShopPage/>} />
        <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/checkout/success" element={<SuccessPage/>} />
        <Route path="/rules" element={<RulesPage/>} />
        <Route path="/tos" element={<TOSPage/>} />
      </Routes>
    </Router>
  )
}
