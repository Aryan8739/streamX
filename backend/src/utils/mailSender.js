import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'streamX <onboarding@resend.dev>', // Change to your verified domain in production
            to: [email],
            subject: title,
            html: body,
        });

        if (error) {
            console.error("Resend Error:", error);
            return null;
        }

        console.log("Email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("Mail Sender Error:", error.message);
        return null;
    }
};

export default mailSender;
