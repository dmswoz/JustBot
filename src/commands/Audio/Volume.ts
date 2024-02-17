import { Command } from "@sapphire/framework";
import { Formatter } from "../../lib/Formatter";

export class Volume extends Command {
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
        .setName(`volume`)
        .setDescription(`Set or view the player volume.`)
        .setDescriptionLocalizations({
          ko: `현재 음량을 보거나 설정합니다.`
        })
        .addIntegerOption((option) =>
          option
            .setName(`volume`)
            .setNameLocalizations({
              ko: `음량`
            })
            .setDescription(`Volume (between 1% and 100%)`)
            .setDescriptionLocalizations({
              ko: `음량 (1% - 100% 사이)`
            })
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const volume: number | null = interaction.options.getInteger(`volume`);
    const player = await this.container.client.audio.getPlayer(
      interaction.guildId!
    );

    if (!player)
      return interaction.reply({
        content: `> ⚠️ 음악을 재생중일 때만 사용할 수 있어요.`,
        ephemeral: true
      });
    if (!volume) {
      return interaction.reply({
        content: `> ${Formatter.volumeInt(player.volume)} 현재 음량은 **${player.volume * 100}%** 입니다.`
      });
    } else {
      if (volume > 100) {
        return interaction.reply({
          content: `> ❗ 실패. 음량은 100을 초과로 설정할 수 없어요.`,
          ephemeral: true
        });
      } else if (volume < 0) {
        return interaction.reply({
          content: `> ❗ 실패. 음량은 0을 미만으로 설정할 수 없어요.`,
          ephemeral: true
        });
      }

      player.setVolume(volume);
      return interaction.reply({
        content: `> ✅ 음량을 **${player.volume * 100}%**로 설정했어요.`
      });
    }
  }
}
