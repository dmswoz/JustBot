import { Command } from "@sapphire/framework";

export class Pause extends Command {
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
        .setName("pause")
        .setDescription("Pause the music.")
        .setDescriptionLocalizations({
          ko: "재생중인 음악을 일시정지/다시재생 합니다."
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

    player.pause(player.playing);
    return interaction.reply({
      content: `> ✅ 음악을 ${player.paused ? "일시정지" : "다시재생"} 합니다.`
    });
  }
}
