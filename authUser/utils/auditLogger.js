import AuditLog from "../models/AuditLog.js";

export const logActivity = async (req, action) => {
  try {
    await AuditLog.create({
      user: req.user?.id || null,
      action,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};