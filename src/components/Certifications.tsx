import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { MdAdd, MdDelete, MdEdit, MdImage, MdDescription, MdDownload } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { Lightbox } from './ui/Lightbox';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
import type { Certification } from '../types/content';

const emptyCert = (): Certification => ({
  id: `cert-${Date.now()}`,
  title: '',
  description: '',
  imageUrl: null,
  documentUrl: null,
  documentName: null,
});

export function Certifications() {
  const { ref, inView } = useScrollReveal();
  const certs = useContentStore((s) => s.content.certifications);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const saveCert = (cert: Certification) => {
    const exists = certs.find((c) => c.id === cert.id);
    const updated = exists
      ? certs.map((c) => (c.id === cert.id ? cert : c))
      : [...certs, cert];
    updateContent({ certifications: updated });
    setModalOpen(false);
    setEditing(null);
  };

  const deleteCert = (id: string) =>
    updateContent({ certifications: certs.filter((c) => c.id !== id) });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = URL.createObjectURL(file);
    setEditing({ ...editing, imageUrl: url });
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = URL.createObjectURL(file);
    setEditing({ ...editing, documentUrl: url, documentName: file.name });
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">Achievements & Certifications</h2>
            {isEditMode && (
              <Button variant="secondary" size="sm" icon={<MdAdd />}
                onClick={() => { setEditing(emptyCert()); setModalOpen(true); }}>
                Add Certification
              </Button>
            )}
          </div>

          {certs.length === 0 ? (
            <p className="text-center text-ocean-500 py-10">
              {isEditMode ? 'No certifications yet. Click "Add Certification" to begin.' : 'Certifications coming soon.'}
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {certs.map((cert) => (
                <motion.div key={cert.id} variants={cardVariants}>
                  <Card
                    onClick={!isEditMode && cert.imageUrl ? () => setLightboxImg(cert.imageUrl!) : undefined}
                    className="relative group flex flex-col gap-3"
                  >
                    {/* Image */}
                    {cert.imageUrl ? (
                      <div className="relative overflow-hidden rounded-lg aspect-video">
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {!isEditMode && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                            <MdImage size={32} className="text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(20,184,166,0.1))' }}>
                        <MdImage size={32} className="text-ocean-300" />
                      </div>
                    )}

                    <div className="flex-1">
                      <h4 className="font-display font-semibold text-ocean-900 text-base leading-tight">
                        {cert.title || 'Certification Title'}
                      </h4>
                      <p className="text-sm text-ocean-700 mt-1 leading-relaxed">{cert.description}</p>
                    </div>

                    {/* Document link */}
                    {cert.documentUrl && (
                      <a
                        href={cert.documentUrl}
                        download={cert.documentName ?? true}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-xs text-ocean-600 hover:text-ocean-800 transition-colors font-medium"
                      >
                        <MdDownload size={14} />
                        {cert.documentName ?? 'Download Document'}
                      </a>
                    )}

                    {/* Edit controls */}
                    {isEditMode && (
                      <div className="flex gap-1 absolute top-2 right-2">
                        <button onClick={() => { setEditing(cert); setModalOpen(true); }}
                          className="p-1.5 rounded-lg glass text-ocean-700 hover:bg-white/40 transition-colors">
                          <MdEdit size={14} />
                        </button>
                        <button onClick={() => deleteCert(cert.id)}
                          className="p-1.5 rounded-lg glass text-red-500 hover:bg-red-50/40 transition-colors">
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

      {/* Lightbox */}
      <Lightbox
        isOpen={!!lightboxImg}
        onClose={() => setLightboxImg(null)}
        imageUrl={lightboxImg ?? ''}
        alt="Certification"
      />

      {/* Edit modal */}
      {editing && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title="Certification" size="md">
          <div className="flex flex-col gap-3">
            <FormField id="cert-title" label="Title" value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })} required />
            <FormField id="cert-desc" label="Description" type="textarea" value={editing.description}
              onChange={(v) => setEditing({ ...editing, description: v })} rows={3} />

            {/* Image upload */}
            <div>
              <label className="text-sm font-medium text-ocean-800 block mb-1.5">Certificate Image</label>
              <div className="flex items-center gap-3">
                {editing.imageUrl && (
                  <img src={editing.imageUrl} alt="" className="w-16 h-10 object-cover rounded-lg" />
                )}
                <Button variant="secondary" size="sm" icon={<MdImage />}
                  onClick={() => imageInputRef.current?.click()}>
                  {editing.imageUrl ? 'Change Image' : 'Upload Image'}
                </Button>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                  onChange={handleImageUpload} />
              </div>
            </div>

            {/* Document upload */}
            <div>
              <label className="text-sm font-medium text-ocean-800 block mb-1.5">Document (optional)</label>
              <div className="flex items-center gap-3">
                {editing.documentName && (
                  <span className="text-xs text-ocean-600 truncate max-w-[120px]">{editing.documentName}</span>
                )}
                <Button variant="secondary" size="sm" icon={<MdDescription />}
                  onClick={() => docInputRef.current?.click()}>
                  {editing.documentUrl ? 'Change Doc' : 'Upload Doc'}
                </Button>
                <input ref={docInputRef} type="file" className="hidden" onChange={handleDocUpload} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={() => saveCert(editing)}>Save</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
