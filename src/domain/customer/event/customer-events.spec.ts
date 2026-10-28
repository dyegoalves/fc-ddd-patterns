import { eventDispatcher } from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import EnviaConsoleLog1Handler from "./handler/envia-console-log-1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log-2.handler";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";

describe("Customer domain events", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    eventDispatcher.unregisterAll();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    eventDispatcher.unregisterAll();
  });

  it("should notify both handlers when a customer is created", () => {
    const handler1 = new EnviaConsoleLog1Handler();
    const handler2 = new EnviaConsoleLog2Handler();
    const handler1Spy = jest.spyOn(handler1, "handle");
    const handler2Spy = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    const customer = new Customer("1", "Customer 1");

    expect(handler1Spy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventData: { id: customer.id, name: customer.name },
      })
    );
    expect(handler2Spy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Esse é o primeiro console.log do evento: CustomerCreated"
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Esse é o segundo console.log do evento: CustomerCreated"
    );
  });

  it("should notify the handler when the customer address changes", () => {
    const handler = new EnviaConsoleLogHandler();
    const handlerSpy = jest.spyOn(handler, "handle");
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);

    expect(handlerSpy).toHaveBeenCalledTimes(1);
    expect(handlerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        eventData: { id: "1", name: "Customer 1", address },
      })
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Endereço do cliente: 1, Customer 1 alterado para: Street 1, 1, Zipcode 1 City 1"
    );
  });

  it("should not fire address changed event on customer creation", () => {
    const handler = new EnviaConsoleLogHandler();
    const handlerSpy = jest.spyOn(handler, "handle");
    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    new Customer("1", "Customer 1");

    expect(handlerSpy).not.toHaveBeenCalled();
  });

  it("should not fire created event when the address changes", () => {
    const handler = new EnviaConsoleLog1Handler();
    const handlerSpy = jest.spyOn(handler, "handle");
    eventDispatcher.register("CustomerCreatedEvent", handler);

    const customer = new Customer("1", "Customer 1");
    handlerSpy.mockClear();
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));

    expect(handlerSpy).not.toHaveBeenCalled();
  });
});
