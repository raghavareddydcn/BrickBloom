import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, Send, Sparkles, Phone, Mail, Building, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid work email address'),
  phone: z.string().min(7, 'Please enter a valid contact phone number'),
  company: z.string().min(2, 'Please enter your company or farm name'),
  product: z.string().min(1, 'Please select a product format'),
  message: z.string().min(10, 'Please include some details about your required quantity and destination port'),
});

type FormValues = z.infer<typeof schema>;

const PRODUCTS = [
  'Ready Pot',
  'Starter Kit',
  'Medium Kit',
  'Premium Kit',
  'Coco Grow Disk',
  'Premium Cocopeat',
  'Open Top Growbags',
  'Coco GrowSlabs',
  'Coir Chips',
  'Multiple Formats / Custom Blend',
];

const BULLETS = [
  'Custom electrical conductivity (EC) & calcium buffering upon request',
  'FCL Container shipping (20ft / 40ft High Cube containers)',
  '24-Hour dedicated quotation turnaround time',
  'Lab certificate of analysis (COA) provided with every container batch',
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
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: 'Premium Cocopeat',
    },
  });

  const selectedProduct = watch('product');

  const onSubmit = async (data: FormValues) => {
    setStatus('loading');
    setErrorMsg('');
    try {
      // 1. Try local server API first
      let sentLocal = false;
      try {
        const localRes = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (localRes.ok) sentLocal = true;
      } catch {
        // local server might not be running or proxy disabled
      }

      // 2. Fallback to FormSubmit if on external static hosting
      if (!sentLocal) {
        await fetch('https://formsubmit.co/ajax/admin@brickbloom.co.in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...data,
            _subject: `BrickBloom Sourcing Inquiry for ${data.product} from ${data.company}`,
          }),
        });
      }

      setStatus('success');
      reset();
    } catch {
      setStatus('error');
      setErrorMsg('There was a problem submitting your inquiry. Please reach out to us at admin@brickbloom.co.in');
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Sourcing Desk Context */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 border border-brand-200 px-3.5 py-1 text-xs font-bold text-brand-800 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-brand-700" />
              <span>Direct Sourcing Desk</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-[1.15]">
              Start your BrickBloom inquiry.
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Tell us about your crop program, desired product format, and destination port. Our sourcing team will prepare FOB/CIF pricing, pallet configurations, and shipment schedules.
            </p>

            {/* Bullets */}
            <div className="space-y-3 pt-2">
              {BULLETS.map((bullet, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-800 mt-0.5">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Direct Contacts Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-400">Direct Inquiries</p>
                  <a href="mailto:admin@brickbloom.co.in" className="text-xs sm:text-sm font-semibold text-brand-800 hover:underline">
                    admin@brickbloom.co.in
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-400">Corporate Trademark</p>
                  <p className="text-xs text-slate-700 font-medium">
                    Konaseema Coco Products LLP • India &amp; Sri Lanka
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-900/5 relative"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-slate-900">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you. Our international sourcing desk has received your requirements and will reply within 24 hours with product specifications and logistics availability.
                  </p>
                  <Button
                    onClick={() => setStatus('idle')}
                    variant="outline"
                    className="rounded-full mt-4"
                  >
                    Submit Another Inquiry
                  </Button>
                </motion.div>
              ) : (
                <form key="form-box" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Full Name *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder="e.g. Alexander Wright"
                        className="h-10 text-xs sm:text-sm rounded-xl border-slate-200"
                      />
                      {errors.name && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Work Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Work Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="alexander@greenhouse.com"
                        className="h-10 text-xs sm:text-sm rounded-xl border-slate-200"
                      />
                      {errors.email && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Phone / WhatsApp Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          {...register('phone')}
                          placeholder="+1 (555) 123-4567"
                          className="h-10 text-xs sm:text-sm rounded-xl border-slate-200 pl-9"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-semibold text-slate-700">Company / Nursery Name *</Label>
                      <Input
                        id="company"
                        {...register('company')}
                        placeholder="Apex Hydroponics Ltd"
                        className="h-10 text-xs sm:text-sm rounded-xl border-slate-200"
                      />
                      {errors.company && (
                        <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="h-3 w-3" />
                          {errors.company.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Interactive Product Selector Chips */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-700 block">
                      Target Product Format *
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCTS.map((prod) => {
                        const isSelected = selectedProduct === prod;
                        return (
                          <button
                            key={prod}
                            type="button"
                            onClick={() => setValue('product', prod, { shouldValidate: true })}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-brand-700 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {prod}
                          </button>
                        );
                      })}
                    </div>
                    {errors.product && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        {errors.product.message}
                      </p>
                    )}
                  </div>

                  {/* Inquiry Message */}
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-semibold text-slate-700">
                      Inquiry Details &amp; Volume *
                    </Label>
                    <Textarea
                      id="message"
                      rows={3}
                      {...register('message')}
                      placeholder="Specify target container volume (e.g. 1x 40ft HQ), custom EC/pH needs, or delivery port..."
                      className="rounded-xl border-slate-200 text-xs sm:text-sm leading-relaxed"
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-11 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm shadow-md shadow-brand-900/10 hover:shadow-brand-700/20 transition-all"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transmitting Sourcing Inquiry…
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Sourcing Inquiry
                      </>
                    )}
                  </Button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
