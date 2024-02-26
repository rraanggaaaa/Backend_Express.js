import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from 'multer';

export const getUsers = async (req, res) => {
  try {
    const users = await Users.findOne({
      attributes: ["id", "name", "email", "image"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const updateUsers = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  const userExists = await Users.findOne({ where: { email: email } });
  if (userExists) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      await Users.update(
        {
          password: hashPassword,
        },
        {
          where: { email: email },
        }
      );

      res.json({ msg: "Ubah Password Berhasil" });
    } catch (error) {
      console.log(error);
      res.status(500).json;
    }
  } else {
    res.status(404).json({ msg: "Email tidak terdaftar" });
  }
};

export const updateProfilUsers = async (req, res) => {
  const { image } = req.body;

    try {
      await Users.update(
        {
          image: image,
        }
      );

      res.json({ msg: "Ubah Profile Berhasil" });
    } catch (error) {
      console.log(error);
      res.status(500).json;
    }
};

export const Register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  try {
    const userExists = await Users.findOne({ where: { email: email } });
    if (userExists) {
      return res.status(409).json({ msg: "Email telah digunakan" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" }); 
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure:true
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "Email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshToken", refreshToken);
  return res.sendStatus(200);
};
