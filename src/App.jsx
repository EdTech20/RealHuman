import React, { useState } from 'react';
import './index.css';
import logoImg from './assets/logo.png';
import CreateProjectModal, { projectTypes } from './CreateProjectModal';
import ProjectDetails from './ProjectDetails';
import CallRoom from './CallRoom';

const ProjectsIcon = () => (
  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

const SettingsIcon = () => (
  <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

const ChevronDownIcon = () => (
  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
);

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-container">
          <div className="logo-icon" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <img src={logoImg} alt="RealHuman Logo" style={{ height: '72px', width: 'auto', objectFit: 'contain', maxWidth: '100%' }} />
          </div>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <ProjectsIcon />
            Projects
          </a>
          <a href="#" className="nav-item">
            <SettingsIcon />
            Settings
          </a>
        </nav>
      </div>
      
      <div className="user-profile">
        <img src="/assets/avatar.png" alt="Dickson Edor" className="avatar" />
        <div className="user-info">
          <span className="user-name">Dickson Edor</span>
          <span className="user-plan">Pro Plan</span>
        </div>
        <ChevronDownIcon />
      </div>
    </aside>
  );
};

const Header = ({ onOpenModal }) => {
  return (
    <header className="header">
      <div className="header-right">
        <button className="btn btn-primary" onClick={onOpenModal}>
          <PlusIcon />
          New Project
        </button>
        <button className="btn-icon">
          <BellIcon />
        </button>
        <div className="header-user">
          <img src="/assets/avatar.png" alt="Profile" className="avatar-small" />
          <ChevronDownIcon />
        </div>
      </div>
    </header>
  );
};

const DashboardContent = ({ onOpenModal, projects, onSelectProject }) => {
  return (
    <div className="dashboard-content">
      <div className="greeting-section">
        <h1 className="greeting-title">Good afternoon, Dickson <span className="wave">👋</span></h1>
        <p className="greeting-subtitle">Create AI humans for conversations, meetings, teaching, recruiting and more.</p>
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2 className="section-title">Your Projects</h2>
          <div className="view-toggle">
            <button className="toggle-btn" aria-label="List view">
              <ListIcon />
            </button>
            <button className="toggle-btn active" aria-label="Grid view">
              <GridIcon />
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {/* Create New Project Card */}
          <div className="project-card create-card" onClick={onOpenModal}>
            <div className="create-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h3 className="create-title">Create New Project</h3>
            <p className="create-subtitle">Start building your AI human</p>
          </div>
          
          {projects.map(project => {
            const typeConfig = projectTypes.find(t => t.id === project.typeId) || projectTypes[0];
            return (
              <div key={project.id} className="project-card" onClick={() => onSelectProject(project)}>
                <div className="card-header">
                  <div className="card-icon" style={{ color: typeConfig.color, backgroundColor: typeConfig.bg }}>
                    {typeConfig.icon}
                  </div>
                  <button className="more-btn">
                    <MoreIcon />
                  </button>
                </div>
                <h3 className="card-title">{project.name}</h3>
                <p className="card-type">{typeConfig.title}</p>
                <div className="card-footer">
                  <span className="updated-text">Updated {project.updatedAt}</span>
                  <span className="badge badge-ready">{project.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
};

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [callSession, setCallSession] = useState(null); // { roomUrl, token, projectName }

  const handleCreateProject = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // When a call is active, render ONLY the call room — no shell, no sidebar
  if (callSession) {
    return (
      <CallRoom
        roomUrl={callSession.roomUrl}
        token={callSession.token}
        projectName={callSession.projectName}
        systemPrompt={callSession.systemPrompt}
        onEndCall={() => setCallSession(null)}
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header onOpenModal={() => setIsModalOpen(true)} />
        {selectedProject ? (
          <ProjectDetails
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            onStartCall={(session) => setCallSession(session)}
          />
        ) : (
          <DashboardContent
            onOpenModal={() => setIsModalOpen(true)}
            projects={projects}
            onSelectProject={setSelectedProject}
          />
        )}
      </main>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
