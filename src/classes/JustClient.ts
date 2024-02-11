import { config } from "dotenv";
import { SapphireClient, LogLevel } from "@sapphire/framework";
import { GatewayIntentBits, Message, TextChannel } from "discord.js";
import "@sapphire/plugin-logger/register";
import { Kazagumo } from "kazagumo";
import { Connectors } from "shoukaku";
import Dokdo from "dokdo";
import { Formatter } from "../lib/Formatter";

config();

declare module "discord.js" {
  interface Client {
    dokdo: Dokdo;
    audio: Kazagumo;
  }
}

export class JustClient extends SapphireClient {
  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
      ],
      defaultPrefix: "..",
      loadMessageCommandListeners: true,
      logger: {
        level:
          process.env.NODE_ENV === "development"
            ? LogLevel.Debug
            : LogLevel.Info
      },
      allowedMentions: {
        repliedUser: false
      }
    });
  }

  private async _init() {
    this.dokdo = new Dokdo(this, {
      prefix: "..",
      aliases: ["dokdo", "dok"],
      noPerm: (message: Message) =>
        message.reply(`> ⚠️ 요청 거부됨. 권한을 확인하세요.`)
    });

    this.audio = new Kazagumo(
      {
        defaultSearchEngine: "youtube",
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        }
      },
      new Connectors.DiscordJS(this),
      [
        {
          name: process.env.LAVA_NAME!,
          url: `${process.env.LAVA_HOST}:${process.env.LAVA_PORT}`,
          auth: process.env.LAVA_AUTH!,
          secure: false
        }
      ]
    );

    this.audio.shoukaku.on("ready", (name, resumed) =>
      this.logger.info(
        `[Plugin#Audio:Ready] Lavalink Node: ${name} is now connected. This connection is ${resumed ? "resumed" : "a new connection"}.`
      )
    );
    this.audio.shoukaku.on("error", (name, error) =>
      this.logger.error(
        `[Plugin#Audio:Error] Lavalink Node: ${name} emitted an error. ${error.stack}`
      )
    );
    this.audio.shoukaku.on("close", (name, code, reason) =>
      this.logger.warn(
        `[Plugin#Audio:Warn] Lavalink Node: ${name} closed with code ${code}. Reason: ${reason || "No reason."}`
      )
    );
    // this.audio.shoukaku.on("disconnect", (name, players, moved) => {
    //   if(moved) return;
    //   players.map((player) => player.connection.disconnect());
    //   this.logger.warn(`[Plugin#Audio:Warn] Lavalink Node: ${name} disconnected.`);
    // });
    this.audio.shoukaku.on("debug", (name, data) =>
      this.logger.debug(
        `[Plugin#Audio:Debug] Lavalink Node: ${name} - Data: ${JSON.stringify(data)}`
      )
    );

    // this.audio.on("playerStart", (player, track) => {
    //   (this.channels.cache.get(player.textId!) as TextChannel).send({
    //     content: `> 재생 시작: **${track.title} [${track.isStream ? "라이브 스트림" : Formatt}]**`
    //   })
    // })
  }

  public async start() {
    await this._init();
    return this.login(process.env.CLI_TOKEN);
  }
}
