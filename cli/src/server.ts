import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { StudyChainConfig, RunResult } from './types';
import { TypeScriptRunner } from './runners/typescript';
import { AnchorRunner } from './runners/anchor';
import { EVMRunner } from './runners/evm';

const app = express();
const PORT = 39999;

app.use(cors());
app.use(express.json());

// Helper to load local configuration file
function loadConfig(): StudyChainConfig | null {
  const configPath = path.join(process.cwd(), 'studychain.config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(raw) as StudyChainConfig;
  } catch (err) {
    console.error('Failed to parse studychain.config.json:', err);
    return null;
  }
}

// GET /status
app.get('/status', async (req, res) => {
  const config = loadConfig();
  const tsRunner = new TypeScriptRunner();
  const anchorRunner = new AnchorRunner();
  const evmRunner = new EVMRunner();

  const envStatus = {
    node: await tsRunner.verifyEnvironment(),
    anchor: await anchorRunner.verifyEnvironment(),
    evm: await evmRunner.verifyEnvironment()
  };

  res.json({
    status: 'online',
    workspacePath: process.cwd(),
    configLoaded: !!config,
    config: config || undefined,
    environment: envStatus
  });
});

// POST /run
app.post('/run', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'Code field is required in request body.' });
    return;
  }

  const config = loadConfig();
  if (!config) {
    res.status(400).json({ 
      error: 'Missing studychain.config.json in the current working directory. Please run "studychain-cli init" to generate one.' 
    });
    return;
  }

  // Select runner strategy
  let runner;
  switch (config.runner) {
    case 'typescript':
      runner = new TypeScriptRunner();
      break;
    case 'anchor':
      runner = new AnchorRunner();
      break;
    case 'evm':
      runner = new EVMRunner();
      break;
    default:
      res.status(400).json({ error: `Unsupported runner type: ${config.runner}` });
      return;
  }

  console.log(`[StudyChain] Executing code payload using strategy: "${config.runner}"`);
  
  try {
    const result: RunResult = await runner.run(code, config);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      stdout: '',
      stderr: '',
      error: `Runner crashed: ${err.message}`
    });
  }
});

export function startServer() {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 StudyChain CLI Local Bridge active on port ${PORT}`);
    console.log(`📂 Monitoring workspace: ${process.cwd()}`);
    console.log(`======================================================\n`);
  });
}
