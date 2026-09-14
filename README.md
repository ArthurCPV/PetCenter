# 🐾 PetCenter

Aplicativo mobile desenvolvido em **React Native com Expo** para acompanhamento da rotina e da saúde de animais de estimação.

O projeto foi desenvolvido como a Sprint 3 que é parte do **Challenge FIAP 2026**, integrando autenticação, navegação mobile, consumo de API REST, gerenciamento de estado e operações de cadastro, consulta, edição e exclusão de dados.

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
* autenticar usuários com Firebase e API Java.

O objetivo é facilitar o acompanhamento diário do animal e oferecer ao veterinário uma visão dos dados compartilhados pelo tutor.

---

## 🧠 Funcionalidades Principais

| Funcionalidade | Descrição |
| --- | --- |
| ✅ Cadastro de usuário | Criação de conta de tutor ou veterinário |
| ✅ Login real | Firebase Authentication integrado à API Java |
| ✅ Persistência de sessão | Token e usuário armazenados localmente |
| ✅ Proteção de rotas | Telas internas disponíveis somente após autenticação |
| ✅ Gestão de pets | Cadastro, consulta, edição e exclusão |
| ✅ Diário do pet | Criação, consulta, edição e exclusão de entradas |
| ✅ Registros de acompanhamento | Consulta, edição e exclusão de registros |
| ✅ Alertas | Consulta, criação e desativação de alertas |
| ✅ Visão do veterinário | Consulta de pets e diários autorizados |
| ✅ Estados de carregamento | Indicadores durante carregamento e atualização |
| ✅ Atualização da interface | Dados atualizados após operações bem-sucedidas |
| ⏳ Assistente de IA | Tela reservada para a API própria do grupo na Sprint 4 |

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
* Criar alertas como veterinário
* Desativar alertas
* Exibir alertas desativados em estado visual cinza com a mensagem `Desativado`

A reativação depende de um endpoint que não está disponível no Swagger atual do backend.

---

## 🤖 Assistente de IA

A tela de IA está preparada na navegação, mas permanece em desenvolvimento enquanto a API de IA criada pelo grupo não estiver publicada.

Não foi adicionada uma API genérica externa nem uma resposta mockada. Essa decisão mantém a integração coerente com o escopo do projeto e evita apresentar como funcionalidade real algo que ainda não possui backend integrado.

A integração do assistente será realizada na Sprint 4, após a publicação e definição do contrato da API própria do grupo.

---

## 🔐 Autenticação e Permissões

O fluxo de autenticação utiliza duas camadas:

1. **Firebase Authentication**, responsável pela autenticação externa;
2. **API Java**, responsável pelo login, token e dados persistidos do usuário.

A sessão é armazenada usando AsyncStorage. Ao reabrir o aplicativo, o Firebase é verificado e a sessão Java é validada antes da entrada nas telas protegidas.

### Perfis

| Perfil | Permissões principais |
| --- | --- |
| Tutor | Gerencia seus pets, diários e registros |
| Veterinário | Consulta pets e diários e cria alertas |

---

## 📁 Estrutura de Pastas

```txt
PetCenter/
├── assets/
│   └── icons/
├── src/
│   ├── api/
│   │   ├── alerts.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── diary.ts
│   │   ├── firebaseAuth.ts
│   │   ├── pets.ts
│   │   └── records.ts
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   └── authStorage.ts
│   ├── components/
│   │   ├── AlertFormModal.tsx
│   │   ├── CreatePetModal.tsx
│   │   ├── DiaryEntryEditModal.tsx
│   │   ├── EntryCard.tsx
│   │   ├── Form.tsx
│   │   ├── Item.tsx
│   │   ├── PetCard.tsx
│   │   └── RecordFormModal.tsx
│   ├── navigation/
│   │   └── Home.tsx
│   ├── screens/
│   │   ├── AI.tsx
│   │   ├── Alerts.tsx
│   │   ├── Details.tsx
│   │   ├── Diary/
│   │   │   └── index.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   ├── Register.tsx
│   │   └── Welcome.tsx
│   ├── store/
│   │   ├── useAlerts.ts
│   │   └── useDiary.ts
│   ├── styles/
│   │   ├── global.ts
│   │   └── theme.ts
│   └── types/
│       ├── api.ts
│       ├── index.ts
│       └── navigation.ts
├── App.tsx
├── app.json
├── firebaseConfig.ts
├── index.ts
├── package.json
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

As telas não realizam chamadas HTTP diretamente. Elas utilizam hooks e componentes, enquanto a camada `api` concentra a comunicação com o backend.

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

É necessário que o backend Java esteja acessível e que o projeto Firebase configurado em `firebaseConfig.ts` esteja disponível para autenticação.

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

## 📚 Requisitos Acadêmicos Atendidos

| Requisito | Status |
| --- | --- |
| React Native | Implementado |
| Expo | Implementado |
| TypeScript | Implementado |
| Navegação por rotas | Implementado |
| Mais de seis telas | Implementado |
| Consumo de API REST | Implementado |
| Autenticação real | Firebase + API Java |
| Proteção de telas | Implementado |
| CRUD de pets | Implementado |
| CRUD de entradas do diário | Implementado |
| Registros de acompanhamento | Consulta, edição e exclusão implementadas na interface |
| Assistente de IA | Planejado para a Sprint 4, aguardando API própria |
| Estados de carregamento | Implementado |
| Componentização | Implementado |
| Atualização após mutações | Implementado |
| Reativação de alertas | Pendente no backend |
| Vídeo demonstrativo | Adicionar link antes da entrega |

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

[Adicionar link do repositório oficial do GitHub Classroom](https://github.com/ArthurCPV/PetCenter)

### Vídeo demonstrativo

[Adicionar link do vídeo publicado no YouTube](https://youtu.be/-1Dy5-Xt1R8)

---

## 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos e educacionais como parte do Challenge FIAP 2026.
