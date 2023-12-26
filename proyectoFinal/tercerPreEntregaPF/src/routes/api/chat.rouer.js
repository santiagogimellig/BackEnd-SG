import { Router } from "express";
import MessageManager from "../../dao/message_manager.js";

const router = Router()

router.get('/chat', async (req, res) => {
    const { query = {} } = req
    const message = await MessageManager.get(query)
    res.status(200).json(message)
})
router.post('/chat', async (req, res) => {
    const { body } = req
    const message = await MessageManager.create(body)
    res.status(201).json(message)
})
export default router