import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Book, Camera, CheckCircle, FileText, IndianRupee, Loader2, MapPin, PackageCheck, RotateCcw, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES, DELIVERY_METHODS, INDIAN_STATES, LANGUAGES } from '../../constants';
import sellerService from '../../services/sellerService';

const bookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  author: z.string().min(2, 'Author name is required'),
  isbn: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  genre: z.string().min(2, 'Genre is required'),
  publisher: z.string().min(2, 'Publisher is required'),
  edition: z.string().min(2, 'Edition is required'),
  publicationYear: z.coerce.number().min(1950, 'Enter a valid year').max(2030, 'Enter a valid year'),
  language: z.string().min(1, 'Select language'),
  condition: z.enum(['like-new', 'good', 'fair', 'acceptable']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  defects: z.string().optional(),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  originalPrice: z.coerce.number().positive('Original price is required'),
  sellingPrice: z.coerce.number().positive('Selling price is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  deliveryMethod: z.string().min(1, 'Select a delivery method'),
}).refine((data) => data.sellingPrice <= data.originalPrice, {
  message: 'Selling price cannot exceed original price',
  path: ['sellingPrice'],
});

const steps = [
  { title: 'Basic Information', icon: Book, fields: ['title', 'author', 'isbn', 'category', 'genre', 'publisher', 'edition', 'publicationYear', 'language'] },
  { title: 'Condition', icon: FileText, fields: ['condition', 'description', 'defects', 'quantity'] },
  { title: 'Pricing', icon: IndianRupee, fields: ['originalPrice', 'sellingPrice'] },
  { title: 'Images', icon: Camera, fields: [] },
  { title: 'Delivery', icon: MapPin, fields: ['city', 'state', 'postalCode', 'deliveryMethod'] },
  { title: 'Review', icon: PackageCheck, fields: [] },
];

const inputClass = (error) => `input-field ${error ? 'border-error focus:border-error' : ''}`;

const AddBook = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, watch, trigger, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: 'Concepts of Physics (HC Verma) Vol 1',
      author: 'H.C. Verma',
      isbn: '978-8177091878',
      category: 'academic',
      genre: 'Physics',
      publisher: 'Bharati Bhawan',
      edition: '2024 Edition',
      publicationYear: 2024,
      language: 'English',
      condition: 'good',
      description: 'Comprehensive physics textbook for Class 11 and JEE preparation. Minimal pencil marks inside, all pages intact.',
      defects: 'Minor shelf wear on edges, clean pages inside.',
      quantity: 1,
      originalPrice: 450,
      sellingPrice: 250,
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      deliveryMethod: 'standard',
    },
  });

  const handleAutoFill = () => {
    reset({
      title: 'Concepts of Physics (HC Verma) Vol 1',
      author: 'H.C. Verma',
      isbn: '978-8177091878',
      category: 'academic',
      genre: 'Physics',
      publisher: 'Bharati Bhawan',
      edition: '2024 Edition',
      publicationYear: 2024,
      language: 'English',
      condition: 'good',
      description: 'Comprehensive physics textbook for Class 11 and JEE preparation. Minimal pencil marks inside, all pages intact.',
      defects: 'Minor shelf wear on edges, clean pages inside.',
      quantity: 1,
      originalPrice: 450,
      sellingPrice: 250,
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      deliveryMethod: 'standard',
    });

    if (images.length === 0) {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 150, 200);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('HC Verma Vol 1', 20, 100);
      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], 'sample.jpg', { type: 'image/jpeg' });
          setImages([{ id: `sample-${Date.now()}`, src: canvas.toDataURL('image/jpeg', 0.5), name: 'sample.jpg', file: sampleFile }]);
        }
      }, 'image/jpeg', 0.5);
    }

    toast.success('Sample test data pre-filled!');
  };

  const values = watch();
  const discount = values.originalPrice && values.sellingPrice && values.originalPrice > values.sellingPrice
    ? Math.round(((values.originalPrice - values.sellingPrice) / values.originalPrice) * 100)
    : 0;

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 5 - images.length);
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImages((current) => [...current, { id: `${file.name}-${Date.now()}`, src: reader.result, name: file.name, file }]);
      reader.readAsDataURL(file);
    });
  };

  const nextStep = async () => {
    if (step === 3 && images.length === 0) {
      toast.error('Upload at least one book image');
      return;
    }
    const valid = await trigger(steps[step].fields);
    if (valid) setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const onSubmit = async () => {
    if (images.length === 0) {
      setStep(3);
      toast.error('Upload at least one book image');
      return;
    }

    try {
      const data = watch();
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('author', data.author);
      if (data.isbn) formData.append('isbn', data.isbn);
      formData.append('category', data.category);
      formData.append('genre', data.genre);
      formData.append('publisher', data.publisher);
      formData.append('edition', data.edition);
      formData.append('publicationYear', data.publicationYear);
      formData.append('language', data.language);

      const conditionMap = {
        'like-new': 'Like New',
        'good': 'Good',
        'fair': 'Acceptable',
        'acceptable': 'Acceptable',
      };
      formData.append('condition', conditionMap[data.condition] || 'Good');
      formData.append('description', data.description);
      if (data.defects) formData.append('defects', data.defects);
      formData.append('quantity', data.quantity);
      formData.append('originalPrice', data.originalPrice);
      formData.append('sellingPrice', data.sellingPrice);
      formData.append('sellerLocation', `${data.city}, ${data.state}`);
      formData.append('deliveryMethods', data.deliveryMethod);

      images.forEach((img) => {
        if (img.file) {
          formData.append('images', img.file);
        }
      });

      await sellerService.createListing(formData);
      setSubmitted(true);
      toast.success('Book submitted for Admin Approval!');
    } catch (err) {
      console.error('Failed to submit listing:', err);
      toast.error(err?.message || 'Failed to submit book listing');
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle size={52} />
        </motion.div>
        <h1 className="mb-3 text-4xl font-serif font-bold text-forest">Submitted for Admin Approval</h1>
        <p className="mb-8 text-mutedText">Your listing is now pending review. You can track its status from My Listings.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate('/seller/listings')} className="btn-primary">View My Listings</button>
          <button onClick={() => { setSubmitted(false); setStep(0); setImages([]); }} className="btn-secondary">
            <RotateCcw size={18} /> Add Another Book
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl pb-24 md:pb-12">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="section-heading">Add New Book</h1>
          <p className="text-mutedText">A guided six-step listing flow for marketplace-ready book submissions.</p>
        </div>
        <button
          type="button"
          onClick={handleAutoFill}
          className="px-4 py-2.5 bg-amber/20 hover:bg-amber text-amber-dark hover:text-forest font-semibold text-xs md:text-sm rounded-xl border border-amber/30 transition-all flex items-center gap-2 shadow-sm"
        >
          ⚡ Auto-Fill Sample Book for Testing
        </button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const active = index <= step;
          return (
            <button key={item.title} type="button" onClick={() => index < step && setStep(index)} className={`rounded-xl border px-2 py-3 transition ${active ? 'border-amber bg-amber/10 text-amber-dark' : 'border-forest/10 bg-white text-mutedText'}`}>
              <Icon className="mx-auto mb-1" size={18} />
              <span className="block truncate text-xs font-bold">{index + 1}. {item.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.section key="basic" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><Book className="text-emerald" /> Basic Information</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="input-label">Title</label>
                  <input {...register('title')} className={inputClass(errors.title)} placeholder="NCERT Mathematics Class 12 Part I" />
                  {errors.title && <p className="input-error">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="input-label">Author</label>
                  <input {...register('author')} className={inputClass(errors.author)} placeholder="NCERT" />
                  {errors.author && <p className="input-error">{errors.author.message}</p>}
                </div>
                <div>
                  <label className="input-label">ISBN</label>
                  <input {...register('isbn')} className="input-field" placeholder="978-93-5000-000-0" />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <select {...register('category')} className={inputClass(errors.category)}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                  {errors.category && <p className="input-error">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="input-label">Genre</label>
                  <input {...register('genre')} className={inputClass(errors.genre)} placeholder="Mathematics" />
                  {errors.genre && <p className="input-error">{errors.genre.message}</p>}
                </div>
                <div>
                  <label className="input-label">Publisher</label>
                  <input {...register('publisher')} className={inputClass(errors.publisher)} placeholder="NCERT" />
                  {errors.publisher && <p className="input-error">{errors.publisher.message}</p>}
                </div>
                <div>
                  <label className="input-label">Edition</label>
                  <input {...register('edition')} className={inputClass(errors.edition)} placeholder="2024-25" />
                  {errors.edition && <p className="input-error">{errors.edition.message}</p>}
                </div>
                <div>
                  <label className="input-label">Publication Year</label>
                  <input type="number" {...register('publicationYear')} className={inputClass(errors.publicationYear)} />
                  {errors.publicationYear && <p className="input-error">{errors.publicationYear.message}</p>}
                </div>
                <div>
                  <label className="input-label">Language</label>
                  <select {...register('language')} className={inputClass(errors.language)}>
                    {LANGUAGES.map((language) => <option key={language} value={language}>{language}</option>)}
                  </select>
                </div>
              </div>
            </motion.section>
          )}

          {step === 1 && (
            <motion.section key="condition" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><FileText className="text-emerald" /> Condition and Description</h2>
              <div className="grid gap-5">
                <div className="grid gap-3 sm:grid-cols-4">
                  {['like-new', 'good', 'fair', 'acceptable'].map((condition) => (
                    <label key={condition} className={`cursor-pointer rounded-2xl border p-4 text-center transition ${values.condition === condition ? 'border-amber bg-amber/10' : 'border-forest/10 hover:border-amber/40'}`}>
                      <input type="radio" value={condition} {...register('condition')} className="sr-only" />
                      <span className="font-bold capitalize text-darkText">{condition.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="input-label">Description</label>
                  <textarea rows="5" {...register('description')} className={inputClass(errors.description)} placeholder="Mention pages, notes, usage, and why this is a good buy." />
                  {errors.description && <p className="input-error">{errors.description.message}</p>}
                </div>
                <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                  <div>
                    <label className="input-label">Defects or marks</label>
                    <input {...register('defects')} className="input-field" placeholder="Small crease on cover, light pencil marks" />
                  </div>
                  <div>
                    <label className="input-label">Quantity</label>
                    <input type="number" {...register('quantity')} className={inputClass(errors.quantity)} />
                    {errors.quantity && <p className="input-error">{errors.quantity.message}</p>}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section key="pricing" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><IndianRupee className="text-emerald" /> Pricing</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="input-label">Original price</label>
                  <input type="number" {...register('originalPrice')} className={inputClass(errors.originalPrice)} placeholder="450" />
                  {errors.originalPrice && <p className="input-error">{errors.originalPrice.message}</p>}
                </div>
                <div>
                  <label className="input-label">Selling price</label>
                  <input type="number" {...register('sellingPrice')} className={inputClass(errors.sellingPrice)} placeholder="220" />
                  {errors.sellingPrice && <p className="input-error">{errors.sellingPrice.message}</p>}
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-emerald/10 p-5 text-emerald">
                <p className="text-sm font-semibold">Automatic discount calculation</p>
                <p className="mt-1 text-3xl font-serif font-bold">{discount}% OFF</p>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section key="images" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><Camera className="text-emerald" /> Images</h2>
              <label className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest/20 bg-warmWhite p-6 text-center transition hover:border-amber hover:bg-amber/5">
                <Upload className="mb-3 text-amber-dark" size={32} />
                <span className="font-bold text-darkText">Drag and drop or upload images</span>
                <span className="text-sm text-mutedText">Upload up to 5 images. First image becomes cover.</span>
                <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageChange} />
              </label>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {images.map((image, index) => (
                  <div key={image.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-forest/10 bg-white">
                    <img src={image.src} alt={image.name} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))} className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-error opacity-0 shadow transition group-hover:opacity-100" aria-label="Remove image">
                      <X size={16} />
                    </button>
                    {index === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-forest px-2 py-1 text-xs font-bold text-white">Cover</span>}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {step === 4 && (
            <motion.section key="delivery" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><MapPin className="text-emerald" /> Delivery and Location</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="input-label">City</label>
                  <input {...register('city')} className={inputClass(errors.city)} placeholder="New Delhi" />
                  {errors.city && <p className="input-error">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="input-label">State</label>
                  <select {...register('state')} className={inputClass(errors.state)}>
                    {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Postal code</label>
                  <input {...register('postalCode')} className={inputClass(errors.postalCode)} placeholder="110001" />
                  {errors.postalCode && <p className="input-error">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="input-label">Delivery method</label>
                  <select {...register('deliveryMethod')} className={inputClass(errors.deliveryMethod)}>
                    {DELIVERY_METHODS.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
                  </select>
                </div>
              </div>
            </motion.section>
          )}

          {step === 5 && (
            <motion.section key="review" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-serif font-bold"><PackageCheck className="text-emerald" /> Review and Submit</h2>
              <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-warmWhite">
                  {images[0] ? <img src={images[0].src} alt="Cover preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-mutedText">No image</div>}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif font-bold text-forest">{values.title || 'Untitled book'}</h3>
                  <p className="text-mutedText">{values.author || 'Author'} - {values.publisher || 'Publisher'} - {values.language}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-warmWhite p-4"><span className="text-xs text-mutedText">Condition</span><p className="font-bold capitalize">{values.condition?.replace('-', ' ')}</p></div>
                    <div className="rounded-xl bg-warmWhite p-4"><span className="text-xs text-mutedText">Discount</span><p className="font-bold text-emerald">{discount}% OFF</p></div>
                    <div className="rounded-xl bg-warmWhite p-4"><span className="text-xs text-mutedText">Price</span><p className="font-bold">₹{values.sellingPrice || 0}</p></div>
                    <div className="rounded-xl bg-warmWhite p-4"><span className="text-xs text-mutedText">Location</span><p className="font-bold">{values.city || 'City'}, {values.state}</p></div>
                  </div>
                  <p className="text-sm text-mutedText">{values.description}</p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0} className="btn-secondary disabled:opacity-40">Back</button>
          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-amber">Continue</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Submit for Admin Approval'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddBook;
