import axios from "axios";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";

// api calls
export default function (app) {
  app.post("/register", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email en wachtwoord zijn vereist" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.
        status(400).
        json({ error: "Emailadres is al in gebruik" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const lastIp =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress;

      const newUser = new User({
        email,
        password: hashedPassword,
        lastIp,
      });

      await newUser.save();

      res.
      status(201).
      json({ message: "Account succesvol aangemaakt" });
    } catch (error) {
      console.error(error);
      res.
      status(500).
      json({ error: "Er is een fout opgetreden" });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.
        status(400).
        json({ error: "Email en wachtwoord zijn vereist" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.
        status(400).
        json({ error: "Ongeldig e-mailadres of wachtwoord" });
      }

      if (user.isBlocked) {
        return res.
        status(403).
        json({ error: "Account is geblokkeerd wegens te veel mislukte pogingen" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        user.tries += 1;

        if (user.tries > 4) {
          user.isBlocked = true;
          await user.save();
          return res.
          status(403).
          json({ error: "Account is geblokkeerd wegens te veel mislukte pogingen" });
        }

        await user.save();

        return res.
        status(400).
        json({ error: "Ongeldig e-mailadres of wachtwoord" });
      }

      user.tries = 0;
      user.isBlocked = false;
      await user.save();

      res.
      status(200).
      json({ message: "Succesvol ingelogd" });
    } catch (error) {
      console.error(error);
      res.
      status(500).
      json({ error: "Er is een fout opgetreden" });
    }
  });
}
