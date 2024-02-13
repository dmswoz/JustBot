import { Command } from "@sapphire/framework";
import { GuildMember } from "discord.js";
import { Messages } from "../../lib/Messages";

export class Play extends Command {
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
        .setName(`play`)
        .setDescription(`Play a track or playlist.`)
        .setDescriptionLocalizations({
          ko: `음악 또는 플레이리스트를 재생해요.`
        })
        .addStringOption((option) =>
          option
            .setName(`query`)
            .setNameLocalizations({
              ko: `검색어`
            })
            .setDescription(`Query to search and play.`)
            .setDescriptionLocalizations({
              ko: `재생하고자 하는 음악의 제목, URL을 입력하세요.`
            })
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName(`applemusic`)
            .setNameLocalizations({
              ko: `애플뮤직`
            })
            .setDescription(`Search query on Apple Music.`)
            .setDescriptionLocalizations({
              ko: `애플뮤직에서 음악을 재생해요.`
            })
            .setRequired(false)
        )
    );
  }

  public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const query: string = interaction.options.getString(`query`, true);
    if (query.length <= 0) {
      await interaction.reply({
        content: `💡 검색어 또는 URL을 입력해야 합니다.`,
        ephemeral: true
      });
      return;
    }

    if (!this.container.client.audio.getPlayer(interaction.guildId!)) {
      const { voice } = interaction.member as GuildMember;
      if (!voice.channel)
        return interaction.reply({
          content: `> ⚠️ 요청 거부됨. 음성채널에 먼저 접속해야 합니다.`,
          ephemeral: true
        });

      try {
        await this.container.client.audio.createPlayer({
          guildId: interaction.guildId!,
          textId: interaction.channelId,
          voiceId: voice.channelId!,
          volume: 70,
          deaf: true
        });
      } catch (e) {
        return await interaction.reply({
          content: `> ❗ 실패. 음성채널 접속에 실패했어요. 다시시도 해주세요.`,
          ephemeral: true
        });
      }
    }

    await interaction.deferReply();

    const player = await this.container.client.audio.getPlayer(
      interaction.guildId!
    );
    const ap = interaction.options.getBoolean(`applemusic`, false);
    const searchResult = await this.container.client.audio.search(query, {
      engine: ap ? `apple` : `youtube`,
      requester: interaction.user
    });

    if (searchResult.type === "PLAYLIST") {
      if (player!.queue.length <= 0) {
        if (player!.playing || player!.paused) {
          interaction.editReply(
            await Messages.getPlaylistQueueEmbed(searchResult, player!)
          );
        } else
          interaction.editReply(await Messages.getPlaylistEmbed(searchResult));
      } else
        interaction.editReply(
          await Messages.getPlaylistQueueEmbed(searchResult, player!)
        );

      for (const track of searchResult.tracks) player?.queue.add(track);
    } else if (searchResult.type === "SEARCH") {
      if (player!.queue.length <= 0) {
        if (player!.playing || player!.paused) {
          interaction.editReply(
            await Messages.getTrackQueueEmbed(
              searchResult,
              player!,
              interaction.user
            )
          );
        } else
          interaction.editReply(
            await Messages.getTrackEmbed(searchResult, interaction.user)
          );
      } else
        interaction.editReply(
          await Messages.getTrackQueueEmbed(
            searchResult,
            player!,
            interaction.user
          )
        );

      player?.queue.add(searchResult.tracks[0]);
    }

    if (!player?.playing && !player?.paused) player?.play();
  }
}
