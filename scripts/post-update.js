#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de pós-atualização
 * Executado após cada atualização bem-sucedida
 */

class PostUpdateProcessor {
  constructor() {
    this.rootPath = path.resolve(__dirname, '..');
    this.logFile = path.join(this.rootPath, 'update.log');
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(this.logFile, logMessage);
  }

  async run() {
    this.log('🚀 Starting post-update processing...');

    try {
      await this.updateDependencies();
      await this.runDatabaseMigrations();
      await this.updateExpoConfig();
      await this.clearCaches();
      await this.runTests();
      await this.notifyServices();
      
      this.log('✅ Post-update processing completed successfully');
    } catch (error) {
      this.log(`❌ Post-update processing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza dependências se necessário
   */
  async updateDependencies() {
    this.log('📦 Updating dependencies...');

    try {
      // Verificar se há mudanças no package.json principal
      if (this.hasPackageChanges('package.json')) {
        this.log('Installing root dependencies...');
        execSync('npm install', { cwd: this.rootPath, stdio: 'pipe' });
      }

      // Verificar dependências do web app
      const webPath = path.join(this.rootPath, 'apps', 'web');
      if (this.hasPackageChanges(path.join('apps', 'web', 'package.json'))) {
        this.log('Installing web app dependencies...');
        execSync('npm install', { cwd: webPath, stdio: 'pipe' });
      }

      // Verificar dependências do mobile app
      const mobilePath = path.join(this.rootPath, 'apps', 'mobile');
      if (this.hasPackageChanges(path.join('apps', 'mobile', 'package.json'))) {
        this.log('Installing mobile app dependencies...');
        execSync('npm install', { cwd: mobilePath, stdio: 'pipe' });
      }

      this.log('✅ Dependencies updated successfully');
    } catch (error) {
      this.log(`❌ Dependencies update failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executa migrações do banco de dados (se houver backend Java)
   */
  async runDatabaseMigrations() {
    this.log('🗄️ Running database migrations...');

    try {
      const backendPath = path.join(this.rootPath, 'apps', 'backend');
      
      if (fs.existsSync(path.join(backendPath, 'pom.xml'))) {
        // Backend Java - executar migrações via Maven/Gradle
        this.log('Running Java backend migrations...');
        
        if (fs.existsSync(path.join(backendPath, 'mvnw'))) {
          execSync('./mvnw flyway:migrate', { cwd: backendPath, stdio: 'pipe' });
        } else if (fs.existsSync(path.join(backendPath, 'gradlew'))) {
          execSync('./gradlew flywayMigrate', { cwd: backendPath, stdio: 'pipe' });
        }
      }

      this.log('✅ Database migrations completed');
    } catch (error) {
      this.log(`⚠️ Database migrations failed (this might be normal): ${error.message}`);
      // Não falhar o processo se as migrações falharem
    }
  }

  /**
   * Atualiza configuração do Expo
   */
  async updateExpoConfig() {
    this.log('📱 Updating Expo configuration...');

    try {
      const appJsonPath = path.join(this.rootPath, 'apps', 'mobile', 'app.json');
      const versionPath = path.join(this.rootPath, 'VERSION.json');

      if (fs.existsSync(appJsonPath) && fs.existsSync(versionPath)) {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

        // Atualizar versão no app.json
        appJson.expo.version = version.version;
        
        // Incrementar build numbers
        if (appJson.expo.ios) {
          appJson.expo.ios.buildNumber = String(version.platforms.mobile.buildNumber);
        }
        if (appJson.expo.android) {
          appJson.expo.android.versionCode = version.platforms.mobile.buildNumber;
        }

        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        this.log('✅ Expo configuration updated');
      }
    } catch (error) {
      this.log(`❌ Expo configuration update failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Limpa caches
   */
  async clearCaches() {
    this.log('🧹 Clearing caches...');

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

      // Limpar node_modules/.cache se existir
      const cacheDirs = [
        path.join(this.rootPath, 'node_modules', '.cache'),
        path.join(this.rootPath, 'apps', 'web', 'node_modules', '.cache'),
        path.join(this.rootPath, 'apps', 'mobile', 'node_modules', '.cache')
      ];

      cacheDirs.forEach(dir => {
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
   * Executa testes básicos para verificar integridade
   */
  async runTests() {
    this.log('🧪 Running post-update tests...');

    try {
      // Test: Verificar se os arquivos principais existem
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
          throw new Error(`Critical file missing: ${file}`);
        }
      }

      // Test: Verificar se as versões estão consistentes
      const rootPackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8'));
      const webPackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'web', 'package.json'), 'utf8'));
      const mobilePackage = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'apps', 'mobile', 'package.json'), 'utf8'));

      if (rootPackage.version !== webPackage.version || rootPackage.version !== mobilePackage.version) {
        throw new Error('Version mismatch detected between packages');
      }

      // Test: Verificar sintaxe do VERSION.json
      JSON.parse(fs.readFileSync(path.join(this.rootPath, 'VERSION.json'), 'utf8'));

      this.log('✅ Post-update tests passed');
    } catch (error) {
      this.log(`❌ Post-update tests failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Notifica serviços externos sobre a atualização
   */
  async notifyServices() {
    this.log('📢 Notifying external services...');

    try {
      const version = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'VERSION.json'), 'utf8'));

      // Webhook para serviços de monitoramento
      if (process.env.UPDATE_WEBHOOK_URL) {
        await this.sendWebhook(process.env.UPDATE_WEBHOOK_URL, {
          event: 'update_completed',
          version: version.version,
          timestamp: new Date().toISOString(),
          platforms: version.platforms
        });
      }

      // Atualizar arquivo de status para load balancers
      const statusFile = path.join(this.rootPath, 'public', 'health.json');
      if (fs.existsSync(path.dirname(statusFile))) {
        const healthStatus = {
          status: 'healthy',
          version: version.version,
          updated: new Date().toISOString()
        };
        fs.writeFileSync(statusFile, JSON.stringify(healthStatus, null, 2));
      }

      this.log('✅ External services notified');
    } catch (error) {
      this.log(`⚠️ Service notification failed: ${error.message}`);
      // Não falhar o processo se a notificação falhar
    }
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

  /**
   * Verifica se houve mudanças em um package.json
   */
  hasPackageChanges(packagePath) {
    // Por simplicidade, sempre retorna true
    // Em um ambiente real, isso compararia com a versão anterior
    return true;
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const processor = new PostUpdateProcessor();
  processor.run().catch((error) => {
    console.error('Post-update processing failed:', error);
    process.exit(1);
  });
}

module.exports = PostUpdateProcessor;