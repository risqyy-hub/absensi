import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import schoolBackground from "@/assets/school-background.jpg";
import schoolLogo from "@/assets/school-logo.png";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        const user = {
          username: "admin",
          name: "Administrator",
          role: "admin" as const
        };
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("Login berhasil! Selamat datang di sistem absensi.");
        navigate("/dashboard");
      } else {
        toast.error("Username atau password salah!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${schoolBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
      
      {/* Login card */}
      <Card className="w-full max-w-md mx-4 relative z-10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <img src={schoolLogo} alt="Logo Sekolah" className="w-12 h-12" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">MA NURUSSIDIQ</CardTitle>
            <CardDescription className="text-base mt-2">
              Sistem Absensi Digital
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Demo: username: <strong>admin</strong>, password: <strong>admin123</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
