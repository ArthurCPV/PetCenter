# 🐾 PetCenter — Diário Inteligente para Pets

Aplicativo mobile desenvolvido em **React Native com Expo** para auxiliar responsáveis de pet no acompanhamento da rotina, comportamento e bem-estar diário de seus pets.

O projeto foi desenvolvido como parte do Challenge acadêmico da FIAP para a disciplina de **Mobile Application Development**, com foco em navegação entre telas, manipulação de estado, persistência local e construção de uma experiência mobile funcional.

---

## 🎯 Objetivo do Projeto

O PetCenter foi criado com a proposta de funcionar como um diário digital inteligente para animais de estimação, permitindo que o responsável pelo pet registre e acompanhe informações importantes do dia a dia do pet de maneira simples e organizada.

A aplicação busca facilitar:

- acompanhamento da rotina do animal;
- registro de alimentação, comportamento e sintomas;
- organização do histórico diário;
- controle de observações importantes;
- visualização rápida do estado geral do pet.

Além disso, o projeto já possui telas preparadas para futuras funcionalidades envolvendo:

- inteligência artificial;
- alertas automáticos;
- perfil do usuário;
- insights inteligentes baseados no histórico do pet.

---

## 🧠 Funcionalidades Principais

| Funcionalidade | Descrição |
|----------------|----------|
| ✅ Cadastro de pets | Criação de diários individuais para cada animal |
| ✅ Histórico diário | Visualização de registros anteriores |
| ✅ Registro único por dia | Evita duplicidade de entradas |
| ✅ Edição do registro atual | Permite atualizar o dia em andamento |
| ✅ Eventos estruturados | Alimentação, comportamento, sintomas e atividades |
| ✅ Subtipos inteligentes | Categorias específicas para cada tipo de evento |
| ✅ Modal dinâmico | Sistema moderno de criação e edição |
| ✅ AsyncStorage | Persistência local de dados |
| ✅ Navegação entre telas | Uso completo do React Navigation |
| ✅ Simulação de funcionalidades futuras | IA, alertas e perfil interativos |
| ✅ Interface mobile moderna | Layout responsivo e organizado |

---

## 📱 Funcionalidades do Diário

Cada pet possui um diário individual contendo registros organizados por data.

Os registros podem incluir:

### 🍖 Alimentação
- Ração
- Alimentação natural
- Petiscos
- Outros

Com:
- quantidade formatada automaticamente em gramas;
- horário;
- observações opcionais.

---

### 🐶 Comportamento

Subtipos disponíveis:

- Carinhoso
- Agitado
- Ansioso
- Estressado
- Apático
- Agressivo
- Assustado

---

### 🎾 Atividades

Subtipos disponíveis:

- Passeio
- Brincadeira
- Enriquecimento ambiental
- Socialização
- Adestramento

---

### 🩺 Sintomas

Subtipos disponíveis:

- Vômito
- Diarreia
- Falta de apetite
- Febre
- Tosse
- Coceira
- Tremores

---

## 🚀 Como usar o aplicativo

### **Para o Usuário:**
1. Abra o aplicativo  
2. Crie um diário para o pet  
3. Cadastre informações básicas do animal  
4. Acesse o diário do pet  
5. Registre os acontecimentos do dia  
6. Consulte registros anteriores  
7. Edite o registro atual sempre que necessário  

### **Fluxo do Diário:**
1. O usuário seleciona o pet  
2. Cria um registro diário  
3. Adiciona eventos estruturados  
4. Visualiza o histórico completo  
5. Consulta detalhes antigos do pet  

---

## 📦 Estrutura de Pastas

```txt
PetCenter/
│
├── assets/
│
├── src/
│   ├── components/
│   │   ├── DailyEntryModal.tsx
│   │   ├── EntryCard.tsx
│   │   ├── Form.tsx
│   │   ├── PetCard.tsx
│   │   └── CreatePetModal.tsx
│   │
│   ├── screens/
│   │   ├── Diary/
│   │   │    ├── index.tsx
│   │   ├── AI.tsx
│   │   ├── Alerts.tsx
│   │   ├── Login.tsx
│   │   ├── PetDiary.tsx
│   │   ├── Profile.tsx
│   │   └── Welcome.tsx
│   │
│   ├── store/
│   │   └── useDiary.ts
│   │
│   ├── styles/
│   │   ├── global.ts
│   │   └── theme.ts
│   │
│   └── types/
│
├── App.tsx
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✔️ Tecnologias Utilizadas

### 🚀 Framework e Linguagens

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### 🧭 Navegação

![React Navigation](https://img.shields.io/badge/React_Navigation-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### 💾 Persistência de Dados

![AsyncStorage](https://img.shields.io/badge/AsyncStorage-FFB300?style=for-the-badge)

### 🔧 Ferramentas

![Git](https://img.shields.io/badge/Git-F05033?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-121011?style=for-the-badge&logo=github&logoColor=white)

---

## 📚 Requisitos Acadêmicos Atendidos

O projeto contempla os requisitos exigidos pela disciplina de **Mobile Application Development**:

| Requisito | Status |
|-----------|--------|
| ✅ Navegação entre telas | Implementado |
| ✅ Protótipo visual funcional | Implementado |
| ✅ Formulário com useState | Implementado |
| ✅ Persistência com AsyncStorage | Implementado |
| ✅ Fluxo completo do app | Implementado |
| ✅ Múltiplas rotas navegáveis | Implementado |
| ✅ Demonstração mobile | Implementado |

---

## ▶️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, instale:

- Node.js
- npm
- Expo CLI
- Expo Go no celular ou emulador Android/iOS

---

### 📥 Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta:

```bash
cd PetCenter
```

Instale as dependências:

```bash
npm install
```

---

### ▶️ Executando o App

```bash
npm start
```

Ou diretamente:

```bash
npm run android
```

```bash
npm run ios
```

```bash
npm run web
```

---

## 💾 Persistência Local

O aplicativo utiliza `AsyncStorage` para salvar os dados localmente no dispositivo.

Isso permite que:

- os pets cadastrados permaneçam salvos;
- os registros diários sejam restaurados;
- o histórico continue disponível mesmo após fechar o app.

---

## 🧪 Telas em Desenvolvimento

O projeto já possui páginas preparadas para futuras funcionalidades:

| Tela | Objetivo |
|------|----------|
| 🤖 IA | Sugestões inteligentes e análise do histórico |
| 🔔 Alertas | Lembretes automáticos |
| 👤 Perfil | Dados do usuário e preferências |

Atualmente essas telas simulam funcionalidades futuras com interações visuais e feedbacks animados.

---

## 📌 Status do Projeto

🚧 Em desenvolvimento

### Funcionalidades já implementadas
- Diário individual para pets
- Histórico de registros
- Registro estruturado de eventos
- Edição de entradas
- Persistência local
- Navegação completa
- Simulação de funcionalidades futuras

### Funcionalidades planejadas
- IA integrada
- Sistema real de notificações
- Perfil completo do usuário
- Exportação de histórico
- Integração com backend

---

## 👥 Integrantes

| Nome | GitHub | LinkedIn | RM |
|------|--------|----------|----|
| Arthur Cabral | [ArthurCPV](https://github.com/ArthurCPV) | [Arthur LinkedIn](https://www.linkedin.com/in/arthur-cabral2101/) | 566515 |

---

## 📦 Sumário

1. [Título e Descrição](#-petcenter--diário-inteligente-para-pets)
2. [Objetivo do Projeto](#-objetivo-do-projeto)
3. [Funcionalidades Principais](#-funcionalidades-principais)
4. [Como usar o aplicativo](#-como-usar-o-aplicativo)
5. [Estrutura de Pastas](#-estrutura-de-pastas)
6. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
7. [Requisitos Acadêmicos Atendidos](#-requisitos-acadêmicos-atendidos)
8. [Como Executar o Projeto](#️-como-executar-o-projeto)
9. [Persistência Local](#-persistência-local)
10. [Telas em Desenvolvimento](#-telas-em-desenvolvimento)
11. [Status do Projeto](#-status-do-projeto)
12. [Integrantes](#-integrantes)
13. [Acesso ao Projeto](#-acesso-ao-projeto)

---

## 📁 Acesso ao Projeto

### 🖥️ Repositório GitHub
- Adicionar link do GitHub Classroom aqui

### 🎬 Vídeo Demonstrativo
- Adicionar link do YouTube aqui

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos e educacionais — FIAP 2026.