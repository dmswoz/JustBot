import { Listener } from "@sapphire/framework";
import { Client } from "discord.js";

export class Ready extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options
  ) {
    super(context, {
      ...options,
      once: true,
      event: "ready"
    });
  }

  public run(client: Client) {
    const { tag, id } = client.user!;
    this.container.logger.info(
      `[JustBot:Ready] ${tag}(${id}) is ready to use.`
    );
  }
}
