import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockStudents } from "@/lib/mockData";
import { Users } from "lucide-react";

const Students = () => {
  const studentsByClass = mockStudents.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = [];
    }
    acc[student.class].push(student);
    return acc;
  }, {} as Record<string, typeof mockStudents>);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Siswa</h1>
            <p className="text-muted-foreground">
              Daftar seluruh siswa MA NURUSSIDIQ
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {Object.entries(studentsByClass).map(([className, students]) => (
            <Card key={className}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Kelas {className}</CardTitle>
                    <CardDescription>
                      {students.length} siswa
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {students.length} siswa
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>NIS</TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Kelas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{student.nis}</TableCell>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.class}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan</CardTitle>
            <CardDescription>
              Statistik keseluruhan data siswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {mockStudents.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Siswa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Object.keys(studentsByClass).length}
                </div>
                <div className="text-sm text-muted-foreground">Jumlah Kelas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round(mockStudents.length / Object.keys(studentsByClass).length)}
                </div>
                <div className="text-sm text-muted-foreground">Rata-rata per Kelas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Students;