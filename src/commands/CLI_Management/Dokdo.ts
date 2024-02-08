import { Command } from "@sapphire/framework";
import { Message } from "discord.js";

export class Dokdo extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      name: "dokdo",
      aliases: ["dok"],
      description: "[CLI_Management Only] 명령어를 실행합니다.",
      fullCategory: ["CLI_Management"],
      preconditions: ["OwnerOnly"]
    });
  }

  public async messageRun(message: Message) {
    this.container.client.dokdo.options.prefix = "..";
    return this.container.client.dokdo.run(message);
  }
}
