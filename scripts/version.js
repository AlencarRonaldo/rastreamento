#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionManager {
  constructor() {
    this.rootPath = path.resolve(__dirname, '..');
    this.versionFile = path.join(this.rootPath, 'VERSION.json');
    this.version = this.loadVersion();
  }

  loadVersion() {
    try {
      return JSON.parse(fs.readFileSync(this.versionFile, 'utf8'));
    } catch (error) {
      console.error('Error loading VERSION.json:', error.message);
      process.exit(1);
    }
  }

  saveVersion() {
    try {
      fs.writeFileSync(this.versionFile, JSON.stringify(this.version, null, 2));
      console.log(`✅ Version updated to ${this.version.version}`);
    } catch (error) {
      console.error('Error saving VERSION.json:', error.message);
      process.exit(1);
    }
  }

  incrementVersion(type = 'patch') {
    const [major, minor, patch] = this.version.version.split('.').map(Number);
    const currentDate = new Date().toISOString();
    
    let newVersion;
    switch (type.toLowerCase()) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    // Update main version
    this.version.version = newVersion;
    this.version.releaseDate = currentDate;
    this.version.buildNumber = this.version.buildNumber + 1;

    // Update platform versions
    Object.keys(this.version.platforms).forEach(platform => {
      this.version.platforms[platform].version = newVersion;
      this.version.platforms[platform].lastUpdate = currentDate;
      
      if (platform === 'mobile') {
        this.version.platforms[platform].buildNumber = this.version.platforms[platform].buildNumber + 1;
      }
      if (platform === 'web') {
        this.version.platforms[platform].buildNumber = this.version.platforms[platform].buildNumber + 1;
      }
    });

    return newVersion;
  }

  updatePackageJsonFiles(newVersion) {
    const packagesToUpdate = [
      path.join(this.rootPath, 'package.json'),
      path.join(this.rootPath, 'apps', 'mobile', 'package.json'),
      path.join(this.rootPath, 'apps', 'web', 'package.json'),
      path.join(this.rootPath, 'apps', 'backend', 'package.json')
    ];

    packagesToUpdate.forEach(packagePath => {
      if (fs.existsSync(packagePath)) {
        try {
          const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
          packageData.version = newVersion;
          fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
          console.log(`✅ Updated ${path.relative(this.rootPath, packagePath)}`);
        } catch (error) {
          console.error(`❌ Error updating ${packagePath}:`, error.message);
        }
      }
    });
  }

  updateAppJson(newVersion) {
    const appJsonPath = path.join(this.rootPath, 'apps', 'mobile', 'app.json');
    
    if (fs.existsSync(appJsonPath)) {
      try {
        const appData = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        appData.expo.version = newVersion;
        
        // Increment build numbers
        if (appData.expo.ios) {
          appData.expo.ios.buildNumber = String(parseInt(appData.expo.ios.buildNumber) + 1);
        }
        if (appData.expo.android) {
          appData.expo.android.versionCode = appData.expo.android.versionCode + 1;
        }
        
        fs.writeFileSync(appJsonPath, JSON.stringify(appData, null, 2));
        console.log(`✅ Updated app.json to version ${newVersion}`);
      } catch (error) {
        console.error('❌ Error updating app.json:', error.message);
      }
    }
  }

  addChangelogEntry(type, changes, breakingChanges = [], security = [], performance = []) {
    const newVersion = this.version.version;
    const releaseDate = new Date().toISOString();
    
    this.version.changelog[newVersion] = {
      releaseDate,
      type: type.toLowerCase(),
      changes: Array.isArray(changes) ? changes : [changes],
      breakingChanges: Array.isArray(breakingChanges) ? breakingChanges : [],
      security: Array.isArray(security) ? security : [],
      performance: Array.isArray(performance) ? performance : []
    };
  }

  setForceUpdate(enabled = true, version = null) {
    const targetVersion = version || this.version.version;
    
    Object.keys(this.version.platforms).forEach(platform => {
      this.version.platforms[platform].forceUpdateVersion = enabled ? targetVersion : null;
    });

    console.log(`✅ Force update ${enabled ? 'enabled' : 'disabled'} for version ${targetVersion}`);
  }

  getLatestVersion() {
    return this.version.version;
  }

  getCurrentBuildNumber() {
    return this.version.buildNumber;
  }

  generateReleaseNotes(version = null) {
    const targetVersion = version || this.version.version;
    const changelog = this.version.changelog[targetVersion];
    
    if (!changelog) {
      console.error(`❌ No changelog found for version ${targetVersion}`);
      return '';
    }

    let notes = `# Release Notes - v${targetVersion}\n\n`;
    notes += `**Release Date:** ${new Date(changelog.releaseDate).toLocaleDateString()}\n`;
    notes += `**Type:** ${changelog.type.charAt(0).toUpperCase() + changelog.type.slice(1)} Release\n\n`;

    if (changelog.changes.length > 0) {
      notes += `## ✨ What's New\n`;
      changelog.changes.forEach(change => {
        notes += `- ${change}\n`;
      });
      notes += `\n`;
    }

    if (changelog.breakingChanges.length > 0) {
      notes += `## 🚨 Breaking Changes\n`;
      changelog.breakingChanges.forEach(change => {
        notes += `- ${change}\n`;
      });
      notes += `\n`;
    }

    if (changelog.security.length > 0) {
      notes += `## 🔒 Security Updates\n`;
      changelog.security.forEach(change => {
        notes += `- ${change}\n`;
      });
      notes += `\n`;
    }

    if (changelog.performance.length > 0) {
      notes += `## ⚡ Performance Improvements\n`;
      changelog.performance.forEach(change => {
        notes += `- ${change}\n`;
      });
      notes += `\n`;
    }

    return notes;
  }

  createGitTag(version = null) {
    const targetVersion = version || this.version.version;
    
    try {
      execSync(`git add .`, { cwd: this.rootPath });
      execSync(`git commit -m "chore: bump version to ${targetVersion}"`, { cwd: this.rootPath });
      execSync(`git tag -a v${targetVersion} -m "Release v${targetVersion}"`, { cwd: this.rootPath });
      console.log(`✅ Created Git tag v${targetVersion}`);
    } catch (error) {
      console.error('❌ Error creating Git tag:', error.message);
    }
  }

  validateVersion() {
    const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
    if (!semverRegex.test(this.version.version)) {
      throw new Error(`Invalid version format: ${this.version.version}`);
    }
    
    // Check platform version consistency
    Object.entries(this.version.platforms).forEach(([platform, config]) => {
      if (!semverRegex.test(config.version)) {
        throw new Error(`Invalid ${platform} version format: ${config.version}`);
      }
    });
    
    console.log('✅ Version validation passed');
  }
}

// CLI Interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const versionManager = new VersionManager();

  try {
    switch (command) {
      case 'bump':
        const type = args[1] || 'patch';
        const newVersion = versionManager.incrementVersion(type);
        versionManager.updatePackageJsonFiles(newVersion);
        versionManager.updateAppJson(newVersion);
        versionManager.saveVersion();
        break;

      case 'changelog':
        const changeType = args[1] || 'patch';
        const changes = args.slice(2);
        if (changes.length === 0) {
          console.error('❌ Please provide changelog entries');
          process.exit(1);
        }
        versionManager.addChangelogEntry(changeType, changes);
        versionManager.saveVersion();
        break;

      case 'force-update':
        const enabled = args[1] !== 'false';
        const version = args[2] || null;
        versionManager.setForceUpdate(enabled, version);
        versionManager.saveVersion();
        break;

      case 'current':
        console.log(versionManager.getLatestVersion());
        break;

      case 'build-number':
        console.log(versionManager.getCurrentBuildNumber());
        break;

      case 'notes':
        const notesVersion = args[1] || null;
        console.log(versionManager.generateReleaseNotes(notesVersion));
        break;

      case 'tag':
        const tagVersion = args[1] || null;
        versionManager.createGitTag(tagVersion);
        break;

      case 'validate':
        versionManager.validateVersion();
        break;

      default:
        console.log(`
🚀 Vehicle Tracking System - Version Manager

Usage:
  node scripts/version.js <command> [options]

Commands:
  bump [major|minor|patch]     Increment version (default: patch)
  changelog <type> <changes>   Add changelog entry
  force-update [true|false]    Enable/disable force update
  current                      Show current version
  build-number                 Show current build number
  notes [version]              Generate release notes
  tag [version]                Create Git tag
  validate                     Validate version format

Examples:
  node scripts/version.js bump minor
  node scripts/version.js changelog minor "Added new feature" "Fixed bug"
  node scripts/version.js force-update true 1.2.0
  node scripts/version.js notes
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

module.exports = VersionManager;