import User from "../models/User";
import jwt from "jsonwebtoken";

class TokenController {
  async store(req, res) {
    const { email = "", password = "" } = req.body;
    if (!email || !password) return res.status(401).json({ errors: ["Invalid credentials"] });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ errors: ["This user does not exist"] });
    if (!(await user.checkPassword(password))) return res.status(401).json({ errors: ["Invalid password"] });

    const { id } = user;
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION });

    return res.json({ token, user: { id, name: user.name, email } });
  }
}

export default new TokenController();
