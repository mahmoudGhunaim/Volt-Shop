"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Info, Lock, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm, useWatch, type FieldError } from "react-hook-form";
import { CartEmpty } from "@/components/cart/cart-empty";
import { PromoField, Totals } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import {
  cardBrand,
  checkoutSchema,
  createOrderId,
  countries,
  EXPRESS_RATE,
  formatCardNumber,
  formatExpiry,
  ORDER_KEY,
  paymentFields,
  shippingFields,
  type CheckoutInput,
  type PlacedOrder,
} from "@/lib/checkout";
import { useHydrated } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { computeTotals, useCart } from "@/store/cart";
import { CardPreview } from "./card-preview";

type Step = 0 | 1 | 2;
const ease = [0.16, 1, 0.3, 1] as const;

export function CheckoutView() {
  const { t, f, price, dir } = useI18n();
  const router = useRouter();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const promo = useCart((s) => s.promo);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [cvcFocused, setCvcFocused] = useState(false);
  const [placing, setPlacing] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      zip: "",
      country: countries[0],
      method: "standard",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvc: "",
    },
  });
  const { register, handleSubmit, trigger, control, formState, getValues } = form;
  const values = useWatch({ control });
  const errors = formState.errors;
  const method = values.method ?? "standard";

  const baseTotals = computeTotals(lines, promo);
  const shippingOverride = method === "express" ? EXPRESS_RATE : undefined;
  const totals = computeTotals(lines, promo, shippingOverride ?? baseTotals.shipping);

  const steps = [t.checkout.steps.shipping, t.checkout.steps.payment, t.checkout.steps.review];

  function go(next: Step) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function next() {
    const fields = step === 0 ? shippingFields : paymentFields;
    const ok = await trigger(fields, { shouldFocus: true });
    if (ok) go((step + 1) as Step);
  }

  const onSubmit = handleSubmit(async (data) => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1400)); // pretend payment processing
    const eta = new Date();
    eta.setDate(eta.getDate() + (data.method === "express" ? 2 : 5));
    const order: PlacedOrder = {
      id: createOrderId(),
      name: data.firstName,
      email: data.email,
      total: totals.total,
      itemCount: totals.itemCount,
      eta: eta.toISOString(),
      images: lines.slice(0, 4).map((l) => l.image),
    };
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      /* storage blocked: success page falls back to a generic message */
    }
    router.push("/checkout/success");
    clear();
  });

  if (!hydrated) {
    return (
      <div className="container-volt py-12" aria-busy="true">
        <div className="skeleton h-14 w-60 rounded-lg" />
        <div className="skeleton mt-8 h-12 max-w-xl rounded-full" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <div className="skeleton h-[28rem] rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (lines.length === 0 && !placing) {
    return (
      <div className="container-volt py-12">
        <h1 className="text-h1">{t.checkout.title}</h1>
        <p className="mt-3 text-muted">{t.checkout.emptyCart}</p>
        <CartEmpty />
      </div>
    );
  }

  const err = (e?: FieldError) =>
    e?.message ? t.checkout.errors[e.message as keyof typeof t.checkout.errors] ?? e.message : undefined;
  const last4 = (values.cardNumber ?? "").replace(/\D/g, "").slice(-4);

  return (
    <div className="container-volt py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-h1">{t.checkout.title}</h1>
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-text hover:underline">
          <ArrowLeft className="flip-rtl size-4" />
          {t.cart.viewCart}
        </Link>
      </div>

      <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-violet/40 bg-violet/10 px-4 py-3 text-sm">
        <Info className="mt-0.5 size-4 shrink-0 text-violet-text" aria-hidden />
        {t.checkout.demoNotice}
      </p>

      {/* Progress */}
      <nav aria-label={f(t.checkout.stepOf, { current: step + 1, total: 3 })} className="mt-10">
        <ol className="flex items-center gap-2 sm:gap-3">
          {steps.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3 last:flex-none">
                <button
                  type="button"
                  onClick={() => done && go(i as Step)}
                  disabled={!done}
                  aria-current={current ? "step" : undefined}
                  className="flex items-center gap-2.5 disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "tabular grid size-9 shrink-0 place-items-center rounded-full border text-sm font-bold transition-[background-color,border-color,color] duration-300",
                      current && "border-lime bg-lime text-on-lime",
                      done && "border-fg bg-fg text-bg",
                      !current && !done && "border-border text-muted",
                    )}
                  >
                    {done ? <Check className="size-4" /> : i + 1}
                  </span>
                  <span className={cn("text-sm font-medium max-sm:hidden", !current && !done && "text-muted")}>{label}</span>
                </button>
                {i < steps.length - 1 && (
                  <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden>
                    <motion.span
                      className="absolute inset-y-0 start-0 bg-fg"
                      initial={false}
                      animate={{ width: done ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-sm text-muted sm:hidden">{steps[step]}</p>
      </nav>

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-14">
        <form onSubmit={onSubmit} noValidate className="min-w-0">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: 32 * direction * (dir === "rtl" ? -1 : 1) }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 * direction * (dir === "rtl" ? -1 : 1) }}
              transition={{ duration: 0.35, ease }}
            >
              {step === 0 && (
                <div className="flex flex-col gap-10">
                  <Section title={t.checkout.contact}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.checkout.email} error={err(errors.email)}>
                        {(p) => <Input {...p} type="email" autoComplete="email" inputMode="email" {...register("email")} />}
                      </Field>
                      <Field label={t.checkout.phone} error={err(errors.phone)}>
                        {(p) => <Input {...p} type="tel" autoComplete="tel" inputMode="tel" {...register("phone")} />}
                      </Field>
                    </div>
                  </Section>

                  <Section title={t.checkout.address}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.checkout.firstName} error={err(errors.firstName)}>
                        {(p) => <Input {...p} autoComplete="given-name" {...register("firstName")} />}
                      </Field>
                      <Field label={t.checkout.lastName} error={err(errors.lastName)}>
                        {(p) => <Input {...p} autoComplete="family-name" {...register("lastName")} />}
                      </Field>
                      <Field label={t.checkout.street} error={err(errors.street)} className="sm:col-span-2">
                        {(p) => <Input {...p} autoComplete="street-address" {...register("street")} />}
                      </Field>
                      <Field label={t.checkout.city} error={err(errors.city)}>
                        {(p) => <Input {...p} autoComplete="address-level2" {...register("city")} />}
                      </Field>
                      <Field label={t.checkout.zip} error={err(errors.zip)}>
                        {(p) => <Input {...p} autoComplete="postal-code" {...register("zip")} />}
                      </Field>
                      <Field label={t.checkout.country} error={err(errors.country)} className="sm:col-span-2">
                        {(p) => (
                          <select
                            {...p}
                            autoComplete="country-name"
                            {...register("country")}
                            className={inputClass(!!errors.country)}
                          >
                            {countries.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        )}
                      </Field>
                    </div>
                  </Section>

                  <Section title={t.checkout.method}>
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
                      {(
                        [
                          { id: "standard", label: t.checkout.standard, eta: t.checkout.standardEta, cost: baseTotals.shipping },
                          { id: "express", label: t.checkout.express, eta: t.checkout.expressEta, cost: EXPRESS_RATE },
                        ] as const
                      ).map((m) => (
                        <label
                          key={m.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-[border-color,background-color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-(--focus)",
                            method === m.id ? "border-fg bg-surface" : "border-border hover:border-fg/40",
                          )}
                        >
                          <input type="radio" value={m.id} {...register("method")} className="sr-only" />
                          <span
                            className={cn(
                              "grid size-5 shrink-0 place-items-center rounded-full border-2",
                              method === m.id ? "border-fg" : "border-border",
                            )}
                          >
                            {method === m.id && <span className="size-2.5 rounded-full bg-fg" />}
                          </span>
                          <span className="flex-1">
                            <span className="block font-medium">{m.label}</span>
                            <span className="block text-sm text-muted">{m.eta}</span>
                          </span>
                          <span className="tabular font-semibold">{m.cost === 0 ? t.cart.free : price(m.cost, true)}</span>
                        </label>
                      ))}
                    </div>
                  </Section>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
                  <Section title={t.checkout.steps.payment}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label={t.checkout.cardNumber} error={err(errors.cardNumber)} className="sm:col-span-2">
                        {(p) => {
                          const reg = register("cardNumber");
                          return (
                            <Input
                              {...p}
                              {...reg}
                              dir="ltr"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="4242 4242 4242 4242"
                              onChange={(e) => {
                                e.target.value = formatCardNumber(e.target.value);
                                return reg.onChange(e);
                              }}
                              end={
                                <span className="text-xs font-bold uppercase text-muted">
                                  {cardBrand(values.cardNumber ?? "") !== "card" && cardBrand(values.cardNumber ?? "")}
                                </span>
                              }
                            />
                          );
                        }}
                      </Field>
                      <Field label={t.checkout.cardName} error={err(errors.cardName)} className="sm:col-span-2">
                        {(p) => <Input {...p} autoComplete="cc-name" {...register("cardName")} />}
                      </Field>
                      <Field label={t.checkout.expiry} error={err(errors.expiry)}>
                        {(p) => {
                          const reg = register("expiry");
                          return (
                            <Input
                              {...p}
                              {...reg}
                              dir="ltr"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              placeholder="MM/YY"
                              onChange={(e) => {
                                e.target.value = formatExpiry(e.target.value);
                                return reg.onChange(e);
                              }}
                            />
                          );
                        }}
                      </Field>
                      <Field label={t.checkout.cvc} error={err(errors.cvc)}>
                        {(p) => {
                          const reg = register("cvc");
                          return (
                            <Input
                              {...p}
                              {...reg}
                              dir="ltr"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="123"
                              maxLength={4}
                              onFocus={() => setCvcFocused(true)}
                              onBlur={(e) => {
                                setCvcFocused(false);
                                return reg.onBlur(e);
                              }}
                              onChange={(e) => {
                                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                                return reg.onChange(e);
                              }}
                            />
                          );
                        }}
                      </Field>
                    </div>
                  </Section>
                  <div className="order-first xl:order-none xl:pt-12">
                    <CardPreview
                      number={values.cardNumber ?? ""}
                      name={values.cardName ?? ""}
                      expiry={values.expiry ?? ""}
                      cvc={values.cvc ?? ""}
                      flipped={cvcFocused}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <ReviewBlock title={t.checkout.shipTo} onEdit={() => go(0)} editLabel={t.checkout.edit}>
                    <p className="font-medium">
                      {getValues("firstName")} {getValues("lastName")}
                    </p>
                    <p className="text-muted">
                      {getValues("street")}, {getValues("city")} {getValues("zip")}, {getValues("country")}
                    </p>
                    <p className="text-muted">
                      {getValues("email")} · {getValues("phone")}
                    </p>
                    <p className="mt-2 text-sm">
                      {method === "express" ? t.checkout.express : t.checkout.standard} ·{" "}
                      <span className="text-muted">{method === "express" ? t.checkout.expressEta : t.checkout.standardEta}</span>
                    </p>
                  </ReviewBlock>
                  <ReviewBlock title={t.checkout.payWith} onEdit={() => go(1)} editLabel={t.checkout.edit}>
                    <p className="font-medium">
                      <span className="capitalize">{cardBrand(values.cardNumber ?? "")}</span> · {f(t.checkout.cardEnding, { last4 })}
                    </p>
                    <p className="text-muted">{getValues("cardName")}</p>
                  </ReviewBlock>
                  <ul className="flex flex-col divide-y divide-border rounded-xl border border-border px-5">
                    {lines.map((l) => (
                      <li key={l.key} className="flex items-center gap-4 py-4">
                        <span className="plate relative size-14 shrink-0 overflow-hidden rounded-md">
                          <Image src={l.image} alt="" fill sizes="56px" className="object-contain p-1.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{l.name}</span>
                          <span className="block text-xs text-muted">
                            {[l.colorName, l.size, `× ${l.qty}`].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="tabular text-sm font-semibold">{price(l.price * l.qty, true)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => go((step - 1) as Step)} disabled={placing}>
                <ArrowLeft className="flip-rtl" />
                {t.checkout.back}
              </Button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button key="next" size="lg" onClick={next}>
                {t.checkout.continue}
              </Button>
            ) : (
              <Button key="submit" size="lg" type="submit" disabled={placing} className="min-w-52">
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-on-lime/30 border-t-on-lime" aria-hidden />
                    {t.checkout.placing}
                  </span>
                ) : (
                  <>
                    <Lock />
                    {t.checkout.placeOrder} · {price(totals.total, true)}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        <aside
          aria-label={t.checkout.orderSummary}
          className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
        >
          <h2 className="text-h3">{t.checkout.orderSummary}</h2>
          <ul className="flex flex-col gap-4">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="plate relative size-14 shrink-0 overflow-hidden rounded-md">
                  <Image src={l.image} alt="" fill sizes="56px" className="object-contain p-1.5" />
                  <span className="tabular absolute end-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-white text-[0.625rem] font-bold text-plate">
                    {l.qty}
                  </span>
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">{l.name}</span>
                <span className="tabular text-sm font-medium">{price(l.price * l.qty, true)}</span>
              </li>
            ))}
          </ul>
          <PromoField />
          <Totals shippingOverride={shippingOverride ?? baseTotals.shipping} />
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-5 font-wide text-xl font-extrabold tracking-[-0.02em]">{title}</legend>
      {children}
    </fieldset>
  );
}

const inputClass = (invalid: boolean) =>
  cn(
    "h-12 w-full rounded-md border bg-surface px-4 text-base outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-fg/50 focus:shadow-[0_0_0_4px_var(--glow-violet)] focus-visible:outline-none",
    invalid ? "border-danger" : "border-border",
  );

interface FieldProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: (props: FieldProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({ id, "aria-invalid": !!error, "aria-describedby": error ? errorId : undefined })}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ end, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { end?: ReactNode; "aria-invalid"?: boolean }) {
  return (
    <div className="relative">
      <input {...props} className={cn(inputClass(!!props["aria-invalid"]), end ? "pe-20" : "", className)} />
      {end && <span className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">{end}</span>}
    </div>
  );
}

function ReviewBlock({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-sm font-semibold text-muted [font-stretch:100%]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-violet-text hover:bg-surface-2"
        >
          <Pencil className="size-3.5" aria-hidden />
          {editLabel}
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-0.5">{children}</div>
    </section>
  );
}
