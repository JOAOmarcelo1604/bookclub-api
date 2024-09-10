import NodeMailJet from "node-mailjet";

const mailJet = NodeMailJet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAIL_SECRET_KEY
);
class Mail {
  async sendForgotPasswordMail(email, name, token) {
    try {
      const result = await mailJet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "marcelooliveira004@outlook.com",
              Name: "Joao  Marcelo",
            },
            To: [
              {
                Email: email,
                Name: name,
              },
            ],
            TemplateID: 6278744,
            TemplateLanguage: true,
            Subject: "Alteração de senha",
            Variables: {
              name: name,
              token: token,
            },
          },
        ],
      });
      return result;
    } catch (error) {
      return { error };
    }
  }
}

export default new Mail();
