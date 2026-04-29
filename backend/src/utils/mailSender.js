import nodemailer from 'nodemailer';
import { ApiError } from './ApiError.js';

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000
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
        console.log("Error occurred while sending mail: ", error.message);
        throw new ApiError(500, "Error occurred while sending mail");
    }
};

export default mailSender;
