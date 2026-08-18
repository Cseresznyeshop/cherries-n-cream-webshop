"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

export default function CheckoutPage() {
  const { items, totalHuf } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aszfAccepted, setAszfAccepted] = useState(false);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    billingName: "",
    billingAddress: "",
    shippingMethod: "gls_box",
    shippingAddress: "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aszfAccepted || items.length === 0) return;
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, ...form, aszfAcceptedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      setLoading(false);
      alert("Hiba történt a rendelés indításakor. Kérjük, próbáld újra.");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl mb-8">Pénztár</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="E-mail cím" type="email" required value={form.email} onChange={(v) => update("email", v)} />
        <Field label="Telefonszám" type="tel" required value={form.phone} onChange={(v) => update("phone", v)} />
        <Field
          label="Számlázási név"
          required
          value={form.billingName}
          onChange={(v) => update("billingName", v)}
        />
        <Field
          label="Számlázási cím"
          required
          value={form.billingAddress}
          onChange={(v) => update("billingAddress", v)}
        />

        <div>
          <label className="block text-sm text-cream/70 mb-2">Szállítási mód</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "gls_box", label: "GLS csomagpont" },
              { value: "gls_home", label: "GLS házhozszállítás" },
            ].map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => update("shippingMethod", opt.value)}
                className={`px-4 py-3 rounded-soft border text-sm transition-colors ${
                  form.shippingMethod === opt.value
                    ? "border-cherryLight bg-cherry/20"
                    : "border-cream/20 hover:border-cream/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Szállítási cím / csomagpont"
          required
          value={form.shippingAddress}
          onChange={(v) => update("shippingAddress", v)}
        />

        <label className="flex items-start gap-3 text-sm text-cream/70 pt-2">
          <input
            type="checkbox"
            checked={aszfAccepted}
            onChange={(e) => setAszfAccepted(e.target.checked)}
            className="mt-1"
          />
          <span>
            A rendelés leadásával elfogadom az{" "}
            <a href="/aszf" target="_blank" className="underline hover:text-blush">
              ÁSZF-et
            </a>{" "}
            és megerősítem, hogy elmúltam 18 éves.
          </span>
        </label>

        <div className="flex items-center justify-between pt-4 border-t border-cream/10">
          <span className="text-cream/60">Fizetendő</span>
          <span className="text-xl font-medium">{totalHuf().toLocaleString("hu-HU")} Ft</span>
        </div>

        <button
          type="submit"
          disabled={!aszfAccepted || loading || items.length === 0}
          className="w-full px-8 py-3 bg-cherry hover:bg-cherryLight disabled:opacity-40 disabled:cursor-not-allowed rounded-soft font-medium transition-colors"
        >
          {loading ? "Átirányítás a fizetéshez…" : "Fizetés bankkártyával (Stripe)"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-cream/70 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-cream/5 border border-cream/20 rounded-soft px-3 py-2 focus:border-blush outline-none"
      />
    </div>
  );
}
