import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    action: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      default: "GENERAL",
    },

    severity: {
      type: String,
      enum: ["INFO", "WARN", "ERROR"],
      default: "INFO",
    },

    method: String,
    route: String,
    statusCode: Number,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Auto-delete logs after 90 days
auditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 }
);

export default mongoose.model("AuditLog", auditLogSchema);