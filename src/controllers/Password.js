import nodemailer from "nodemailer";
import User from "../models/User";

class PasswordController {
  async store(req, res) {
    const { email = "" } = req.body;
    if (!email) return res.status(401).json({ errors: ["Invalid email address"] });

    const registeredEmail = await User.findOne({ where: { email } });
    const code = `${new Date(registeredEmail.dataValues.updated_at).toISOString()} ${new Date().toISOString()}`;
    const confirmationCode = Buffer.from(code).toString("base64");

    if (registeredEmail) {
      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: "contato@aldairgc.com",
          pass: "W@3e0poi@!!;,,8hGDer",
        },
      });

      const mailOptions = {
        from: "'Aldair Garros Carvalho', <contato@aldairgc.com>",
        to: email,
        subject: "Budget Password Reset",
        // eslint-disable-next-line no-multi-str
        html: ` \
        <h1>BUDGET</h1><hr> \
        <h2>Create a new password</h2> \
        <p>This email was sent due to a password reset request.</p> \
        <p>This link will only be valid for 10 minutes. If it's already expired, you have to request a new one.</p> \
        <a href="https://budget.aldairgc.com/?email=${email}&code=${confirmationCode}&loginopt=4" \
        style="padding: 5px; background: #555; border-radius: 5px; text-decoration: none; color: #eee;">Create new password</a> \
        <p>Thank you for using our webapp!</p> \
        <p style="border-top: 20px;">Aldair Garros</p> \
        `,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) return res.json({ passwordRequest: false });
        return res.json({ passwordRequest: true });
      });
    }

    return res.json({ passwordRequest: true });
  }

  async update(req, res) {
    const { registeredEmail = "", confirmationCode = "", password = "" } = req.body;
    const [requestUpdate, requestDate] = Buffer.from(confirmationCode, "base64").toString("utf-8").split(" ");

    function isRequestOutdated(date) {
      const now = new Date();
      const expirationDate = now.setMinutes(now.getMinutes() + 10);
      return date > expirationDate;
    }

    if (!registeredEmail) throw new Error("invalidEmail");
    if (isRequestOutdated(requestDate)) throw new Error("requestExpired");

    try {
      const user = await User.findOne({ where: { email: registeredEmail } });

      if (!user) throw new Error("unregisteredUser");
      if (new Date(user.updated_at).toISOString() !== requestUpdate) throw new Error("invalidRequest");

      const updatedUser = await user.update({ password });
      return res.json({ passwordUpdated: !!updatedUser });
    } catch (err) {
      return res.status(401).json({ error: err.message ?? "invalidRequest" });
    }
  }
}

export default new PasswordController();
