const nodemailer = require("nodemailer");
 
exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, msg: "Missing fields" });
  }

  // build html
  const html = `<h2>New message from Naomi Nation website</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "stub@example.com",
      pass: process.env.GMAIL_PASS || "stubPass",
    },
  });

  // If creds are stub, skip real send.
  const isStub = (transporter.options.auth.user === "stub@example.com");

  try {
    if (!isStub) {
      await transporter.sendMail({
        from: `Naomi Nation <${transporter.options.auth.user}>`,
        to: "yoonveee@gmail.com",
        subject: "Feedback from Naomi Nation",
        html,
      });
    } else {
      console.log("[MAIL STUB] would send to yoonveee@gmail.com", { name, email, message });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Email send error", err);
    res.status(500).json({ success: false, msg: "Email send error" });
  }
};
