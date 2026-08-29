// const requiredEnvVariables = [
//   "MONGODB_URI",
//   "JWT_SECRET",
//   "REFRESH_TOKEN_SECRET",
//   "CLIENT_URL",
// ];

// const validateEnvironment = () => {
//   const missingVariables = requiredEnvVariables.filter(
//     (variable) => !process.env[variable]
//   );

//   if (missingVariables.length > 0) {
//     throw new Error(
//       `Missing environment variables: ${missingVariables.join(", ")}`
//     );
//   }
// };

// module.exports = validateEnvironment;

const requiredEnvVariables = ["MONGODB_URI"];

const validateEnvironment = () => {
  const missingVariables = requiredEnvVariables.filter(
    (variable) => !process.env[variable]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(", ")}`
    );
  }
};

module.exports = validateEnvironment;