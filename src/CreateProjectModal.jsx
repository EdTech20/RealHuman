import React, { useState } from 'react';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
);

const EduIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
);

const BusinessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

const SparklesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M7 5H3"></path></svg>
);

const CheckCircleIcon = () => (
  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export const projectTypes = [
  { id: 'interviewing', title: 'Interviewing', desc: 'Candidate screening', icon: <MicIcon />, color: '#633CFF', bg: '#f5f3ff' },
  { id: 'education', title: 'Education', desc: 'Teaching & tutoring', icon: <EduIcon />, color: '#059669', bg: '#ecfdf5' },
  { id: 'business', title: 'Business', desc: 'Sales & support', icon: <BusinessIcon />, color: '#d97706', bg: '#fffbeb' },
  { id: 'custom', title: 'Custom', desc: 'Build your own', icon: <SparklesIcon />, color: '#3b82f6', bg: '#eff6ff' }
];

export default function CreateProjectModal({ isOpen, onClose, onCreateProject }) {
  const [selectedType, setSelectedType] = useState('interviewing');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!projectName.trim()) return;
    
    if (onCreateProject) {
      onCreateProject({
        id: Date.now(),
        name: projectName,
        typeId: selectedType,
        description: description,
        status: 'Ready',
        updatedAt: 'Just now'
      });
    }
    
    setProjectName('');
    setDescription('');
    setSelectedType('interviewing');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className="modal-right">
          <h2 className="modal-title">Create New Project</h2>
          <p className="modal-subtitle">
            Set up a new workspace for your AI human.<br/>
            You can customize everything later.
          </p>

          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Frontend Engineer Hiring" 
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
            <p className="form-help">Give your project a clear and memorable name.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Choose a Project Type</label>
            <div className="project-types-grid">
              {projectTypes.map(type => (
                <div 
                  key={type.id}
                  className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedType(type.id)}
                >
                  {selectedType === type.id && <CheckCircleIcon />}
                  <div className="type-icon" style={{ color: type.color, backgroundColor: type.bg }}>
                    {type.icon}
                  </div>
                  <div className="type-title">{type.title}</div>
                  <div className="type-desc">{type.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="What will this AI human do?"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <p className="form-help">A short description helps you and your team understand the purpose of this project.</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" style={{ padding: '12px 20px', gap: '8px' }} onClick={handleSubmit}>
              Continue <ArrowRightIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
