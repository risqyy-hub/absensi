import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Save, GraduationCap } from "lucide-react";
import { mockTeachers, saveTeacherAttendance, getStoredTeacherAttendance } from "@/lib/mockData";
import { TeacherAttendanceRecord, AttendanceStatus } from "@/types";
import { toast } from "sonner";

const TeacherAttendance = () => {
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    // Load existing attendance for today
    const today = new Date().toISOString().split('T')[0];
    const existingRecords = getStoredTeacherAttendance().filter(
      record => record.date === today
    );
    
    const existingData: Record<string, AttendanceStatus> = {};
    existingRecords.forEach(record => {
      existingData[record.teacherId] = record.status;
    });
    setAttendanceData(existingData);
  }, []);

  const handleAttendanceChange = (teacherId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: status
    }));
  };

  const handleSaveAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecords = getStoredTeacherAttendance();
    
    // Remove existing records for today
    const filteredRecords = existingRecords.filter(
      record => record.date !== today
    );

    // Add new records
    const newRecords: TeacherAttendanceRecord[] = Object.entries(attendanceData).map(([teacherId, status]) => ({
      teacherId,
      date: today,
      status
    }));

    saveTeacherAttendance([...filteredRecords, ...newRecords]);
    toast.success("Absensi guru berhasil disimpan!");
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'hadir': return 'text-success';
      case 'izin': return 'text-warning';
      case 'sakit': return 'text-orange-500';
      case 'alfa': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      case 'alfa': return 'Alfa';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Absensi Guru</h1>
            <p className="text-muted-foreground">
              Input kehadiran guru hari ini
            </p>
          </div>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daftar Absensi Guru</CardTitle>
                <CardDescription>
                  Pilih status kehadiran untuk setiap guru
                </CardDescription>
              </div>
              <Button onClick={handleSaveAttendance} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Simpan Absensi</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead className="w-96">Status Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTeachers.map((teacher, index) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {teacher.nip}
                    </TableCell>
                    <TableCell className="font-medium">
                      {teacher.name}
                    </TableCell>
                    <TableCell>
                      {teacher.subject}
                    </TableCell>
                    <TableCell>
                      <RadioGroup
                        value={attendanceData[teacher.id] || ""}
                        onValueChange={(value) => handleAttendanceChange(teacher.id, value as AttendanceStatus)}
                        className="flex space-x-6"
                      >
                        {(['hadir', 'izin', 'sakit', 'alfa'] as AttendanceStatus[]).map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <RadioGroupItem value={status} id={`${teacher.id}-${status}`} />
                            <Label 
                              htmlFor={`${teacher.id}-${status}`} 
                              className={`text-sm cursor-pointer ${getStatusColor(status)}`}
                            >
                              {getStatusLabel(status)}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary */}
        {Object.keys(attendanceData).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Absensi</CardTitle>
              <CardDescription>
                Statistik sementara sebelum disimpan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {(['hadir', 'izin', 'sakit', 'alfa'] as AttendanceStatus[]).map((status) => {
                  const count = Object.values(attendanceData).filter(s => s === status).length;
                  return (
                    <div key={status} className="text-center p-4 rounded-lg border">
                      <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
                        {count}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getStatusLabel(status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TeacherAttendance;