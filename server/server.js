import express, { response } from "express";
import pool from "./db.js";
const PORT = process.env.PORT || 8000;
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";
const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get("/todo/:mail", async (req, res) => {
  const mail = req.params.mail;
  console.log(mail);
  try {
    const todos = await pool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [mail]
    );
    res.json(todos.rows);
  } catch (err) {
    console.log(err);
  }
});

//CREATE A TODO
app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  //   const id = uuidv4();
  console.log(user_email, title, progress, date);
  try {
    const newTodo = await pool.query(
      `INSERT INTO todos ( user_email, title, progress, date) VALUES ($1, $2, $3, $4) `,
      [user_email, title, progress, date]
    );
    res.json(newTodo);
    console.log(newTodo);
  } catch (err) {
    console.log(err);
  }
});

//EDIT A TODO
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;

  try {
    const editTodo = await pool.query(
      "UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5",
      [user_email, title, progress, date, id]
    );
    res.json(editTodo);
  } catch (err) {
    console.log(err);
  }
});

// DELETE

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1", [
      id,
    ]);
    res.json(deleteTodo);
  } catch (err) {
    console.log(err);
  }
});

//SIGNUP
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  try {
    const signupResult = await pool.query(
      `INSERT INTO users (email, hash) VALUES($1, $2)`,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (err) {
    if (err) {
      res.json({ detail: err.detail });
    }
    res.status(500).json({ error: "An error occurred during sign-up" });
  }
});

//LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!users.rows.length) {
      return res.json({ detail: "User does not exist!" });
    } else {
      const success = await bcrypt.compare(password, users.rows[0].hash);
      const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

      if (success) {
        res.json({ email: users.rows[0].hash, token });
      } else {
        res.json({ detail: "Login was not successful" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
