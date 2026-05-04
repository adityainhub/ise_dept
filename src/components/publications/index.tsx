import React, { useState } from 'react';
import type { Publication } from '../../types';
import { publicationsApi, professorsApi, studentsApi } from '../../api';
import { Modal, Button, Input, Select, MultiSelect, Card, Badge, EmptyState, Spinner, Confirm } from '../ui';
import { useEntity } from '../../hooks/useEntity';

interface PublicationFormProps { initial?: Partial<Publication>; onSave: (data: Partial<Publication>) => Promise<void>; onCancel: () => void; }
export function PublicationForm({ initial, onSave, onCancel }: PublicationFormProps) {
  const [form, setForm] = useState({ 
    title: initial?.title ?? '', 
    type: initial?.type ?? 'journal' as Publication['type'], 
    year: initial?.year ?? new Date().getFullYear(), 
    venue: initial?.venue ?? '',
    journalName: initial?.journalName ?? '',
    dateOfPublication: initial?.dateOfPublication ?? '',
    doi: initial?.doi ?? '',
    downloadLink: initial?.downloadLink ?? '',
    nationalInternational: initial?.nationalInternational ?? 'INTERNATIONAL',
    studentAuthorIds: initial?.studentAuthorIds ?? [],
    coAuthorProfessorIds: initial?.coAuthorProfessorIds ?? []
  });
  const [saving, setSaving] = useState(false);
  const { data: professors } = useEntity(() => professorsApi.list());
  const { data: students } = useEntity(() => studentsApi.list());
  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setSaving(true); 
    await onSave(form); 
    setSaving(false); 
  };
  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Novel Approaches to Transformer Architectures" />
      <div className="form-row">
        <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Publication['type'] })} options={[{ value: 'journal', label: 'Journal Article' }, { value: 'conference', label: 'Conference Paper' }, { value: 'book', label: 'Book / Chapter' }, { value: 'other', label: 'Other' }]} />
        <Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: +e.target.value })} required />
      </div>
      <Input label="Venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Nature Machine Intelligence" />
      <Input label="Journal Name" value={form.journalName} onChange={(e) => setForm({ ...form, journalName: e.target.value })} placeholder="e.g., Journal of AI Research" />
      <Input label="Date of Publication" value={form.dateOfPublication} onChange={(e) => setForm({ ...form, dateOfPublication: e.target.value })} placeholder="e.g., July 2025" />
      <Input label="DOI" value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="e.g., 10.1234/example.doi" />
      <Input label="Download Link" type="url" value={form.downloadLink} onChange={(e) => setForm({ ...form, downloadLink: e.target.value })} placeholder="https://..." />
      <Select label="Scope" value={form.nationalInternational} onChange={(e) => setForm({ ...form, nationalInternational: e.target.value as 'NATIONAL' | 'INTERNATIONAL' })} options={[{ value: 'NATIONAL', label: 'National' }, { value: 'INTERNATIONAL', label: 'International' }]} />
      <MultiSelect label="Student Authors" selected={form.studentAuthorIds} onChange={(vals) => setForm({ ...form, studentAuthorIds: vals })} options={(students ?? []).map((s) => ({ value: s.id, label: s.name }))} />
      <MultiSelect label="Co-author Professors" selected={form.coAuthorProfessorIds} onChange={(vals) => setForm({ ...form, coAuthorProfessorIds: vals })} options={(professors ?? []).map((p) => ({ value: p.id, label: p.name }))} />
      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Update' : 'Publish'}</Button>
      </div>
    </form>
  );
}

function PublicationCard({ pub, onClick }: { pub: Publication; onClick: () => void }) {
  return (
    <Card onClick={onClick} accent="var(--accent-purple)">
      <div className="pub-card-top">
        <Badge label={pub.type} />
        <span className="pub-year">{pub.year}</span>
      </div>
      <h3 className="pub-title">{pub.title}</h3>
      <div className="card-statistics">
        <span className="stat">View details →</span>
      </div>
    </Card>
  );
}

interface PublicationDetailProps { publicationId: number; onClose: () => void; onEdit: (pub: Publication) => void; onDelete: (id: number) => void; onStudentAuthorClick?: (id: number) => void; onCoAuthorClick?: (id: number) => void; }
export function PublicationDetail({ publicationId, onClose, onEdit, onDelete, onStudentAuthorClick, onCoAuthorClick }: PublicationDetailProps) {
  const { data: pub, loading } = useEntity(() => publicationsApi.get(publicationId));
  if (loading) return <div className="detail-loading"><Spinner /></div>;
  if (!pub) return null;
  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))' }}>{pub.title.charAt(0)}</div>
        <div>
          <h2 className="detail-name">{pub.title}</h2>
          <p className="detail-sub"><Badge label={pub.type} /> {pub.year}</p>
          {pub.nationalInternational && <p className="detail-sub">{pub.nationalInternational}</p>}
        </div>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>
      <div className="detail-sections">
        {pub.journalName && (
          <div className="detail-section">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Journal</h4>
            <p style={{ fontSize: '13px' }}>{pub.journalName}</p>
          </div>
        )}
        {pub.venue && (
          <div className="detail-section">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Venue</h4>
            <p style={{ fontSize: '13px' }}>{pub.venue}</p>
          </div>
        )}
        {pub.dateOfPublication && (
          <div className="detail-section">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Published</h4>
            <p style={{ fontSize: '13px' }}>{pub.dateOfPublication}</p>
          </div>
        )}
        {pub.doi && (
          <div className="detail-section">
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>DOI</h4>
            <p style={{ fontSize: '13px', fontFamily: 'monospace' }}>{pub.doi}</p>
          </div>
        )}
        {pub.downloadLink && (
          <div className="detail-section">
            <a href={pub.downloadLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              📥 Download PDF
            </a>
          </div>
        )}
        {pub.studentAuthors && pub.studentAuthors.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-header"><span>👩‍🎓</span><h3>Student Authors</h3><span className="detail-count">{pub.studentAuthors.length}</span></div>
            <ul className="detail-list">
              {pub.studentAuthors.map((s: any) => (
                <li key={s.id} className={`detail-list-item ${onStudentAuthorClick ? 'clickable' : ''}`} onClick={() => onStudentAuthorClick?.(s.id)}><span>{s.name}</span></li>
              ))}
            </ul>
          </div>
        )}
        {pub.coAuthors && pub.coAuthors.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-header"><span>👨‍🏫</span><h3>Co-authors</h3><span className="detail-count">{pub.coAuthors.length}</span></div>
            <ul className="detail-list">
              {pub.coAuthors.map((p: any) => (
                <li key={p.id} className={`detail-list-item ${onCoAuthorClick ? 'clickable' : ''}`} onClick={() => onCoAuthorClick?.(p.id)}><span>{p.name}</span><p className="muted">{p.department}</p></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="detail-actions">
        <Button variant="ghost" onClick={() => onEdit(pub)}>Edit Publication</Button>
        <Button variant="danger" onClick={() => onDelete(pub.id)}>Delete Publication</Button>
      </div>
    </div>
  );
}

export function PublicationsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editPub, setEditPub] = useState<Publication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const { data: publications, loading, refetch } = useEntity(() => publicationsApi.list());
  const filtered = publications?.filter((p) => !typeFilter || p.type === typeFilter) ?? [];
  const typeLabels: Record<string, string> = { journal: 'Journal', conference: 'Conference', book: 'Book', other: 'Other' };

  const handleCreate = async (data: Partial<Publication>) => { await publicationsApi.create(data); setShowCreate(false); refetch(); };
  const handleUpdate = async (data: Partial<Publication>) => { if (!editPub) return; await publicationsApi.update(editPub.id, data); setEditPub(null); setDetailId(null); refetch(); };
  const handleDelete = async () => { if (!deleteId) return; await publicationsApi.delete(deleteId); setDeleteId(null); setDetailId(null); refetch(); };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Publications</h1><p className="page-sub">Journals, conferences, and books by faculty</p></div>
        <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>Add Publication</Button>
      </div>
      <div className="filter-tabs">
        <button className={`filter-tab ${typeFilter === '' ? 'active' : ''}`} onClick={() => setTypeFilter('')}>All <span className="tab-count">{publications?.length ?? 0}</span></button>
        {['journal', 'conference', 'book', 'other'].map((t) => (
          <button key={t} className={`filter-tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
            {typeLabels[t]} <span className="tab-count">{publications?.filter((p) => p.type === t).length ?? 0}</span>
          </button>
        ))}
      </div>
      {loading ? <div className="loading-wrap"><Spinner /></div> : (
        <div className="card-grid">
          {filtered.length ? filtered.map((p) => <PublicationCard key={p.id} pub={p} onClick={() => setDetailId(p.id)} />) : <EmptyState icon="📄" message="No publications found." />}
        </div>
      )}
      {detailId && (
        <div className="detail-overlay" onClick={() => setDetailId(null)}>
          <div className="detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <PublicationDetail publicationId={detailId} onClose={() => setDetailId(null)} onEdit={(p) => { setEditPub(p); setDetailId(null); }} onDelete={(id) => { setDeleteId(id); }} />
          </div>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Publication"><PublicationForm onSave={handleCreate} onCancel={() => setShowCreate(false)} /></Modal>
      <Modal open={!!editPub} onClose={() => setEditPub(null)} title="Edit Publication">{editPub && <PublicationForm initial={editPub} onSave={handleUpdate} onCancel={() => setEditPub(null)} />}</Modal>
      <Confirm open={!!deleteId} message="Delete this publication?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
