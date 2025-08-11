#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de pós-rollback
 * Executado após cada rollback bem-sucedido
 */

class PostRollbackProcessor {
  constructor() {
    this.rootPath = path.resolve(__dirname, '..');
    this.logFile = path.join(this.rootPath, 'rollback.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  async run() {
    this.log('🔄 Starting post-rollback processing...');

    try {
      await this.reinstallDependencies();
      await this.rollbackDatabase();
      await this.updateExpoConfig();
      await this.clearCaches();
      await this.validateRollback();
      await this.notifyServices();
      
      this.log('✅ Post-rollback processing completed successfully');
    } catch (error) {
      this.log(`❌ Post-rollback processing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reinstala dependências após rollback
   */
  async reinstallDependencies() {
    this.log('📦 Reinstalling dependencies after rollback...');

    try {
      // Reinstalar dependências principais
      this.log('Reinstalling root dependencies...');
      execSync('npm install', { cwd: this.rootPath, stdio: 'pipe' });

      // Reinstalar dependências do web app
      const webPath = path.join(this.rootPath, 'apps', 'web');
      if (fs.existsSync(path.join(webPath, 'package.json'))) {
        this.log('Reinstalling web app dependencies...');
        execSync('npm install', { cwd: webPath, stdio: 'pipe' });
      }

      // Reinstalar dependências do mobile app
      const mobilePath = path.join(this.rootPath, 'apps', 'mobile');
      if (fs.existsSync(path.join(mobilePath, 'package.json'))) {
        this.log('Reinstalling mobile app dependencies...');
        execSync('npm install', { cwd: mobilePath, stdio: 'pipe' });
      }

      this.log('✅ Dependencies reinstalled successfully');
    } catch (error) {
      this.log(`❌ Dependencies reinstallation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reverte migrações do banco de dados se necessário
   */
  async rollbackDatabase() {
    this.log('🗄️ Checking database rollback requirements...');

    try {
      const backendPath = path.join(this.rootPath, 'apps', 'backend');
      
      if (fs.existsSync(path.join(backendPath, 'pom.xml'))) {
        // Backend Java - verificar se há migrações para reverter
        this.log('Checking for database rollback requirements...');
        
        // Por segurança, apenas log uma mensagem
        // Rollbacks de database devem ser feitos manualmente em produção
        this.log('⚠️ Database rollback may be required. Please check manually.');
        
        // Se houver scripts de rollback específicos, executá-los aqui
        const rollbackScript = path.join(backendPath, 'scripts', 'rollback-db.sh');
        if (fs.existsSync(rollbackScript)) {
          this.log('Running database rollback script...');
          execSync(`bash "${rollbackScript}"`, { cwd: backendPath, stdio: 'pipe' });
        }
      }

      this.log('✅ Database rollback check completed');
    } catch (error) {
      this.log(`⚠️ Database rollback check failed: ${error.message}`);
      // Não falhar o processo - rollbacks de DB são críticos e devem ser manuais
    }
  }

  /**
   * Atualiza configuração do Expo para versão anterior
   */
  async updateExpoConfig() {
    this.log('📱 Updating Expo configuration for rollback...');

    try {
      const appJsonPath = path.join(this.rootPath, 'apps', 'mobile', 'app.json');
      const versionPath = path.join(this.rootPath, 'VERSION.json');

      if (fs.existsSync(appJsonPath) && fs.existsSync(versionPath)) {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

        // Atualizar versão no app.json
        appJson.expo.version = version.version;
        
        // Atualizar build numbers
        if (appJson.expo.ios) {
          appJson.expo.ios.buildNumber = String(version.platforms.mobile.buildNumber);
        }
        if (appJson.expo.android) {
          appJson.expo.android.versionCode = version.platforms.mobile.buildNumber;
        }

        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        this.log('✅ Expo configuration updated for rollback');
      }
    } catch (error) {
      this.log(`❌ Expo configuration rollback failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Limpa caches após rollback
   */
  async clearCaches() {
    this.log('🧹 Clearing caches after rollback...');

    try {
      // Limpar cache do Next.js
      const nextCachePath = path.join(this.rootPath, 'apps', 'web', '.next');
      if (fs.existsSync(nextCachePath)) {
        fs.rmSync(nextCachePath, { recursive: true, force: true });
        this.log('Cleared Next.js cache');
      }

      // Limpar cache do Expo
      const expoCachePath = path.join(this.rootPath, 'apps', 'mobile', '.expo');
      if (fs.existsSync(expoCachePath)) {
        fs.rmSync(expoCachePath, { recursive: true, force: true });
        this.log('Cleared Expo cache');
      }

      // Limpar caches de build
      const buildCacheDirs = [
        path.join(this.rootPath, 'node_modules', '.cache'),
        path.join(this.rootPath, 'apps', 'web', 'node_modules', '.cache'),
        path.join(this.rootPath, 'apps', 'mobile', 'node_modules', '.cache'),
        path.join(this.rootPath, 'apps', 'web', '.next', 'cache'),
        path.join(this.rootPath, 'apps', 'mobile', '.expo', 'cache')
      ];

      buildCacheDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      });

      this.log('✅ Caches cleared successfully');
    } catch (error) {
      this.log(`❌ Cache clearing failed: ${error.message}`);
      // Não falhar o processo se a limpeza de cache falhar
    }
  }

  /**
   * Valida o rollback
   */
  async validateRollback() {
    this.log('🧪 Validating rollback...');

    try {
      // Verificar se os arquivos principais existem
      const criticalFiles = [
        'VERSION.json',
        'package.json',
        'apps/web/package.json',
        'apps/mobile/package.json',
        'apps/mobile/app.json'
      ];

      for (const file of criticalFiles) {
        const filePath = path.join(this.rootPath, file);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Critical file missing after rollback: ${file}`);
        }
      }

      // Verificar consistência das versões
      const version = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'VERSION.json'), 'utf8'));
      const rootPackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8'));
      const webPackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'web', 'package.json'), 'utf8'));
      const mobilePackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'mobile', 'package.json'), 'utf8'));
      const appJson = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'mobile', 'app.json'), 'utf8'));

      // Verificar se as versões estão alinhadas
      if (version.version !== rootPackage.version || 
          version.version !== webPackage.version || 
          version.version !== mobilePackage.version ||
          version.version !== appJson.expo.version) {
        throw new Error('Version inconsistency detected after rollback');
      }

      // Verificar build numbers
      if (appJson.expo.ios && 
          appJson.expo.ios.buildNumber !== String(version.platforms.mobile.buildNumber)) {
        throw new Error('iOS build number inconsistency after rollback');
      }

      if (appJson.expo.android && 
          appJson.expo.android.versionCode !== version.platforms.mobile.buildNumber) {
        throw new Error('Android version code inconsistency after rollback');
      }

      // Teste básico de sintaxe dos arquivos JSON
      try {
        JSON.parse(fs.readFileSync(path.join(this.rootPath, 'VERSION.json'), 'utf8'));
        JSON.parse(fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8'));
        JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'mobile', 'app.json'), 'utf8'));
      } catch (error) {
        throw new Error(`JSON syntax error after rollback: ${error.message}`);
      }

      this.log('✅ Rollback validation passed');
    } catch (error) {
      this.log(`❌ Rollback validation failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notifica serviços sobre o rollback
   */
  async notifyServices() {
    this.log('📢 Notifying services about rollback...');

    try {
      const version = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'VERSION.json'), 'utf8'));

      // Webhook para serviços de monitoramento
      if (process.env.ROLLBACK_WEBHOOK_URL) {
        await this.sendWebhook(process.env.ROLLBACK_WEBHOOK_URL, {
          event: 'rollback_completed',
          version: version.version,
          timestamp: new Date().toISOString(),
          platforms: version.platforms,
          severity: 'high'
        });
      }

      // Atualizar arquivo de status
      const statusFile = path.join(this.rootPath, 'public', 'health.json');
      if (fs.existsSync(path.dirname(statusFile))) {
        const healthStatus = {
          status: 'healthy',
          version: version.version,
          updated: new Date().toISOString(),
          rollback: true
        };
        fs.writeFileSync(statusFile, JSON.stringify(healthStatus, null, 2));
      }

      // Log crítico para auditoria
      this.logCriticalEvent('ROLLBACK_COMPLETED', {
        version: version.version,
        timestamp: new Date().toISOString(),
        reason: 'Automatic rollback after failed update'
      });

      this.log('✅ Services notified about rollback');
    } catch (error) {
      this.log(`⚠️ Service notification failed: ${error.message}`);
      // Não falhar o processo se a notificação falhar
    }
  }

  /**
   * Log de eventos críticos
   */
  logCriticalEvent(event, data) {
    const criticalLogFile = path.join(this.rootPath, 'critical-events.log');
    const logEntry = {
      event,
      data,
      timestamp: new Date().toISOString()
    };
    
    fs.appendFileSync(criticalLogFile, JSON.stringify(logEntry) + '\n');
  }

  /**
   * Envia webhook
   */
  async sendWebhook(url, data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      const urlObj = new URL(url);

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = require(urlObj.protocol === 'https:' ? 'https' : 'http').request(options, (res) => {
        resolve(res.statusCode);
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const processor = new PostRollbackProcessor();
  processor.run().catch((error) => {
    console.error('Post-rollback processing failed:', error);
    process.exit(1);
  });
}

module.exports = PostRollbackProcessor;