describe("AuthConfig", () => {
    test("has a providers array and a jwt session strategy", () => {
        const authConfig = require("./authconfig"); 

        expect(authConfig.providers).toBeInstanceOf(Array);
        expect(authConfig.session.strategy).toBe("jwt");

        // JWT = JSON Web Token.
        //     It’s a compact, signed token that represents the user's session data.
    });
});
