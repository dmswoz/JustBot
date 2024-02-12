import { EmbedBuilder, User } from "discord.js";
import { KazagumoPlayer, KazagumoSearchResult } from "kazagumo";
import { Formatter } from "./Formatter";

export class Messages {
  public static async getPlaylistEmbed(result: KazagumoSearchResult) {
    return {
      content: `> ✅ **${result.tracks[0].title} [${result.tracks[0].isStream ? `라이브스트림` : Formatter.humanizeSec(result.tracks[0].length!, true)}]**이 곧 재생됩니다.`,
      embeds: [
        new EmbedBuilder()
          .setTitle(`🗂️ 플레이리스트`)
          .setDescription(
            `플레이리스트 **${result.playlistName}**의 음악 **${result.tracks.length - 1}개**를 대기열에 추가했어요.`
          )
          .setColor("#c6beb9")
      ]
    };
  }

  public static async getPlaylistQueueEmbed(
    result: KazagumoSearchResult,
    player: KazagumoPlayer
  ) {
    return {
      content: `> ✅ **${result.tracks[0].title} [${result.tracks[0].isStream ? `라이브스트림` : Formatter.humanizeSec(result.tracks[0].length!, true)}]**을 대기열 **#${player.queue && player.queue.length + 1}**에 추가했어요.`,
      embeds: [
        new EmbedBuilder()
          .setTitle(`🗂️ 플레이리스트`)
          .setDescription(
            `플레이리스트 **${result.playlistName}**의 음악 **${result.tracks.length - 1}개**를 대기열에 추가했어요.`
          )
          .setColor("#c6beb9")
      ]
    };
  }

  public static async getTrackEmbed(
    result: KazagumoSearchResult,
    interaction: User /**, sc: Boolean*/
  ) {
    return {
      content: `> ✅ 음악이 곧 재생됩니다.`,
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.tag,
            iconURL: interaction.displayAvatarURL()
          })
          .setDescription(
            `[${result.tracks[0].title} [${result.tracks[0].isStream ? `라이브스트림` : Formatter.humanizeSec(result.tracks[0].length!, true)}]](${result.tracks[0].uri})`
          )
          .setFooter({ text: `Artist: ${result.tracks[0].author}` })
          .setThumbnail(
            /** sc ? result.tracks[0].thumbnail! : */ `https://img.youtube.com/vi/${result.tracks[0].identifier}/maxresdefault.jpg`
          )
          .setColor("#c6beb9")
      ]
    };
  }

  public static async getTrackQueueEmbed(
    result: KazagumoSearchResult,
    player: KazagumoPlayer,
    interaction: User /**, sc: Boolean*/
  ) {
    return {
      content: `> ✅ 음악을 대기열 **#${player.queue && player.queue.length + 1}**에 추가했어요.`,
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.tag,
            iconURL: interaction.displayAvatarURL()
          })
          .setDescription(
            `[${result.tracks[0].title} [${result.tracks[0].isStream ? `라이브스트림` : Formatter.humanizeSec(result.tracks[0].length!, true)}]](${result.tracks[0].uri})`
          )
          .setFooter({ text: `Artist: ${result.tracks[0].author}` })
          .setThumbnail(
            /** sc ? result.tracks[0].thumbnail! : */ `https://img.youtube.com/vi/${result.tracks[0].identifier}/maxresdefault.jpg`
          )
          .setColor("#c6beb9")
      ]
    };
  }
}
