#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

class UpdateManager {
  constructor() {
    this.rootPath = path.resolve(__dirname, '..');
    this.versionFile = path.join(this.rootPath, 'VERSION.json');
    this.version = this.loadVersion();
    this.backupDir = path.join(this.rootPath, '.backups');
  }

  loadVersion() {
    try {
      return JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
    } catch (error) {
      console.error('❌ Error loading VERSION.json:', error.message);
      process.exit(1);
    }
  }

  saveVersion() {
    try {
      fs.writeFileSync(this.versionFile, JSON.stringify(this.version, null, 2));
    } catch (error) {
      console.error('❌ Error saving VERSION.json:', error.message);
      process.exit(1);
    }
  }

  /**
   * Verifica se há atualizações disponíveis
   */
  async checkForUpdates() {
    console.log('🔍 Checking for updates...');
    
    try {
      // Verificar repositório remoto
      const remoteVersion = await this.fetchRemoteVersion();
      const currentVersion = this.version.version;
      
      if (this.compareVersions(remoteVersion, currentVersion) > 0) {
        console.log(`✅ Update available: ${currentVersion} → ${remoteVersion}`);
        return {
          hasUpdate: true,
          currentVersion,
          remoteVersion,
          updateInfo: await this.fetchUpdateInfo(remoteVersion)
        };
      } else {
        console.log(`✅ Already up to date (${currentVersion})`);
        return {
          hasUpdate: false,
          currentVersion
        };
      }
    } catch (error) {
      console.error('❌ Error checking for updates:', error.message);
      return { hasUpdate: false, error: error.message };
    }
  }

  /**
   * Instala uma atualização
   */
  async installUpdate(options = {}) {
    const { force = false, skipBackup = false } = options;
    
    console.log('📦 Installing update...');

    try {
      // Verificar se há atualizações
      const updateCheck = await this.checkForUpdates();
      if (!updateCheck.hasUpdate && !force) {
        console.log('ℹ️ No updates available');
        return;
      }

      // Criar backup antes da atualização
      if (!skipBackup) {
        await this.createBackup();
      }

      // Baixar e aplicar atualização
      await this.downloadAndApplyUpdate(updateCheck.remoteVersion);
      
      // Verificar integridade
      await this.verifyUpdate();
      
      // Atualizar VERSION.json
      this.version.version = updateCheck.remoteVersion;
      this.version.releaseDate = new Date().toISOString();
      this.saveVersion();

      console.log(`✅ Update installed successfully: ${updateCheck.remoteVersion}`);
      
      // Executar scripts pós-atualização
      await this.runPostUpdateScripts();
      
    } catch (error) {
      console.error('❌ Update failed:', error.message);
      
      // Tentar rollback em caso de falha
      if (!skipBackup) {
        console.log('🔄 Attempting rollback...');
        await this.rollbackUpdate();
      }
      
      throw error;
    }
  }

  /**
   * Faz rollback para versão anterior
   */
  async rollbackUpdate() {
    console.log('🔄 Rolling back to previous version...');

    try {
      // Listar backups disponíveis
      const backups = this.getAvailableBackups();
      
      if (backups.length === 0) {
        throw new Error('No backups available for rollback');
      }

      // Usar o backup mais recente
      const latestBackup = backups[0];
      console.log(`📂 Using backup: ${latestBackup.name}`);

      // Restaurar backup
      await this.restoreBackup(latestBackup.path);
      
      // Atualizar VERSION.json
      const backupVersion = this.loadBackupVersion(latestBackup.path);
      this.version = backupVersion;
      this.saveVersion();

      console.log(`✅ Rollback completed: ${backupVersion.version}`);
      
      // Executar scripts pós-rollback
      await this.runPostRollbackScripts();
      
    } catch (error) {
      console.error('❌ Rollback failed:', error.message);
      throw error;
    }
  }

  /**
   * Cria backup do estado atual
   */
  async createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${this.version.version}-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);

    console.log(`💾 Creating backup: ${backupName}`);

    try {
      // Criar diretório de backup
      if (!fs.existsSync(this.backupDir)) {
        fs.mkdirSync(this.backupDir, { recursive: true });
      }
      fs.mkdirSync(backupPath, { recursive: true });

      // Copiar arquivos importantes
      const filesToBackup = [
        'VERSION.json',
        'package.json',
        'apps/web/package.json',
        'apps/mobile/package.json',
        'apps/mobile/app.json'
      ];

      for (const file of filesToBackup) {
        const sourcePath = path.join(this.rootPath, file);
        const destPath = path.join(backupPath, file);
        
        if (fs.existsSync(sourcePath)) {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(sourcePath, destPath);
        }
      }

      // Salvar metadados do backup
      const backupInfo = {
        version: this.version.version,
        timestamp: new Date().toISOString(),
        files: filesToBackup
      };
      
      fs.writeFileSync(
        path.join(backupPath, 'backup-info.json'),
        JSON.stringify(backupInfo, null, 2)
      );

      console.log(`✅ Backup created: ${backupPath}`);
      
      // Limpar backups antigos (manter apenas os 5 mais recentes)
      this.cleanupOldBackups(5);
      
    } catch (error) {
      console.error('❌ Backup creation failed:', error.message);
      throw error;
    }
  }

  /**
   * Obtém lista de backups disponíveis
   */
  getAvailableBackups() {
    if (!fs.existsSync(this.backupDir)) {
      return [];
    }

    const backups = fs.readdirSync(this.backupDir)
      .filter(name => name.startsWith('backup-'))
      .map(name => {
        const backupPath = path.join(this.backupDir, name);
        const infoPath = path.join(backupPath, 'backup-info.json');
        
        let info = null;
        if (fs.existsSync(infoPath)) {
          try {
            info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          } catch (error) {
            console.warn(`Warning: Could not read backup info for ${name}`);
          }
        }

        return {
          name,
          path: backupPath,
          info,
          timestamp: info?.timestamp || fs.statSync(backupPath).mtime
        };
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return backups;
  }

  /**
   * Restaura um backup
   */
  async restoreBackup(backupPath) {
    console.log(`📁 Restoring backup from: ${backupPath}`);

    try {
      const backupInfoPath = path.join(backupPath, 'backup-info.json');
      
      if (!fs.existsSync(backupInfoPath)) {
        throw new Error('Invalid backup: missing backup-info.json');
      }

      const backupInfo = JSON.parse(fs.readFileSync(backupInfoPath, 'utf8'));
      
      // Restaurar arquivos
      for (const file of backupInfo.files) {
        const sourcePath = path.join(backupPath, file);
        const destPath = path.join(this.rootPath, file);
        
        if (fs.existsSync(sourcePath)) {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(sourcePath, destPath);
        }
      }

      console.log(`✅ Backup restored successfully`);
      
    } catch (error) {
      console.error('❌ Backup restoration failed:', error.message);
      throw error;
    }
  }

  /**
   * Limpa backups antigos
   */
  cleanupOldBackups(keepCount = 5) {
    const backups = this.getAvailableBackups();
    
    if (backups.length > keepCount) {
      const toDelete = backups.slice(keepCount);
      
      for (const backup of toDelete) {
        try {
          this.removeDirectory(backup.path);
          console.log(`🗑️ Removed old backup: ${backup.name}`);
        } catch (error) {
          console.warn(`Warning: Could not remove backup ${backup.name}:`, error.message);
        }
      }
    }
  }

  /**
   * Remove diretório recursivamente
   */
  removeDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /**
   * Carrega versão de um backup
   */
  loadBackupVersion(backupPath) {
    const versionPath = path.join(backupPath, 'VERSION.json');
    return JSON.parse(fs.readFileSync(versionPath, 'utf8'));
  }

  /**
   * Busca versão remota
   */
  async fetchRemoteVersion() {
    // Esta implementação deveria buscar a versão do repositório remoto
    // Por agora, simula uma versão remota
    return '1.0.1';
  }

  /**
   * Busca informações da atualização
   */
  async fetchUpdateInfo(version) {
    // Esta implementação deveria buscar as informações da atualização
    return {
      version,
      releaseDate: new Date().toISOString(),
      changelog: ['Bug fixes and improvements'],
      downloadSize: 1024 * 1024 // 1MB
    };
  }

  /**
   * Baixa e aplica atualização
   */
  async downloadAndApplyUpdate(version) {
    console.log(`📥 Downloading update ${version}...`);
    
    // Simular download e aplicação
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`✅ Update ${version} downloaded and applied`);
  }

  /**
   * Verifica integridade da atualização
   */
  async verifyUpdate() {
    console.log('🔍 Verifying update integrity...');
    
    // Verificações básicas
    const requiredFiles = [
      'VERSION.json',
      'package.json'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(this.rootPath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required file missing after update: ${file}`);
      }
    }

    console.log('✅ Update verification passed');
  }

  /**
   * Executa scripts pós-atualização
   */
  async runPostUpdateScripts() {
    console.log('🔧 Running post-update scripts...');
    
    try {
      // Reinstalar dependências se necessário
      if (this.hasPackageJsonChanges()) {
        execSync('npm install', { cwd: this.rootPath, stdio: 'inherit' });
      }

      // Executar scripts personalizados
      const postUpdateScript = path.join(this.rootPath, 'scripts', 'post-update.js');
      if (fs.existsSync(postUpdateScript)) {
        execSync(`node "${postUpdateScript}"`, { cwd: this.rootPath, stdio: 'inherit' });
      }

      console.log('✅ Post-update scripts completed');
    } catch (error) {
      console.warn('⚠️ Post-update scripts failed:', error.message);
    }
  }

  /**
   * Executa scripts pós-rollback
   */
  async runPostRollbackScripts() {
    console.log('🔧 Running post-rollback scripts...');
    
    try {
      // Reinstalar dependências
      execSync('npm install', { cwd: this.rootPath, stdio: 'inherit' });

      // Executar scripts personalizados
      const postRollbackScript = path.join(this.rootPath, 'scripts', 'post-rollback.js');
      if (fs.existsSync(postRollbackScript)) {
        execSync(`node "${postRollbackScript}"`, { cwd: this.rootPath, stdio: 'inherit' });
      }

      console.log('✅ Post-rollback scripts completed');
    } catch (error) {
      console.warn('⚠️ Post-rollback scripts failed:', error.message);
    }
  }

  /**
   * Verifica se houve mudanças no package.json
   */
  hasPackageJsonChanges() {
    // Implementação simplificada - sempre retorna true para garantir reinstalação
    return true;
  }

  /**
   * Compara versões
   */
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  /**
   * Lista informações do sistema
   */
  getSystemInfo() {
    return {
      version: this.version.version,
      buildNumber: this.version.buildNumber,
      platforms: this.version.platforms,
      updatePolicy: this.version.updatePolicy,
      lastCheck: new Date().toISOString()
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const updateManager = new UpdateManager();

  try {
    switch (command) {
      case 'check':
        const result = await updateManager.checkForUpdates();
        console.log(JSON.stringify(result, null, 2));
        break;

      case 'install':
        const force = args.includes('--force');
        const skipBackup = args.includes('--skip-backup');
        await updateManager.installUpdate({ force, skipBackup });
        break;

      case 'rollback':
        await updateManager.rollbackUpdate();
        break;

      case 'backup':
        await updateManager.createBackup();
        break;

      case 'list-backups':
        const backups = updateManager.getAvailableBackups();
        console.log('Available backups:');
        backups.forEach(backup => {
          console.log(`  ${backup.name} (${backup.info?.version || 'unknown'}) - ${backup.timestamp}`);
        });
        break;

      case 'cleanup':
        const keep = parseInt(args[1]) || 5;
        updateManager.cleanupOldBackups(keep);
        break;

      case 'info':
        const info = updateManager.getSystemInfo();
        console.log(JSON.stringify(info, null, 2));
        break;

      default:
        console.log(`
🚀 Vehicle Tracking System - Update Manager

Usage:
  node scripts/update-manager.js <command> [options]

Commands:
  check                        Check for available updates
  install [--force] [--skip-backup]  Install available updates
  rollback                     Rollback to previous version
  backup                       Create manual backup
  list-backups                 List available backups
  cleanup [count]              Clean up old backups (keep count, default: 5)
  info                         Show system information

Examples:
  node scripts/update-manager.js check
  node scripts/update-manager.js install
  node scripts/update-manager.js rollback
  node scripts/update-manager.js cleanup 3
        `);
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = UpdateManager;