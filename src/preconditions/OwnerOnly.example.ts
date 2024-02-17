import { Precondition } from "@sapphire/framework";
import type { CommandInteraction, Message } from "discord.js";

export class OwnerOnly extends Precondition {
  public override async messageRun(message: Message) {
    return this.checkOwner(message.author.id);
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  private async checkOwner(userId: string) {
    return ["OWNERID1"].includes(userId)
      ? this.ok()
      : this.error({ message: "> ⚠️ 요청 거부됨. 권한을 확인하세요." });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}

export default undefined;
