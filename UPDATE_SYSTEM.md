# 🚀 Sistema de Atualização - Rastreador Veicular

Este documento descreve o sistema completo de atualização implementado para o aplicativo de rastreamento veicular multiplataforma.

## 📋 Visão Geral

O sistema de atualização suporta:
- **Versionamento Semântico** automático
- **Updates OTA** para aplicativo mobile (React Native/Expo)
- **Service Workers** para atualizações PWA
- **CI/CD** completo com GitHub Actions
- **Rollback** automático e manual
- **Notificações** in-app para usuários

## 🏗️ Arquitetura

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   VERSION.json  │  │ package.json    │  │  app.json       │
│   (Central)     │  │ (Web/Mobile)    │  │  (Expo)         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                     │                     │
         └─────────────────────┼─────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Web Updates    │  │ Mobile Updates  │  │   CI/CD         │
│  Service Worker │  │ Expo Updates    │  │ GitHub Actions  │
│  PWA Manifest   │  │ CodePush Alt.   │  │ Auto Deploy     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 📦 Componentes

### 1. Controle de Versão

**`VERSION.json`** - Arquivo central de versionamento:
```json
{
  "version": "1.0.0",
  "buildNumber": 1,
  "platforms": {
    "mobile": { "version": "1.0.0", "buildNumber": 1 },
    "web": { "version": "1.0.0", "buildNumber": 1 },
    "backend": { "version": "1.0.0", "apiVersion": "v1" }
  },
  "updatePolicy": {
    "autoUpdate": true,
    "forceUpdate": false,
    "checkInterval": 3600000
  }
}
```

**Scripts de Versionamento:**
- `scripts/version.js` - Gerenciador de versões
- `scripts/update-manager.js` - Gerenciador de atualizações
- `scripts/post-update.js` - Scripts pós-atualização
- `scripts/post-rollback.js` - Scripts pós-rollback

### 2. Updates Mobile (React Native/Expo)

**Expo Updates (OTA):**
- Configurado via `eas.json`
- Canais: development, preview, production
- Updates automáticos via `expo-updates`

**Serviços:**
- `updateService.ts` - Serviço principal de updates
- `UpdateBanner.tsx` - Banner de notificação
- `UpdateModal.tsx` - Modal de atualização
- `useUpdate.ts` - Hook personalizado

### 3. Updates Web (PWA)

**Service Worker:**
- Cache inteligente com estratégias diferenciadas
- Auto-atualização com notificação ao usuário
- Offline-first approach

**Componentes:**
- `updateService.ts` - Serviço web de updates
- `UpdateNotification.tsx` - Componente de notificação
- `UpdateProvider.tsx` - Context provider
- `manifest.json` - Manifest PWA com versionamento

### 4. CI/CD com GitHub Actions

**Workflows:**
- `ci.yml` - Integração contínua
- `deploy-web.yml` - Deploy do web app
- `deploy-mobile.yml` - Deploy do mobile app
- `release.yml` - Gerenciamento de releases
- `semantic-release.yml` - Release automático

### 5. Semantic Release

**Configuração (`.releaserc.json`):**
- Conventional Commits
- Geração automática de changelog
- Tags e releases do GitHub
- Versionamento automático

## 🚀 Como Usar

### Comandos Disponíveis

```bash
# Verificar atualizações
npm run update:check

# Instalar atualizações
npm run update:install

# Fazer rollback
npm run update:rollback

# Criar backup manual
npm run update:backup

# Informações do sistema
npm run update:info

# Versioning
npm run version:bump [major|minor|patch]
npm run version:current
npm run version:notes
npm run version:validate

# Release
npm run release:prepare
npm run release:semantic
```

### Fluxo de Desenvolvimento

#### 1. Desenvolvimento Normal
```bash
# Fazer alterações no código
git add .
git commit -m "feat: add new vehicle tracking feature"
git push origin develop
```

#### 2. Release Manual
```bash
# Preparar release
npm run release:prepare

# Fazer bump de versão
npm run version:bump minor

# Commit e push
git add .
git commit -m "chore: bump version to 1.1.0"
git push origin main
```

#### 3. Release Automático (Recomendado)
```bash
# Usar conventional commits
git commit -m "feat: add real-time notifications"
git push origin main

# O semantic-release irá:
# 1. Analisar commits desde última release
# 2. Determinar o tipo de release (major/minor/patch)
# 3. Gerar changelog
# 4. Criar tag e release
# 5. Disparar deployments automáticos
```

### Force Updates

Para ativar atualizações obrigatórias:

```bash
# Ativar force update para versão específica
node scripts/version.js force-update true 1.2.0

# Desativar force update
node scripts/version.js force-update false
```

### Rollback de Emergência

```bash
# Rollback automático para versão anterior
npm run update:rollback

# Rollback manual para backup específico
node scripts/update-manager.js list-backups
node scripts/update-manager.js restore <backup-name>
```

## 📱 Updates Mobile

### Configuração Expo

1. Configure o projeto no Expo:
```bash
cd apps/mobile
eas init
eas build:configure
```

2. Configure os canais de update:
```bash
# Publicar update de desenvolvimento
eas update --branch development --message "Development update"

# Publicar update de produção
eas update --branch production --message "Production update"
```

### Uso no App

```typescript
import { useUpdate } from '../hooks/useUpdate';
import UpdateBanner from '../components/UpdateBanner';

function App() {
  const { updateInfo, checkForUpdates } = useUpdate();

  useEffect(() => {
    // Verificar updates na inicialização
    checkForUpdates();
  }, []);

  return (
    <View>
      {updateInfo && <UpdateBanner />}
      {/* Resto do app */}
    </View>
  );
}
```

## 🌐 Updates Web

### Service Worker

O service worker é automaticamente registrado e gerencia:
- Cache de assets estáticos
- Updates automáticos
- Offline functionality

### Uso no App

```typescript
import { UpdateProvider } from '@/components/UpdateProvider';
import UpdateNotification from '@/components/UpdateNotification';

function App({ children }: { children: ReactNode }) {
  return (
    <UpdateProvider autoCheck={true} checkInterval={30 * 60 * 1000}>
      {children}
      <UpdateNotification />
    </UpdateProvider>
  );
}
```

## 🔧 Configuração do Ambiente

### Variáveis de Ambiente

```env
# GitHub Actions
GITHUB_TOKEN=<your-github-token>
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>

# Expo
EXPO_USERNAME=<your-expo-username>
EXPO_PASSWORD=<your-expo-password>

# Notifications
SLACK_WEBHOOK_URL=<your-slack-webhook>
DISCORD_WEBHOOK_URL=<your-discord-webhook>
SLACK_RELEASE_WEBHOOK=<your-slack-release-webhook>
DISCORD_RELEASE_WEBHOOK=<your-discord-release-webhook>
```

### Secrets do GitHub

Configure estes secrets no repositório:

- `GITHUB_TOKEN` - Token para releases
- `VERCEL_TOKEN` - Deploy do web app
- `VERCEL_ORG_ID` - ID da organização Vercel
- `VERCEL_PROJECT_ID` - ID do projeto Vercel
- `EXPO_USERNAME` - Username do Expo
- `EXPO_PASSWORD` - Senha do Expo
- `SLACK_WEBHOOK_URL` - Webhook do Slack
- `DISCORD_WEBHOOK_URL` - Webhook do Discord

## 📊 Monitoramento

### Logs de Atualização

Os logs são mantidos em:
- `update.log` - Updates bem-sucedidos
- `rollback.log` - Rollbacks
- `critical-events.log` - Eventos críticos

### Health Checks

Endpoint de saúde disponível em: `/health.json`

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "updated": "2024-12-10T10:00:00Z"
}
```

### Métricas

- Taxa de adoção de updates mobile
- Tempo de carregamento do web app
- Taxa de erro pós-update
- Tempo de rollback

## 🔒 Segurança

### Validações de Integridade

- Verificação de checksum dos arquivos
- Validação de assinaturas digitais
- Testes automáticos pós-update

### Políticas de Rollback

- Rollback automático em caso de falha
- Threshold de erro configurável
- Backup automático antes de updates

## 📚 Troubleshooting

### Problemas Comuns

1. **Update não aparece no mobile:**
   - Verificar se o canal está correto
   - Verificar se o app está em produção
   - Limpar cache: `expo r -c`

2. **Web app não atualiza:**
   - Forçar reload: Ctrl+Shift+R
   - Limpar service worker cache
   - Verificar se o service worker está registrado

3. **Versões inconsistentes:**
   - Executar: `npm run version:validate`
   - Verificar se todos os package.json estão alinhados

### Debug

```bash
# Verificar status do sistema
npm run update:info

# Validar configuração
npm run version:validate

# Listar backups
node scripts/update-manager.js list-backups

# Logs detalhados
tail -f update.log
tail -f rollback.log
```

## 🎯 Roadmap

- [ ] Rollback granular por plataforma
- [ ] A/B testing para updates
- [ ] Métricas avançadas de adoção
- [ ] Update differential (delta updates)
- [ ] Suporte a múltiplos ambientes
- [ ] Dashboard de monitoramento

---

Para mais informações, consulte a documentação individual de cada componente ou abra uma issue no repositório.