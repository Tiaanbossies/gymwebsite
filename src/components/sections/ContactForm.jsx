import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Send, MessageCircle, Mail } from 'lucide-react';

import { site, waLink } from '../../lib/site.js';

/**
 * ContactForm — no backend in this build. After validation passes we show a
 * success state that hands the user both a mailto: link and a pre-filled
 * WhatsApp link containing exactly what they typed, so the message never
 * gets lost while the client wires up a form handler.
 *
 * `intent` and `plan` query-params prefill the message area — used by the
 * Join Online / Free Trial / Gym Tour / plan=day-pass CTAs.
 */
export default function ContactForm() {
  const [params] = useSearchParams();
  const intent = params.get('intent'); // join | trial | tour | enquire
  const plan = params.get('plan');     // day-pass | open-gym | m2m | contract

  const prefillMessage = useMemo(() => {
    if (intent === 'trial')
      return "Hi Bossie's Gym, I'd like to book a free trial session. When would be a good time to come in?";
    if (intent === 'join')
      return "Hi Bossie's Gym, I'd like to join. Please send me the latest pricing and next steps.";
    if (intent === 'tour')
      return "Hi Bossie's Gym, I'd like to book a quick tour of the gym.";
    if (plan === 'day-pass')
      return "Hi Bossie's Gym, I'd like a day pass. When can I drop in?";
    if (plan === 'open-gym')
      return "Hi Bossie's Gym, I'm interested in open-gym membership. Can you send me the month-to-month / 6-month / 12-month rates?";
    if (plan === 'pt-3x')
      return "Hi Bossie's Gym, I'm interested in personal training at 3 sessions per week (R2,100/month). Can you send me the next steps?";
    if (plan === 'pt-5x')
      return "Hi Bossie's Gym, I'm interested in personal training at 5 sessions per week (R2,700/month). Can you send me the next steps?";
    return '';
  }, [intent, plan]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: prefillMessage,
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sendState, setSendState] = useState({ status: 'idle', message: '' });

  // Keep the message field in sync when the user navigates between intents
  // within the same SPA session (useState initialiser only runs on first mount).
  useEffect(() => {
    setForm((f) => ({ ...f, message: prefillMessage }));
  }, [prefillMessage]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (!form.phone.trim()) next.phone = 'Please enter a phone number.';
    if (!form.message.trim()) next.message = 'Please include a short message.';
    if (!form.consent) next.consent = 'Please confirm consent to continue.';
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSendState({ status: 'sending', message: 'Sending your message...' });
    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'The message could not be sent.');
      }
      setSubmitted(true);
    } catch (error) {
      setSendState({
        status: 'error',
        message: error.message || 'Your message could not be sent. Please try WhatsApp or email directly.',
      });
    }
  };

  if (submitted) {
    const wa = waLink(`Hi Bossie's Gym, I just sent an enquiry via the website contact form. My name is ${form.name}.`);
    const mailto = `mailto:${site.enquiryEmail}?subject=${encodeURIComponent(
      `Website enquiry — ${form.name}`,
    )}&body=${encodeURIComponent(`Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`)}`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-brand-500/40 bg-gradient-to-b from-brand-500/10 to-ink-900 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/40">
          <CheckCircle2 size={26} />
        </div>
        <h3 className="font-display text-2xl tracking-headline text-white">
          Message sent — we'll be in touch.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-300 leading-relaxed">
          Your enquiry has been sent to the gym. We'll come back to you personally — usually same day.
          You can also reach us faster on WhatsApp if you prefer.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={wa} target="_blank" rel="noreferrer" className="btn-whatsapp" data-track="WhatsApp — Contact Success">
            <span>Follow up on WhatsApp</span>
            <MessageCircle size={16} strokeWidth={2.5} />
          </a>
          <a href={mailto} className="btn-ghost">
            <span>Send a copy via email</span>
            <Mail size={14} strokeWidth={2.5} />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Your name" error={errors.name}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Full name"
          className="input"
          autoComplete="name"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" error={errors.phone}>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="e.g. 082 000 0000"
            className="input"
            autoComplete="tel"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="input"
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Message" error={errors.message}>
        <textarea
          name="message"
          rows={5}
          value={form.message}
          onChange={onChange}
          placeholder="Tell us about your goals and what you're looking for."
          className="input resize-none"
        />
      </Field>

      <label
        className={`flex items-start gap-3 rounded-xl border p-4 text-sm text-ink-300 transition-colors ${
          errors.consent ? 'border-red-400/60 bg-red-500/5' : 'border-white/10 bg-white/[0.03]'
        }`}
      >
        <input
          type="checkbox"
          name="consent"
          checked={form.consent}
          onChange={onChange}
          className="mt-1 h-4 w-4 accent-brand-500"
        />
        <span>
          I agree that Bossie's Gym may contact me about my enquiry. I understand my details will
          be handled responsibly and not shared with third parties.
        </span>
      </label>
      {errors.consent && <p className="-mt-3 text-xs text-red-400">{errors.consent}</p>}

      {sendState.status === 'error' && (
        <p className="text-sm text-red-400">{sendState.message}</p>
      )}

      <button
        type="submit"
        disabled={sendState.status === 'sending'}
        className="btn-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start"
      >
        <span>{sendState.status === 'sending' ? 'Sending...' : 'Send Enquiry'}</span>
        <Send size={15} strokeWidth={2.5} />
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
