const {getServerSession} = require("next-auth")

module.exports = async function handler(req, res) {
    const session = await getServerSession(req, res);
    if (!session) {
        return res.status(401).json({error: "Unauthorized"});
    }
    return res.status(200).json({user: session.user});
};