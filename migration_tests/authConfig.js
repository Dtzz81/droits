module.exports = {
    providers: [{
        name: "GitHub",
        clientId: "FAKE_CLIENT_ID",   // placeholder
        clientSecret: "FAKE_CLIENT_SECRET", // placeholder
        authorize: async () => {
            return {
                id: "123",
                name: "Test User",
                email: "testuser@example.com",
            };
        },
    },
    ],
    session: {
        strategy: "jwt"
    }
};
