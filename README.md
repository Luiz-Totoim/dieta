# 💚 Minha Saúde Ideal — Mini-app de Afiliados

**Aplicação completa de recomendação de suplementos com IA + links de afiliado Amazon & Shopee**

Um mini-app 100% automático que recomenda 3 suplementos personalizados baseados em idade, nível de atividade e objetivo do usuário. Cada recomendação inclui links diretos para Amazon e Shopee com seus IDs de afiliado.

---

## 📋 O que este projeto faz

- ✅ **Interface única e simples**: usuário preenche 3 campos e recebe recomendações instantâneas
- ✅ **8 objetivos de saúde**: emagrecimento, ganho muscular, energia, imunidade, saúde mental, sono, digestão, ossos/articulações
- ✅ **24 produtos pré-configurados**: 3 produtos por objetivo com ASINs da Amazon e queries da Shopee
- ✅ **IA personalizada**: OpenAI gera introdução customizada baseada no perfil do usuário
- ✅ **Links de afiliado prontos**: basta colar suas tags Amazon Associates e Shopee ID
- ✅ **Pronto para produção**: deploy fácil em Vercel (frontend) + Render/Vercel Functions (backend)

---

## 🗂️ Estrutura do projeto

```
projeto/
├── backend/
│   ├── index.js            # Servidor Express + lógica de produtos + OpenAI
│   ├── package.json        # Dependências do backend
│   └── .env.example        # Template de variáveis de ambiente
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Componente principal com formulário e resultados
│   │   ├── main.jsx        # Entry point React
│   │   └── styles.css      # Estilos completos (gradientes, cards, botões)
│   ├── index.html          # HTML base
│   ├── package.json        # Dependências do frontend
│   └── vite.config.js      # Configuração Vite + proxy
│
└── README.md               # Este arquivo
```

---

## 🚀 Como rodar localmente

### 1️⃣ Clonar e instalar dependências

```powershell
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 2️⃣ Configurar variáveis de ambiente

Crie o arquivo **`backend/.env`** baseado no `.env.example`:

```env
# Obrigatório: sua chave da OpenAI
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Opcional mas recomendado: sua tag de afiliado Amazon Associates
# Exemplo: seuuser-20
AFF_AMAZON_TAG=

# Opcional: seu ID de afiliado Shopee
AFF_SHOPEE_ID=

# Porta do servidor (padrão: 3000)
PORT=3000
```

**🔑 Como obter suas chaves:**

- **OpenAI API Key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys) (crie uma conta e gere uma chave)
- **Amazon Associates Tag**: [affiliate-program.amazon.com.br](https://affiliate-program.amazon.com.br/) (cadastre-se no programa de afiliados)
- **Shopee Affiliate**: [affiliate.shopee.com.br](https://affiliate.shopee.com.br/) (cadastre-se como parceiro)

### 3️⃣ Iniciar os servidores

```powershell
# Terminal 1 - Backend
cd backend
npm start
# Servidor rodará em http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Interface rodará em http://localhost:5173
```

### 4️⃣ Testar a aplicação

1. Abra [http://localhost:5173](http://localhost:5173) no navegador
2. Preencha idade, nível de atividade e objetivo
3. Clique em **"Gerar Recomendação Personalizada"**
4. Veja os 3 produtos recomendados com links Amazon & Shopee

---

## 💰 Configurar seus links de afiliado

### Amazon Associates

No arquivo **`backend/.env`**, adicione sua tag:

```env
AFF_AMAZON_TAG=seuuser-20
```

O backend já está configurado para gerar links no formato:
```
https://www.amazon.com.br/dp/B07QKNH9YZ?tag=seuuser-20
```

### Shopee Affiliate

No arquivo **`backend/.env`**, adicione seu ID:

```env
AFF_SHOPEE_ID=seu-id-shopee
```

Se quiser customizar o formato do link Shopee, edite a função `gerarLinkShopee` em **`backend/index.js`** (linha ~164):

```javascript
function gerarLinkShopee(query) {
  const affiliateId = process.env.AFF_SHOPEE_ID;
  const searchUrl = `https://shopee.com.br/search?keyword=${query}`;
  
  if (affiliateId) {
    // Exemplo: adicione seu parâmetro de afiliado aqui
    return `${searchUrl}&aff_sid=${affiliateId}`;
  }
  return searchUrl;
}
```

---

## 📦 Produtos pré-configurados

O backend já inclui **24 produtos** divididos em 8 objetivos:

| Objetivo | Produtos |
|----------|----------|
| 🔥 Emagrecimento | Whey Isolado, L-Carnitina, CLA |
| 💪 Ganho Muscular | Creatina, Whey Concentrado, BCAA |
| ⚡ Energia/Disposição | Complexo B, Cafeína+Teanina, Multivitamínico |
| 🛡️ Imunidade | Vitamina C, Vitamina D3, Zinco |
| 🧠 Saúde Mental | Ômega 3, Magnésio Dimalato, L-Teanina |
| 😴 Sono | Melatonina, Magnésio Glicina, 5-HTP |
| 🥗 Digestão | Probióticos, Psyllium, Enzimas Digestivas |
| 🦴 Ossos/Articulações | Colágeno Tipo II, Cálcio+D3+K2, Glucosamina |

Todos os produtos já incluem **ASINs da Amazon** e **queries otimizadas da Shopee**.

---

## 🌐 Deploy em produção

### Frontend (Vercel)

1. Faça login em [vercel.com](https://vercel.com)
2. Importe o repositório ou pasta `frontend/`
3. Configure o build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione variável de ambiente:
   - `VITE_API_URL`: URL do seu backend (ex: `https://seu-backend.onrender.com/api/recommend`)
5. Deploy!

### Backend (Render)

1. Faça login em [render.com](https://render.com)
2. Crie um **Web Service** e conecte ao repositório ou pasta `backend/`
3. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Adicione as **variáveis de ambiente**:
   - `OPENAI_API_KEY`
   - `AFF_AMAZON_TAG`
   - `AFF_SHOPEE_ID`
   - `PORT=3000`
5. Deploy!

**Alternativa:** Use **Vercel Functions** para o backend também (crie uma pasta `api/` e converta `index.js` para serverless).

---

## 🔒 Segurança e custos

### Controle de custos OpenAI

- **Modelo usado**: `gpt-3.5-turbo` (mais econômico)
- **Max tokens**: 150 por recomendação (~$0.0002 por chamada)
- **Limite no frontend**: 3 recomendações grátis por sessão (ajuste conforme necessário)

### Proteção de API

Para produção, considere adicionar:

- Rate limiting (ex: `express-rate-limit`)
- Autenticação simples com API key
- CORS configurado apenas para seu domínio

Exemplo de rate limiting (adicione em `backend/index.js`):

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10 // máximo 10 requisições por IP
});

app.use('/api/', limiter);
```

---

## 🎨 Personalização

### Adicionar mais produtos

Edite o objeto `PRODUTOS_POR_OBJETIVO` em **`backend/index.js`**:

```javascript
'seu-novo-objetivo': [
  {
    nome: 'Nome do Produto',
    asin: 'B0XXXXXXXX',
    shopeeQuery: 'produto+shopee',
    beneficio: 'Descrição do benefício'
  },
  // ... mais 2 produtos
]
```

### Alterar estilos

Edite **`frontend/src/styles.css`** — cores do gradiente, botões, cards etc.

### Mudar modelo de IA

Em **`backend/index.js`** (linha ~217), altere o modelo:

```javascript
model: 'gpt-4', // Para respostas mais elaboradas (mais caro)
// ou
model: 'gpt-3.5-turbo', // Mais econômico (atual)
```

---

## 📊 Tracking de conversões

### Amazon Associates

Acesse o [dashboard Amazon](https://affiliate-program.amazon.com.br/home) para ver:
- Cliques nos links
- Conversões (vendas)
- Comissões ganhas

### Shopee Affiliate

Acesse o [painel Shopee](https://affiliate.shopee.com.br/dashboard) para tracking similar.

**Dica**: Use UTM parameters nos links para rastrear campanhas específicas no Google Analytics.

---

## 🛠️ Troubleshooting

### Erro: "OPENAI_API_KEY não configurada"

- Verifique se o arquivo **`backend/.env`** existe e contém a chave correta
- Reinicie o servidor backend após adicionar a chave

### Erro: "Cota da API OpenAI excedida"

- Verifique seu saldo em [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
- Adicione créditos ou espere o reset mensal (para contas com créditos grátis)

### Links de afiliado não estão funcionando

- **Amazon**: Confirme que sua tag está aprovada no programa Associates
- **Shopee**: Verifique o formato do link no código (pode variar por região)

### Frontend não conecta ao backend

- Confirme que o backend está rodando em `http://localhost:3000`
- Verifique o proxy no **`frontend/vite.config.js`**
- Em produção, configure `VITE_API_URL` corretamente no Vercel

---

## 📈 Próximos passos

- [ ] Adicionar Google Analytics para tracking
- [ ] Implementar sistema de e-mail para capturar leads
- [ ] Criar landing page com depoimentos
- [ ] Adicionar mais produtos e nichos (fitness, beleza, etc)
- [ ] Implementar cache de recomendações para reduzir custos OpenAI
- [ ] Criar versão mobile app (React Native)

---

## 📄 Licença

MIT — sinta-se livre para usar, modificar e monetizar este projeto.

---

## 💬 Suporte

Dúvidas? Sugestões? Abra uma issue ou entre em contato!

**Boa sorte com suas vendas de afiliado! 🚀💰**
