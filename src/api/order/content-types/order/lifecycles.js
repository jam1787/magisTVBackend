module.exports = {
    async afterCreate(event) {
        const { result } = event

        try {
            await strapi.plugins['email'].services.email.send({
                to: result.email,
                from: process.env.SMTP_DEFAULT_FROM,
                bcc: process.env.BCC_EMAIL,
                subject: '¡Gracias por tu compra en MagisTV!',
                text: `
                    <p>¡Gracias por elegir MagisTV! A continuación, encontrarás los detalles de tu compra:</p>
                    
                    <h3>Resumen de tu orden:</h3>
                    <ul>
                        <li><strong>Plan:</strong> ${result.plan}</li>
                        <li><strong>Precio:</strong> USD ${result.amount}</li>
                        <li><strong>Tienes acceso hasta:</strong> ${result.subscriptionEndDate}</li>
                        <li><strong>Identificador de pago:</strong> ${result.paymentID}</li>
                    </ul>

                    <p>Esperamos que disfrutes de nuestro servicio. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>

                    <p>Saludos cordiales,<br>
                    El equipo de MagisTV</p>

                    <p><small>Para más información o soporte, puedes enviar un mensaje a nuestro <a href="https://wa.link/71fjq4">WhatsApp</a>.</small></p>
                `
            })
        } catch (error) {
            console.log(error)
        }
    }
}