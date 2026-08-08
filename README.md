# RealHuman

## Run locally

Start the backend API in one terminal:

```sh
npm run dev:backend
```

For automatic backend reloads while editing Python files, use:

```sh
npm run dev:backend:reload
```

Start the Vite frontend in another terminal:

```sh
npm run dev
```

The frontend calls `/api/...` and Vite forwards those requests to `http://127.0.0.1:8000`.

Create a `.env` file in the project root with the LiveKit and agent service keys before starting a real conversation:

```sh
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
DEEPGRAM_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
SIMLI_API_KEY=
SIMLI_FACE_ID=
```

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
