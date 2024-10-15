import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoutes';

dotenv.config();

const server = Fastify({
  logger: true
});

server.register(cors, {
  origin: (origin, cb) => {
    cb(null, true);
  }
});

server.register(userRoutes, { prefix: '/api/users' });
server.register(courseRoutes, { prefix: '/api/courses' });

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
