import { Command } from "@sapphire/framework";

export class Ping extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      fullCategory: ["General"],
      requiredClientPermissions: ["SendMessages"]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("ping")
        .setDescription("Replies with pong.")
        .setDescriptionLocalizations({
          ko: "봇의 반응속도를 알려드려요."
        })
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    await interaction.editReply({
      content: `> Message Latency **${new Date().getTime() - interaction.createdTimestamp}ms**\n> Client Latency **${this.container.client.ws.ping}ms**`
    });
  }
}
