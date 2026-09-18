import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MdVisibility, MdDownload, MdUploadFile, MdDelete } from 'react-icons/md';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useContentStore, useEditModeStore } from '../store';
import { Modal } from './ui/Modal';
import { PDFViewer } from './ui/PDFViewer';
import { Button } from './ui/Button';

export function Resume() {
  const { ref, inView } = useScrollReveal();
  const resume = useContentStore((s) => s.content.resume);
  const updateContent = useContentStore((s) => s.updateContent);
  const isEditMode = useEditModeStore((s) => s.isEditMode);

  const [viewerOpen, setViewerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file only.');
      return;
    }
    const url = URL.createObjectURL(file);
    updateContent({
      resume: {
        fileUrl: url,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
  };

  const handleRemove = () => {
    updateContent({ resume: { fileUrl: null, fileName: null, uploadedAt: null } });
  };

  return (
    <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="section-heading mb-10 inline-block">Resume</h2>

          <div className="glass-card p-8 flex flex-col items-center gap-6">
            {resume.fileUrl ? (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #38bdf8, #14b8a6)' }}>
                  <MdVisibility size={32} className="text-white" />
                </div>

                <div>
                  <p className="font-display font-semibold text-ocean-900 text-lg">
                    {resume.fileName ?? 'NK_Resume.pdf'}
                  </p>
                  {resume.uploadedAt && (
                    <p className="text-xs text-ocean-500 mt-1">
                      Updated {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<MdVisibility />}
                    onClick={() => setViewerOpen(true)}
                  >
                    View Resume
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={<MdDownload />}
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = resume.fileUrl!;
                      a.download = resume.fileName ?? 'NK_Resume.pdf';
                      a.click();
                    }}
                  >
                    Download
                  </Button>
                </div>

                {isEditMode && (
                  <div className="flex gap-2 mt-2">
                    <Button variant="secondary" size="sm" icon={<MdUploadFile />}
                      onClick={() => fileInputRef.current?.click()}>
                      Replace PDF
                    </Button>
                    <Button variant="danger" size="sm" icon={<MdDelete />} onClick={handleRemove}>
                      Remove
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed border-ocean-300/60">
                  <MdUploadFile size={28} className="text-ocean-400" />
                </div>
                <div>
                  <p className="font-display font-semibold text-ocean-700 text-lg">
                    Resume Coming Soon
                  </p>
                  <p className="text-sm text-ocean-500 mt-1">
                    {isEditMode ? 'Upload a PDF resume below.' : 'Check back soon!'}
                  </p>
                </div>
                {isEditMode && (
                  <Button variant="primary" icon={<MdUploadFile />}
                    onClick={() => fileInputRef.current?.click()}>
                    Upload Resume PDF
                  </Button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </motion.div>
      </div>

      {/* PDF Viewer Modal */}
      <Modal isOpen={viewerOpen} onClose={() => setViewerOpen(false)}
        title={resume.fileName ?? 'Resume'} size="full">
        {resume.fileUrl && (
          <PDFViewer fileUrl={resume.fileUrl} fileName={resume.fileName ?? undefined} />
        )}
      </Modal>
    </section>
  );
}
