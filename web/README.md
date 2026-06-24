# StudyChain Web (dev)

This is a minimal Vite + React scaffold for the StudyChain MVP.

Quick start:

```bash
cd web
npm install
npm run dev
```

Environment variables (create a `.env` file in `web/`):

```
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_PROGRAM_ID=ReplaceWithDeployedProgramId
```

Notes:
- The frontend includes `@solana/wallet-adapter` wiring and a placeholder `Submit Demo Challenge` flow. Replace the placeholder RPC/IDL calls with the Anchor program IDL and program ID after building the Anchor program.
- To build the Anchor program, see `programs/studychain/` and the root `Anchor.toml`.
