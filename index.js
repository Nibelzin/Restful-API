const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient()
const port = 3001

app.use(express.json())

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
})

app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        })
        res.json(user)
    } catch (e){
        res.status(404).send('Usuário não encontrado')
    }
})

app.post('/users', async (req, res) => {
    const { name, email } = req.body
    const user = await prisma.user.create({
        data: { name, email }
    })
    res.status(201).json(user);
})

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: req.body
        })
        res.json(user)
    } catch {
        res.status(404).send('Usuário nao encontrado')
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params
        const user = await prisma.user.delete({
            where: { id: Number(id) }
        })
        res.json(user)
    } catch {
        res.status(404).send('Usuário nao encontrado')
    }
})

app.listen(port, async () => {
    console.log("backend executando")
})


