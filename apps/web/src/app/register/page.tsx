'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { 
  Eye, 
  EyeOff, 
  Truck, 
  Loader2, 
  Users,
  Lock,
  Mail,
  Phone,
  Car,
  ArrowLeft,
  Check,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import BackgroundSlider from '@/components/login/BackgroundSlider';

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido').regex(/^[0-9()\s-]+$/, 'Formato de telefone inválido'),
  vehicleType: z.enum(['uber', 'personal']),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      vehicleType: 'personal',
      terms: false,
    },
  });

  const watchVehicleType = watch('vehicleType');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      // Simular chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registro:', data);
      
      // Redirecionar para login após registro bem-sucedido
      router.push('/login?registered=true');
    } catch (error) {
      console.error('Erro no registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: <Check className="h-4 w-4 text-green-400" />, text: "Bloqueio e desbloqueio pelo app" },
    { icon: <Check className="h-4 w-4 text-green-400" />, text: "Rastreamento GPS em tempo real" },
    { icon: <Check className="h-4 w-4 text-green-400" />, text: "Assistência 24h inclusa" },
    { icon: <Check className="h-4 w-4 text-green-400" />, text: "Sem taxa de instalação" },
    { icon: <Check className="h-4 w-4 text-green-400" />, text: "Cancele quando quiser" },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Professional Background with Image Slider */}
      <BackgroundSlider />

      {/* Main Content */}
      <div className="relative z-10 w-full flex justify-center items-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Back to Login */}
          <Link
            href="/login"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Link>

          {/* Logo and Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl shadow-2xl">
                  <Truck className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Criar Conta</h1>
                <p className="text-sm text-slate-300">Proteção completa para seu veículo</p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="mb-6 p-4 bg-white/5 backdrop-blur rounded-xl border border-white/10">
            <div className="space-y-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  {benefit.icon}
                  <span className="text-sm text-slate-200">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Card */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-white">Informações da Conta</CardTitle>
              <CardDescription className="text-slate-300">
                Preencha os dados para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Nome Completo */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-200">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="João Silva"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all duration-200 pr-10"
                      disabled={isLoading}
                      {...register('name')}
                    />
                    <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-200">
                    E-mail
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
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-200">
                    Telefone/WhatsApp
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all duration-200 pr-10"
                      disabled={isLoading}
                      {...register('phone')}
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-400">{errors.phone.message}</p>
                  )}
                </div>

                {/* Tipo de Veículo */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Tipo de Uso
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="uber"
                        {...register('vehicleType')}
                        className="sr-only peer"
                      />
                      <div className="p-4 text-center rounded-lg bg-white/5 border border-white/20 peer-checked:bg-green-600/20 peer-checked:border-green-500 transition-all">
                        <Car className="h-6 w-6 text-white mx-auto mb-2" />
                        <span className="text-sm text-white font-semibold">Uber/99</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="personal"
                        {...register('vehicleType')}
                        className="sr-only peer"
                      />
                      <div className="p-4 text-center rounded-lg bg-white/5 border border-white/20 peer-checked:bg-green-600/20 peer-checked:border-green-500 transition-all">
                        <Users className="h-6 w-6 text-white mx-auto mb-2" />
                        <span className="text-sm text-white font-semibold">Pessoal</span>
                      </div>
                    </label>
                  </div>
                </div>


                {/* Senha */}
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

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-200">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 transition-all duration-200 pr-10"
                      disabled={isLoading}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Termos */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-white/20 bg-white/10 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                      {...register('terms')}
                    />
                    <span className="text-sm text-slate-300">
                      Aceito os{' '}
                      <Link href="/terms" className="text-green-400 hover:text-green-300 underline">
                        termos de uso
                      </Link>
                      {' '}e a{' '}
                      <Link href="/privacy" className="text-green-400 hover:text-green-300 underline">
                        política de privacidade
                      </Link>
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-400">{errors.terms.message}</p>
                  )}
                </div>

                {/* Preços especiais para Uber */}
                {watchVehicleType === 'uber' && (
                  <div className="p-3 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-lg border border-orange-500/30">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-300">
                          Desconto Especial para Motoristas de Aplicativo!
                        </p>
                        <p className="text-xs text-orange-200 mt-1">
                          Planos a partir de R$ 24,90/mês com assistência completa
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Criar Conta Grátis
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-300 mt-4">
                  Já tem uma conta?{' '}
                  <Link href="/login" className="text-green-400 hover:text-green-300 font-semibold">
                    Fazer login
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Trust Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              🔒 Seus dados estão seguros com criptografia de ponta a ponta
            </p>
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