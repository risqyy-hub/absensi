import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts/BarChart";
import { FileText, Download, Filter } from "lucide-react";
import { getMonthlyStats, getStoredAttendance, mockStudents, classes } from "@/lib/mockData";
import { AttendanceRecord, AttendanceStatus } from "@/types";
import { toast } from "sonner";

const Reports = () => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [reportData, setReportData] = useState<any[]>([]);

  useEffect(() => {
    setMonthlyData(getMonthlyStats());
    generateReportData();
  }, [selectedClass]);

  const generateReportData = () => {
    const records = getStoredAttendance();
    const students = selectedClass === "all" 
      ? mockStudents 
      : mockStudents.filter(s => s.class === selectedClass);

    const reportRows = students.map(student => {
      const studentRecords = records.filter(r => r.studentId === student.id);
      
      const stats = {
        hadir: studentRecords.filter(r => r.status === 'hadir').length,
        izin: studentRecords.filter(r => r.status === 'izin').length,
        sakit: studentRecords.filter(r => r.status === 'sakit').length,
        alfa: studentRecords.filter(r => r.status === 'alfa').length,
      };

      const total = stats.hadir + stats.izin + stats.sakit + stats.alfa;
      const percentage = total > 0 ? Math.round((stats.hadir / total) * 100) : 0;

      return {
        student,
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

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Laporan Absensi</h1>
              <p className="text-muted-foreground">
                Laporan dan analisis kehadiran siswa
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

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Laporan</span>
            </CardTitle>
            <CardDescription>
              Pilih kelas untuk melihat laporan spesifik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classes.map((className) => (
                  <SelectItem key={className} value={className}>
                    Kelas {className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grafik Absensi Mingguan</CardTitle>
            <CardDescription>
              Tren kehadiran siswa dalam 7 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlyData} />
          </CardContent>
        </Card>

        {/* Report Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rekap Absensi Siswa</CardTitle>
            <CardDescription>
              {selectedClass === "all" ? "Seluruh siswa" : `Kelas ${selectedClass}`} - 
              Data kehadiran keseluruhan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>NIS</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
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
                    <TableRow key={row.student.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.student.nis}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.student.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.student.class}</Badge>
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
              <CardTitle>Total Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {selectedClass === "all" ? mockStudents.length : mockStudents.filter(s => s.class === selectedClass).length}
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedClass === "all" ? "Seluruh siswa" : `Kelas ${selectedClass}`}
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
              <CardTitle>Siswa Aktif</CardTitle>
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

export default Reports;