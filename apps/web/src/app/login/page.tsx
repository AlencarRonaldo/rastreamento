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
import { Eye, EyeOff, Truck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

  const remember = watch('remember');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password, data.remember);
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(error || 'Erro no login');
    }
  };

  const handleDemoLogin = () => {
    setValue('email', 'admin@tracking.com');
    setValue('password', 'admin123');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Redirecionando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center bg-primary rounded-full">
              <Truck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">
              Vehicle Tracking
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sistema de rastreamento veicular em tempo real
            </p>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Entrar</CardTitle>
              <CardDescription className="text-center">
                Digite suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="admin@tracking.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div className="relative">
                  <Input
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="remember-checkbox" className="flex items-center space-x-2 text-sm">
                    <input
                      id="remember-checkbox"
                      type="checkbox"
                      className="rounded border-gray-300"
                      {...register('remember')}
                    />
                    <span>Lembrar de mim</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueci a senha
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Entrar
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
              >
                Usar dados de demonstração
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                <p>Credenciais de teste:</p>
                <p>Email: admin@tracking.com</p>
                <p>Senha: admin123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Image/Gradient */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl" />
          <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Monitore sua frota em tempo real
              </h2>
              <div className="space-y-4 text-primary-foreground/90">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Localização GPS precisa em tempo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Alertas automáticos e notificações</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Relatórios detalhados de atividade</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  <span>Interface intuitiva e responsiva</span>
                </div>
              </div>
            </div>
            <div className="mt-8 text-sm opacity-75">
              Desenvolvido com tecnologias modernas para máxima confiabilidade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}