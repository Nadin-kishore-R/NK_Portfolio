import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import type { Interest } from '../types/content';

const INTEREST_ICONS = ['🌊', '🎨', '💻', '📸', '🎵', '📚', '🏄', '🌿', '✈️', '🔬'];

const emptyInterest = (): Interest => ({
  id: `int-${Date.now()}`,
  title: '',
  description: '',
});

export function Interests() {
  const { ref, inView } = useScrollReveal();
  const interests = useContentStore((s) => s.content.interests);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Interest | null>(null);

  const saveInterest = (item: Interest) => {
    const exists = interests.find((i) => i.id === item.id);
    const updated = exists
      ? interests.map((i) => (i.id === item.id ? item : i))
      : [...interests, item];
    updateContent({ interests: updated });
    setModalOpen(false);
    setEditing(null);
  };

  const deleteInterest = (id: string) =>
    updateContent({ interests: interests.filter((i) => i.id !== id) });

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="interests" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">Area of Interest</h2>
            {isEditMode && (
              <Button variant="secondary" size="sm" icon={<MdAdd />}
                onClick={() => { setEditing(emptyInterest()); setModalOpen(true); }}>
                Add Interest
              </Button>
            )}
          </div>

          {interests.length === 0 ? (
            <p className="text-center text-ocean-500 py-10">
              {isEditMode ? 'No interests added yet. Click "Add Interest" to begin.' : 'Interests coming soon.'}
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {interests.map((item, i) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="relative group text-center">
                    <div className="text-3xl mb-2">{INTEREST_ICONS[i % INTEREST_ICONS.length]}</div>
                    <h4 className="font-display font-semibold text-ocean-900 text-base">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-ocean-600 mt-1 leading-relaxed">{item.description}</p>
                    )}
                    {isEditMode && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditing(item); setModalOpen(true); }}
                          className="p-1 rounded-lg text-ocean-600 hover:bg-white/30"
                        >
                          <MdEdit size={14} />
                        </button>
                        <button
                          onClick={() => deleteInterest(item.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50/30"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {editing && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title="Area of Interest" size="sm">
          <div className="flex flex-col gap-3">
            <FormField id="int-title" label="Title" value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })} required />
            <FormField id="int-desc" label="Description (optional)" type="textarea"
              value={editing.description ?? ''} onChange={(v) => setEditing({ ...editing, description: v })} rows={2} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={() => saveInterest(editing)}>Save</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
