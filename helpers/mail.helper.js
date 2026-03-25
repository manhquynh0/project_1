const nodemailer = require("nodemailer");
module.exports.sendMail =async(email,otp) => {
    const secure = process.env.SMTP_SECURE == "true"
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure:secure , // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}); 
try {
  const info = await transporter.sendMail({
    from: `<${process.env.SMTP_USER}>`, // sender address
    to: email, // list of recipients
    subject: "CÔNG TY MANHQUYNHDZ", // subject line
    text: "OTP", // plain text body
  html: `
  <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 30px; border-radius: 10px; text-align: center;">
      
      <h2 style="color: #333;">🔐 Xác nhận OTP</h2>
      
      <p style="color: #555; font-size: 14px;">
        Công ty MANHQUYNHDZ đã gửi cho bạn mã OTP để xác thực.
      </p>

      <div style="margin: 20px 0;">
        <span style="
          display: inline-block;
          font-size: 32px;
          font-weight: bold;
          color: #ffffff;
          background: #007bff;
          padding: 15px 25px;
          border-radius: 8px;
          letter-spacing: 5px;
        ">
          ${otp}
        </span>
      </div>

      <p style="color: #888; font-size: 13px;">
        Mã OTP có hiệu lực trong 5 phút.
      </p>

      <hr style="margin: 20px 0;">

      <p style="color: #aaa; font-size: 12px;">
        Nếu bạn không yêu cầu, vui lòng bỏ qua email này.
      </p>

    </div>
  </div>
` // HTML body
  });
   console.log("OTP:", otp); 
    console.log("Message sent:", info.messageId);
    return otp; 
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}