const authConfig = require( "../migration_tests/authConfig" );

describe("GitHub login flow", () => {
    test("user session is returned after login", async () => {
        const user = await authConfig.providers[0].authorize();
        const session = {user};

        expect(session).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    name: "Test User",
                    email: "testuser@example.com",
                }),
            })
        );
    });
});

describe("OIDC login flow", () => {
    test("user session is returned after login", async () => {

        const user = await authConfig.providers.find(p => p.name === "OIDC").authorize();
        const session = { user }; // simulate session

        expect(session).toEqual(
            expect.objectContaining({
                user: expect.objectContaining({
                    name: "Test OIDC User",
                    email: "oidcuser@example.com",
                }),
            })
        );
    });
});
