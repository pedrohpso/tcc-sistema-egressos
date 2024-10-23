/// <reference path="./types/fastify.d.ts" />

import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';
import fastifyJwt from '@fastify/jwt';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';
import formRoutes from './routes/formRoutes';

dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: (origin, cb) => {
    cb(null, true);
  }
});

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey'
});

server.decorate('authenticate', async (req, res) => {
  try {
    await req.jwtVerify();
    req.user = req.user;
  } catch (err) {
    return res.status(401).send({ message: 'Not authorized.' });
  }
});

server.register(userRoutes, { prefix: '/api/users' });
server.register(courseRoutes, { prefix: '/api/courses' });
server.register(formRoutes, { prefix: '/api/forms' });

const start = async () => {
  try {
    server.log.info('Conectado ao banco de dados');

    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`Servidor rodando em http://localhost:3000`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
