import { regexProtectSensitiveData } from "./regex";

const COLORS = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
  none: "",
} as const;

export type LoggerLevel = "INFO" | "WARN" | "SUCCESS" | "ERROR" | "DEBUG" | "DEFAULT";

const LEVEL_LOGGER_COLOR: Record<LoggerLevel, string> = {
  DEFAULT: COLORS["reset"],
  ERROR: COLORS["red"],
  INFO: COLORS["cyan"],
  SUCCESS: COLORS["green"],
  WARN: COLORS["yellow"],
  DEBUG: COLORS["purple"],
};

export type LoggerOption = {
  scope: string;
  level?: LoggerLevel;
  color?: boolean;
};

export type LogData = {
  level: LoggerLevel;
  scope: string;
  timestamp: string;
  message: string;
  meta: string;
};

function sanitizeLog(text: string): string {
  return text
    .replace(/\s{1,}/g, " ")
    .replace(/\\n/g, "")
    .replace(/\\/g, "\\")
    .replace(/"/g, '"')
    .replace(regexProtectSensitiveData, `"$1":"********"`);
}

export class TerminalLogger {
  static firstLog: boolean = false;

  static DEFAULT_LOGGER_OPTIONS: LoggerOption = {
    level: "INFO",
    scope: "GLOBAL",
    color: true,
  };

  static createLog(message: string, options?: LoggerOption, ...meta: string[]): LogData {
    let timestamp: string = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    let scope = options?.scope ?? TerminalLogger.DEFAULT_LOGGER_OPTIONS.scope;
    let level = options?.level ?? (TerminalLogger.DEFAULT_LOGGER_OPTIONS.level as LoggerLevel);
    let metaData: string = meta?.length ? meta.toString() : "";
    const color = options?.color ?? TerminalLogger.DEFAULT_LOGGER_OPTIONS.color;

    if (process.env.NODE_ENV === "development" && color) {
      timestamp = LEVEL_LOGGER_COLOR["WARN"].concat(
        timestamp,
        LEVEL_LOGGER_COLOR["WARN"],
        LEVEL_LOGGER_COLOR["DEFAULT"]
      );
      message = LEVEL_LOGGER_COLOR[level].concat(message, LEVEL_LOGGER_COLOR["DEFAULT"]);
      scope = LEVEL_LOGGER_COLOR["DEBUG"].concat(scope, LEVEL_LOGGER_COLOR["DEFAULT"]);
      level = LEVEL_LOGGER_COLOR[level].concat(level, LEVEL_LOGGER_COLOR["DEFAULT"]) as LoggerLevel;
      metaData = meta ? LEVEL_LOGGER_COLOR["WARN"].concat(meta.toString(), LEVEL_LOGGER_COLOR["DEFAULT"]) : "";
    }

    return {
      level,
      scope,
      timestamp,
      message: sanitizeLog(message),
      meta: sanitizeLog(metaData),
    };
  }

  static log(message: string, options?: LoggerOption, ...meta: string[]): LogData {
    if (!TerminalLogger.firstLog) {
      process.stdout.write("\n\r");
    }

    const dataLog = TerminalLogger.createLog(message, options, ...meta);

    process.stdout.write(
      `{"level":"${dataLog.level}", "scope":"${dataLog.scope}", "timestamp":"${dataLog.timestamp}", "message":"${dataLog.message}", "meta":"${dataLog.meta}"},\n`
    );

    TerminalLogger.firstLog = true;

    return dataLog;
  }
}
