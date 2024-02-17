import { Command } from "@sapphire/framework";

export class Stop extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, {
      ...options,
      fullCategory: ["Audio"],
      requiredClientPermissions: [
        "SendMessages",
        "Connect",
        "Speak",
        "EmbedLinks"
      ]
    });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName("stop")
        .setDescription("Stop the player and reset the queue.")
        .setDescriptionLocalizations({
          ko: "재생중인 음악을 정지하고 대기열을 초기화 해요."
        })
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const player = await this.container.client.audio.getPlayer(
      interaction.guildId!
    );
    if (!player)
      return interaction.reply({
        content: "> ⚠️ 음악을 재생중일 때만 사용할 수 있어요.",
        ephemeral: true
      });

    player.destroy();
    return interaction.reply({
      content: "> 👋 재생중인 음악을 정지하고 대기열을 초기화 했어요."
    });
  }
}
