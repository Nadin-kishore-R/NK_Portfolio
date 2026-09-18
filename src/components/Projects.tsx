import React, { useState, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { MdAdd, MdDelete, MdEdit, MdImage, MdDescription } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
import type { Project } from '../types/content';

const emptyProject = (): Project => ({
  id: `proj-${Date.now()}`,
  title: '',
  description: '',
  githubUrl: '',
  mediaType: null,
  mediaUrl: null,
  mediaName: null,
});

function MediaPreview({ project }: { project: Project }) {
  if (!project.mediaUrl) return null;
  if (project.mediaType === 'image') {
    return (
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover" />
      </div>
    );
  }
  if (project.mediaType === 'video') {
    return (
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <video src={project.mediaUrl} controls className="w-full h-full object-cover" />
      </div>
    );
  }
  if (project.mediaType === 'ppt' || project.mediaType === 'doc') {
    return (
      <div className="flex items-center gap-2 mb-3 p-3 rounded-lg bg-white/20 border border-white/30">
        <MdDescription size={20} className="text-ocean-600" />
        <a
          href={project.mediaUrl}
          download={project.mediaName ?? true}
          className="text-sm text-ocean-700 hover:text-ocean-900 underline truncate"
        >
          {project.mediaName ?? 'Download file'}
        </a>
      </div>
    );
  }
  return null;
}

export function Projects() {
  const { ref, inView } = useScrollReveal();
  const projects = useContentStore((s) => s.content.projects);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const saveProject = (proj: Project) => {
    const exists = projects.find((p) => p.id === proj.id);
    const updated = exists
      ? projects.map((p) => (p.id === proj.id ? proj : p))
      : [...projects, proj];
    updateContent({ projects: updated });
    setModalOpen(false);
    setEditing(null);
  };

  const deleteProject = (id: string) =>
    updateContent({ projects: projects.filter((p) => p.id !== id) });

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    const url = URL.createObjectURL(file);
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    let mediaType: Project['mediaType'] = 'doc';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) mediaType = 'image';
    else if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) mediaType = 'video';
    else if (['ppt', 'pptx'].includes(ext)) mediaType = 'ppt';
    setEditing({ ...editing, mediaUrl: url, mediaName: file.name, mediaType });
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">Projects</h2>
            {isEditMode && (
              <Button variant="secondary" size="sm" icon={<MdAdd />}
                onClick={() => { setEditing(emptyProject()); setModalOpen(true); }}>
                Add Project
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <p className="text-center text-ocean-500 py-10">
              {isEditMode ? 'No projects yet. Click "Add Project" to begin.' : 'Projects coming soon.'}
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={cardVariants}>
                  <Card className="relative group flex flex-col h-full" hoverable>
                    <MediaPreview project={project} />
                    <div className="flex-1 flex flex-col gap-2">
                      <h4 className="font-display font-semibold text-ocean-900 text-base leading-tight">
                        {project.title || 'Project Title'}
                      </h4>
                      <p className="text-sm text-ocean-700 leading-relaxed flex-1">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom bar: GitHub link */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/25">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-sm text-ocean-700 hover:text-ocean-900 transition-colors font-medium group/gh"
                        >
                          <FaGithub size={16} className="group-hover/gh:scale-110 transition-transform" />
                          View on GitHub
                        </a>
                      ) : (
                        <span className="text-xs text-ocean-400">No GitHub link</span>
                      )}
                    </div>

                    {/* Edit controls */}
                    {isEditMode && (
                      <div className="flex gap-1 absolute top-2 right-2">
                        <button onClick={() => { setEditing(project); setModalOpen(true); }}
                          className="p-1.5 rounded-lg glass text-ocean-700 hover:bg-white/40 transition-colors">
                          <MdEdit size={14} />
                        </button>
                        <button onClick={() => deleteProject(project.id)}
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

      {/* Edit modal */}
      {editing && (
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} title="Project" size="md">
          <div className="flex flex-col gap-3">
            <FormField id="proj-title" label="Title" value={editing.title}
              onChange={(v) => setEditing({ ...editing, title: v })} required />
            <FormField id="proj-desc" label="Description" type="textarea" value={editing.description}
              onChange={(v) => setEditing({ ...editing, description: v })} rows={3} />
            <FormField id="proj-github" label="GitHub URL" type="url" value={editing.githubUrl}
              onChange={(v) => setEditing({ ...editing, githubUrl: v })} placeholder="https://github.com/..." />

            {/* Media upload */}
            <div>
              <label className="text-sm font-medium text-ocean-800 block mb-1.5">Media (image/video/PPT/doc)</label>
              <div className="flex items-center gap-3 flex-wrap">
                {editing.mediaName && (
                  <span className="text-xs text-ocean-600 truncate max-w-[140px]">{editing.mediaName}</span>
                )}
                <Button variant="secondary" size="sm" icon={<MdImage />}
                  onClick={() => mediaInputRef.current?.click()}>
                  {editing.mediaUrl ? 'Change Media' : 'Upload Media'}
                </Button>
                <input ref={mediaInputRef} type="file" className="hidden"
                  accept="image/*,video/*,.ppt,.pptx,.pdf,.doc,.docx"
                  onChange={handleMediaUpload} />
                {editing.mediaUrl && (
                  <button
                    onClick={() => setEditing({ ...editing, mediaUrl: null, mediaName: null, mediaType: null })}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => { setModalOpen(false); setEditing(null); }}>Cancel</Button>
            <Button onClick={() => saveProject(editing)}>Save</Button>
          </div>
        </Modal>
      )}
    </section>
  );
}
