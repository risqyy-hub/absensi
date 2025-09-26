import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockTeachers } from "@/lib/mockData";
import { GraduationCap } from "lucide-react";

const Teachers = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Guru</h1>
            <p className="text-muted-foreground">
              Daftar seluruh guru SMA Negeri 1 Jakarta
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Guru</CardTitle>
            <CardDescription>
              Total {mockTeachers.length} guru terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Status</TableHead>
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
                      <Badge variant="secondary">
                        {teacher.subject}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-success text-success-foreground">
                        Aktif
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {mockTeachers.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Guru aktif
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Set(mockTeachers.map(t => t.subject)).size}
              </div>
              <p className="text-sm text-muted-foreground">
                Mata pelajaran berbeda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Rasio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                1:25
              </div>
              <p className="text-sm text-muted-foreground">
                Guru : Siswa
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Mata Pelajaran</CardTitle>
            <CardDescription>
              Jumlah guru per mata pelajaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                mockTeachers.reduce((acc, teacher) => {
                  acc[teacher.subject] = (acc[teacher.subject] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{subject}</span>
                  <Badge variant="outline">{count} guru</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Teachers;