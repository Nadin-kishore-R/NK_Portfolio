import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
import { useAuthStore } from '../store';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    // Small async delay to simulate network (makes it feel real)
    await new Promise((r) => setTimeout(r, 600));
    const ok = signIn(email, password);
    setLoading(false);

    if (ok) {
      setEmail('');
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Invalid credentials. Please try again.'); // generic — never reveal which field is wrong
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin Sign In" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-sm text-ocean-700">
          Enter admin credentials to enable Edit Mode.
        </p>

        <FormField
          id="signin-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="admin@nkportfolio.com"
          required
        />

        <FormField
          id="signin-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-medium"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" variant="primary" loading={loading} className="w-full mt-1">
          Sign In
        </Button>
      </form>
    </Modal>
  );
}
