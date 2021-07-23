import response from "./response";

export default function errors(err, req, res, next) {
  console.error("[error]", err);

  const message = err.message || "error interno";
  const status = err.statusCode || 500;

  response.error(req, res, message, status);
}
