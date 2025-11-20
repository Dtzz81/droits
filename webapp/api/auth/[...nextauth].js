const NextAuth = require("next-auth").default;
const authConfig = require( "../../../migration_tests/authConfig");

module.exports = NextAuth(authConfig);

// This sets up the NextAuth API route.