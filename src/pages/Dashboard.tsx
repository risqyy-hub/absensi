import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/charts/PieChart";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { getTodayStats, mockStudents } from "@/lib/mockData";
import { AttendanceStats } from "@/types";

const Dashboard = () => {
  const [stats, setStats] = useState<AttendanceStats>({ hadir: 0, izin: 0, sakit: 0, alfa: 0 });

  useEffect(() => {
    setStats(getTodayStats());
  }, []);

  const total = stats.hadir + stats.izin + stats.sakit + stats.alfa;
  const totalStudents = mockStudents.length;

  const statCards = [
    {
      title: "Total Siswa",
      value: totalStudents,
      icon: Users,
      description: "Jumlah seluruh siswa",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Hadir",
      value: stats.hadir,
      icon: UserCheck,
      description: "Siswa hadir hari ini",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Tidak Hadir",
      value: stats.izin + stats.sakit + stats.alfa,
      icon: UserX,
      description: "Siswa tidak hadir",
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
    {
      title: "Belum Absen",
      value: totalStudents - total,
      icon: Clock,
      description: "Belum melakukan absensi",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di sistem absensi MA NURUSSIDIQ
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Absensi Hari Ini</CardTitle>
              <CardDescription>
                Grafik distribusi kehadiran siswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {total > 0 ? (
                <PieChart data={stats} />
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Belum ada data absensi hari ini
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Sekolah</CardTitle>
              <CardDescription>
                Data umum sekolah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Siswa</span>
                <span className="font-medium">{totalStudents} orang</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Jumlah Kelas</span>
                <span className="font-medium">6 kelas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tahun Ajaran</span>
                <span className="font-medium">2023/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Semester</span>
                <span className="font-medium">Ganjil</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;