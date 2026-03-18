"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"

import { useCart } from "@/lib/cart-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getDictionary, isLocale, withLocaleHref } from "@/lib/i18n"

export default function LocalizedCartPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    return null
  }

  const locale = params.locale
  const t = getDictionary(locale)
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main>
        <Navbar locale={locale} />
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
          <p className="text-2xl text-muted-foreground">{t.cart.empty}</p>
          <Link href={withLocaleHref(locale, "/")}>
            <Button size="lg">{t.cart.continueShopping}</Button>
          </Link>
        </div>
        <Footer locale={locale} />
      </main>
    )
  }

  const subtotal = total
  const shipping = 10
  const tax = subtotal * 0.1
  const finalTotal = subtotal + shipping + tax

  return (
    <main>
      <Navbar locale={locale} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <Link href={withLocaleHref(locale, "/")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />
          {t.cart.back}
        </Link>

        <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-12">{t.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id + item.size + item.color} className="flex gap-6 p-6 rounded-2xl border border-border bg-card hover:border-foreground transition-colors">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t.cart.size}: {item.size} | {t.cart.color}: {item.color}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{item.price}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-2 border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="px-3 py-2 hover:bg-secondary transition-colors">-</button>
                    <span className="px-4 py-2 font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="px-3 py-2 hover:bg-secondary transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-8 space-y-6 sticky top-6 h-fit">
              <h2 className="font-display text-2xl font-bold text-foreground">{t.cart.orderSummary}</h2>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex justify-between text-foreground">
                  <span>{t.cart.subtotal}</span>
                  <span>{"$" + subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>{t.cart.shipping}</span>
                  <span>{"$" + shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>{t.cart.tax}</span>
                  <span>{"$" + tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-display text-xl font-bold text-foreground border-t border-border pt-6">
                <span>{t.cart.total}</span>
                <span className="text-primary">{"$" + finalTotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button className="w-full" size="lg">{t.cart.proceed}</Button>
              </Link>

              <button onClick={() => clearCart()} className="w-full text-muted-foreground hover:text-foreground text-sm py-2 transition-colors">{t.cart.clear}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer locale={locale} />
    </main>
  )
}
