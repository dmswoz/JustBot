import { Listener } from "@sapphire/framework";
import * as Sentry from "@sentry/node";

export class Error extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options
  ) {
    super(context, {
      ...options,
      event: "error"
    });
  }

  public run(error: Error) {
    this.container.logger.error(`[JustBot:Error] ${error}`);
    Sentry.captureException(error);
  }
}
