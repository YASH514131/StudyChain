import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { Runner, StudyChainConfig, RunResult } from '../types';

export class TypeScriptRunner implements Runner {
  async verifyEnvironment(): Promise<boolean> {
    return new Promise((resolve) => {
      exec('node -v', (err) => {
        resolve(!err);
      });
    });
  }

  async run(code: string, config: StudyChainConfig): Promise<RunResult> {
    const tempFileName = `.studychain_temp_${Date.now()}.ts`;
    const tempFilePath = path.join(process.cwd(), tempFileName);

    try {
      // Write the payload code to a temporary file
      fs.writeFileSync(tempFilePath, code, 'utf8');

      // Execute the script using npx tsx
      return new Promise<RunResult>((resolve) => {
        const command = `npx tsx ${tempFileName}`;
        
        // Pass optional environment variables
        const envVars = { ...process.env, ...config.env };

        exec(command, { env: envVars }, (error, stdout, stderr) => {
          // Cleanup file
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          } catch (cleanupErr) {
            console.error('Failed to clean up temp file:', cleanupErr);
          }

          // Search stdout and stderr for a transaction signature
          // Matches Solana base58 signatures, EVM transaction hashes, or mock strings (64-90 alphanumeric characters)
          const sigRegex = /(?:tx|signature|transaction|hash)[:\s=]+([a-zA-Z0-9]{64,90})/i;
          const match = stdout.match(sigRegex) || stderr.match(sigRegex);
          const txSignature = match ? match[1] : undefined;

          if (error) {
            resolve({
              success: false,
              stdout,
              stderr,
              txSignature,
              error: error.message
            });
          } else {
            resolve({
              success: true,
              stdout,
              stderr,
              txSignature
            });
          }
        });
      });
    } catch (err: any) {
      // Cleanup file in case of crash before execution
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      return {
        success: false,
        stdout: '',
        stderr: '',
        error: `Initialization error: ${err.message}`
      };
    }
  }
}
