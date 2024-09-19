'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // Interceptar el evento de registro de usuario y enviar email de bienvenida
    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async afterCreate(event) {
        const { result } = event;
        const emailService = strapi.plugins['email'].services.email;

        try {
          await emailService.send({
            to: process.env.SMTP_DEFAULT_FROM,
            from: process.env.SMTP_DEFAULT_FROM,
            subject: '¡Nuevo usuario registrado en MagisTV!',
            html: `
              <h1>Se ha detectado un nuevo registro de usuario en tu web de MagisTV.</h1>
              <h2>El nombre de usuario es: </h2><span>${result.username}</span>
              <p>Puedes verlo desde el siguiente link: <a href="${process.env.STRAPI_URL}/admin/content-manager/collection-types/plugin::users-permissions.user?page=1&pageSize=10&sort=username:ASC&filters[$and][0][username][$eq]=${result.username}">ir a strapi</a></p>`,
          });
        } catch (err) {
          console.error('Error al enviar correo:', err);
        }
      },
    });
  },
};
