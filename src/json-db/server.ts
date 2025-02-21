import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import IndexedJSONDatabase from "./IndexedJSONDatabase";
import { validateUser } from "./validators";

interface User {
    id: number;
    name: string;
    email: string;
}

const app = express();
const port = 3000;
const userDB = new IndexedJSONDatabase<User>("users", "id");

app.use(cors());
app.use(bodyParser.json());

app.get("/users", async (req, res) => {
    const users = await userDB.read();
    res.json(users);
});

app.get("/users/:id", async (req, res) => {
    const user = await userDB.findById(Number(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.post("/users", async (req, res) => {
    const result = validateUser(req.body);

    if (!result.success) {
        res.status(400).json({ errors: result.error.format() });
    }

    await userDB.create(result.data!);
    res.status(201).json(result.data);
});

app.put("/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    const result = validateUser({ id: userId, ...req.body });

    if (!result.success) {
        res.status(400).json({ errors: result.error.format() });
    }

    await userDB.update(userId, result.data!);
    res.json({ message: "User updated" });
});

app.delete("/users/:id", async (req, res) => {
    const userId = Number(req.params.id);
    await userDB.delete(userId);
    res.json({ message: "User deleted" });
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
