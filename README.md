# fc-ddd-patterns

Duas tasks entregues neste repositório, cada uma com seu guia de testes:

| Task | Escopo | Guia |
|---|---|---|
| [task-repositorio](como-testar-task-repositorio.md) | `OrderRepository` (create, update, find, findAll) | `como-testar-task-repositorio.md` |
| [task-events-customer](como-testar-task-events-customer.md) | Domain Events de `Customer` (criação e troca de endereço) | `como-testar-task-events-customer.md` |

## Instalação

```bash
npm install
```

## Testes

```bash
npm test
```

Roda `tsc --noEmit` e o Jest com todas as suítes (as duas tasks). Para rodar só uma task, veja o guia dela.

## Estrutura

- `src/domain/checkout` — entidades `Order`/`OrderItem`, factory, service e interface `OrderRepositoryInterface`
- `src/infrastructure/order/repository/sequilize` — `OrderRepository` (Sequelize) + `order.repository.spec.ts`
- `src/domain/customer/event` — eventos `CustomerCreatedEvent`/`CustomerAddressChangedEvent`, handlers de console e testes

## Eventos de domínio (Customer)

- `Customer` criado → `CustomerCreatedEvent` → `EnviaConsoleLog1Handler` e `EnviaConsoleLog2Handler`
- `changeAddress` → `CustomerAddressChangedEvent` (id, nome, novo endereço) → `EnviaConsoleLogHandler`
