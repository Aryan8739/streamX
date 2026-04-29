import axios from 'axios';
import { ApiError } from './ApiError.js';

const makeEmail = (to, from, subject, message) => {
    const str = [
        `To: ${to}`,
        `From: ${from}`,
        `Subject: ${subject}`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        message
    ].join('\r\n');

    return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

const getAccessToken = async () => {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token'
    });
    return response.data.access_token;
};

const mailSender = async (email, title, body) => {
    try {
        console.log(`Getting access token for ${process.env.MAIL_USER}...`);
        const accessToken = await getAccessToken();
        
        console.log(`Sending email to ${email} via Gmail HTTP API...`);
        const rawEmail = makeEmail(
            email, 
            `"streamX" <${process.env.MAIL_USER}>`, 
            title, 
            body
        );

        const response = await axios.post(
            'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
            { raw: rawEmail },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        console.log("Email info: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Error occurred while sending mail: ", error.response?.data || error);
        throw new ApiError(500, "Mail Error: " + (error.response?.data?.error?.message || error.message));
    }
};

export default mailSender;
