import { Router } from "express";
import Message from "../data/dbManagers/message.js";

const router = Router();
const messageManager = new Message();

router.get("/", async (req, res) => {
    try {
        const messages = await messageManager.getAllMessages();
        res.render("chat", { messages });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al recuperar los mensajes");
    }
});

export default router;