function doesWindowConsoleExist(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.console !== "undefined" &&
    window.console != null
  );
}

export function log(subsystem: string, message: string): void {
  if (doesWindowConsoleExist()) {
    window.console.log(`[${subsystem}] ${message}`);
  }
}

export function logWarn(subsystem: string, message: string): void {
  if (doesWindowConsoleExist()) {
    window.console.warn(`[${subsystem}] ${message}`);
  }
}

export function logError(subsystem: string, message: string): void {
  if (doesWindowConsoleExist()) {
    window.console.error(`[${subsystem}] ${message}`);
  }
}
