const NextAuth = require("next-auth");

test("NextAuth is importable", () => {
    expect(typeof NextAuth.default).toBe("function");
});
