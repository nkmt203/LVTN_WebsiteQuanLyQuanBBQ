require("dotenv").config();

console.log("DEBUG JWT env:", {
  SECRET: process.env.JWT_SECRET ? "có" : "THIẾU",
  EXPIRES_IN: process.env.JWT_EXPIRES_IN,
});

module.exports = {
  SECRET: process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "12",
};
