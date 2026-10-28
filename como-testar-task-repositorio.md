# task-repositorio — DDD: Repository e Testes

Implementação do `OrderRepository` (Sequelize) cumprindo `OrderRepositoryInterface`.

## Instalar

```bash
npm install
```

## Rodar os testes desta task

```bash
npx jest src/infrastructure/order
```

## Rodar tudo (typecheck + todas as suítes)

```bash
npm test
```

## O que é testado

`src/infrastructure/order/repository/sequilize/order.repository.spec.ts`

- `create` — pedido com itens persistido
- `update` — itens substituídos, `total` recalculado e gravado
- `update` inválido — rollback, itens originais preservados
- `find` — agregado remontado
- `find` inexistente — `Order not found`
- `findAll` — lista de pedidos
