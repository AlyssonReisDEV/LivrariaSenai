# 📚 Documentação do Projeto - Biblioteca Senai

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Backend](#api-backend)
- [Frontend Mobile](#frontend-mobile)
- [Funções Principais](#funções-principais)

---

## 🎯 Visão Geral

Sistema completo de gerenciamento de biblioteca desenvolvido com:
- **Backend**: Node.js + Express + Sequelize + SQLite
- **Frontend**: React Native + Expo Router + TypeScript

### Funcionalidades Principais
✅ Listar todos os livros cadastrados  
✅ Buscar livros por título  
✅ Visualizar detalhes completos de cada livro  
✅ Cadastrar novos livros  
✅ Editar informações de livros existentes  
✅ Excluir livros  
✅ Alternar disponibilidade de livros  
✅ Upload de imagens de capa  
✅ Links para download de livros digitais  

---

## 📁 Estrutura do Projeto

```
LivrariaSenai-main/
├── API/                          # Backend Node.js
│   ├── index.js                  # Servidor Express e rotas da API
│   ├── biblioteca.sqlite         # Banco de dados SQLite
│   └── package.json              # Dependências do backend
│
└── LivrariaSenai/                # Frontend React Native
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx         # Tela de listagem de livros
    │   │   ├── form.tsx          # Formulário de cadastro/edição
    │   │   ├── detalhes.tsx      # Tela de detalhes do livro
    │   │   └── _layout.tsx       # Layout de navegação por abas
    │   └── _layout.tsx           # Layout raiz da aplicação
    │
    ├── services/
    │   └── api.ts                # Configuração do Axios
    │
    ├── hooks/
    │   ├── use-color-scheme.ts   # Hook para detectar tema
    │   └── use-theme-color.ts    # Hook para cores do tema
    │
    └── constants/
        └── theme.ts              # Definições de cores e temas
```

---

## 🔧 API Backend

### Arquivo: `API/index.js`

#### 🗄️ Modelo de Dados - Livro

```javascript
{
  id: INTEGER (auto-increment),
  titulo: STRING (obrigatório),
  autor: STRING (obrigatório),
  ano: INTEGER (opcional),
  genero: STRING (opcional),
  disponivel: BOOLEAN (padrão: true),
  descricao: STRING (opcional),
  imagemUrl: STRING (opcional),
  linkDownload: STRING (opcional),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

#### 📡 Endpoints da API

| Método | Rota | Descrição | Parâmetros |
|--------|------|-----------|------------|
| `GET` | `/` | Status da API | - |
| `GET` | `/livros` | Lista todos os livros | Query: `titulo`, `autor`, `disponivel` |
| `GET` | `/livros/:id` | Busca livro por ID | Param: `id` |
| `POST` | `/livros` | Cria novo livro | Body: dados do livro |
| `PUT` | `/livros/:id` | Atualiza livro completo | Param: `id`, Body: dados |
| `PATCH` | `/livros/:id` | Atualiza campos específicos | Param: `id`, Body: campos |
| `DELETE` | `/livros/:id` | Remove livro | Param: `id` |

### 🔍 Funções Principais da API

#### `start()`
Função principal de inicialização que:
- Conecta ao banco de dados SQLite
- Sincroniza os modelos (cria tabelas)
- Configura todas as rotas REST
- Inicia o servidor na porta 3000

**Exemplo de uso:**
```javascript
// Inicia automaticamente ao executar o arquivo
start();
```

---

## 📱 Frontend Mobile

### Arquivo: `app/(tabs)/index.tsx` - Lista de Livros

#### Componente: `ListaLivros`
Tela principal que exibe todos os livros em uma grade de 5 colunas.

**Estados:**
- `livros`: Array com todos os livros carregados
- `busca`: Termo de busca digitado pelo usuário
- `refreshing`: Indica se está recarregando a lista

#### Função: `carregarLivros()`
```typescript
async function carregarLivros(): Promise<void>
```

**Descrição:** Busca livros da API com filtro opcional por título.

**Comportamento:**
1. Ativa indicador de carregamento
2. Faz requisição GET para `/livros`
3. Aplica filtro de busca se houver texto
4. Atualiza estado com os livros recebidos
5. Desativa indicador de carregamento

**Exemplo:**
```typescript
// Buscar todos os livros
await carregarLivros();

// Buscar com filtro
setBusca("Harry Potter");
// carregarLivros() é chamado automaticamente pelo useEffect
```

---

### Arquivo: `app/(tabs)/form.tsx` - Formulário

#### Componente: `FormLivro`
Formulário para criar novos livros ou editar existentes.

**Estados:**
- `titulo`: Título do livro
- `autor`: Nome do autor
- `descricao`: Descrição detalhada
- `genero`: Gênero literário
- `imagemUrl`: URL da imagem de capa
- `temLink`: Se possui link de download
- `linkDownload`: URL do link de download
- `loading`: Indica se está salvando

#### Função: `escolherImagem()`
```typescript
async function escolherImagem(): Promise<void>
```

**Descrição:** Abre a galeria do dispositivo para selecionar uma imagem.

**Fluxo:**
1. Solicita permissão de acesso à galeria
2. Abre seletor de imagens
3. Permite edição básica (crop)
4. Salva URI da imagem no estado

**Exemplo:**
```typescript
// Ao clicar no placeholder de imagem
<TouchableOpacity onPress={escolherImagem}>
  <Text>Escolher Imagem</Text>
</TouchableOpacity>
```

#### Função: `salvar()`
```typescript
async function salvar(): Promise<void>
```

**Descrição:** Salva novo livro ou atualiza existente.

**Validações:**
- ✅ Título obrigatório
- ✅ Autor obrigatório
- ✅ Remove espaços em branco extras
- ✅ Converte campos vazios para `null`

**Comportamento:**
- Se `livroParam.id` existe → `PUT /livros/:id` (atualizar)
- Se não existe → `POST /livros` (criar)

**Exemplo:**
```typescript
// Criar novo livro
setTitulo("1984");
setAutor("George Orwell");
await salvar(); // POST /livros

// Atualizar livro existente (id=5)
setTitulo("1984 - Edição Especial");
await salvar(); // PUT /livros/5
```

---

### Arquivo: `app/(tabs)/detalhes.tsx` - Detalhes

#### Componente: `DetalhesPage`
Exibe informações completas de um livro específico.

**Funcionalidades:**
- 📖 Exibe todos os dados do livro
- 🔄 Alterna disponibilidade
- 🗑️ Exclui o livro
- 🔗 Abre link de download no navegador

#### Função: `alternarDisponibilidade()`
```typescript
async function alternarDisponibilidade(): Promise<void>
```

**Descrição:** Inverte o status de disponibilidade do livro.

**Comportamento:**
1. Inverte valor de `disponivel` (true ↔ false)
2. Envia `PATCH /livros/:id`
3. Exibe alerta de sucesso
4. Retorna à tela anterior

**Exemplo:**
```typescript
// Se livro.disponivel = true
await alternarDisponibilidade(); // Marca como indisponível

// Se livro.disponivel = false
await alternarDisponibilidade(); // Marca como disponível
```

#### Função: `excluir()`
```typescript
async function excluir(): Promise<void>
```

**Descrição:** Remove permanentemente o livro do banco de dados.

**Comportamento:**
1. Envia `DELETE /livros/:id`
2. Retorna automaticamente à lista de livros

**Exemplo:**
```typescript
// Ao clicar no botão "Excluir livro"
await excluir(); // DELETE /livros/5
```

---

## 🎨 Hooks Customizados

### `useColorScheme()`
**Arquivo:** `hooks/use-color-scheme.ts`

**Descrição:** Detecta o tema do dispositivo (claro/escuro).

**Retorno:** `'light' | 'dark' | null`

**Exemplo:**
```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';

const theme = useColorScheme();
console.log(theme); // 'light' ou 'dark'
```

### `useThemeColor(props, colorName)`
**Arquivo:** `hooks/use-theme-color.ts`

**Descrição:** Retorna a cor apropriada baseada no tema atual.

**Parâmetros:**
- `props`: Objeto com cores customizadas `{ light?: string, dark?: string }`
- `colorName`: Nome da cor no tema padrão

**Retorno:** `string` (cor hexadecimal)

**Exemplos:**
```typescript
// Usar cor do tema padrão
const backgroundColor = useThemeColor({}, 'background');

// Sobrescrever com cores customizadas
const textColor = useThemeColor(
  { light: '#000000', dark: '#FFFFFF' },
  'text'
);
```

---

## 🚀 Como Executar

### Backend (API)
```bash
cd API
npm install
node index.js
# Servidor rodando em http://localhost:3000
```

### Frontend (App)
```bash
cd LivrariaSenai
npm install
npx expo start
# Escanear QR code com Expo Go
```

---

## 📝 Exemplos de Uso Completo

### 1. Criar um Novo Livro
```typescript
// No formulário (form.tsx)
setTitulo("O Senhor dos Anéis");
setAutor("J.R.R. Tolkien");
setGenero("Fantasia");
setDescricao("Uma jornada épica pela Terra Média");
await salvar();
// → POST /livros
```

### 2. Buscar Livros por Título
```typescript
// Na lista (index.tsx)
setBusca("Harry");
// → useEffect chama carregarLivros()
// → GET /livros?titulo=Harry
```

### 3. Alternar Disponibilidade
```typescript
// Nos detalhes (detalhes.tsx)
await alternarDisponibilidade();
// → PATCH /livros/3 { disponivel: false }
```

### 4. Excluir Livro
```typescript
// Nos detalhes (detalhes.tsx)
await excluir();
// → DELETE /livros/3
// → router.back()
```

---

## 🔐 Segurança e Boas Práticas

✅ **Validação de Dados:** Campos obrigatórios são validados antes do envio  
✅ **Tratamento de Erros:** Try-catch em todas as requisições assíncronas  
✅ **Feedback Visual:** Loading indicators e mensagens de sucesso/erro  
✅ **Sanitização:** Remoção de espaços em branco desnecessários  
✅ **Tipagem:** TypeScript para maior segurança de tipos  

---

## 📚 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Sequelize** - ORM para banco de dados
- **SQLite** - Banco de dados relacional
- **CORS** - Compartilhamento de recursos entre origens

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Superset tipado do JavaScript
- **Axios** - Cliente HTTP
- **Expo Router** - Navegação baseada em arquivos
- **Expo Image Picker** - Seleção de imagens

---

## 👨‍💻 Manutenção e Extensão

### Adicionar Novo Campo ao Livro
1. Atualizar modelo no `API/index.js`
2. Adicionar campo no tipo `Livro` nos arquivos `.tsx`
3. Adicionar input no formulário `form.tsx`
4. Exibir campo em `detalhes.tsx`

### Adicionar Nova Rota na API
```javascript
// Em API/index.js, dentro da função start()
app.get('/nova-rota', async (req, res) => {
  // Implementação
});
```

### Adicionar Nova Tela
1. Criar arquivo em `app/(tabs)/nova-tela.tsx`
2. Adicionar rota em `app/(tabs)/_layout.tsx`
3. Implementar navegação com `router.push()`

---

**Documentação gerada em:** Outubro de 2025  
**Versão:** 1.0.0
