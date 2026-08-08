import React, { useState } from 'react';
import { projectTypes } from './CreateProjectModal';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const VideoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
);

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const ReportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
);

const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);

export default function ProjectDetails({ project, onBack, onStartCall }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditHumanModalOpen, setIsEditHumanModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Talk to Emma flow
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [talkSystemPrompt, setTalkSystemPrompt] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState(null);

  const typeConfig = projectTypes.find(t => t.id === project.typeId) || projectTypes[0];
  const formatApiError = (detail) => {
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map(e => `${e.loc?.join('.') || 'Request'}: ${e.msg}`).join('\n');
    }
    return 'Unable to start the agent.';
  };

  // Called when user submits system prompt in the Talk to Emma modal
  const handleStartCall = async () => {
    setIsStarting(true);
    setStartError(null);
    try {
      const response = await fetch('http://localhost:8000/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.name,
          projectType: typeConfig.title,
          systemPrompt: talkSystemPrompt.trim() || `You are a helpful AI assistant for ${project.name}.`,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(formatApiError(data.detail));
      if (data.status === 'success') {
        setIsTalkModalOpen(false);
        // Hand the session up to App — it will unmount this entire shell
        onStartCall({ roomUrl: data.roomUrl, token: data.token, projectName: project.name, systemPrompt: talkSystemPrompt.trim() });
      }
    } catch (err) {
      setStartError(err.message || 'Something went wrong.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleShareLink = () => {
    alert('Start a call first to generate a room link.');
  };

  // Separate handler for the legacy "Edit AI Human" quick action
  const handleEditSave = () => {
    setIsEditHumanModalOpen(false);
  };

  return (
    <div className="project-details">
      <div className="pd-header-nav">
        <button className="pd-back-btn" onClick={onBack}>
          <BackIcon />
          Back to Projects
        </button>
      </div>
      
      <div className="pd-header">
        <div className="pd-header-left">
          <div className="pd-main-icon" style={{ color: typeConfig.color, backgroundColor: typeConfig.bg }}>
            {typeConfig.icon}
          </div>
          <div className="pd-title-group">
            <h1 className="pd-title">{project.name}</h1>
            <div className="pd-meta">
              <span className="badge badge-ready">{project.status}</span>
              <span className="pd-updated-text">• Last updated {project.updatedAt.toLowerCase()}</span>
            </div>
          </div>
        </div>
        <div className="pd-header-right">
          <button className="btn btn-primary pd-btn pd-btn-start">
            <PlayIcon />
            Start Conversation
          </button>
        </div>
      </div>

      <div className="pd-tabs">
        {['Overview', 'Integration', 'Conversation', 'Report'].map(tab => (
          <button 
            key={tab} 
            className={`pd-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="pd-content">
        <div className="pd-stats-row">
          <div className="pd-stat-card">
            <div className="pd-stat-icon" style={{ color: '#8b5cf6', backgroundColor: '#f5f3ff' }}>
              <UserIcon />
            </div>
            <div className="pd-stat-info">
              <span className="pd-stat-label">AI Human</span>
              <span className="pd-stat-value">Emma</span>
              <span className="pd-stat-badge badge badge-ready">Ready</span>
            </div>
          </div>
          
          <div className="pd-stat-card">
            <div className="pd-stat-icon" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
              <FileIcon />
            </div>
            <div className="pd-stat-info">
              <span className="pd-stat-label">Knowledge Files</span>
              <span className="pd-stat-value">3</span>
              <span className="pd-stat-desc">Files</span>
            </div>
          </div>
          
          <div className="pd-stat-card">
            <div className="pd-stat-icon" style={{ color: '#f97316', backgroundColor: '#fff7ed' }}>
              <ChatIcon />
            </div>
            <div className="pd-stat-info">
              <span className="pd-stat-label">Conversations</span>
              <span className="pd-stat-value">12</span>
              <span className="pd-stat-desc">Total</span>
            </div>
          </div>
          
          <div className="pd-stat-card">
            <div className="pd-stat-icon" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
              <ReportIcon />
            </div>
            <div className="pd-stat-info">
              <span className="pd-stat-label">Reports</span>
              <span className="pd-stat-value">12</span>
              <span className="pd-stat-desc">Generated</span>
            </div>
          </div>
        </div>

        <div className="pd-main-grid">
          <div className="pd-human-card">
            <div className="pd-human-header">
              <h3>Your AI Human</h3>
              <button className="btn-icon"><MoreIcon /></button>
            </div>
            <div className="pd-human-body">
              <div className="pd-human-avatar-container">
                <img src="/assets/emma.png" alt="Emma AI" className="pd-human-avatar" />
              </div>
              <div className="pd-human-details">
                <h2 className="pd-human-name">Emma</h2>
                <p className="pd-human-subtitle">AI Human</p>
                <div className="pd-human-status">
                  <span className="badge badge-ready badge-small">● Ready</span>
                </div>
                
                <div className="pd-human-specs">
                  <div className="pd-spec-item">
                    <div className="pd-spec-icon"><MicIcon /></div>
                    <span className="pd-spec-label">Voice</span>
                    <span className="pd-spec-val">Professional</span>
                  </div>
                  <div className="pd-spec-item">
                    <div className="pd-spec-icon"><BookIcon /></div>
                    <span className="pd-spec-label">Knowledge</span>
                    <span className="pd-spec-val">3 Files</span>
                  </div>
                </div>
                
                <button className="btn btn-primary pd-human-action" onClick={() => setIsTalkModalOpen(true)}>
                  <VideoIcon /> Talk to Emma
                </button>
              </div>
            </div>
          </div>

          <div className="pd-sidebar-grid">
            <div className="pd-conversations-card">
              <div className="pd-card-header">
                <h3>Recent Conversations</h3>
                <a href="#" className="pd-link">View all</a>
              </div>
              <div className="pd-conversation-list">
                {[
                  { initials: 'JD', name: 'John Doe Interview', date: 'Yesterday', color: '#e0e7ff', text: '#4f46e5' },
                  { initials: 'SS', name: 'Sarah Smith Interview', date: '2 days ago', color: '#ffedd5', text: '#ea580c' },
                  { initials: 'MT', name: 'Michael Taylor Interview', date: '5 days ago', color: '#dbeafe', text: '#2563eb' }
                ].map((conv, i) => (
                  <div key={i} className="pd-conversation-item">
                    <div className="pd-conv-avatar" style={{ backgroundColor: conv.color, color: conv.text }}>
                      {conv.initials}
                    </div>
                    <div className="pd-conv-info">
                      <h4>{conv.name}</h4>
                      <div className="pd-conv-status">
                        <span className="pd-status-dot"></span> Completed
                      </div>
                    </div>
                    <div className="pd-conv-date">{conv.date}</div>
                    <ChevronRight />
                  </div>
                ))}
              </div>
            </div>

            <div className="pd-actions-card">
              <div className="pd-card-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="pd-actions-grid">
                <div className="pd-action-item" onClick={() => setIsUploadModalOpen(true)}>
                  <div className="pd-action-icon" style={{ color: '#3b82f6', backgroundColor: '#eff6ff' }}>
                    <UploadIcon />
                  </div>
                  <span>Upload<br/>Knowledge</span>
                </div>
                <div className="pd-action-item" onClick={() => setIsEditHumanModalOpen(true)}>
                  <div className="pd-action-icon" style={{ color: '#f97316', backgroundColor: '#fff7ed' }}>
                    <EditIcon />
                  </div>
                  <span>Edit<br/>Human</span>
                </div>
                <div className="pd-action-item" onClick={handleShareLink}>
                  <div className="pd-action-icon" style={{ color: '#10b981', backgroundColor: '#ecfdf5' }}>
                    <LinkIcon />
                  </div>
                  <span>Share<br/>Link</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isEditHumanModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditHumanModalOpen(false)}>
          <div className="modal-content pd-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsEditHumanModalOpen(false)}>
              <CloseIcon />
            </button>
            <h2 className="modal-title">Edit AI Human</h2>
            <p className="modal-subtitle">Define the core instructions and personality for your AI.</p>
            <div className="form-group" style={{ marginTop: '20px' }}>
              <label className="form-label">System Prompt</label>
              <textarea 
                className="form-input" 
                rows="6" 
                placeholder="You are an expert interviewer..." 
                style={{ resize: 'vertical', minHeight: '120px' }}
                value={talkSystemPrompt}
                onChange={e => setTalkSystemPrompt(e.target.value)}
              />
            </div>
            <div className="modal-footer" style={{ marginTop: '32px' }}>
              <button className="btn btn-secondary" onClick={() => setIsEditHumanModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-content pd-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsUploadModalOpen(false)}>
              <CloseIcon />
            </button>
            <h2 className="modal-title">Upload Knowledge</h2>
            <p className="modal-subtitle">Upload documents (PDF, TXT, DOCX) to expand Emma's knowledge base.</p>
            
            <div className="upload-dropzone">
              <UploadIcon />
              <p style={{ margin: 0 }}>Click or drag files here to upload</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setIsUploadModalOpen(false)}>Upload Files</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Talk to Emma — system prompt modal ─────────────────── */}
      {isTalkModalOpen && (
        <div className="modal-overlay" onClick={() => { setIsTalkModalOpen(false); setStartError(null); }}>
          <div className="modal-content pd-modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setIsTalkModalOpen(false); setStartError(null); }}>
              <CloseIcon />
            </button>

            <h2 className="modal-title">Talk to Emma</h2>
            <p className="modal-subtitle">
              Give Emma her instructions before you join the call. You can keep it short
              or go into detail — she'll follow whatever you set.
            </p>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">System Prompt</label>
              <textarea
                className="form-input"
                rows="6"
                placeholder={`e.g. You are a friendly interviewer for ${project.name}. Ask the candidate about their experience and skills. Keep responses concise and professional.`}
                style={{ resize: 'vertical', minHeight: '140px' }}
                value={talkSystemPrompt}
                onChange={e => setTalkSystemPrompt(e.target.value)}
                autoFocus
              />
              <p className="form-help">Leave blank to use a default prompt based on your project type.</p>
            </div>

            {startError && (
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                ❌ {startError}
              </p>
            )}

            <div className="modal-footer" style={{ marginTop: '32px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => { setIsTalkModalOpen(false); setStartError(null); }}
                disabled={isStarting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStartCall}
                disabled={isStarting}
                style={{ minWidth: '140px' }}
              >
                {isStarting ? 'Starting...' : 'Start Call'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
