import { FastifyInstance } from "fastify";
import { container } from "../../application/container";
import { ReplenishUseCase } from "../../application/ReplenishUseCase";

export async function registerRoutes(app: FastifyInstance) {
  app.post("/replenish", async (request, reply) => {
    const { sku, quantity } = request.body as {
      sku: string;
      quantity?: number;
    };

    if (!sku) {
      return reply.status(400).send({ error: "sku is required" });
    }

    const replenishQty = typeof quantity === "number" ? quantity : 10;
    if (replenishQty <= 0) {
      return reply.status(400).send({ error: "quantity must be > 0" });
    }

    const replenishUseCase = container.resolve<ReplenishUseCase>(
      "replenishUseCase"
    );
    await replenishUseCase.execute(sku, replenishQty);
    return reply.status(200).send({ message: "Replenished" });
  });
}
