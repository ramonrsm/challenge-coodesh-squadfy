const UNIT_SECONDS = 1000;
const UNIT_MINUTES = 60000;
const UNIT_HOURS = 3600000;
const UNIT_DAYS = 86400000;

export class ExecutionTime {
  private static timers = new Map<string, number>();

  constructor() {}

  static start(label: string): void {
    ExecutionTime.timers.set(label, Date.now());
  }

  static end(label: string): string {
    const start = ExecutionTime.timers.get(label);

    if (!start) {
      throw new Error(`Timer ${label} not found`);
    }

    const end = Date.now();
    const time = end - start;

    let elapsedTime = `${time}ms`;

    if (time >= UNIT_DAYS) {
      elapsedTime = `${time / UNIT_DAYS}d`;
    } else if (time >= UNIT_HOURS) {
      elapsedTime = `${time / UNIT_HOURS}h`;
    } else if (time >= UNIT_MINUTES) {
      elapsedTime = `${time / UNIT_MINUTES}m`;
    } else if (time >= UNIT_SECONDS) {
      elapsedTime = `${time / UNIT_SECONDS}s`;
    }

    ExecutionTime.timers.delete(label);

    return elapsedTime;
  }
}
