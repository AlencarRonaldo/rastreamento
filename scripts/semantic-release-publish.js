#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de publicação para semantic-release
 * Executado durante o processo de release automatizado
 */

class SemanticReleasePublisher {
  constructor(version) {
    this.version = version;
    this.rootPath = path.resolve(__dirname, '..');
    this.versionFile = path.join(this.rootPath, 'VERSION.json');
  }

  async publish() {
    console.log(`🚀 Publishing version ${this.version}...`);

    try {
      await this.updateVersionFile();
      await this.updatePackageFiles();
      await this.updateExpoConfig();
      await this.createDistributionPackage();
      await this.triggerDeployments();
      await this.notifyTeams();
      
      console.log(`✅ Version ${this.version} published successfully`);
    } catch (error) {
      console.error(`❌ Publishing failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Atualiza o arquivo VERSION.json
   */
  async updateVersionFile() {
    console.log('📝 Updating VERSION.json...');

    try {
      const versionData = JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
      const now = new Date().toISOString();

      // Atualizar versão principal
      versionData.version = this.version;
      versionData.releaseDate = now;
      versionData.buildNumber = versionData.buildNumber + 1;

      // Atualizar versões das plataformas
      Object.keys(versionData.platforms).forEach(platform => {
        versionData.platforms[platform].version = this.version;
        versionData.platforms[platform].lastUpdate = now;
        
        if (versionData.platforms[platform].buildNumber !== undefined) {
          versionData.platforms[platform].buildNumber = versionData.platforms[platform].buildNumber + 1;
        }
      });

      fs.writeFileSync(this.versionFile, JSON.stringify(versionData, null, 2));
      console.log('✅ VERSION.json updated');
    } catch (error) {
      console.error('❌ Failed to update VERSION.json:', error.message);
      throw error;
    }
  }

  /**
   * Atualiza package.json files
   */
  async updatePackageFiles() {
    console.log('📦 Updating package.json files...');

    const packageFiles = [
      'package.json',
      'apps/web/package.json',
      'apps/mobile/package.json'
    ];

    try {
      for (const packageFile of packageFiles) {
        const packagePath = path.join(this.rootPath, packageFile);
        
        if (fs.existsSync(packagePath)) {
          const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          packageData.version = this.version;
          fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
          console.log(`✅ Updated ${packageFile}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to update package files:', error.message);
      throw error;
    }
  }

  /**
   * Atualiza configuração do Expo
   */
  async updateExpoConfig() {
    console.log('📱 Updating Expo configuration...');

    try {
      const appJsonPath = path.join(this.rootPath, 'apps', 'mobile', 'app.json');
      const versionData = JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));

      if (fs.existsSync(appJsonPath)) {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        
        // Atualizar versão
        appJson.expo.version = this.version;
        
        // Atualizar build numbers
        if (appJson.expo.ios) {
          appJson.expo.ios.buildNumber = String(versionData.platforms.mobile.buildNumber);
        }
        if (appJson.expo.android) {
          appJson.expo.android.versionCode = versionData.platforms.mobile.buildNumber;
        }

        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        console.log('✅ Expo configuration updated');
      }
    } catch (error) {
      console.error('❌ Failed to update Expo config:', error.message);
      throw error;
    }
  }

  /**
   * Cria pacote de distribuição
   */
  async createDistributionPackage() {
    console.log('📦 Creating distribution package...');

    try {
      const distDir = path.join(this.rootPath, 'dist');
      
      // Criar diretório dist se não existir
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Criar tarball usando npm pack
      const packageName = JSON.parse(fs.readFileSync(path.join(this.rootPath, 'package.json'), 'utf8')).name;
      const tarballName = `${packageName.replace('@', '').replace('/', '-')}-${this.version}.tgz`;
      
      execSync(`npm pack --pack-destination="${distDir}"`, { cwd: this.rootPath });
      
      console.log(`✅ Distribution package created: ${tarballName}`);
    } catch (error) {
      console.error('❌ Failed to create distribution package:', error.message);
      throw error;
    }
  }

  /**
   * Dispara deployments automáticos
   */
  async triggerDeployments() {
    console.log('🚀 Triggering automated deployments...');

    try {
      // Verificar se estamos em um ambiente CI
      if (!process.env.CI) {
        console.log('ℹ️ Not in CI environment, skipping deployment triggers');
        return;
      }

      // Criar arquivo de trigger para deployments
      const triggerFile = path.join(this.rootPath, '.deployment-trigger.json');
      const triggerData = {
        version: this.version,
        timestamp: new Date().toISOString(),
        platforms: ['web', 'mobile'],
        triggerReason: 'semantic-release'
      };

      fs.writeFileSync(triggerFile, JSON.stringify(triggerData, null, 2));

      // Se estiver no GitHub Actions, criar outputs
      if (process.env.GITHUB_ACTIONS) {
        console.log(`::set-output name=version::${this.version}`);
        console.log(`::set-output name=trigger_deployments::true`);
      }

      console.log('✅ Deployment triggers configured');
    } catch (error) {
      console.error('❌ Failed to trigger deployments:', error.message);
      // Não falhar o release se os deployments não puderem ser disparados
    }
  }

  /**
   * Notifica equipes sobre o release
   */
  async notifyTeams() {
    console.log('📢 Notifying teams about release...');

    try {
      const versionData = JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
      const changelogPath = path.join(this.rootPath, 'CHANGELOG.md');
      
      let releaseNotes = 'No release notes available';
      if (fs.existsSync(changelogPath)) {
        const changelog = fs.readFileSync(changelogPath, 'utf8');
        // Extrair as notas da versão atual do changelog
        const versionSection = changelog.split(`## [${this.version}]`)[1];
        if (versionSection) {
          releaseNotes = versionSection.split('##')[0].trim();
        }
      }

      // Webhook para Slack
      if (process.env.SLACK_RELEASE_WEBHOOK) {
        await this.sendSlackNotification({
          version: this.version,
          releaseNotes,
          platforms: versionData.platforms
        });
      }

      // Webhook para Discord
      if (process.env.DISCORD_RELEASE_WEBHOOK) {
        await this.sendDiscordNotification({
          version: this.version,
          releaseNotes
        });
      }

      // Webhook personalizado
      if (process.env.CUSTOM_RELEASE_WEBHOOK) {
        await this.sendWebhook(process.env.CUSTOM_RELEASE_WEBHOOK, {
          event: 'release_published',
          version: this.version,
          releaseNotes,
          platforms: versionData.platforms,
          timestamp: new Date().toISOString()
        });
      }

      console.log('✅ Team notifications sent');
    } catch (error) {
      console.error('⚠️ Failed to send notifications:', error.message);
      // Não falhar o release se as notificações falharem
    }
  }

  /**
   * Envia notificação para Slack
   */
  async sendSlackNotification(data) {
    const payload = {
      text: `🚀 New release: v${data.version}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚀 Vehicle Tracker v${data.version} Released`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Version:* ${data.version}\n*Platforms:* Web, Mobile\n*Release Date:* ${new Date().toLocaleDateString()}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Release Notes:*\n\`\`\`${data.releaseNotes.substring(0, 500)}${data.releaseNotes.length > 500 ? '...' : ''}\`\`\``
          }
        }
      ]
    };

    return this.sendWebhook(process.env.SLACK_RELEASE_WEBHOOK, payload);
  }

  /**
   * Envia notificação para Discord
   */
  async sendDiscordNotification(data) {
    const payload = {
      embeds: [
        {
          title: `🚀 Vehicle Tracker v${data.version} Released`,
          description: `New version of the vehicle tracking system is now available!`,
          color: 0x2563eb,
          fields: [
            {
              name: 'Version',
              value: data.version,
              inline: true
            },
            {
              name: 'Platforms',
              value: 'Web & Mobile',
              inline: true
            },
            {
              name: 'Release Date',
              value: new Date().toLocaleDateString(),
              inline: true
            },
            {
              name: 'Release Notes',
              value: data.releaseNotes.substring(0, 1000) + (data.releaseNotes.length > 1000 ? '...' : ''),
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Automated release via semantic-release'
          }
        }
      ]
    };

    return this.sendWebhook(process.env.DISCORD_RELEASE_WEBHOOK, payload);
  }

  /**
   * Envia webhook genérico
   */
  async sendWebhook(url, data) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      const urlObj = new URL(url);

      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'User-Agent': 'Vehicle-Tracker-Release-Bot/1.0'
        }
      };

      const req = require(urlObj.protocol === 'https:' ? 'https' : 'http').request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ statusCode: res.statusCode, body });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  const version = process.argv[2];
  
  if (!version) {
    console.error('❌ Version parameter is required');
    process.exit(1);
  }

  const publisher = new SemanticReleasePublisher(version);
  publisher.publish().catch((error) => {
    console.error('Publishing failed:', error);
    process.exit(1);
  });
}

module.exports = SemanticReleasePublisher;