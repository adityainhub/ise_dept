import React, { useState } from 'react';
import type { EntityType } from './types';
import { Sidebar } from './components/ui/Sidebar';
import { ProfessorsPage } from './components/professors';
import { StudentsPage } from './components/students';
import { ProjectsPage } from './components/projects';
import { PublicationsPage } from './components/publications';

export function App() {
  const [active, setActive] = useState<EntityType>('professors');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pages: Record<EntityType, React.ReactNode> = {
    professors: <ProfessorsPage />,
    students: <StudentsPage />,
    projects: <ProjectsPage />,
    publications: <PublicationsPage />,
  };

  const getPageTitle = (section: EntityType): string => {
    const titles: Record<EntityType, string> = {
      professors: 'Professors',
      students: 'Students',
      projects: 'Projects',
      publications: 'Publications',
    };
    return titles[section];
  };

  const handleNavClick = (section: EntityType) => {
    setActive(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-left">
          <button 
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <img src="/logo-bmsce.png" alt="BMSCE Logo" className="header-logo" />
          <div className="header-brand">
            <div className="header-title">ISE Department</div>
            <div className="header-subtitle">BMS College of Engineering</div>
          </div>
          <nav className="header-nav">
            <button
              className={`header-nav-item ${active === 'professors' ? 'active' : ''}`}
              onClick={() => setActive('professors')}
            >
              👨‍🏫 Professors
            </button>
            <button
              className={`header-nav-item ${active === 'students' ? 'active' : ''}`}
              onClick={() => setActive('students')}
            >
              👩‍🎓 Students
            </button>
            <button
              className={`header-nav-item ${active === 'projects' ? 'active' : ''}`}
              onClick={() => setActive('projects')}
            >
              🔬 Projects
            </button>
            <button
              className={`header-nav-item ${active === 'publications' ? 'active' : ''}`}
              onClick={() => setActive('publications')}
            >
              📄 Publications
            </button>
          </nav>
        </div>
        <div className="header-right"></div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">Menu</div>
          <button
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="mobile-menu-items">
          <button
            className={`mobile-menu-item ${active === 'professors' ? 'active' : ''}`}
            onClick={() => handleNavClick('professors')}
          >
            👨‍🏫 Professors
          </button>
          <button
            className={`mobile-menu-item ${active === 'students' ? 'active' : ''}`}
            onClick={() => handleNavClick('students')}
          >
            👩‍🎓 Students
          </button>
          <button
            className={`mobile-menu-item ${active === 'projects' ? 'active' : ''}`}
            onClick={() => handleNavClick('projects')}
          >
            🔬 Projects
          </button>
          <button
            className={`mobile-menu-item ${active === 'publications' ? 'active' : ''}`}
            onClick={() => handleNavClick('publications')}
          >
            📄 Publications
          </button>
        </div>
      </nav>

      <main className="app-main">
        {pages[active]}
      </main>
    </div>
  );
}
