import { createApp } from "./app.js";
import { env } from "./config/env.js";

const server = createApp().listen(env.PORT, () => {
    console.log(`Server listening on PORT: ${env.PORT}`);
});

function shutdown(signal: string) {
    console.log('Shutting down...');
    server.close(() => process.exit(0));
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));