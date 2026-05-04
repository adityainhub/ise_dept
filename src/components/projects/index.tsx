import React, { useState } from 'react';
import type { Project } from '../../types';
import { projectsApi, professorsApi, studentsApi } from '../../api';
import { Modal, Button, Input, Select, MultiSelect, Card, Badge, EmptyState, Spinner, Confirm } from '../ui';
import { useEntity } from '../../hooks/useEntity';

interface ProjectFormProps { initial?: Partial<Project>; onSave: (data: Partial<Project>) => Promise<void>; onCancel: () => void; }
export function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState({ title: initial?.title ?? '', status: initial?.status ?? 'planned' as Project['status'], startDate: initial?.startDate ?? '', endDate: initial?.endDate ?? '', professorIds: initial?.professorIds ?? [], studentIds: initial?.studentIds ?? [] });
  const [saving, setSaving] = useState(false);
  const { data: professors } = useEntity(() => professorsApi.list());
  const { data: students } = useEntity(() => studentsApi.list());
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); await onSave(form); setSaving(false); };
  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <Input label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Deep Learning for Medical Imaging" />
      <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })} options={[{ value: 'planned', label: 'Planned' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' }]} />
      <div className="form-row">
        <Input label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <Input label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
      </div>
      <MultiSelect label="Principal Investigators" selected={form.professorIds} onChange={(vals) => setForm({ ...form, professorIds: vals })} options={(professors ?? []).map((p) => ({ value: p.id, label: p.name }))} />
      <MultiSelect label="Assigned Students" selected={form.studentIds} onChange={(vals) => setForm({ ...form, studentIds: vals })} options={(students ?? []).map((s) => ({ value: s.id, label: s.name }))} />
      <div className="form-actions">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : initial ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const statusAccent: Record<string, string> = { ongoing: 'var(--accent-green)', completed: 'var(--accent-blue)', planned: 'var(--accent-orange)' };
  return (
    <Card onClick={onClick} accent={statusAccent[project.status] ?? 'var(--accent-blue)'}>
      <div className="project-card-top"><Badge label={project.status} /><span className="project-year">{project.startDate?.slice(0, 4)}</span></div>
      <h3 className="project-title">{project.title}</h3>
      <div className="card-statistics">
        <span className="stat">See details →</span>
      </div>
    </Card>
  );
}

interface ProjectDetailProps { projectId: number; onClose: () => void; onEdit: (project: Project) => void; onDelete: (id: number) => void; onProfessorClick?: (id: number) => void; onStudentClick?: (id: number) => void; }
export function ProjectDetail({ projectId, onClose, onEdit, onDelete, onProfessorClick, onStudentClick }: ProjectDetailProps) {
  const { data: project, loading } = useEntity(() => projectsApi.get(projectId));
  if (loading) return <div className="detail-loading"><Spinner /></div>;
  if (!project) return null;
  return (
    <div className="detail-panel">
      <div className="detail-hero">
        <div className="detail-avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))' }}>{project.title.charAt(0)}</div>
        <div>
          <h2 className="detail-name">{project.title}</h2>
          <p className="detail-sub"><Badge label={project.status} /> {project.startDate?.slice(0, 10)}</p>
          {project.endDate && <p className="detail-sub">Ends: {project.endDate.slice(0, 10)}</p>}
        </div>
        <button className="detail-close" onClick={onClose}>✕</button>
      </div>
      <div className="detail-sections">
        {project.professors && project.professors.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-header"><span>👨‍🏫</span><h3>PIs</h3><span className="detail-count">{project.professors.length}</span></div>
            <ul className="detail-list">
              {project.professors.map((p: any) => (
                <li key={p.id} className={`detail-list-item ${onProfessorClick ? 'clickable' : ''}`} onClick={() => onProfessorClick?.(p.id)}><span>{p.name}</span><p className="muted">{p.department}</p></li>
              ))}
            </ul>
          </div>
        )}
        {project.students && project.students.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-header"><span>👩‍🎓</span><h3>Students</h3><span className="detail-count">{project.students.length}</span></div>
            <ul className="detail-list">
              {project.students.map((s: any) => (
                <li key={s.id} className={`detail-list-item ${onStudentClick ? 'clickable' : ''}`} onClick={() => onStudentClick?.(s.id)}><span>{s.name}</span><Badge label={s.program} /></li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="detail-actions">
        <Button variant="ghost" onClick={() => onEdit(project)}>Edit Project</Button>
        <Button variant="danger" onClick={() => onDelete(project.id)}>Delete Project</Button>
      </div>
    </div>
  );
}

export function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const { data: projects, loading, refetch } = useEntity(() => projectsApi.list());
  const filtered = projects?.filter((p) => !statusFilter || p.status === statusFilter) ?? [];
  const counts = { all: projects?.length ?? 0, ongoing: projects?.filter((p) => p.status === 'ongoing').length ?? 0, completed: projects?.filter((p) => p.status === 'completed').length ?? 0, planned: projects?.filter((p) => p.status === 'planned').length ?? 0 };

  const handleCreate = async (data: Partial<Project>) => { await projectsApi.create(data); setShowCreate(false); refetch(); };
  const handleUpdate = async (data: Partial<Project>) => { if (!editProject) return; await projectsApi.update(editProject.id, data); setEditProject(null); setDetailId(null); refetch(); };
  const handleDelete = async () => { if (!deleteId) return; await projectsApi.delete(deleteId); setDeleteId(null); setDetailId(null); refetch(); };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Projects</h1><p className="page-sub">Research projects across all departments</p></div>
        <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>New Project</Button>
      </div>
      <div className="filter-tabs">
        {(['', 'ongoing', 'completed', 'planned'] as const).map((s) => (
          <button key={s} className={`filter-tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
            {s || 'All'} <span className="tab-count">{s ? counts[s] : counts.all}</span>
          </button>
        ))}
      </div>
      {loading ? <div className="loading-wrap"><Spinner /></div> : (
        <div className="card-grid">
          {filtered.length ? filtered.map((p) => <ProjectCard key={p.id} project={p} onClick={() => setDetailId(p.id)} />) : <EmptyState icon="🔬" message="No projects found." />}
        </div>
      )}
      {detailId && (
        <div className="detail-overlay" onClick={() => setDetailId(null)}>
          <div className="detail-wrapper" onClick={(e) => e.stopPropagation()}>
            <ProjectDetail projectId={detailId} onClose={() => setDetailId(null)} onEdit={(p) => { setEditProject(p); setDetailId(null); }} onDelete={(id) => { setDeleteId(id); }} />
          </div>
        </div>
      )}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Project"><ProjectForm onSave={handleCreate} onCancel={() => setShowCreate(false)} /></Modal>
      <Modal open={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">{editProject && <ProjectForm initial={editProject} onSave={handleUpdate} onCancel={() => setEditProject(null)} />}</Modal>
      <Confirm open={!!deleteId} message="Delete this project?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
