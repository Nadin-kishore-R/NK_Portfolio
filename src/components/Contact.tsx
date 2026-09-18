import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdPhone, MdEmail, MdEdit, MdCheck } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';

const contactLinks = (contact: { phone: string; whatsapp: string; linkedin: string; github: string; email: string; }) => [
  {
    key: 'phone',
    icon: <MdPhone size={22} />,
    label: 'Phone',
    value: contact.phone,
    href: `tel:${contact.phone.replace(/\s/g, '')}`,
    color: 'from-ocean-400 to-ocean-600',
  },
  {
    key: 'whatsapp',
    icon: <FaWhatsapp size={20} />,
    label: 'WhatsApp',
    value: `+${contact.whatsapp}`,
    href: `https://wa.me/${contact.whatsapp}`,
    color: 'from-green-400 to-green-600',
  },
  {
    key: 'linkedin',
    icon: <FaLinkedin size={20} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/nadin-k',
    href: contact.linkedin,
    color: 'from-blue-500 to-blue-700',
  },
  {
    key: 'github',
    icon: <FaGithub size={20} />,
    label: 'GitHub',
    value: 'github.com/nadin-k',
    href: contact.github,
    color: 'from-gray-600 to-gray-800',
  },
  {
    key: 'email',
    icon: <MdEmail size={22} />,
    label: 'Email',
    value: contact.email,
    href: `mailto:${contact.email}`,
    color: 'from-seafoam-400 to-seafoam-600',
  },
];

export function Contact() {
  const { ref, inView } = useScrollReveal();
  const contact = useContentStore((s) => s.content.contact);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');

  const startEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingKey) {
      updateContent({ contact: { ...contact, [editingKey]: editValue } });
    }
    setEditingKey(null);
  };

  const links = contactLinks(contact);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-10 text-center">Contact</h2>

          <div className="glass-card p-8">
            <p className="text-ocean-700 text-center mb-8 text-base">
              I'd love to hear from you! Reach out through any of these channels:
            </p>

            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="space-y-4"
            >
              {links.map((link) => (
                <motion.li key={link.key} variants={itemVariants}>
                  <div className="flex items-center gap-4 group">
                    {/* Icon bubble */}
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-200`}
                    >
                      {link.icon}
                    </div>

                    {/* Label + value */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ocean-500 leading-tight">
                        {link.label}
                      </p>
                      {isEditMode && editingKey === link.key ? (
                        <div className="flex items-center gap-2 mt-0.5">
                          <input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 text-sm text-ocean-800 glass border border-ocean-300/50 rounded-lg px-2 py-1 focus:outline-none focus:border-ocean-400"
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                          <button onClick={saveEdit}
                            className="p-1 rounded-lg text-ocean-600 hover:bg-white/30 transition-colors">
                            <MdCheck size={16} />
                          </button>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          target={['linkedin', 'github'].includes(link.key) ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="text-sm text-ocean-800 hover:text-ocean-950 font-medium truncate block hover:underline transition-colors"
                        >
                          {link.value}
                        </a>
                      )}
                    </div>

                    {/* Edit button */}
                    {isEditMode && editingKey !== link.key && (
                      <button
                        onClick={() => startEdit(link.key, (contact as unknown as Record<string, string>)[link.key])}
                        className="flex-shrink-0 p-1.5 rounded-lg text-ocean-500 hover:bg-white/30 transition-colors"
                        aria-label={`Edit ${link.label}`}
                      >
                        <MdEdit size={14} />
                      </button>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
