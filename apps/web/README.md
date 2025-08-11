# Vehicle Tracking System - Frontend Web

Sistema completo de rastreamento veicular em tempo real construído com Next.js 14, React 18, TypeScript e Tailwind CSS.

## 📋 Características

### ✅ Funcionalidades Implementadas

- **🔐 Autenticação Completa**
  - Login com email/senha
  - Persistência de sessão
  - Logout seguro
  - Redirecionamento automático

- **📊 Dashboard Interativo**
  - Estatísticas em tempo real
  - Mapa com posição dos veículos
  - Lista de alertas ativos
  - Gráficos de atividade
  - Cards de resumo

- **🚗 Gerenciamento de Veículos**
  - Lista completa de veículos
  - Visualização em grid/lista
  - Filtros avançados
  - Detalhes completos
  - Status em tempo real

- **🗺️ Mapa Interativo**
  - Leaflet integrado
  - Marcadores customizados
  - Popups informativos
  - Rotas e histórico
  - Cercas virtuais

- **🚨 Sistema de Alertas**
  - Alertas em tempo real
  - Diferentes níveis de severidade
  - Notificações push
  - Histórico completo

- **📱 Design Responsivo**
  - Mobile-first approach
  - Sidebar adaptativa
  - Layout otimizado
  - Touch-friendly

- **🎨 Interface Moderna**
  - Design system consistente
  - Modo escuro/claro
  - Animações suaves
  - Loading states

### 🛠️ Tecnologias Utilizadas

#### Core Framework
- **Next.js 14** - App Router, Server Components
- **React 18** - Hooks, Context API
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

#### UI Components
- **Radix UI** - Primitives acessíveis
- **Lucide React** - Ícones modernos
- **shadcn/ui** - Component library
- **Class Variance Authority** - Variants

#### Estado e Dados
- **Zustand** - Estado global
- **TanStack Query** - Data fetching
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

#### Mapa e Visualização
- **Leaflet** - Mapas interativos
- **React Leaflet** - Integração React
- **Recharts** - Gráficos e charts

#### Tempo Real
- **Socket.io Client** - WebSocket connection
- **React Hot Toast** - Notificações

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js 18+
- npm 8+

### Instalação

```bash
# 1. Navegue até o diretório
cd D:\rastreamento\vehicle-tracking-superclaude\apps\web

# 2. Instale as dependências
npm install

# 3. Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor produção
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
```

### Credenciais de Teste

Para testar o sistema, use:
- **Email:** `admin@tracking.com`
- **Senha:** `admin123`

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rotas autenticadas
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── vehicles/      # Gerenciamento veículos
│   │   ├── alerts/        # Sistema alertas
│   │   ├── reports/       # Relatórios
│   │   └── settings/      # Configurações
│   ├── login/             # Página de login
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx          # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── layout/           # Layout components
│   ├── map/              # Componentes mapa
│   ├── vehicles/         # Componentes veículos
│   ├── dashboard/        # Componentes dashboard
│   └── providers/        # Context providers
├── lib/                  # Utilitários
├── store/                # Estado global (Zustand)
└── types/                # Tipos TypeScript
```

## 🎯 Telas Principais

### 1. Login (/login)
- Formulário moderno com validação
- Credenciais de demo
- Modo escuro/claro
- Design responsivo

### 2. Dashboard (/dashboard)
- Mapa em tempo real
- Cards de estatísticas
- Lista de alertas
- Gráfico de atividade
- Lista de veículos

### 3. Veículos (/vehicles)
- Grid/Lista de veículos
- Filtros avançados
- Busca em tempo real
- Status colorido
- Ações rápidas

### 4. Detalhes do Veículo (/vehicles/[id])
- Informações completas
- Mapa com posição
- Histórico de rotas
- Métricas detalhadas
- Comandos remotos

## 🗺️ Componentes do Mapa

### MapView
Componente principal do mapa com:
- Integração Leaflet
- Marcadores de veículos
- Popups informativos
- Controles de zoom
- Modo seguir veículo

### VehicleMarker
Marcadores customizados com:
- Cores por status
- Direção do movimento
- Animação para movimento
- Click para detalhes

### RoutePolyline
Rotas dos veículos com:
- Histórico de posições
- Estatísticas da rota
- Cores customizáveis
- Popups informativos

## 🚨 Sistema de Alertas

Tipos de alertas implementados:
- Excesso de velocidade
- Entrada/Saída de área
- Dispositivo offline
- Bateria baixa
- Botão de pânico
- Motor ligado/desligado

## 📊 Gráficos e Métricas

### ActivityChart
Gráfico de atividade com:
- Dados em tempo real
- Múltiplos formatos (linha, área, barra)
- Estatísticas resumidas
- Período configurável

### StatsCard
Cards de estatísticas com:
- Valores em tempo real
- Indicadores de tendência
- Ícones temáticos
- Cores por status

## 🎨 Design System

### Cores
- **Primary:** #e11d48 (Pink 600)
- **Secondary:** #f1f5f9 (Slate 100)
- **Success:** #22c55e (Green 500)
- **Warning:** #f59e0b (Amber 500)
- **Error:** #ef4444 (Red 500)

### Tipografia
- **Fonte:** Inter (variável)
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

### Espaçamento
- **Base:** 4px (0.25rem)
- **Escala:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

## 📱 Responsividade

### Breakpoints
- **sm:** 640px+ (Mobile landscape)
- **md:** 768px+ (Tablet)
- **lg:** 1024px+ (Desktop)
- **xl:** 1280px+ (Large desktop)

### Layout Mobile
- Menu hamburguer
- Stack vertical
- Cards full-width
- Touch-friendly

## 🔧 Configuração

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Temas
- Sistema automático
- Modo claro
- Modo escuro
- Persistência local

## 📦 Build e Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor produção
npm run start

# Análise do bundle
npm run analyze
```

## 🤝 Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `src/app/layout.tsx` | Layout principal com providers |
| `src/app/(auth)/layout.tsx` | Layout autenticado com sidebar |
| `src/components/map/map-view.tsx` | Componente principal do mapa |
| `src/store/auth.ts` | Estado de autenticação |
| `src/store/vehicles.ts` | Estado dos veículos |
| `src/types/index.ts` | Interfaces TypeScript |

## 🔮 Próximas Funcionalidades

- Página de alertas completa
- Sistema de relatórios
- Configurações de usuário
- Cercas virtuais
- Comandos remotos
- Notificações push
- Modo offline
- PWA

---

**Desenvolvido com ❤️ usando Next.js 14 e React 18**
