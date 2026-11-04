# 🐾 PetCenter

Aplicativo mobile desenvolvido em **React Native com Expo** para acompanhamento da rotina e da saúde de animais de estimação.

Entrega final do projeto integrado do **Challenge FIAP 2026**, desenvolvido em React Native com Expo. O aplicativo integra autenticação, navegação mobile, consumo de API REST, gerenciamento de estado e operações de cadastro, consulta, edição e exclusão de dados.

---

## 🎯 Objetivo do Projeto

O PetCenter foi criado para aproximar tutores e veterinários por meio de uma aplicação centralizada para acompanhamento dos pets.

A aplicação permite:

* cadastrar e gerenciar pets;
* registrar o diário do pet;
* consultar e editar entradas do diário;
* consultar e gerenciar registros de acompanhamento existentes;
* consultar alertas associados aos pets;
* diferenciar as permissões de tutores e veterinários;
* autenticar usuários pela API Java com token JWT.

O objetivo é facilitar o acompanhamento diário do animal e oferecer ao veterinário uma visão dos dados compartilhados pelo tutor.

---

## 🧠 Funcionalidades Principais

| Funcionalidade | Descrição |
| --- | --- |
| ✅ Cadastro de usuário | Criação de conta de tutor ou veterinário |
| ✅ Login real | API Java com autenticação JWT |
| ✅ Persistência de sessão | Token e usuário armazenados localmente |
| ✅ Proteção de rotas | Telas internas disponíveis somente após autenticação |
| ✅ Gestão de pets | Cadastro, consulta, edição e exclusão |
| ✅ Diário do pet | Criação, consulta, edição e exclusão de entradas |
| ✅ Registros de acompanhamento | Consulta, edição e exclusão de registros |
| ✅ Alertas | Consulta, criação e desativação restrita à interface veterinária |
| ✅ Notificações locais | Lembretes opcionais no aparelho do tutor, seguindo a frequência do alerta |
| ✅ Visão do veterinário | Consulta de pets e diários autorizados |
| ✅ Estados de carregamento | Indicadores durante carregamento e atualização |
| ✅ Atualização da interface | Dados atualizados após operações bem-sucedidas |
| ⚠️ Assistente de IA | Chat integrado; consultas aos dados IoT dependem da API e do ESP32 estarem acessíveis |

> A API atualmente publicada disponibiliza a operação de desativação de alertas, mas não publica uma rota de reativação. Por isso, alertas desativados são exibidos como `Desativado` no aplicativo.

---

## 🐶 Gestão de Pets

O tutor pode cadastrar pets informando:

* nome;
* espécie;
* raça;
* data de nascimento.

### Operações de pets

* Criar pet
* Consultar pets do tutor
* Editar pet
* Excluir pet

Veterinários podem consultar os pets disponíveis para visualização, mas não possuem os controles de edição e exclusão do tutor.

---

## 📔 Diário do Pet

Cada pet possui entradas de diário com o resumo da situação observada pelo tutor.

O formulário principal utiliza o campo:

> Como seu pet está hoje?

Ao confirmar o formulário, o aplicativo envia uma requisição real para a API e somente fecha o popup depois que a operação termina com sucesso. Em caso de erro, a mensagem retornada pelo backend é apresentada no próprio formulário.

### Operações do diário

* Criar entrada diária
* Consultar entradas do pet
* Editar entrada diária
* Excluir entrada diária
* Atualizar automaticamente a lista após a operação

---

## 📊 Registros de Acompanhamento

Os registros detalham informações relacionadas a uma entrada do diário.

Cada registro pode conter:

* tipo;
* subtipo;
* valor;
* unidade;
* observações;
* data e horário retornados pela API.

### Operações de registros

* Consultar registros
* Editar registro do dia atual
* Excluir registro do dia atual

A camada de integração também possui a requisição `POST /api/registros` para criação de registros de acompanhamento. O formulário principal da tela, entretanto, cria uma nova **entrada do diário** por meio de `POST /api/diarioentradas`.

Registros de dias anteriores são exibidos em modo de consulta e não podem ser alterados pelo tutor.

---

## ⚠️ Sistema de Alertas

Os alertas são associados a pets e possuem informações como:

* tipo;
* título;
* descrição;
* data de início;
* frequência;
* data final;
* status ativo ou desativado.

### Operações de alertas

* Listar alertas
* Filtrar alertas dos pets do tutor
* Buscar e filtrar pets por nome ou ID
* Criar e desativar alertas pela interface veterinária
* Exibir alertas desativados em estado visual cinza com a mensagem `Desativado`

A reativação depende de um endpoint que não está disponível no Swagger atual do backend.
O app oculta as ações de gerenciamento para tutores e também as bloqueia na camada de estado. A API Java deve aplicar a mesma autorização no servidor; uma regra somente no aplicativo não protege chamadas diretas ao endpoint.

### Notificações locais

Quando a permissão do sistema ainda não foi concedida, a tela de Alertas oferece a opção de ativá-la. Com a permissão concedida, o app agenda notificações locais neste aparelho: alertas com frequência se repetem no intervalo definido pelo veterinário; sem frequência, geram um lembrete único. O tutor também pode tocar em **Notificar agora** em um alerta ativo para receber imediatamente uma notificação local relacionada àquele alerta, sem alterar os lembretes recorrentes agendados. A permissão é mantida pelo Android ou iOS e pode ser revogada nas configurações do dispositivo; ao voltar ao app, o estado é verificado novamente. Desativar um alerta pelo veterinário cancela os lembretes locais recorrentes correspondentes na próxima sincronização da tela. As notificações não são push.

---

## 🤖 Assistente de IA

A tela oferece um chat com a API CLYVO VET. As perguntas são enviadas para `POST /chat` como `{ "message": "..." }`, e a interface exibe o campo `response` retornado pelo backend. O assistente responde sobre alimentação e hidratação com base nos dados disponíveis pelo monitor IoT.

Esta integração foi desenvolvida originalmente para outra disciplina e ainda não distingue contas ou pets do PetCenter. As respostas consultam o monitor IoT compartilhado, não o perfil, os pets ou o diário do usuário autenticado. Os sensores registram interações com recipientes; o assistente não realiza diagnóstico veterinário nem substitui a avaliação de um profissional.

---

## 🔐 Autenticação e Permissões

O fluxo de autenticação utiliza duas camadas:

1. **API Java**, responsável pelo cadastro, validação de credenciais e emissão do token JWT.
2. **Armazenamento local**, que mantém o token e os dados básicos da sessão usando AsyncStorage.

Ao reabrir o aplicativo, a sessão armazenada é validada pela API antes da entrada nas telas protegidas.

### Perfis

| Perfil | Permissões principais |
| --- | --- |
| Tutor | Gerencia seus pets, diários e registros |
| Veterinário | Consulta pets e diários e gerencia alertas |

---

## 📁 Estrutura de Pastas

```txt
PetCenter/
├── assets/
│   ├── icons/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── src/
│   ├── api/
│   │   ├── alerts.ts
│   │   ├── api.ts
│   │   ├── assistant.ts
│   │   ├── auth.ts
│   │   ├── diary.ts
│   │   ├── pets.ts
│   │   └── records.ts
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   └── authStorage.ts
│   ├── components/
│   │   ├── AlertFormModal.tsx
│   │   ├── CreatePetModal.tsx
│   │   ├── DiaryTextModal.tsx
│   │   ├── EntryCard.tsx
│   │   ├── EntryDetailsModal.tsx
│   │   ├── Form.tsx
│   │   ├── InfoCard.tsx
│   │   ├── ModalShell.tsx
│   │   ├── OutlineButton.tsx
│   │   ├── PetCard.tsx
│   │   ├── PetFilter.tsx
│   │   ├── RecordFormModal.tsx
│   │   └── SelectDropdown.tsx
│   ├── constants/
│   │   └── alerts.ts
│   ├── navigation/
│   │   └── Home.tsx
│   ├── notifications/
│   │   └── alertNotifications.ts
│   ├── screens/
│   │   ├── AI.tsx
│   │   ├── Alerts.tsx
│   │   ├── Diary/
│   │   │   └── index.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   └── Welcome.tsx
│   ├── store/
│   │   ├── useAssistant.ts
│   │   ├── useAlertNotifications.ts
│   │   ├── useAlerts.ts
│   │   ├── useDiary.ts
│   │   ├── usePetCount.ts
│   │   └── useRegistration.ts
│   ├── styles/
│   │   ├── global.ts
│   │   └── theme.ts
│   ├── types/
│   │   ├── api.ts
│   │   ├── index.ts
│   │   └── navigation.ts
│   └── utils/
│       ├── date.ts
│       └── validation.ts
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## ✔️ Arquitetura

O projeto separa as responsabilidades em camadas:

* `screens/`: telas e fluxos da aplicação;
* `components/`: componentes reutilizáveis e formulários;
* `api/`: chamadas HTTP e conversão dos dados da API;
* `store/`: hooks que orquestram carregamento, mutações e atualização da interface;
* `auth/`: autenticação e persistência da sessão;
* `navigation/`: configuração das rotas;
* `styles/`: tema e estilos compartilhados;
* `types/`: tipos de domínio e contratos da API.

As telas delegam operações de rede e lógica reutilizável a hooks e serviços da camada `api`, que concentra a comunicação HTTP com os backends.

---

## 🔗 Integração Backend

A aplicação consome a API REST publicada em:

```txt
https://challenge-java-petcenter.onrender.com
```

Documentação Swagger/OpenAPI:

```txt
https://challenge-java-petcenter.onrender.com/swagger-ui/index.html
```

## Autenticação

```http
POST /api/auth/login
GET  /api/users/email/{email}
POST /api/users
POST /api/veterinarios
```

## Pets

```http
GET    /api/pets
GET    /api/pets/user/{userId}
POST   /api/pets
PUT    /api/pets/{id}
DELETE /api/pets/{id}
```

## Entradas do diário

```http
GET    /api/diarioentradas
POST   /api/diarioentradas
PUT    /api/diarioentradas/{id}
DELETE /api/diarioentradas/{id}
```

## Registros

```http
GET    /api/registros
POST   /api/registros
PUT    /api/registros/{id}
DELETE /api/registros/{id}
```

## Alertas

```http
GET   /api/alertas
POST  /api/alertas
PATCH /api/alertas/{id}/desativar
```

Todas as operações protegidas enviam o token JWT no cabeçalho `Authorization`.

O endereço pode ser sobrescrito pela variável `EXPO_PUBLIC_API_URL`. Se ela não estiver definida, o app usa o endereço Render acima.

A API do assistente é configurada separadamente por `EXPO_PUBLIC_AI_API_URL`. O padrão é `https://challenger-iot.onrender.com`.

---

## 🚀 Como Utilizar o Aplicativo

### Fluxo principal

1. Crie uma conta ou realize o login.
2. Acesse a área de Diário.
3. Cadastre um pet como tutor.
4. Selecione o pet cadastrado.
5. Preencha como o pet está hoje.
6. Salve a entrada do diário e confira a resposta da API.
7. Edite ou exclua entradas existentes.
8. Consulte e gerencie registros associados.
9. Acesse a tela de Alertas.
10. Consulte os alertas disponíveis.

---

## ▶️ Como Executar o Projeto

## Pré-requisitos

Instale:

* Node.js;
* npm;
* Expo CLI ou use o Expo via `npx`;
* Expo Go em um dispositivo Android/iOS ou um emulador compatível.

É necessário que o backend Java esteja acessível. Para usar outra instância da API, crie um arquivo `.env.local` na raiz com:

```env
EXPO_PUBLIC_API_URL=https://seu-endereco-da-api
EXPO_PUBLIC_AI_API_URL=https://challenger-iot.onrender.com
```

O endereço deve apontar para a raiz da API, sem adicionar `/api`.

## Clonando o repositório

```bash
git clone <url-do-repositorio>
cd PetCenter
```

## Instalando dependências

```bash
npm install
```

## Executando

```bash
npm start
```

Ou:

```bash
npm run android
npm run ios
npm run web
```

Depois, leia o QR Code com o Expo Go ou execute em um emulador.

---

## 👥 Integrantes

| Nome | GitHub | RM |
| --- | --- | --- |
| Arthur Cabral | [ArthurCPV](https://github.com/ArthurCPV) | 566515 |
| Bruno Martins | [TaikaWaititi](https://github.com/TaikaWaititi) | 564939 |
| José Diogo | [ZeDio](https://github.com/ZeDio) | 562341 |
| Júlia Tiziotto | [JuliaTButtler](https://github.com/JuliaTButtler) | 564975 |
| Mariana Xavier | [Marixavq](https://github.com/Marixavq) | 566357 |

---

## 📁 Acesso ao Projeto

### Repositório GitHub

[Abrir o repositório do projeto no GitHub](https://github.com/ArthurCPV/PetCenter)

### Vídeo demonstrativo

[Assistir à demonstração no YouTube](https://youtu.be/-1Dy5-Xt1R8)

---

## 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais como parte do Challenge FIAP 2026.
