import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";

export async function routes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.get("/teste", async (request: FastifyRequest, reply: FastifyReply) => {
        return { hello: "world" }
    })
}