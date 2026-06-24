#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { startServer } from './server';

const args = process.argv.slice(2);
const command = args[0] || 'start';

if (command === 'init') {
  const configPath = path.join(process.cwd(), 'studychain.config.json');
  if (fs.existsSync(configPath)) {
    console.log('⚠️ studychain.config.json already exists in this folder.');
    process.exit(0);
  }

  const defaultConfig = {
    challengeId: 1,
    runner: 'typescript',
    entrypoint: './exploit.ts',
    env: {
      SOLANA_RPC_URL: 'https://api.devnet.solana.com'
    }
  };

  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  console.log('✅ Created studychain.config.json template in the current folder.');
  process.exit(0);
}

if (command === 'start') {
  startServer();
} else {
  console.log(`
StudyChain CLI Tool

Usage:
  studychain-cli init     - Initialize studychain.config.json template in current folder
  studychain-cli start    - Run local HTTP bridge server on port 39999 (default)
  studychain-cli help     - Show this help message
  `);
  process.exit(0);
}
