import React from 'react';
import type { EntityType } from '../../types';

interface NavItem {
  id: EntityType;
  label: string;
  icon: string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'professors', label: 'Professors', icon: '👨‍🏫', description: 'Faculty & researchers' },
  { id: 'students', label: 'Students', icon: '👩‍🎓', description: 'PhD & grad students' },
  { id: 'projects', label: 'Projects', icon: '🔬', description: 'Active research' },
  { id: 'publications', label: 'Publications', icon: '📄', description: 'Papers & journals' },
];

interface SidebarProps {
  active: EntityType;
  onChange: (id: EntityType) => void;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ active, onChange, collapsed = false, onToggle }: SidebarProps) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo-container">
            <img src="/logo-bmsce.png" alt="BMSCE Logo" className="brand-logo bmsce-logo" />
            <img src="/logo-ise.png" alt="ISE Department Logo" className="brand-logo ise-logo" />
          </div>
          <div className="brand-info">
            <div className="brand-name">ISE Department</div>
            <div className="brand-tagline">BMS College of Engineering</div>
          </div>
        </div>
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <p className="nav-section-label">MANAGEMENT</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <div className="nav-text">
              <span className="nav-label">{item.label}</span>
              <span className="nav-desc">{item.description}</span>
            </div>
            {active === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="footer-dot" />
        <span>Connected to localhost:8080</span>
      </div>
    </aside>
  );
}
