import React, { useState } from 'react';
import type { Student } from '../../types';
import { studentsApi, professorsApi, projectsApi } from '../../api';
import { Modal, Button, Input, Select, MultiSelect, Card, Badge, EmptyState, Spinner, Confirm } from '../ui';
import { useEntity } from '../../hooks/useEntity';

interface StudentFormProps { initial?: Partial<Student>; onSave: (data: Partial<Student>) => Promise<void>; onCancel: () => void; }
export function StudentForm({ initial, onSave, onCancel }: StudentFormProps) {
  const [form, setForm] = useState({ name: initial?.name ?? '', program: initial?.program ?? 'PhD', enrollmentYear: initial?.enrollmentYear ?? new Date().getFullYear(), supervisorId: initial?.supervisorId ?? ('' as any), projectIds: initial?.projectIds ?? [] });
  const [saving, setSaving] = useState(false);
  const { data: professors } = useEntity(() => professorsApi.list());
  const { data: projects } = useEntity(() => projectsApi.list());
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave({ ...form, supervisorId: form.supervisorId || undefined }); setSaving(false); };
  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Alice Johnson" />
      <Select label="Program" value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} options={[{ value: 'PhD', label: 'PhD' }, { value: 'Masters', label: 'Masters' }, { value: 'Undergraduate', label: 'Undergraduate' }]} />
      <Input label="Enrollment Year" type="number" value={form.enrollmentYear} onChange={(e) => setForm({ ...form, enrollmentYear: +e.target.value })} required />
      <Select label="Supervisor" value={form.supervisorId} onChange={(e) => setForm({ ...form, supervisorId: +e.target.value })} options={(professors ?? []).map((p) => ({ value: p.id, label: p.name }))} />
      <MultiSelect label="Assigned Projects" selected={form.projectIds} onChange={(vals) => setForm({ ...form, projectIds: vals })} options={(projects ?? []).map((p) => ({ value: p.id, label: p.title }))} />
      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}

interface StudentDetailProps { studentId: number; onClose: () => void; onEdit: (student: Student) => void; onDelete: (id: number) => void; onSupervisorClick?: (id: number) => void; onProjectClick?: (id: number) => void; }
export function StudentDetail({ studentId, onClose, onEdit, onDelete, onSupervisorClick, onProjectClick }: StudentDetailProps) {
  const { data: student, loading } = useEntity(() => studentsApi.get(studentId));
  if (loading) return <div className="detail-loading"><Spinner /></div>;
  if (!student) return null;
  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))' }}>{student.name.charAt(0)}</div>
        <div>
          <h2 className="detail-name">{student.name}</h2>
          <p className="detail-sub">{student.program} Student</p>
          <p className="detail-sub">Enrolled: {student.enrollmentYear}</p>
        </div>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>
      <div className="detail-sections">
        {student.supervisor && (
          <div className="detail-section">
            <div className="detail-section-header"><span>👨‍🏫</span><h3>Supervisor</h3></div>
            <ul className="detail-list">
              <li className={`detail-list-item ${onSupervisorClick ? 'clickable' : ''}`} onClick={() => onSupervisorClick?.(student.supervisor!.id)}><span>{student.supervisor.name}</span><p className="muted">{student.supervisor.department}</p></li>
            </ul>
          </div>
        )}
        {student.projects && student.projects.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-header"><span>🔬</span><h3>Projects</h3><span className="detail-count">{student.projects.length}</span></div>
            <ul className="detail-list">
              {student.projects.map((p: any) => (
                <li key={p.id} className={`detail-list-item ${onProjectClick ? 'clickable' : ''}`} onClick={() => onProjectClick?.(p.id)}><span>{p.title}</span><Badge label={p.status} /></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="detail-actions">
        <Button variant="ghost" onClick={() => onEdit(student)}>Edit Student</Button>
        <Button variant="danger" onClick={() => onDelete(student.id)}>Delete Student</Button>
      </div>
    </div>
  );
}

export function StudentCard({ student, onClick }: { student: Student; onClick: () => void }) {
  return (
    <Card onClick={onClick} accent="var(--accent-green)">
      <div className="prof-card-header">
        <div className="prof-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))' }}>{student.name.charAt(0)}</div>
        <div className="prof-meta"><h3 className="prof-name">{student.name}</h3><Badge label={student.program} /></div>
      </div>
      <div className="card-stats">
        <span className="stat">{student.enrollmentYear} enrolled</span>
      </div>
      <div className="card-statistics">
        <span className="stat">View full profile →</span>
      </div>
    </Card>
  );
}

export function StudentsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const { data: students, loading, refetch } = useEntity(() => studentsApi.list());
  const filtered = students?.filter((s) => !filter || s.name.toLowerCase().includes(filter.toLowerCase()) || s.program.toLowerCase().includes(filter.toLowerCase())) ?? [];

  const handleCreate = async (data: Partial<Student>) => { await studentsApi.create(data); setShowCreate(false); refetch(); };
  const handleUpdate = async (data: Partial<Student>) => { if (!editStudent) return; await studentsApi.update(editStudent.id, data); setEditStudent(null); setDetailId(null); refetch(); };
  const handleDelete = async () => { if (!deleteId) return; await studentsApi.delete(deleteId); setDeleteId(null); setDetailId(null); refetch(); };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Students</h1><p className="page-sub">PhD and graduate students across all labs</p></div>
        <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>Add Student</Button>
      </div>
      <div className="search-bar">
        <input className="search-input" placeholder="Filter by name or program…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      {loading ? <div className="loading-wrap"><Spinner /></div> : (
        <div className="card-grid">
          {filtered.length ? filtered.map((s) => <StudentCard key={s.id} student={s} onClick={() => setDetailId(s.id)} />) : <EmptyState icon="👩‍🎓" message="No students found." />}
        </div>
      )}
      {detailId && (
        <div className="detail-overlay" onClick={() => setDetailId(null)}>
          <div className="detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <StudentDetail studentId={detailId} onClose={() => setDetailId(null)} onEdit={(s) => { setEditStudent(s); setDetailId(null); }} onDelete={(id) => { setDeleteId(id); }} />
          </div>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Student"><StudentForm onSave={handleCreate} onCancel={() => setShowCreate(false)} /></Modal>
      <Modal open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student">{editStudent && <StudentForm initial={editStudent} onSave={handleUpdate} onCancel={() => setEditStudent(null)} />}</Modal>
      <Confirm open={!!deleteId} message="Delete this student?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
