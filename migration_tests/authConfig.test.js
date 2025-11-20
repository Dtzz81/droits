const authConfig = require("./authconfig");

describe("AuthConfig", () => {
    test("has a providers array and a jwt session strategy", () => {
        const authConfig = require("./authconfig"); 

        expect(authConfig.providers).toBeInstanceOf(Array);
        expect(authConfig.session.strategy).toBe("jwt");

        // JWT = JSON Web Token.
        //     It’s a compact, signed token that represents the user's session data.
    });

    test("can add a GitHub provider", () => {
        // Expect providers array to include an object with a name "GitHub"
        const hasGitHub = authConfig.providers.some(
            (p) => p.name === "GitHub"
        );
        expect(hasGitHub).toBe(true); 
    });
    
    const handler = require("../webapp/api/auth/[...nextauth]");

    describe("NextAuth API", () => {
        test("API route handler can be imported", () => {
            expect(handler).toBeDefined();
        });
    });
});
