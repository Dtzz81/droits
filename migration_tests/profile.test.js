const { createRequest, createResponse } = require("node-mocks-http");

jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}), { virtual: true });

const { getServerSession } = require("next-auth");
const handler = require("./profile");

describe("GET profile (protected route)", () => {
    it("returns 401 when no session exists", async () => {
        // Arrange: Mock no session
        getServerSession.mockResolvedValueOnce(null);

        const req = createRequest({
            method: "GET",
        });
        const res = createResponse();

        // Act
        await handler(req, res);

        // Assert
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
    });
    it("returns 200 and user info when session exists", async () => {
        const mockUser = { name: "Alice", email: "alice@example.com" };

        // Arrange: Mock a session
        getServerSession.mockResolvedValueOnce({ user: mockUser });

        const req = createRequest({ method: "GET" });
        const res = createResponse();

        // Act
        await handler(req, res);

        // Assert
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ user: mockUser });
    });

});
