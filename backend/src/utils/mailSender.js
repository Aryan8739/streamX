import nodemailer from 'nodemailer';
import { ApiError } from './ApiError.js';

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN
            }
        });

        let info = await transporter.sendMail({
            from: `"streamX" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Email info: ", info);
        return info;
    } catch (error) {
        console.log("Error occurred while sending mail: ", error);
        throw new ApiError(500, "Mail Error: " + error.message);
    }
};

export default mailSender;
