import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useInView } from 'framer-motion';
import axios from 'axios';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const schema = z.object({
  name:    z.string().min(2,  'Please enter your name'),
  email:   z.string().email('Please enter a valid work email'),
  phone:   z.string().min(7,  'Please enter a valid phone number'),
  company: z.string().min(2,  'Please enter your company name'),
  product: z.string().min(1,  'Please select a product'),
  message: z.string().min(20, 'Please add more detail about your inquiry (min 20 characters)'),
});

type FormValues = z.infer<typeof schema>;

const PRODUCTS = [
  'Ready Pot',
  'Starter Kit',
  'Medium Kit',
  'Premium Kit',
  'Coco Grow Disk',
  'Premium Cocopeat',
  'Multiple Products / Unsure',
];

const BULLETS = [
  { icon: '✓', text: 'Custom EC & pH buffering upon request' },
  { icon: '✓', text: 'FCL Container shipping (20ft / 40ft High Cube)' },
  { icon: '✓', text: '24-Hour quotation turnaround time' },
];

export default function ContactForm() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      await axios.post(
        'https://formsubmit.co/ajax/admin@brickbloom.co.in',
        {
          ...data,
          _subject: `BrickBloom Sourcing Inquiry for ${data.product} from ${data.company}`,
        },
        { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
      );
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg('There was a problem submitting your inquiry. Please email us directly at admin@brickbloom.co.in');
    }
  };

  const FormField = ({
    id, label, error, children,
  }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-slate-700 font-semibold">{label}</Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <section id="contact" className="section-pad bg-brand-50">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left — Info panel */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow">Direct Sourcing Desk</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight text-balance">
              Start your BrickBloom inquiry.
            </h2>
            <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-md">
              Tell us about your crop program, desired product format, and destination port.
              Our team will prepare custom pricing and shipping options.
            </p>

            {/* Bullets */}
            <ul className="mt-8 space-y-4">
              {BULLETS.map((b) => (
                <li key={b.text} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {b.icon}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{b.text}</span>
                </li>
              ))}
            </ul>

            {/* Contact email */}
            <div className="mt-10 p-5 rounded-2xl bg-white border border-border shadow-card">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Direct contact</p>
              <a
                href="mailto:admin@brickbloom.co.in"
                className="text-sm font-medium text-brand-700 hover:text-brand-900 transition-colors"
              >
                admin@brickbloom.co.in
              </a>
              <p className="text-xs text-slate-400 mt-1">India & Sri Lanka · FCL Export</p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl border border-border shadow-lg p-6 sm:p-8"
          >
            {status === 'success' ? (
              <div className="flex flex-col items-center text-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="font-display text-2xl text-slate-900">Inquiry Received!</h3>
                <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                  Our sourcing desk will get back to you within 24 hours with custom pricing.
                </p>
                <Button variant="outline" onClick={() => setStatus('idle')} className="mt-2">
                  Submit Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField id="name" label="Your Name" error={errors.name?.message}>
                    <Input
                      id="name"
                      placeholder="e.g. Alexander Wright"
                      {...register('name')}
                      className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                  </FormField>
                  <FormField id="email" label="Work Email" error={errors.email?.message}>
                    <Input
                      id="email"
                      type="email"
                      placeholder="alexander@greenhouse.com"
                      {...register('email')}
                      className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField id="phone" label="Phone Number" error={errors.phone?.message}>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      {...register('phone')}
                      className={errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                  </FormField>
                  <FormField id="company" label="Company / Farm" error={errors.company?.message}>
                    <Input
                      id="company"
                      placeholder="Apex Hydroponics Ltd"
                      {...register('company')}
                      className={errors.company ? 'border-red-400 focus-visible:ring-red-400' : ''}
                    />
                  </FormField>
                </div>

                <FormField id="product" label="Product of Interest" error={errors.product?.message}>
                  <Select
                    onValueChange={(val) => setValue('product', val, { shouldValidate: true })}
                    value={watch('product') ?? ''}
                  >
                    <SelectTrigger
                      id="product"
                      className={errors.product ? 'border-red-400 focus:ring-red-400' : ''}
                    >
                      <SelectValue placeholder="Select a product..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField id="message" label="Inquiry Details" error={errors.message?.message}>
                  <Textarea
                    id="message"
                    placeholder="Specify volume, target format (e.g., 5kg blocks, GrowSlabs), and destination port..."
                    {...register('message')}
                    className={`min-h-[130px] ${errors.message ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                  />
                </FormField>

                {status === 'error' && (
                  <p className="text-sm text-red-500 flex items-start gap-2 bg-red-50 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Sourcing Inquiry
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We respond within 24 hours &middot; No spam, ever.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
