type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVEL: LogLevel = 'warn'

class CustomLogger {
  private logLevel: LogLevel
  private colorMap: Record<LogLevel, string> = {
    debug: 'color: blue',
    info: 'color: green',
    warn: 'color: orange',
    error: 'color: red',
  }

  private levels: LogLevel[] = ['debug', 'info', 'warn', 'error']

  constructor(logLevel: LogLevel = 'warn') {
    this.logLevel = logLevel
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level
  }

  private log(message: string, data: any, level: LogLevel) {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toLocaleString(navigator.language)
      console.log(
        `%c[${timestamp}] ${level.toUpperCase()}: ${message}`,
        this.colorMap[level]
      )
      if (data && typeof data === 'object') {
        console.log(data)
      } else if (data !== undefined) {
        console.log(data)
      }
    }
  }

  debug(message: string, data?: any) {
    this.log(message, data, 'debug')
  }

  info(message: string, data?: any) {
    this.log(message, data, 'info')
  }

  warn(message: string, data?: any) {
    this.log(message, data, 'warn')
  }

  error(message: string, data?: any) {
    this.log(message, data, 'error')
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels.indexOf(level) >= this.levels.indexOf(this.logLevel)
  }
}

export const logger = new CustomLogger(LOG_LEVEL)
