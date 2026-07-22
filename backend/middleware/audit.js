const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const auditLog = (action, resource) => {
  return async (req, res, next) => {
    const start = Date.now();
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      const duration = Date.now() - start;
      try {
        if (req.user) {
          await AuditLog.create({
            user: req.user._id,
            userEmail: req.user.email,
            userRole: req.user.role,
            action,
            resource,
            resourceId: req.params.id || (body.data && body.data._id),
            description: `${action} ${resource}`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            statusCode: res.statusCode,
            success: body.success !== false,
            duration,
          });
        }
      } catch (error) {
        logger.error(`Audit log error: ${error.message}`);
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
