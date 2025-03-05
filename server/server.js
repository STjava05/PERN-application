
const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fastifyJwt = require('@fastify/jwt');
const fastifyCors = require('@fastify/cors');
const { request } = require('express');
const { reply } = require('server');

// Inizializzazione di Prisma
const db = new PrismaClient();

// Configurazione JWT
fastify.register(fastifyJwt, { secret: 'supersecret' });

// Configurazione CORS
fastify.register(fastifyCors, {
    origin: "*",  // Permetti richieste da qualsiasi origine
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});


// parsing del body
fastify.register(require('@fastify/formbody'));

fastify.register(require('@fastify/express'));



// Middleware di autenticazione
fastify.decorate("authenticate", async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (error) {
        return reply.status(401).send({ error: "Non autorizzato" });
    }
});

// Route di base

fastify.post('/users', async (request, reply) => {

    try {
        const { name, email } = request.body;

        const newUser = await db.$executeRaw`INSERT INTO users (name, email) VALUES (${name}, ${email})`;

        reply.status(201).send(newUser);
    } catch (error) {
        console.error(error);
        reply.status(500).send({ error: 'Errore nella creazione dell\'utente' });
    }
});

fastify.get('/users', async (request, reply) => {
    try {
        const users = await db.$queryRaw`SELECT * FROM users`;
        reply.status(200).send(users)

    } catch (err) {
        console.error(err.message)

    }
});

fastify.get('/users/:id', async (request, reply) => {
    try {
        const { id } = request.params;

        // Converto l'id in intero prima di passarli alla query
        const onlyUser = await db.$queryRaw`SELECT * FROM users WHERE id = ${parseInt(id)}`;

        if (!onlyUser || onlyUser.length === 0) {
            return reply.status(404).send({ error: 'User not found' });
        }

        reply.status(200).send(onlyUser[0]); // Se esiste, restituisci il primo elemento (singolo utente)
    } catch (err) {
        console.error(err.message);
        reply.status(500).send({ error: 'Internal server error' });
    }
});

fastify.put('/users/:id', async (request, reply) => {
    try {
        const { id } = request.params;
        const {name, email } = request.body; // Assicurati che 'email' venga estratta dal corpo della richiesta

        // La query aggiorna l'email dell'utente con id specificato
        const updateUser = await db.$queryRaw`UPDATE users SET email=${email},name=${name} WHERE id=${parseInt(id)}`;

        // Restituisce una risposta
        reply.status(200).send({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        reply.status(500).send({ error: 'Internal server error' });
    }
});

fastify.delete('/users/:id', async (request, reply) => {
    try {
        const { id } = request.params;
       
        const deleteUser = await db.$queryRaw`DELETE FROM users WHERE id=${parseInt(id)}`;
        reply.status(200).send({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err.message);
        reply.status(500).send({ error: 'Internal server error' });

    }

})





fastify.get('/signup', async (request, reply) => {
    const users = await db.signup.findMany();  // Trova tutti gli utenti nel database
    console.log(users);
    return users;
});



// Signup
fastify.post('/signup', async (request, reply) => {
    const { name, email, password } = request.body;

    // Verifica se l'utente esiste già
    console.log(db)
    const existUser = await db.users.findUnique({ where: { email } });
    if (existUser) return reply.status(400).send({ error: 'Email già usata' });

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione dell'utente
    const user = await db.signup.create({
        data: { name, email, password: hashedPassword }
    });

    return { message: 'Utente creato con successo' };
});

// Login
fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    const user = await db.users.findUnique({ where: { email } });
    if (!user) return reply.status(400).send({ error: 'Utente non trovato' });

    // Verifica password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return reply.status(400).send({ error: 'Password errata' });

    // Generazione token
    const token = fastify.jwt.sign({ userId: user.id });
    return { token };
});

// Route protetta (richiede autenticazione)
fastify.get('/profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const user = await db.users.findUnique({ where: { id: request.user.userId } });
    return user;
});

// Avvio del server
const start = async () => {
    try {
        await fastify.listen({ port: 3001 });
        console.log("Server avviato sulla porta 3001");
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();


