import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiAcademicCap } from 'react-icons/hi';
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
import type { EducationEntry } from '../types/content';

const emptyEntry = (): EducationEntry => ({
  id: `edu-${Date.now()}`,
  level: 'graduation',
  institutionName: '',
  location: '',
  fieldOrBoard: '',
  yearRange: '',
  description: '',
});

function EntryForm({
  entry,
  onChange,
}: {
  entry: EducationEntry;
  onChange: (e: EducationEntry) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="level"
            value="schooling"
            checked={entry.level === 'schooling'}
            onChange={() => onChange({ ...entry, level: 'schooling' })}
          />
          <span className="text-sm text-ocean-800">Schooling</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="level"
            value="graduation"
            checked={entry.level === 'graduation'}
            onChange={() => onChange({ ...entry, level: 'graduation' })}
          />
          <span className="text-sm text-ocean-800">Graduation</span>
        </label>
      </div>
      <FormField id="inst" label="Institution Name" value={entry.institutionName}
        onChange={(v) => onChange({ ...entry, institutionName: v })} required />
      <FormField id="loc" label="Location" value={entry.location}
        onChange={(v) => onChange({ ...entry, location: v })} placeholder="City, State" />
      <FormField id="field" label="Board / Field of Study" value={entry.fieldOrBoard}
        onChange={(v) => onChange({ ...entry, fieldOrBoard: v })} />
      <FormField id="year" label="Year Range" value={entry.yearRange}
        onChange={(v) => onChange({ ...entry, yearRange: v })} placeholder="2019 – 2023" />
      <FormField id="desc" label="Description (optional)" type="textarea" value={entry.description ?? ''}
        onChange={(v) => onChange({ ...entry, description: v })} rows={2} />
    </div>
  );
}

function EducationCard({
  entry,
  index,
  isEditMode,
  onEdit,
  onDelete,
}: {
  entry: EducationEntry;
  index: number;
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
    >
      <Card className="relative">
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #14b8a6)' }}
          >
            <HiAcademicCap size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-ocean-900 text-base leading-tight">
              {entry.institutionName || 'Institution Name'}
            </h4>
            <p className="text-sm text-ocean-600 mt-0.5">{entry.location}</p>
            <p className="text-sm text-seafoam-700 font-medium mt-1">{entry.fieldOrBoard}</p>
            <p className="text-xs text-ocean-500 mt-1 font-mono">{entry.yearRange}</p>
            {entry.description && (
              <p className="text-sm text-ocean-700 mt-2 leading-relaxed">{entry.description}</p>
            )}
          </div>

          {isEditMode && (
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg text-ocean-600 hover:bg-white/30 transition-colors"
                aria-label="Edit entry"
              >
                <MdEdit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50/30 transition-colors"
                aria-label="Delete entry"
              >
                <MdDelete size={16} />
              </button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function Education() {
  const { ref, inView } = useScrollReveal();
  const education = useContentStore((s) => s.content.education);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EducationEntry | null>(null);

  const schooling = education.filter((e) => e.level === 'schooling');
  const graduation = education.filter((e) => e.level === 'graduation');

  const saveEntry = (entry: EducationEntry) => {
    const exists = education.find((e) => e.id === entry.id);
    const updated = exists
      ? education.map((e) => (e.id === entry.id ? entry : e))
      : [...education, entry];
    updateContent({ education: updated });
    setModalOpen(false);
    setEditing(null);
  };

  const deleteEntry = (id: string) =>
    updateContent({ education: education.filter((e) => e.id !== id) });

  const openEdit = (entry: EducationEntry) => {
    setEditing(entry);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditing(emptyEntry());
    setModalOpen(true);
  };

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">Education</h2>
            {isEditMode && (
              <Button variant="secondary" size="sm" icon={<MdAdd />} onClick={openAdd}>
                Add Entry
              </Button>
            )}
          </div>

          <div className="space-y-10">
            {/* Schooling group */}
            {(schooling.length > 0 || isEditMode) && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-seafoam-600 mb-4 flex items-center gap-2">
                  <span className="h-px flex-1 bg-seafoam-300/40" />
                  Schooling
                  <span className="h-px flex-1 bg-seafoam-300/40" />
                </h3>
                <div className="space-y-4">
                  {schooling.length === 0 ? (
                    <p className="text-ocean-500 text-sm text-center py-4">No schooling entries yet.</p>
                  ) : (
                    schooling.map((entry, i) => (
                      <EducationCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        isEditMode={isEditMode}
                        onEdit={() => openEdit(entry)}
                        onDelete={() => deleteEntry(entry.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Graduation group */}
            {(graduation.length > 0 || isEditMode) && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-ocean-600 mb-4 flex items-center gap-2">
                  <span className="h-px flex-1 bg-ocean-300/40" />
                  Graduation
                  <span className="h-px flex-1 bg-ocean-300/40" />
                </h3>
                <div className="space-y-4">
                  {graduation.length === 0 ? (
                    <p className="text-ocean-500 text-sm text-center py-4">No graduation entries yet.</p>
                  ) : (
                    graduation.map((entry, i) => (
                      <EducationCard
                        key={entry.id}
                        entry={entry}
                        index={i}
                        isEditMode={isEditMode}
                        onEdit={() => openEdit(entry)}
                        onDelete={() => deleteEntry(entry.id)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {education.length === 0 && !isEditMode && (
              <p className="text-center text-ocean-500 py-10">Education details coming soon.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit modal */}
      {editing && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title="Education Entry" size="md">
          <EntryForm entry={editing} onChange={setEditing} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={() => saveEntry(editing)}>Save</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
