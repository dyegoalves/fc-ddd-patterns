import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  async function createOrder(
    orderId: string,
    productId: string,
    quantity = 2
  ): Promise<Order> {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(`c-${orderId}`, "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(productId, "Product 1", 10);
    await productRepository.create(product);

    const order = new Order(`o-${orderId}`, customer.id, [
      new OrderItem(`i-${orderId}`, product.name, product.price, product.id, quantity),
    ]);
    await new OrderRepository().create(order);
    return order;
  }

  it("should update an order", async () => {
    const order = await createOrder("1", "p1");

    const orderRepository = new OrderRepository();
    const updated = new Order(order.id, order.customerId, [
      new OrderItem("i-novo", "Product 1", 10, "p1", 5),
    ]);
    await orderRepository.update(updated);

    const found = await orderRepository.find(order.id);
    expect(found.items).toHaveLength(1);
    expect(found.total()).toBe(50);
    expect(found.items[0].id).toBe("i-novo");

    const orderModel = await OrderModel.findOne({ where: { id: order.id } });
    expect(orderModel.total).toBe(50);
  });

  it("should keep original items when update fails", async () => {
    const order = await createOrder("5", "p5");

    const orderRepository = new OrderRepository();
    const invalid = new Order(order.id, order.customerId, [
      new OrderItem("i-invalido", "Product X", 10, "produto-inexistente", 1),
    ]);

    await expect(orderRepository.update(invalid)).rejects.toThrow();

    const found = await orderRepository.find(order.id);
    expect(found.items).toHaveLength(1);
    expect(found.items[0].id).toBe(`i-5`);
    expect(found.total()).toBe(20);
  });

  it("should find an order", async () => {
    const order = await createOrder("2", "p2");

    const found = await new OrderRepository().find(order.id);
    expect(found.id).toBe(order.id);
    expect(found.customerId).toBe(order.customerId);
    expect(found.total()).toBe(20);
    expect(found.items[0].name).toBe("Product 1");
  });

  it("should throw when order not found", async () => {
    await expect(new OrderRepository().find("inexistente")).rejects.toThrow(
      "Order not found"
    );
  });

  it("should find all orders", async () => {
    const order1 = await createOrder("3", "p3");
    const order2 = await createOrder("4", "p4");

    const orders = await new OrderRepository().findAll();
    expect(orders).toHaveLength(2);
    expect(orders.map((o) => o.id)).toEqual(
      expect.arrayContaining([order1.id, order2.id])
    );
  });
});
