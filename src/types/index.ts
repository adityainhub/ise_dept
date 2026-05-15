export interface Grant {
  id: number;
  title: string;
  fundingAgency: string;
  type: 'Government' | 'Non-Government';
  fundsProvided?: number;
  dateOfReceipt?: string;
  durationMonths?: number;
  department: string;
  status: 'ongoing' | 'completed' | 'pending';
}

export interface Professor {
  id: number;
  name: string;
  department: string;
  email: string;
  students?: Student[];
  projects?: Project[];
  publications?: Publication[];
  grants?: Grant[];
}

export interface Student {
  id: number;
  name: string;
  program: string;
  enrollmentYear: number;
  supervisorId?: number;
  supervisor?: Professor;
  projectIds?: number[];
  projects?: Project[];
}

export interface Project {
  id: number;
  title: string;
  status: 'ongoing' | 'completed' | 'planned';
  startDate: string;
  endDate?: string;
  professorIds?: number[];
  studentIds?: number[];
  professors?: Professor[];
  students?: Student[];
}

export interface Publication {
  id: number;
  title: string;
  type: 'journal' | 'conference' | 'book' | 'other';
  year: number;
  venue: string;
  journalName?: string;
  dateOfPublication?: string;
  doi?: string;
  downloadLink?: string;
  nationalInternational?: 'NATIONAL' | 'INTERNATIONAL';
  studentAuthorIds?: number[];
  coAuthorProfessorIds?: number[];
  studentAuthors?: Student[];
  coAuthors?: Professor[];
}

export type EntityType = 'professors' | 'students' | 'projects' | 'publications';
