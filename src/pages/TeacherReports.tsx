import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, Calendar as CalendarIcon, GraduationCap } from "lucide-react";
import { getTeacherMonthlyStats, getStoredTeacherAttendance, mockTeachers, getTeacherAttendanceByDate, generateSampleTeacherAttendance } from "@/lib/mockData";
import { TeacherAttendanceRecord, AttendanceStatus, AttendanceStats } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TeacherReports = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyStats, setDailyStats] = useState<AttendanceStats>({ hadir: 0, izin: 0, sakit: 0, alfa: 0 });

  useEffect(() => {
    generateSampleTeacherAttendance(); // Generate sample data if none exists
    setMonthlyData(getTeacherMonthlyStats());
    generateReportData();
    updateDailyStats();
  }, [selectedDate]);

  const updateDailyStats = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const stats = getTeacherAttendanceByDate(dateStr);
    setDailyStats(stats);
  };

  const generateReportData = () => {
    const records = getStoredTeacherAttendance();

    const reportRows = mockTeachers.map(teacher => {
      const teacherRecords = records.filter(r => r.teacherId === teacher.id);
      
      const stats = {
        hadir: teacherRecords.filter(r => r.status === 'hadir').length,
        izin: teacherRecords.filter(r => r.status === 'izin').length,
        sakit: teacherRecords.filter(r => r.status === 'sakit').length,
        alfa: teacherRecords.filter(r => r.status === 'alfa').length,
      };

      const total = stats.hadir + stats.izin + stats.sakit + stats.alfa;
      const percentage = total > 0 ? Math.round((stats.hadir / total) * 100) : 0;

      return {
        teacher,
        ...stats,
        total,
        percentage
      };
    });

    setReportData(reportRows);
  };

  const getStatusBadge = (status: AttendanceStatus, count: number) => {
    if (count === 0) return null;
    
    const variants = {
      hadir: "bg-success text-success-foreground",
      izin: "bg-warning text-warning-foreground", 
      sakit: "bg-orange-500 text-white",
      alfa: "bg-danger text-danger-foreground"
    };

    return (
      <Badge className={variants[status]}>
        {count}
      </Badge>
    );
  };

  const handleExportExcel = () => {
    toast.success("Fitur export Excel akan segera tersedia!");
  };

  const handleExportPDF = () => {
    toast.success("Fitur export PDF akan segera tersedia!");
  };

  const getAttendancePercentage = (percentage: number) => {
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-warning"; 
    return "text-danger";
  };

  const getTeacherByDate = () => {
    const records = getStoredTeacherAttendance();
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayRecords = records.filter(r => r.date === dateStr);
    
    return mockTeachers.map(teacher => {
      const record = dayRecords.find(r => r.teacherId === teacher.id);
      return {
        teacher,
        status: record?.status || null
      };
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Laporan Absensi Guru</h1>
              <p className="text-muted-foreground">
                Laporan dan analisis kehadiran guru
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Date Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Pilih Tanggal</span>
            </CardTitle>
            <CardDescription>
              Pilih tanggal untuk melihat absensi guru pada hari tersebut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-60 justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pilih tanggal</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Harian - {format(selectedDate, "PPP")}</CardTitle>
              <CardDescription>
                Ringkasan kehadiran guru pada tanggal yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart data={dailyStats} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detail Absensi Harian</CardTitle>
              <CardDescription>
                Daftar guru dan status kehadiran pada {format(selectedDate, "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Guru</TableHead>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTeacherByDate().map((row) => (
                    <TableRow key={row.teacher.id}>
                      <TableCell className="font-medium">
                        {row.teacher.name}
                      </TableCell>
                      <TableCell>{row.teacher.subject}</TableCell>
                      <TableCell className="text-center">
                        {row.status ? (
                          getStatusBadge(row.status, 1)
                        ) : (
                          <Badge variant="outline">Belum dicatat</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Absensi Mingguan</CardTitle>
            <CardDescription>
              Tren kehadiran guru dalam 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlyData} />
          </CardContent>
        </Card>

        {/* Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rekap Absensi Guru</CardTitle>
            <CardDescription>
              Data kehadiran keseluruhan guru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead className="text-center">Hadir</TableHead>
                  <TableHead className="text-center">Izin</TableHead>
                  <TableHead className="text-center">Sakit</TableHead>
                  <TableHead className="text-center">Alfa</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Persentase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map((row, index) => (
                    <TableRow key={row.teacher.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.teacher.nip}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.teacher.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.teacher.subject}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge("hadir", row.hadir)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge("izin", row.izin)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge("sakit", row.sakit)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge("alfa", row.alfa)}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {row.total}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`font-medium ${getAttendancePercentage(row.percentage)}`}>
                          {row.percentage}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Belum ada data absensi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockTeachers.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Seluruh guru
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kehadiran Rata-rata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {reportData.length > 0 
                  ? Math.round(reportData.reduce((sum, row) => sum + row.percentage, 0) / reportData.length)
                  : 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                Persentase kehadiran
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guru Aktif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {reportData.filter(row => row.percentage >= 80).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Kehadiran ≥ 80%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherReports;