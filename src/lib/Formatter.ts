import moment from "moment-timezone";

export class Formatter {
  public static FormatTimezone(date: Date): string {
    return date
      ? moment(date).tz("Asia/Seoul").format("YYYY/MM/DD hh:mm:ss A (Z)")
      : moment(date).format("Asia/Seoul");
  }

  public static humanizeSec(sec: number, ms?: boolean): string {
    if (ms) sec = sec / 1000;
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor(sec / 60) % 60;
    const secs = Math.floor(sec % 60);

    return [hrs, mins, secs]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }
}
