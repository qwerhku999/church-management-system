const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

const validateEnv = () => {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is required in production.");
  }

  const weakSecrets = ["JWT_SECRET", "JWT_REFRESH_SECRET"].filter((name) => {
    const value = process.env[name] || "";
    return value.length < 32;
  });

  if (weakSecrets.length > 0) {
    throw new Error(`JWT secrets must be at least 32 characters: ${weakSecrets.join(", ")}`);
  }
};

const parseOrigins = (value) => {
  if (!value) return [];
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const getAllowedOrigins = () => {
  const configuredOrigins = parseOrigins(process.env.FRONTEND_URL);

  if (process.env.NODE_ENV === "production") {
    return configuredOrigins;
  }

  return Array.from(
    new Set([
      ...configuredOrigins,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ])
  );
};

module.exports = {
  validateEnv,
  getAllowedOrigins,
};
