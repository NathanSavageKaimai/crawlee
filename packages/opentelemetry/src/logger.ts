import type { Telemetry } from "@crawlee/types";

import type { LoggerOptions, LogLevel } from "@apify/log";
import { Log } from "@apify/log";

export class OpenTelemetryLogger extends Log {
    constructor(private readonly baseLogger: Log, private readonly telemetry: Telemetry) {
        super();
    }

    override  internal(level: LogLevel, message: string, data?: any, exception?: any) {
        if (level > this.getLevel()) return;
        this.baseLogger.internal(level, message, data, exception);
        this.telemetry.addEvent(message, {
            ...data,
            ...exception,
            level,
        });
    }

    override child(options: Partial<LoggerOptions>): Log {
        return new OpenTelemetryLogger(this.baseLogger.child(options), this.telemetry);
    }
}