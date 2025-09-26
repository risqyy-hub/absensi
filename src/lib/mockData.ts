import { Student, Teacher, AttendanceRecord, TeacherAttendanceRecord, AttendanceStats, AttendanceStatus } from '@/types';

export const mockStudents: Student[] = [
  { id: '1', name: 'Ahmad Rizki Pratama', nis: '2021001', class: 'X-A' },
  { id: '2', name: 'Siti Nurhaliza', nis: '2021002', class: 'X-A' },
  { id: '3', name: 'Budi Santoso', nis: '2021003', class: 'X-A' },
  { id: '4', name: 'Dewi Sartika', nis: '2021004', class: 'X-A' },
  { id: '5', name: 'Muhammad Iqbal', nis: '2021005', class: 'X-A' },
  { id: '6', name: 'Rina Marlina', nis: '2021006', class: 'X-B' },
  { id: '7', name: 'Andi Firmansyah', nis: '2021007', class: 'X-B' },
  { id: '8', name: 'Maya Sari', nis: '2021008', class: 'X-B' },
  { id: '9', name: 'Fadli Rahman', nis: '2021009', class: 'X-B' },
  { id: '10', name: 'Indira Putri', nis: '2021010', class: 'X-B' },
];

export const mockTeachers: Teacher[] = [
  { id: '1', name: 'Mohamad dzaky syarof', nip: '196801011990031001', subject: 'Fiqih' },
  { id: '2', name: 'Harko wikan jatmiko', nip: '197205121995122001', subject: 'Matematika' },
  { id: '3', name: 'Deva nasirotun finga', nip: '198003151999031002', subject: 'Al Qur-an Hadist ' },
  { id: '4', name: 'Eka milawati', nip: '198507232008012003', subject: 'Bahasa Inggris' },
  { id: '5', name: 'Tri mujianah', nip: '198507232008012003', subject: 'Pendidikan Pancasila' },
  { id: '6', name: 'Rina wening rahayu', nip: '198507232008012003', subject: 'Bahasa Indonesia' },
  { id: '7', name: 'Evi winarni', nip: '198507232008012003', subject: 'ilmu Pengetahuan Alam' },
  { id: '8', name: 'Herlina', nip: '198507232008012003', subject: 'Prakarya' },
  { id: '9', name: 'Yulita wijayanti', nip: '198507232008012003', subject: 'Bahasa Arap' },
  { id: '10', name: 'Erfanovago M F', nip: '198507232008012003', subject: 'ilmu pengetahuan sosial' },
  { id: '11', name: 'Eko Aris Setiawan ', nip: '198507232008012003', subject: 'Matematika' },
  { id: '12', name: 'Nurohmani asyaifulloh', nip: '198507232008012003', subject: 'Ekonomi' },
  { id: '13', name: 'Yeni anjarwati', nip: '198507232008012003', subject: 'Bahasa Indonesia' },
  { id: '14', name: 'Yeni yukarnain', nip: '198507232008012003', subject: 'Matematika' },
  { id: '15', name: 'Umi farida purwaningsih', nip: '198507232008012003', subject: 'Bahasa Inggris' },
  { id: '16', name: 'Ani lu lujannah ', nip: '198507232008012003', subject: 'Akidah Akhlaq' },           
];
export const classes = ['X-A', 'X-B', 'XI-A', 'XI-B', 'XII-A', 'XII-B'];

export const getTodayStats = (): AttendanceStats => {
  const records = getStoredAttendance();
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today);
  
  return {
    hadir: todayRecords.filter(r => r.status === 'hadir').length,
    izin: todayRecords.filter(r => r.status === 'izin').length,
    sakit: todayRecords.filter(r => r.status === 'sakit').length,
    alfa: todayRecords.filter(r => r.status === 'alfa').length,
  };
};

export const getStoredAttendance = (): AttendanceRecord[] => {
  const stored = localStorage.getItem('attendanceRecords');
  return stored ? JSON.parse(stored) : [];
};

export const saveAttendance = (records: AttendanceRecord[]) => {
  localStorage.setItem('attendanceRecords', JSON.stringify(records));
};

export const getMonthlyStats = () => {
  const records = getStoredAttendance();
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = records.filter(r => r.date === dateStr);
    
    return {
      date: dateStr,
      hadir: dayRecords.filter(r => r.status === 'hadir').length,
      izin: dayRecords.filter(r => r.status === 'izin').length,
      sakit: dayRecords.filter(r => r.status === 'sakit').length,
      alfa: dayRecords.filter(r => r.status === 'alfa').length,
    };
  });
  
  return monthlyData;
};

// Teacher Attendance Functions
export const getStoredTeacherAttendance = (): TeacherAttendanceRecord[] => {
  const stored = localStorage.getItem('teacherAttendanceRecords');
  return stored ? JSON.parse(stored) : [];
};

export const saveTeacherAttendance = (records: TeacherAttendanceRecord[]) => {
  localStorage.setItem('teacherAttendanceRecords', JSON.stringify(records));
};

export const getTodayTeacherStats = (): AttendanceStats => {
  const records = getStoredTeacherAttendance();
  const today = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter(r => r.date === today);
  
  return {
    hadir: todayRecords.filter(r => r.status === 'hadir').length,
    izin: todayRecords.filter(r => r.status === 'izin').length,
    sakit: todayRecords.filter(r => r.status === 'sakit').length,
    alfa: todayRecords.filter(r => r.status === 'alfa').length,
  };
};

export const getTeacherMonthlyStats = () => {
  const records = getStoredTeacherAttendance();
  const monthlyData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayRecords = records.filter(r => r.date === dateStr);
    
    return {
      date: dateStr,
      hadir: dayRecords.filter(r => r.status === 'hadir').length,
      izin: dayRecords.filter(r => r.status === 'izin').length,
      sakit: dayRecords.filter(r => r.status === 'sakit').length,
      alfa: dayRecords.filter(r => r.status === 'alfa').length,
    };
  });
  
  return monthlyData;
};

export const getTeacherAttendanceByDate = (selectedDate: string) => {
  const records = getStoredTeacherAttendance();
  const dateRecords = records.filter(r => r.date === selectedDate);
  
  return {
    hadir: dateRecords.filter(r => r.status === 'hadir').length,
    izin: dateRecords.filter(r => r.status === 'izin').length,
    sakit: dateRecords.filter(r => r.status === 'sakit').length,
    alfa: dateRecords.filter(r => r.status === 'alfa').length,
  };
};

// Generate sample teacher attendance data if none exists
export const generateSampleTeacherAttendance = () => {
  const existing = getStoredTeacherAttendance();
  if (existing.length > 0) return; // Don't overwrite existing data

  const sampleData: TeacherAttendanceRecord[] = [];
  const statuses: AttendanceStatus[] = ['hadir', 'hadir', 'hadir', 'hadir', 'izin', 'sakit', 'alfa']; // Weighted towards 'hadir'

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    mockTeachers.forEach(teacher => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      sampleData.push({
        teacherId: teacher.id,
        date: dateStr,
        status: randomStatus
      });
    });
  }

  saveTeacherAttendance(sampleData);
};