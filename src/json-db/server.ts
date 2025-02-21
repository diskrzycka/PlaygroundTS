import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import IndexedJSONDatabase from "./IndexedJSONDatabase";
import { validateUser, validateUserUpdate } from "./validators";
import { v4 as uuidv4 } from "uuid";

interface User {
    id: string;
    name: string;
    email: string;
}

const app = express();
const port = 3000;
const userDB = new IndexedJSONDatabase<User>("users-server", "id");

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
    const user = {... result.data!, id: uuidv4()} as User;
    await userDB.create(user);
    res.status(201).json(result.data);
});

app.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    const result = validateUserUpdate({ id: userId, ...req.body });

    if (!result.success) {
        res.status(400).json({ errors: result.error.format() });
        return;
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
