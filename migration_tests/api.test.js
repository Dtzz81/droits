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

const handler = require("./nextauth-wrapper");

describe("Azure AD OIDC login route", () => {
    test("returns user session when logged in via OIDC", async () => {
        const req = { method: "GET", headers: {} };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await handler(req, res); // call the wrapper

        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                user: expect.objectContaining({
                    name: "Test OIDC User",
                    email: "oidcuser@example.com",
                }),
            })
        );
    });
});
