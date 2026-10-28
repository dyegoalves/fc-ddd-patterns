# fc-ddd-patterns

Implementação da camada de infraestrutura (Repository) da aplicação de vendas com DDD + TDD.

## Instalação

```bash
npm install
```

## Testes

```bash
npm test
```

Roda `tsc --noEmit` e o Jest (todos os testes, incluindo o `OrderRepository`).

## Estrutura

- `src/domain/checkout` — entidades `Order`/`OrderItem`, factory, service e interface `OrderRepositoryInterface`
- `src/infrastructure/order/repository/sequilize` — `OrderRepository` (Sequelize) + `order.repository.spec.ts`
