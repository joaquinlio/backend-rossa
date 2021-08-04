// Componentes
import express from "express";

export function success (req: express.Request, res: express.Response, message: any, code: number): void {
  let statusCode = code || 200;
  let statusMessage = message || "";

  res.status(code).json({
    error: false,
    status: statusCode,
    body: statusMessage,
  });
} 

export function error (req: express.Request, res: express.Response, message: any, code: number): void {
  let statusCode = code || 500;
  let statusMessage = message || "Internal server error";

  res.status(code).json({
    error: true,
    status: statusCode,
    body: statusMessage,
  });
}
