const ONE_HOUR_IN_SECONDS = 3600;
const ONE_MINUTE_IN_SECONDS = 60;

export class RootUseCase {
  async execute(): Promise<string> {
    const uptime = Math.floor(process.uptime());

    const hours = Math.floor(uptime / ONE_HOUR_IN_SECONDS);
    const minutes = Math.floor((uptime % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS);
    const seconds = Math.floor(uptime % ONE_MINUTE_IN_SECONDS);

    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
