const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()
const port = 3001
const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json())

app.post('/register', async (req, res) => {
    const { name, email, password, admin } = req.body

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists'})
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
                admin
            }
        })

        res.status(201).json({ message: 'User registred', user: { name, email, admin}})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({error: 'Invalid credentials'})
        }

        const token = jwt.sign({ userId: user.id}, JWT_SECRET, { expiresIn: '1h' })
        res.json({ message: 'Sucefully signed in', token})
    } catch(error) {
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.status(401).json({message: 'Unathourized'});

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user;
        next();
    })
}

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId}
        })
        if (!user) {
            return res.status(404).json({error: "invalid token"})
        }
        res.json({ id: user.id, name: user.name, email: user.email, admin: user.admin})
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})
 

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


