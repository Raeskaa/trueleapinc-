import { useState } from 'react';
import { Button } from '../ui/Button';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface ContactFormProps {
  fields?: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

const defaultFields: FormField[] = [
  { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@organization.com' },
  { name: 'organization', label: 'Organization', type: 'text', placeholder: 'Your organization' },
  { 
    name: 'interest', 
    label: 'Area of Interest', 
    type: 'select',
    options: [
      { value: '', label: 'Select an option' },
      { value: 'government', label: 'Government Solutions' },
      { value: 'education', label: 'Education' },
      { value: 'ngo', label: 'NGO / Humanitarian' },
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'partnership', label: 'Partnership' },
      { value: 'other', label: 'Other' },
    ]
  },
  { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'How can we help?' },
];

export function ContactForm({ 
  fields = defaultFields, 
  submitText = 'Send Message',
  onSubmit 
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      const value = formData[field.name] || '';
      
      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field.name] = 'Please enter a valid email';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setStatus('submitting');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setStatus('success');
      setFormData({});
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (status === 'success') {
    return (
      <div className="p-8 bg-cream rounded-2xl text-center">
        <p className="font-display text-2xl mb-2">Thank you!</p>
        <p className="text-charcoal/70">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label 
            htmlFor={field.name}
            className="block font-mono text-xs uppercase tracking-wider mb-2"
          >
            {field.label}
            {field.required && <span className="text-indigo ml-1">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border bg-white transition-colors
                ${errors[field.name] ? 'border-red-500' : 'border-border focus:border-indigo'}
                focus:outline-none focus:ring-2 focus:ring-indigo/20`}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border bg-white transition-colors
                ${errors[field.name] ? 'border-red-500' : 'border-border focus:border-indigo'}
                focus:outline-none focus:ring-2 focus:ring-indigo/20`}
            >
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={`w-full px-4 py-3 rounded-lg border bg-white transition-colors
                ${errors[field.name] ? 'border-red-500' : 'border-border focus:border-indigo'}
                focus:outline-none focus:ring-2 focus:ring-indigo/20`}
            />
          )}
          
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
      
      <Button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full"
      >
        {status === 'submitting' ? 'Sending...' : submitText}
      </Button>
      
      {status === 'error' && (
        <p className="text-sm text-red-500 text-center">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
