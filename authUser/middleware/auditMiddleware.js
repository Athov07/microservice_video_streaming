import AuditLog from "../models/AuditLog.js";

export const auditLogger = ({
  action,
  module = "GENERAL",
  severity = "INFO",
}) => {
  return (req, res, next) => {
    res.on("finish", async () => {
      try {
        await AuditLog.create({
          user: req.user?.id || null,
          action,
          module,
          severity,
          method: req.method,
          route: req.originalUrl,
          statusCode: res.statusCode,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        });
      } catch (error) {
        console.error("Audit log error:", error.message);
      }
    });

    next();
  };
};