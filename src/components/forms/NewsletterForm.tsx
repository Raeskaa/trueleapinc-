import { useState } from 'react';
import { Button } from '../ui/Button';

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
}

export function NewsletterForm({
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  onSubmit,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setStatus('submitting');
    
    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <p className="text-center py-4 text-success font-medium">
        Thanks for subscribing!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-full border bg-white transition-colors
            ${error ? 'border-error' : 'border-border focus:border-primary'}
            focus:outline-none focus:ring-2 focus:ring-primary/20`}
        />
        {error && <p className="mt-1 text-sm text-error px-4">{error}</p>}
      </div>
      <Button 
        type="submit" 
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Subscribing...' : buttonText}
      </Button>
    </form>
  );
}
