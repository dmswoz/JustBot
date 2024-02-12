import { config } from "dotenv";
import * as Sentry from "@sentry/node";
import { rewriteFramesIntegration } from "@sentry/integrations";
import { JustClient } from "./classes/JustClient";
import { Catcher } from "./lib/Catcher";

config();
const client = new JustClient();

// Sentry init
if (process.env.SENTRY_DSN && Catcher.isURL(process.env.SENTRY_DSN as string)) {
  client.logger.info(`[Catcher#Sentry:Info] Sentry is now enabled.`);
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      rewriteFramesIntegration({
        root: global.__dirname
      })
    ]
  });
} else {
  client.logger.warn(
    `[Catcher#Sentry:Warn] Sentry is disabled. Please check the DSN.`
  );
}

// Ignore errors
const uncaughtException = (err: Error): void => {
  client.logger.error(`Uncaught exception: ${err}`);
  Sentry.captureException(err);
};
const unhandledRejection = (
  reason: string,
  promise: Promise<unknown>
): void => {
  promise.catch((_) => {
    Sentry.captureException(_);
    client.logger.fatal(`Uncaught rejection, reason: ${_}`);
  });
};

client.logger.info(`[Client#JustBot:Start] Pre-Cfg success. Client setup..`);
client
  .start()
  .then(() => {
    process.on("uncaughtException", uncaughtException);
    process.on("unhandledRejection", unhandledRejection);
  })
  .catch((e) => {
    client.logger.error(`Failed to start client: ${e}`);
    process.exit(2);
  });
