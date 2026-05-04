import React, { ReactNode } from 'react';

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; }
export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

const badgeColors: Record<string, string> = {
  ongoing: 'badge-green', completed: 'badge-blue', planned: 'badge-amber',
  journal: 'badge-violet', conference: 'badge-cyan', book: 'badge-rose', other: 'badge-slate',
  PhD: 'badge-violet', Masters: 'badge-cyan', Undergraduate: 'badge-amber',
};
export function Badge({ label }: { label: string }) {
  return <span className={`badge ${badgeColors[label] ?? 'badge-slate'}`}>{label}</span>;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'secondary'; size?: 'sm' | 'md'; icon?: ReactNode;
}
export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
      {icon && <span className="btn-icon">{icon}</span>}{children}
    </button>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; }
export function Input({ label, error, className = '', ...rest }: InputProps) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <input className={`field-input ${error ? 'field-input--error' : ''} ${className}`} {...rest} />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; options: { value: string | number; label: string }[]; }
export function Select({ label, options, className = '', ...rest }: SelectProps) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <select className={`field-input ${className}`} {...rest}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

interface CardProps { children: ReactNode; className?: string; onClick?: () => void; accent?: string; }
export function Card({ children, className = '', onClick, accent }: CardProps) {
  return (
    <div className={`card ${onClick ? 'card--clickable' : ''} ${className}`} onClick={onClick}
      style={accent ? { '--card-accent': accent } as React.CSSProperties : undefined}>
      {accent && <div className="card-accent-bar" />}
      {children}
    </div>
  );
}

export function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      <p>{message}</p>
    </div>
  );
}

export function Spinner() { return <div className="spinner" />; }

interface ConfirmProps { open: boolean; message: string; onConfirm: () => void; onCancel: () => void; }
export function Confirm({ open, message, onConfirm, onCancel }: ConfirmProps) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box confirm-box" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-msg">{message}</p>
        <div className="confirm-actions">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

interface MultiSelectProps { label: string; options: { value: number; label: string }[]; selected: number[]; onChange: (vals: number[]) => void; }
export function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const toggle = (val: number) => onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="multi-select">
        {options.map((o) => (
          <label key={o.value} className={`multi-chip ${selected.includes(o.value) ? 'multi-chip--on' : ''}`}>
            <input type="checkbox" checked={selected.includes(o.value)} onChange={() => toggle(o.value)} />{o.label}
          </label>
        ))}
        {options.length === 0 && <span className="multi-empty">No options</span>}
      </div>
    </div>
  );
}
