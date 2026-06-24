import { exec } from 'child_process';
import { Runner, StudyChainConfig, RunResult } from '../types';

export class AnchorRunner implements Runner {
  async verifyEnvironment(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('anchor --version', (err) => {
        if (err) return resolve(false);
        exec('solana --version', (solanaErr) => {
          resolve(!solanaErr);
        });
      });
    });
  }

  async run(code: string, config: StudyChainConfig): Promise<RunResult> {
    // Future implementation: Write rust code, execute anchor build / anchor test
    return {
      success: false,
      stdout: '',
      stderr: 'Anchor runner compilation is not fully configured in this version.',
      error: 'Anchor runner not implemented. Please use "typescript" runner for script-based exploits.'
    };
  }
}
