import React, { useState } from 'react';
import type { Professor, Publication, Student } from '../../types';
import { professorsApi, publicationsApi } from '../../api';
import { Modal, Button, Input, Card, Badge, EmptyState, Spinner, Confirm } from '../ui';
import { useEntity } from '../../hooks/useEntity';
import { ProjectDetail } from '../projects';
import { PublicationDetail, PublicationForm } from '../publications';
import { StudentDetail } from '../students';

interface ProfessorFormProps { initial?: Partial<Professor>; onSave: (data: Partial<Professor>) => Promise<void>; onCancel: () => void; }
export function ProfessorForm({ initial, onSave, onCancel }: ProfessorFormProps) {
  const [form, setForm] = useState({ name: initial?.name ?? '', department: initial?.department ?? '', email: initial?.email ?? '' });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); };
  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Dr. Jane Smith" />
      <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required placeholder="Computer Science" />
      <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="jsmith@university.edu" />
      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}

interface ProfessorCardProps { professor: Professor; onClick: () => void; }
export function ProfessorCard({ professor, onClick }: ProfessorCardProps) {
  return (
    <Card onClick={onClick} accent="var(--accent-blue)">
      <div className="prof-card-header">
        <div className="prof-avatar">{professor.name.charAt(0)}</div>
        <div className="prof-meta">
          <h3 className="prof-name">{professor.name}</h3>
          <p className="prof-dept">{professor.department}</p>
        </div>
      </div>
      <p className="prof-email">{professor.email}</p>
      <div className="card-statistics">
        <span className="stat">View full profile →</span>
      </div>
    </Card>
  );
}

interface ProfessorDetailProps { professorId: number; onClose: () => void; onEdit: (prof: Professor) => void; onDelete: (id: number) => void; onPublicationEdit?: (pub: Publication) => void; }
export function ProfessorDetail({ professorId, onClose, onEdit, onDelete, onPublicationEdit }: ProfessorDetailProps) {
  const { data: professor, loading } = useEntity(() => professorsApi.get(professorId));
  const { data: students = [] } = useEntity(() => professorsApi.getStudents(professorId));
  const { data: projects = [] } = useEntity(() => professorsApi.getProjects(professorId));
  const { data: publications = [] } = useEntity(() => professorsApi.getPublications(professorId));
  const [nestedDetailId, setNestedDetailId] = useState<number | null>(null);
  const [nestedDetailType, setNestedDetailType] = useState<'student' | 'project' | 'publication' | null>(null);

  if (nestedDetailType === 'publication' && nestedDetailId) {
    return (
      <div className="detail-panel">
        <button className="detail-back" onClick={() => { setNestedDetailId(null); setNestedDetailType(null); }}>← Back</button>
        <PublicationDetail publicationId={nestedDetailId} onClose={onClose} onEdit={(pub) => { onPublicationEdit?.(pub); setNestedDetailId(null); setNestedDetailType(null); }} onDelete={() => {}} onStudentAuthorClick={(id) => { setNestedDetailId(id); setNestedDetailType('student'); }} onCoAuthorClick={(id) => { setNestedDetailId(id); setNestedDetailType('project'); }} />
      </div>
    );
  }
  if (nestedDetailType === 'project' && nestedDetailId) {
    return (
      <div className="detail-panel">
        <button className="detail-back" onClick={() => { setNestedDetailId(null); setNestedDetailType(null); }}>← Back</button>
        <ProjectDetail projectId={nestedDetailId} onClose={onClose} onEdit={() => {}} onDelete={() => {}} onProfessorClick={(id) => { setNestedDetailId(id); setNestedDetailType('project'); }} onStudentClick={(id) => { setNestedDetailId(id); setNestedDetailType('student'); }} />
      </div>
    );
  }
  if (nestedDetailType === 'student' && nestedDetailId) {
    return (
      <div className="detail-panel">
        <button className="detail-back" onClick={() => { setNestedDetailId(null); setNestedDetailType(null); }}>← Back</button>
        <StudentDetail studentId={nestedDetailId} onClose={onClose} onEdit={() => {}} onDelete={() => {}} onSupervisorClick={(id) => { setNestedDetailId(id); setNestedDetailType('project'); }} onProjectClick={(id) => { setNestedDetailId(id); setNestedDetailType('project'); }} />
      </div>
    );
  }

  if (loading) return <div className="detail-loading"><Spinner /></div>;
  if (!professor) return null;
  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-avatar">{professor.name.charAt(0)}</div>
        <div>
          <h2 className="detail-name">{professor.name}</h2>
          <p className="detail-sub">{professor.department}</p>
          <a className="detail-email" href={`mailto:${professor.email}`}>{professor.email}</a>
        </div>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>
      <div className="detail-sections">
        <div className="detail-section">
          <div className="detail-section-header"><span>👩‍🎓</span><h3>PhD Students</h3><span className="detail-count">{students?.length ?? 0}</span></div>
          {students && students.length ? (
            <ul className="detail-list">{students.map((s: Student) => (
              <li key={s.id} className="detail-list-item clickable" onClick={() => { setNestedDetailId(s.id); setNestedDetailType('student'); }}><span>{s.name}</span><Badge label={s.program} /><span className="muted">{s.enrollmentYear}</span></li>
            ))}</ul>
          ) : <EmptyState icon="🎓" message="No students yet" />}
        </div>
        <div className="detail-section">
          <div className="detail-section-header"><span>🔬</span><h3>Projects</h3><span className="detail-count">{projects?.length ?? 0}</span></div>
          {projects && projects.length ? (
            <ul className="detail-list">{projects.map((p: any) => (
              <li key={p.id} className="detail-list-item clickable" onClick={() => { setNestedDetailId(p.id); setNestedDetailType('project'); }}><span>{p.title}</span><Badge label={p.status} /></li>
            ))}</ul>
          ) : <EmptyState icon="🔭" message="No projects yet" />}
        </div>
        <div className="detail-section">
          <div className="detail-section-header"><span>📄</span><h3>Publications</h3><span className="detail-count">{publications?.length ?? 0}</span></div>
          {publications && publications.length ? (
            <ul className="detail-list">{publications.map((pub: any) => (
              <li key={pub.id} className="detail-list-item clickable" onClick={() => { setNestedDetailId(pub.id); setNestedDetailType('publication'); }}><span>{pub.title}</span><Badge label={pub.type} /><span className="muted">{pub.year}</span></li>
            ))}</ul>
          ) : <EmptyState icon="📚" message="No publications yet" />}
        </div>
      </div>
      <div className="detail-actions">
        <Button variant="ghost" onClick={() => onEdit(professor)}>Edit Professor</Button>
        <Button variant="danger" onClick={() => onDelete(professor.id)}>Delete Professor</Button>
      </div>
    </div>
  );
}

export function ProfessorsPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editProf, setEditProf] = useState<Professor | null>(null);
  const [editPublication, setEditPublication] = useState<Publication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const { data: professors, loading, refetch } = useEntity(() => professorsApi.list(search));

  const handleCreate = async (data: Partial<Professor>) => { await professorsApi.create(data); setShowCreate(false); refetch(); };
  const handleUpdate = async (data: Partial<Professor>) => { if (!editProf) return; await professorsApi.update(editProf.id, data); setEditProf(null); setDetailId(null); refetch(); };
  const handlePublicationUpdate = async (data: Partial<Publication>) => { if (!editPublication) return; await publicationsApi.update(editPublication.id, data); setEditPublication(null); refetch(); };
  const handleDelete = async () => { if (!deleteId) return; await professorsApi.delete(deleteId); setDeleteId(null); setDetailId(null); refetch(); };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Professors</h1><p className="page-sub">Manage faculty members and their research profiles</p></div>
        <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>Add Professor</Button>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="Search by name, department…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && refetch()} />
        <button className="search-btn" onClick={refetch}>Search</button>
      </div>
      {loading ? <div className="loading-wrap"><Spinner /></div> : (
        <div className="card-grid">
          {professors?.length ? professors.map((p) => (
            <ProfessorCard key={p.id} professor={p} onClick={() => setDetailId(p.id)} />
          )) : <EmptyState icon="👨‍🏫" message="No professors found. Add one to get started." />}
        </div>
      )}
      {detailId && (
        <div className="detail-overlay" onClick={() => setDetailId(null)}>
          <div className="detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <ProfessorDetail professorId={detailId} onClose={() => setDetailId(null)} onEdit={(p) => { setEditProf(p); setDetailId(null); }} onDelete={(id) => { setDeleteId(id); }} onPublicationEdit={(pub) => setEditPublication(pub)} />
          </div>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Professor">
        <ProfessorForm onSave={handleCreate} onCancel={() => setShowCreate(false)} />
      </Modal>
      <Modal open={!!editProf} onClose={() => setEditProf(null)} title="Edit Professor">
        {editProf && <ProfessorForm initial={editProf} onSave={handleUpdate} onCancel={() => setEditProf(null)} />}
      </Modal>
      <Modal open={!!editPublication} onClose={() => setEditPublication(null)} title="Edit Publication">
        {editPublication && <PublicationForm initial={editPublication} onSave={handlePublicationUpdate} onCancel={() => setEditPublication(null)} />}
      </Modal>
      <Confirm open={!!deleteId} message="Delete this professor? This cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
