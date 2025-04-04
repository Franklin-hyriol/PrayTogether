import nodemailer from 'nodemailer';

// Définition de la fonction pour envoyer un email
export async function sendEmail(toEmail: string, messageBody: string): Promise<void> {
    // Configurer le transporteur SMTP
    const transporter = nodemailer.createTransport({
        host: "localhost",   // Serveur SMTP local
        port: 1025,          // Port du serveur SMTP local
        secure: false,       // Désactiver le SSL
    });

    // Options de l'email
    const mailOptions = {
        from: '"Votre Nom" <no-reply@example.com>',  // Adresse de l’expéditeur
        to: toEmail,                                  // Adresse du destinataire
        subject: 'Votre Sujet d’email',               // Sujet de l’email
        text: messageBody,                            // Corps du message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé :', info.response);
    } catch (error) {
        console.error('Erreur lors de l’envoi de l’email :', error);
        throw error;
    }
}
