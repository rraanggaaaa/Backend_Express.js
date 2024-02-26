import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      attributes: ["id", "name", "email"],
    });
    res.json(admin);
  } catch (error) {
    console.log(error);
  }
};

export const updateAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  const adminExists = await Admin.findOne({ where: { email: email } });
  if (adminExists) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      await Admin.update(
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

export const adminRegister = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm password tidak cocok" });

  try {
    // Cek email terdata
    const adminExists = await Admin.findOne({ where: { email: email } });
    if (adminExists) {
      return res.status(409).json({ msg: "Email telah digunakan" });
    }

    // Proses hashing pw jika email belum terdata
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Admin.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan pada server" }); // It's good practice to send back a response on error
  }
};

export const adminLogin = async (req, res) => {
  try {
    const admin = await Admin.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, admin[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });
    const adminId = admin[0].id;
    const name = admin[0].name;
    const email = admin[0].email;
    const accessToken = jwt.sign(
      { adminId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10s",
      }
    );
    const refreshToken = jwt.sign(
      { adminId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await Admin.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: adminId,
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
