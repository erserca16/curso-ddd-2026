import { InjectionMode, asClass, createContainer } from "awilix";
import { OrderEventsAdapter } from "../infrastructure/rabbitmq/OrderEventsAdapter";
import { ReplenishUseCase } from "./ReplenishUseCase";

export const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

export async function bootstrapContainer() {
  container.register({
    orderReplenishPort: asClass(OrderEventsAdapter).singleton(),
    replenishUseCase: asClass(ReplenishUseCase).scoped(),
  });
}
