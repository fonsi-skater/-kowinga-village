// PortfolioPanel.jsx
// The actual modal overlay shown when a nav button is clicked. Renders
// different content depending on activePanel — About (bio paragraphs),
// Projects (list with links), or Contact (email/phone/GitHub).

import { useGameStore } from '../../state/useGameStore';
import { ABOUT_CONTENT, PROJECTS_CONTENT, CONTACT_CONTENT, SKILLS_CONTENT } from '../../story/portfolioContent';
import { useGitHubRepos } from '../../hooks/useGitHubRepos';

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
};

const panelStyle = {
  background: '#1e2a20',
  color: 'white',
  fontFamily: 'sans-serif',
  borderRadius: '10px',
  padding: '28px 32px',
  maxWidth: '480px',
  width: '90%',
  maxHeight: '75vh',
  overflowY: 'auto',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '12px',
  right: '16px',
  background: 'transparent',
  color: 'white',
  border: 'none',
  fontSize: '1.4rem',
  cursor: 'pointer',
};

function AboutPanelContent() {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>{ABOUT_CONTENT.title}</h2>
      {ABOUT_CONTENT.paragraphs.map((p, i) => (
        <p key={i} style={{ lineHeight: 1.6, opacity: 0.9 }}>{p}</p>
      ))}
      <h3 style={{ marginBottom: '8px' }}>What I do as a software engineer</h3>
      <ul style={{ lineHeight: 1.7, opacity: 0.9, paddingLeft: '20px' }}>
        {ABOUT_CONTENT.responsibilities.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </>
  );
}

function ProjectsPanelContent() {
  const { repos, loading, error } = useGitHubRepos();

  // Fall back to the curated static list while loading, or if the live
  // fetch fails (e.g., the unauthenticated API rate limit was hit) —
  // this way the panel never shows an empty/broken state to a visitor.
  const useLiveData = !loading && !error && repos && repos.length > 0;

  return (
    <>
      <h2 style={{ marginTop: 0 }}>{PROJECTS_CONTENT.title}</h2>
      {loading && (
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Loading live repos from GitHub…</p>
      )}
      {useLiveData
        ? repos.map((repo) => (
            <div key={repo.id} style={{ marginBottom: '16px' }}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#8fd694', fontWeight: 'bold', textDecoration: 'none' }}
              >
                {repo.name} ↗
              </a>
              <p style={{ margin: '4px 0 0', opacity: 0.85, lineHeight: 1.5 }}>
                {repo.description || 'No description provided.'}
                {repo.language && (
                  <span style={{ opacity: 0.6 }}> — {repo.language}</span>
                )}
              </p>
            </div>
          ))
        : !loading &&
          PROJECTS_CONTENT.items.map((item, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#8fd694', fontWeight: 'bold', textDecoration: 'none' }}
              >
                {item.name} ↗
              </a>
              <p style={{ margin: '4px 0 0', opacity: 0.85, lineHeight: 1.5 }}>{item.description}</p>
            </div>
          ))}
    </>
  );
}

function SkillsPanelContent() {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>{SKILLS_CONTENT.title}</h2>
      {SKILLS_CONTENT.categories.map((category, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '6px', fontSize: '0.95rem', opacity: 0.9 }}>{category.name}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {category.items.map((item, j) => (
              <span
                key={j}
                style={{
                  background: 'rgba(143,214,148,0.15)',
                  border: '1px solid rgba(143,214,148,0.4)',
                  borderRadius: '14px',
                  padding: '4px 12px',
                  fontSize: '0.85rem',
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function ContactPanelContent() {
  return (
    <>
      <h2 style={{ marginTop: 0 }}>{CONTACT_CONTENT.title}</h2>
      <p style={{ lineHeight: 1.8 }}>
        Email: <a href={`mailto:${CONTACT_CONTENT.email}`} style={{ color: '#8fd694' }}>{CONTACT_CONTENT.email}</a>
        <br />
        Phone: {CONTACT_CONTENT.phone}
        <br />
        GitHub: <a href={CONTACT_CONTENT.github} target="_blank" rel="noopener noreferrer" style={{ color: '#8fd694' }}>
          {CONTACT_CONTENT.github}
        </a>
      </p>
    </>
  );
}

export default function PortfolioPanel() {
  const activePanel = useGameStore((state) => state.activePanel);
  const setActivePanel = useGameStore((state) => state.setActivePanel);

  if (!activePanel) return null; // nothing open, render nothing

  return (
    <div style={overlayStyle} onClick={() => setActivePanel(null)}>
      {/* stopPropagation so clicking INSIDE the panel doesn't close it —
          only clicking the dark backdrop or the X button should close */}
      <div style={{ position: 'relative', ...panelStyle }} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={() => setActivePanel(null)}>✕</button>
        {activePanel === 'about' && <AboutPanelContent />}
        {activePanel === 'projects' && <ProjectsPanelContent />}
        {activePanel === 'skills' && <SkillsPanelContent />}
        {activePanel === 'contact' && <ContactPanelContent />}
      </div>
    </div>
  );
}
