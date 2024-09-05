import { User } from "../models";
import * as Yup from "yup";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  async login(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório"),
        password: Yup.string().required("Senha é obrigatório"),
      });
      await schema.validate(req.body);

      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        return res.status(401).json({ error: "Usuário ou senha não comferem" });
      }

      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password_hash
      );

      if (!checkPassword) {
        return res.status(401).json({ error: "Usuário ou senha não comferem" });
      }

      console.log({ hash: process.env.JWT_HASH });

      const token = jwt.sign({ id: user.id }, process.env.JWT_HASH, {
        expiresIn: "30d",
      });

      const { id, name, email, avatar_url, createdAt } = user;

      return res.json({
        user: {
          id,
          name,
          email,
          avatar_url,
          createdAt,
          token,
        },
      });
    } catch (error) {
      return res.status(400).json({ error: error?.message });
    }
  }

  async create(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Nome é obrigatório")
          .min(3, "Nome deve conter ao menos 3 caracteres"),
        email: Yup.string()
          .email("E-mail inválido")
          .required("E-mail é obrigatório"),
        password: Yup.string()
          .required("Senha é obrigatório")
          .min(6, "Senha deve conter ao menos 6 caracteres"),
      });

      await schema.validate(req.body);

      const existedUser = await User.findOne({
        where: { email: req.body.email },
      });

      if (existedUser) {
        return res.status(400).json({ error: "Usário já existe." });
      }

      const hashPassword = await bcrypt.hash(req.body.password, 8);

      const user = new User({
        ...req.body,
        password: "",
        password_hash: hashPassword,
      });

      await user.save();

      return res.json({ user });
    } catch (error) {
      console.log({ error });
      return res.status(400).json({ error: error?.message });
    }
  }

  async get(req, res) {
    if (!req.userId) {
      return res.status(400).json({ error: "Id não fornecido " });
    }

    const user = await User.findOne({ where: { id: Number(req.userId) } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json(user);
  }
}

export default new UserController();
