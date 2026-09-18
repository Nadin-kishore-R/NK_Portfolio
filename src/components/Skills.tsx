import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdAdd, MdDelete } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Chip } from './ui/Chip';
import { Button } from './ui/Button';

const CHIP_COLORS: Record<string, 'ocean' | 'seafoam' | 'sand'> = {
  languages: 'ocean',
  tools: 'seafoam',
  platforms: 'sand',
  softSkills: 'ocean',
};

function SkillGroup({
  title,
  items,
  color,
  isEditMode,
  onAdd,
  onRemove,
  startIndex = 0,
}: {
  title: string;
  items: string[];
  color: 'ocean' | 'seafoam' | 'sand';
  isEditMode: boolean;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  startIndex?: number;
}) {
  const [newItem, setNewItem] = useState('');

  return (
    <div className="mb-5">
      <h4 className="text-xs font-bold uppercase tracking-widest text-ocean-600 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Chip
            key={item + i}
            label={item}
            color={color}
            index={startIndex + i}
            onRemove={isEditMode ? () => onRemove(i) : undefined}
          />
        ))}
        {isEditMode && (
          <div className="flex gap-1 items-center">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newItem.trim()) {
                  onAdd(newItem.trim());
                  setNewItem('');
                }
              }}
              placeholder="Add skill…"
              className="px-2 py-1 rounded-lg text-sm glass border border-dashed border-ocean-300/60 text-ocean-800 placeholder-ocean-400/60 focus:outline-none focus:border-ocean-400 w-24 transition-all"
            />
            {newItem.trim() && (
              <button
                onClick={() => { onAdd(newItem.trim()); setNewItem(''); }}
                className="p-1 rounded-lg text-ocean-600 hover:bg-white/30"
              >
                <MdAdd size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Skills() {
  const { ref, inView } = useScrollReveal();
  const content = useContentStore((s) => s.content);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const { skills } = content;

  const update = (key: keyof typeof skills, newList: string[]) =>
    updateContent({ skills: { ...skills, [key]: newList } });

  const add = (key: keyof typeof skills, val: string) =>
    update(key, [...skills[key], val]);

  const remove = (key: keyof typeof skills, idx: number) =>
    update(key, skills[key].filter((_, i) => i !== idx));

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading mb-10">Skills</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Technical skills (left) */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-ocean-900 mb-5 text-lg">⚙️ Technical Skills</h3>
              <SkillGroup title="Languages" items={skills.languages} color="ocean" isEditMode={isEditMode}
                onAdd={(v) => add('languages', v)} onRemove={(i) => remove('languages', i)} startIndex={0} />
              <SkillGroup title="Tools & Frameworks" items={skills.tools} color="seafoam" isEditMode={isEditMode}
                onAdd={(v) => add('tools', v)} onRemove={(i) => remove('tools', i)} startIndex={skills.languages.length} />
              <SkillGroup title="Platforms" items={skills.platforms} color="sand" isEditMode={isEditMode}
                onAdd={(v) => add('platforms', v)} onRemove={(i) => remove('platforms', i)} startIndex={skills.languages.length + skills.tools.length} />
            </div>

            {/* Soft skills (right) */}
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold text-ocean-900 mb-5 text-lg">🌊 Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.softSkills.map((skill, i) => (
                  <Chip
                    key={skill + i}
                    label={skill}
                    color="seafoam"
                    index={i}
                    onRemove={isEditMode ? () => remove('softSkills', i) : undefined}
                  />
                ))}
                {isEditMode && (
                  <div className="flex gap-1 items-center">
                    <input
                      placeholder="Add soft skill…"
                      className="px-2 py-1 rounded-lg text-sm glass border border-dashed border-seafoam-300/60 text-ocean-800 placeholder-ocean-400/60 focus:outline-none focus:border-seafoam-400 w-28 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.currentTarget.value ?? '').trim()) {
                          add('softSkills', e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
