import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ClipboardList, Save } from "lucide-react";
import { mockStudents, classes, saveAttendance, getStoredAttendance } from "@/lib/mockData";
import { AttendanceRecord, AttendanceStatus, Student } from "@/types";
import { toast } from "sonner";

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceStatus>>({});
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (selectedClass) {
      const students = mockStudents.filter(student => student.class === selectedClass);
      setFilteredStudents(students);
      
      // Load existing attendance for today
      const today = new Date().toISOString().split('T')[0];
      const existingRecords = getStoredAttendance().filter(
        record => record.date === today && record.className === selectedClass
      );
      
      const existingData: Record<string, AttendanceStatus> = {};
      existingRecords.forEach(record => {
        existingData[record.studentId] = record.status;
      });
      setAttendanceData(existingData);
    } else {
      setFilteredStudents([]);
      setAttendanceData({});
    }
  }, [selectedClass]);

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) {
      toast.error("Pilih kelas terlebih dahulu!");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const existingRecords = getStoredAttendance();
    
    // Remove existing records for today and this class
    const filteredRecords = existingRecords.filter(
      record => !(record.date === today && record.className === selectedClass)
    );

    // Add new records
    const newRecords: AttendanceRecord[] = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      date: today,
      status,
      className: selectedClass
    }));

    saveAttendance([...filteredRecords, ...newRecords]);
    toast.success(`Absensi kelas ${selectedClass} berhasil disimpan!`);
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
          <ClipboardList className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Absensi Siswa</h1>
            <p className="text-muted-foreground">
              Input kehadiran siswa hari ini
            </p>
          </div>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Kelas</CardTitle>
            <CardDescription>
              Pilih kelas untuk melakukan absensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((className) => (
                    <SelectItem key={className} value={className}>
                      Kelas {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedClass && (
                <div className="text-sm text-muted-foreground">
                  {filteredStudents.length} siswa
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Table */}
        {selectedClass && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Absensi Kelas {selectedClass}</CardTitle>
                  <CardDescription>
                    Pilih status kehadiran untuk setiap siswa
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
                    <TableHead>NIS</TableHead>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead className="w-96">Status Kehadiran</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.nis}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          value={attendanceData[student.id] || ""}
                          onValueChange={(value) => handleAttendanceChange(student.id, value as AttendanceStatus)}
                          className="flex space-x-6"
                        >
                          {(['hadir', 'izin', 'sakit', 'alfa'] as AttendanceStatus[]).map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <RadioGroupItem value={status} id={`${student.id}-${status}`} />
                              <Label 
                                htmlFor={`${student.id}-${status}`} 
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
        )}

        {/* Summary */}
        {selectedClass && Object.keys(attendanceData).length > 0 && (
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

export default Attendance;