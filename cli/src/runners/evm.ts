import { exec } from 'child_process';
import { Runner, StudyChainConfig, RunResult } from '../types';

export class EVMRunner implements Runner {
  async verifyEnvironment(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check for hardhat or forge
      exec('npx hardhat --version', (hardhatErr) => {
        if (!hardhatErr) return resolve(true);
        exec('forge --version', (forgeErr) => {
          resolve(!forgeErr);
        });
      });
    });
  }

  async run(code: string, config: StudyChainConfig): Promise<RunResult> {
    // Future implementation: Write Solidity files and run hardhat/forge script/test
    return {
      success: false,
      stdout: '',
      stderr: 'EVM runner compilation is not fully configured in this version.',
      error: 'EVM runner not implemented. Please use "typescript" runner for script-based exploits.'
    };
  }
}
