# task-events-customer — Domain Events de Customer

Publicação e assinatura de eventos de domínio do agregado `Customer`.

## Instalar

```bash
npm install
```

## Rodar os testes desta task

```bash
npx jest src/domain/customer/event
```

## Rodar tudo (typecheck + todas as suítes)

```bash
npm test
```

## O que é testado

`src/domain/customer/event/customer-events.spec.ts`

- `CustomerCreatedEvent` — disparado ao criar `Customer`; `EnviaConsoleLog1Handler` e `EnviaConsoleLog2Handler` executados
- `CustomerAddressChangedEvent` — disparado em `changeAddress`; `EnviaConsoleLogHandler` imprime `Endereço do cliente: {id}, {nome} alterado para: {endereco}`
- não-disparo cruzado (criação não dispara troca de endereço e vice-versa)
