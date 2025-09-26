export interface Student {
  id: string;
  name: string;
  nis: string;
  class: string;
}

export interface Teacher {
  id: string;
  name: string;
  nip: string;
  subject: string;
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alfa';

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: AttendanceStatus;
  className: string;
}

export interface TeacherAttendanceRecord {
  teacherId: string;
  date: string;
  status: AttendanceStatus;
}

export interface AttendanceStats {
  hadir: number;
  izin: number;
  sakit: number;
  alfa: number;
}

export interface User {
  username: string;
  role: 'admin' | 'teacher';
  name: string;
}