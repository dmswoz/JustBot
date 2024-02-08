import moment from "moment-timezone";

export class Formatter {
  public static FormatTimezone(date: any): string {
    return date
      ? moment(date).tz("Asia/Seoul").format("YYYY/MM/DD hh:mm:ss A (Z)")
      : moment(date).format("Asia/Seoul");
  }
}
