const authConfig = require("./authconfig");

// simulate route handler returning stub session
module.exports = async (req, res) => {
    if (req.method === "GET") {
        const user = await authConfig.providers.find(p => p.name === "OIDC").authorize();
        return res.json({ user });
    }
};
