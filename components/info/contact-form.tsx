"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Send } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { contact } from "@/data/content";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1, "errorRequired"),
  email: z.string().trim().min(1, "errorRequired").email("errorEmail"),
  topic: z.string().min(1),
  order: z.string().optional(),
  message: z.string().trim().min(10, "errorMessage"),
});
type Values = z.infer<typeof schema>;

const inputClass = (invalid: boolean) =>
  cn(
    "w-full rounded-md border bg-surface px-4 text-base outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:border-fg/50 focus:shadow-[0_0_0_4px_var(--glow-violet)] focus-visible:outline-none",
    invalid ? "border-danger" : "border-border",
  );

export function ContactForm() {
  const { t, l } = useI18n();
  const id = useId();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", topic: contact.topics[0]!.en, order: "", message: "" },
  });
  const { errors, isSubmitting } = formState;
  const err = (key?: string) => (key ? t.info[key as "errorRequired" | "errorEmail" | "errorMessage"] : undefined);

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 900)); // pretend network
    setSent(true);
    toast.success(t.info.sent);
    reset();
    setTimeout(() => setSent(false), 3000);
  });

  const field = (name: keyof Values, label: string, input: React.ReactNode, error?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-${name}`} className="text-sm font-medium">
        {label}
      </label>
      {input}
      {error && (
        <p id={`${id}-${name}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
  const a11y = (name: keyof Values, error?: string) => ({
    id: `${id}-${name}`,
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5 rounded-xl border border-border bg-surface/50 p-6 sm:p-8">
      <h2 className="text-h3">{t.info.formTitle}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", t.info.name, <input {...a11y("name", err(errors.name?.message))} autoComplete="name" {...register("name")} className={cn(inputClass(!!errors.name), "h-12")} />, err(errors.name?.message))}
        {field("email", t.info.email, <input {...a11y("email", err(errors.email?.message))} type="email" autoComplete="email" {...register("email")} className={cn(inputClass(!!errors.email), "h-12")} />, err(errors.email?.message))}
        {field(
          "topic",
          t.info.topic,
          <select {...a11y("topic")} {...register("topic")} className={cn(inputClass(false), "h-12")}>
            {contact.topics.map((topic) => (
              <option key={topic.en} value={topic.en}>
                {l(topic)}
              </option>
            ))}
          </select>,
        )}
        {field("order", t.info.orderNumber, <input {...a11y("order")} placeholder="VLT-XXXXXX" {...register("order")} className={cn(inputClass(false), "h-12")} />)}
      </div>
      {field(
        "message",
        t.info.message,
        <textarea {...a11y("message", err(errors.message?.message))} rows={5} {...register("message")} className={cn(inputClass(!!errors.message), "resize-y py-3")} />,
        err(errors.message?.message),
      )}
      <Button type="submit" size="lg" disabled={isSubmitting} className="self-start">
        {sent ? <Check /> : <Send className="flip-rtl" />}
        {isSubmitting ? t.info.sending : t.info.send}
      </Button>
    </form>
  );
}
