import { Request, Response, NextFunction } from "express";

// Basic configuration interface
interface LoggingOptions {
  includeHeaders?: boolean;
  includeQuery?: boolean;
  includeBody?: boolean;
  excludeFields?: string[];
  maxBodyLength?: number;
  logLevel?: "info" | "debug" | "log";
}

// Default options
const defaultOptions: LoggingOptions = {
  includeHeaders: false,
  includeQuery: true,
  includeBody: true,
  excludeFields: ["password", "token", "secret", "authorization"],
  maxBodyLength: 1000,
  logLevel: "info",
};

// Utility function to sanitize sensitive data
const sanitizeObject = (obj: any, excludeFields: string[]): any => {
  if (!obj || typeof obj !== "object") return obj;

  const sanitized = { ...obj };

  for (const field of excludeFields) {
    if (field.toLowerCase() in sanitized) {
      sanitized[field.toLowerCase()] = "[REDACTED]";
    }
    if (field in sanitized) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
};

// Utility function to truncate large bodies
const truncateBody = (body: any, maxLength: number): any => {
  const bodyStr = JSON.stringify(body);
  if (bodyStr.length <= maxLength) return body;

  return {
    ...body,
    _truncated: true,
    _originalLength: bodyStr.length,
    _message: `Body truncated (original length: ${bodyStr.length} chars)`,
  };
};

// Main logging middleware
export const apiInputLogger = (options: LoggingOptions = {}) => {
  const config = { ...defaultOptions, ...options };

  return (req: Request, res: Response, next: NextFunction) => {
    const timestamp = new Date().toISOString();
    const requestId =
      req.headers["x-request-id"] || Math.random().toString(36).substr(2, 9);

    // Build log object
    const logData: any = {
      timestamp,
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    };

    // Add query parameters if enabled
    if (config.includeQuery && Object.keys(req.query).length > 0) {
      logData.query = sanitizeObject(req.query, config.excludeFields!);
    }

    // Add request body if enabled
    if (config.includeBody && req.body && Object.keys(req.body).length > 0) {
      let sanitizedBody = sanitizeObject(req.body, config.excludeFields!);
      sanitizedBody = truncateBody(sanitizedBody, config.maxBodyLength!);
      logData.body = sanitizedBody;
    }

    // Add headers if enabled
    if (config.includeHeaders) {
      logData.headers = sanitizeObject(req.headers, config.excludeFields!);
    }

    // Log based on configured level
    const logMessage = `[API REQUEST] ${req.method} ${req.originalUrl || req.url}`;

    switch (config.logLevel) {
      case "debug":
        console.debug(logMessage, logData);
        break;
      case "log":
        console.log(logMessage, logData);
        break;
      default:
        console.info(logMessage, logData);
    }

    // Add request ID to response headers for tracing
    res.setHeader("X-Request-ID", requestId);

    next();
  };
};

// Specialized middleware for different environments
export const developmentLogger = apiInputLogger({
  includeHeaders: true,
  includeQuery: true,
  includeBody: true,
  logLevel: "debug",
  maxBodyLength: 2000,
});

export const productionLogger = apiInputLogger({
  includeHeaders: false,
  includeQuery: true,
  includeBody: true,
  logLevel: "info",
  maxBodyLength: 500,
  excludeFields: [
    "password",
    "token",
    "secret",
    "authorization",
    "apiKey",
    "sessionId",
  ],
});

// Minimal logger for high-traffic routes
export const minimalLogger = apiInputLogger({
  includeHeaders: false,
  includeQuery: false,
  includeBody: false,
  logLevel: "info",
});
