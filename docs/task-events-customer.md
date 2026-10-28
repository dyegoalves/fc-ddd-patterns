Aplicar o conceito de Domain Events na prática. Você deve implementar a publicação e a assinatura de eventos de domínio na criação e atualização de um cliente (Customer), garantindo que o sistema reaja a essas mudanças de estado conforme os requisitos de log abaixo.

Tecnologias e Padrões

Linguagem: TypeScript

Padrão: Domain Events (DDD)

Testes: Testes Unitários

Requisitos Técnicos

Você deve criar dois eventos de domínio distintos para o agregado Customer:

1. Evento: CustomerCreated

Gatilho: Deve ser disparado sempre que um novo Customer é criado.

Comportamento: Ao ser disparado, esse evento deve executar dois Handlers independentes:

Handler 1 (EnviaConsoleLog1Handler): Deve imprimir no console: "Esse é o primeiro console.log do evento: CustomerCreated"

Handler 2 (EnviaConsoleLog2Handler): Deve imprimir no console: "Esse é o segundo console.log do evento: CustomerCreated"

2. Evento: CustomerAddressChanged

Gatilho: Deve ser disparado quando o endereço do Customer é trocado.

Dados: O evento deve transportar o id, o nome e o novo endereço do cliente.

Comportamento: Deve executar um Handler (EnviaConsoleLogHandler) que imprime no console: "Endereço do cliente: {id}, {nome} alterado para: {endereco}"

Validação

Toda a implementação deve ser coberta por testes unitários que assegurem que os eventos estão sendo disparados e os handlers executados corretamente.

Entregável

Link do Repositório: O link para o seu repositório no GitHub contendo a implementação.

README: Instruções de como rodar os testes.

Regras de Entrega

Repositório Único: É obrigatória a entrega de apenas um projeto por repositório.

Branch Principal: Todo o código deve estar na branch main.

Testes: O projeto deve conter os testes automatizados passando.
