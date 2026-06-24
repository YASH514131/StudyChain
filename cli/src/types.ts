export interface StudyChainConfig {
  challengeId: number;
  runner: 'typescript' | 'anchor' | 'evm';
  entrypoint: string;
  env?: Record<string, string>;
}

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  txSignature?: string;
  error?: string;
}

export interface Runner {
  verifyEnvironment(): Promise<boolean>;
  run(code: string, config: StudyChainConfig): Promise<RunResult>;
}
