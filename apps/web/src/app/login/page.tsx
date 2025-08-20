'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth';
import { LoginForm } from '@/types';
import { 
  Eye, 
  EyeOff, 
  Truck, 
  Loader2, 
  MapPin, 
  Shield, 
  Zap, 
  Clock,
  Wrench,
  CreditCard,
  Phone,
  CheckCircle,
  Users,
  BarChart3,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import BackgroundSlider from '@/components/login/BackgroundSlider';
import ServiceStats from '@/components/login/ServiceStats';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password, data.remember);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'demo@example.com');
    setValue('password', 'operator');
    toast.success('Credenciais de demonstração preenchidas!');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Professional Background with Image Slider */}
      <BackgroundSlider />

      {/* Main Content */}
      <div className="relative z-10 w-full flex">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
          <div className="w-full max-w-md mx-auto">
            {/* Logo and Brand */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-2xl">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Vehicle Tracking</h1>
                  <p className="text-sm text-slate-300">Sistema Profissional de Rastreamento</p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-white">Acessar Sistema</CardTitle>
                <CardDescription className="text-slate-300">
                  Entre com suas credenciais para acessar o painel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-200">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all duration-200 pr-10"
                        disabled={isLoading}
                        {...register('email')}
                      />
                      <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-200">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all duration-200 pr-10"
                        disabled={isLoading}
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        {...register('remember')}
                      />
                      <span className="text-sm text-slate-300">Lembrar-me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Entrar no Sistema
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-slate-900/50 px-2 text-slate-400">ou</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
                    onClick={fillDemoCredentials}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Acessar Demonstração
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-center gap-6 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="text-sm">SSL Seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">24/7 Suporte</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-xs">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-xs">LGPD Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-yellow-400" />
                <span className="text-xs">Criptografia AES-256</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Features Showcase */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12 xl:px-16">
          <div className="max-w-2xl">
            {/* Statistics */}
            <ServiceStats />

            {/* Main heading */}
            <div className="mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Controle Total da<br />Sua Frota
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Tecnologia avançada para monitoramento em tempo real, 
                gestão eficiente e máxima segurança dos seus veículos.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex-shrink-0 p-3 bg-blue-600/20 rounded-xl group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Rastreamento GPS em Tempo Real</h3>
                  <p className="text-sm text-slate-300">Localização precisa com atualização a cada 10 segundos</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex-shrink-0 p-3 bg-emerald-600/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Alertas Inteligentes</h3>
                  <p className="text-sm text-slate-300">Notificações automáticas via SMS, E-mail e Push</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex-shrink-0 p-3 bg-violet-600/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Segurança Avançada</h3>
                  <p className="text-sm text-slate-300">Bloqueio remoto e cerca eletrônica geográfica</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex-shrink-0 p-3 bg-orange-600/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Wrench className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Assistência 24 Horas</h3>
                  <p className="text-sm text-slate-300">Guincho, mecânico e suporte emergencial</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 backdrop-blur border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Precisa de ajuda?</h4>
                  <p className="text-sm text-slate-300">Nossa equipe está pronta para atender</p>
                </div>
                <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-lg">
                  <Phone className="h-4 w-4" />
                  <span className="font-semibold">0800 123 4567</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}