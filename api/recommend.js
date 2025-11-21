import OpenAI from 'openai';

// Validação de variáveis de ambiente (OpenAI agora é opcional)
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-proj-TESTKEY') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Base de dados de produtos por objetivo (com ASINs da Amazon)
const PRODUTOS_POR_OBJETIVO = {
  'emagrecimento': [
    {
      nome: 'Whey Protein Isolado',
      asin: 'B07QKNH9YZ',
      shopeeQuery: 'whey+protein+isolado',
      beneficio: 'Alta proteína com baixas calorias, ajuda na saciedade e preserva massa magra durante a perda de peso'
    },
    {
      nome: 'L-Carnitina 2000mg',
      asin: 'B01M4IB0N4',
      shopeeQuery: 'l-carnitina+2000mg',
      beneficio: 'Auxilia no transporte de gorduras para serem queimadas como energia durante exercícios'
    },
    {
      nome: 'CLA (Ácido Linoleico Conjugado)',
      asin: 'B01NBQJHUS',
      shopeeQuery: 'cla+acido+linoleico',
      beneficio: 'Pode ajudar a reduzir gordura corporal e manter massa muscular'
    }
  ],
  'ganho-muscular': [
    {
      nome: 'Creatina Monohidratada 300g',
      asin: 'B07G3C6SPJ',
      shopeeQuery: 'creatina+monohidratada',
      beneficio: 'Aumenta força e desempenho em treinos de alta intensidade, favorecendo ganho muscular'
    },
    {
      nome: 'Whey Protein Concentrado',
      asin: 'B01LZHQGV6',
      shopeeQuery: 'whey+protein+concentrado',
      beneficio: 'Fonte rápida de proteína para recuperação e crescimento muscular pós-treino'
    },
    {
      nome: 'BCAA 2:1:1 - 120 cápsulas',
      asin: 'B07D3K8Q7H',
      shopeeQuery: 'bcaa+capsulas',
      beneficio: 'Aminoácidos essenciais que reduzem fadiga e aceleram recuperação muscular'
    }
  ],
  'energia-disposicao': [
    {
      nome: 'Complexo B com B12',
      asin: 'B01M16V2QN',
      shopeeQuery: 'complexo+b+b12',
      beneficio: 'Suporta metabolismo energético e reduz fadiga mental e física'
    },
    {
      nome: 'Cafeína 210mg + L-Teanina',
      asin: 'B01D09K1RG',
      shopeeQuery: 'cafeina+teanina',
      beneficio: 'Energia limpa e foco sem nervosismo; ideal para produtividade'
    },
    {
      nome: 'Multivitamínico Completo',
      asin: 'B08C4ZW91L',
      shopeeQuery: 'multivitaminico+completo',
      beneficio: 'Preenche deficiências nutricionais que causam cansaço'
    }
  ],
  'imunidade': [
    {
      nome: 'Vitamina C 1000mg',
      asin: 'B00K0POTX4',
      shopeeQuery: 'vitamina+c+1000mg',
      beneficio: 'Antioxidante poderoso que fortalece defesas naturais do corpo'
    },
    {
      nome: 'Vitamina D3 2000 UI',
      asin: 'B07TQ1B8S3',
      shopeeQuery: 'vitamina+d3+2000',
      beneficio: 'Essencial para sistema imunológico forte e saúde óssea'
    },
    {
      nome: 'Zinco Quelato 30mg',
      asin: 'B07B4CZT3X',
      shopeeQuery: 'zinco+quelato',
      beneficio: 'Mineral crucial para função imune e recuperação celular'
    }
  ],
  'saude-mental': [
    {
      nome: 'Ômega 3 1000mg (EPA/DHA)',
      asin: 'B01GJQXE1K',
      shopeeQuery: 'omega+3+1000mg',
      beneficio: 'Melhora função cerebral, reduz inflamação e apoia humor equilibrado'
    },
    {
      nome: 'Magnésio Dimalato 500mg',
      asin: 'B07F6SXZY5',
      shopeeQuery: 'magnesio+dimalato',
      beneficio: 'Reduz estresse, melhora sono e relaxamento muscular'
    },
    {
      nome: 'L-Teanina 200mg',
      asin: 'B00EC4R0SM',
      shopeeQuery: 'l-teanina+200mg',
      beneficio: 'Promove calma e foco sem causar sonolência'
    }
  ],
  'sono-qualidade': [
    {
      nome: 'Melatonina 5mg',
      asin: 'B07K8V86PW',
      shopeeQuery: 'melatonina+5mg',
      beneficio: 'Regula ciclo sono-vigília naturalmente para noites mais reparadoras'
    },
    {
      nome: 'Magnésio Glicina 400mg',
      asin: 'B00C9KL4QE',
      shopeeQuery: 'magnesio+glicina',
      beneficio: 'Relaxa músculos e mente, facilitando sono profundo'
    },
    {
      nome: '5-HTP 100mg',
      asin: 'B01M7RTSXG',
      shopeeQuery: '5-htp+100mg',
      beneficio: 'Precursor de serotonina, melhora humor e qualidade do sono'
    }
  ],
  'digestao-intestino': [
    {
      nome: 'Probióticos 10 Bilhões UFC',
      asin: 'B07GXFXZQW',
      shopeeQuery: 'probioticos+10+bilhoes',
      beneficio: 'Restaura flora intestinal saudável e melhora digestão'
    },
    {
      nome: 'Fibras Psyllium 500g',
      asin: 'B07CZHNKML',
      shopeeQuery: 'psyllium+fibras',
      beneficio: 'Regula trânsito intestinal e promove saciedade'
    },
    {
      nome: 'Enzimas Digestivas Complexas',
      asin: 'B07F7LL71D',
      shopeeQuery: 'enzimas+digestivas',
      beneficio: 'Auxilia na quebra de alimentos e reduz desconfortos digestivos'
    }
  ],
  'ossos-articulacoes': [
    {
      nome: 'Colágeno Tipo II 40mg',
      asin: 'B07QHQ6BF3',
      shopeeQuery: 'colageno+tipo+2',
      beneficio: 'Específico para cartilagens, reduz dores articulares'
    },
    {
      nome: 'Cálcio + Vitamina D3 + K2',
      asin: 'B07X5NBTSG',
      shopeeQuery: 'calcio+d3+k2',
      beneficio: 'Trio essencial para densidade óssea e saúde cardiovascular'
    },
    {
      nome: 'Glucosamina + Condroitina',
      asin: 'B00Y8DD3LS',
      shopeeQuery: 'glucosamina+condroitina',
      beneficio: 'Suporta regeneração e flexibilidade de articulações'
    }
  ]
};

// Introduções pré-escritas por objetivo e perfil
const INTRODUCOES = {
  'emagrecimento': {
    jovem: 'Para seu objetivo de emagrecimento, selecionei suplementos que aumentam saciedade, aceleram metabolismo e preservam massa magra durante o déficit calórico.',
    adulto: 'Estes suplementos são ideais para otimizar sua perda de peso de forma saudável, mantendo energia e massa muscular enquanto elimina gordura.',
    senior: 'Pensando em emagrecimento saudável na sua faixa etária, escolhi produtos que ajudam na queima de gordura sem perder vitalidade e massa muscular.'
  },
  'ganho-muscular': {
    jovem: 'Para maximizar seus ganhos musculares, estes suplementos fornecem proteína de qualidade, energia explosiva e recuperação acelerada pós-treino.',
    adulto: 'Perfeito para construir massa magra: creatina para força, proteína para crescimento muscular e aminoácidos para recuperação eficiente.',
    senior: 'Selecionei suplementos seguros e eficazes que apoiam ganho muscular, força e recuperação, respeitando as necessidades da sua idade.'
  },
  'energia-disposicao': {
    jovem: 'Energia limpa e sustentada! Estes suplementos combatem fadiga, melhoram foco mental e mantêm você produtivo o dia todo.',
    adulto: 'Para aumentar energia e disposição no dia a dia, escolhi vitaminas essenciais, estimulantes naturais e nutrientes que reduzem cansaço.',
    senior: 'Produtos focados em combater fadiga natural da idade, melhorando vitalidade, disposição e energia mental sem sobrecarregar o organismo.'
  },
  'imunidade': {
    jovem: 'Fortaleça suas defesas naturais com estes antioxidantes e vitaminas essenciais que potencializam o sistema imunológico.',
    adulto: 'Para blindar sua imunidade, selecionei vitaminas C, D3 e Zinco - trio poderoso respaldado pela ciência para prevenir doenças.',
    senior: 'Reforço imunológico completo: nutrientes fundamentais que compensam deficiências naturais da idade e protegem sua saúde.'
  },
  'saude-mental': {
    jovem: 'Para clareza mental e equilíbrio emocional, estes suplementos nutrem o cérebro, reduzem estresse e melhoram foco.',
    adulto: 'Cuide da sua mente: Ômega 3 para função cerebral, magnésio para estresse e L-Teanina para calma sem sonolência.',
    senior: 'Suporte cognitivo e emocional: nutrientes que preservam memória, humor equilibrado e saúde mental na maturidade.'
  },
  'sono-qualidade': {
    jovem: 'Para noites verdadeiramente reparadoras, estes suplementos regulam seu ciclo circadiano e promovem sono profundo e restaurador.',
    adulto: 'Durma melhor naturalmente: melatonina para regular o sono, magnésio para relaxamento e 5-HTP para qualidade do descanso.',
    senior: 'Produtos seguros para melhorar qualidade do sono, combater insônia relacionada à idade e acordar revigorado.'
  },
  'digestao-intestino': {
    jovem: 'Para um intestino saudável e digestão eficiente, escolhi probióticos, fibras e enzimas que otimizam absorção de nutrientes.',
    adulto: 'Restaure seu equilíbrio digestivo: probióticos para flora intestinal, fibras para regularidade e enzimas para digestão completa.',
    senior: 'Suporte digestivo gentil e eficaz: produtos que melhoram conforto intestinal, regularidade e absorção de nutrientes.'
  },
  'ossos-articulacoes': {
    jovem: 'Previna lesões e fortaleça articulações com colágeno tipo II, cálcio e suplementos que mantêm cartilagens saudáveis.',
    adulto: 'Para ossos fortes e articulações flexíveis, estes nutrientes essenciais previnem desgaste e mantêm mobilidade ativa.',
    senior: 'Proteção completa para ossos e articulações: suplementos que combatem desgaste natural, reduzem dores e preservam mobilidade.'
  }
};

function getIntroducao(objetivo, idade) {
  const faixaEtaria = idade < 30 ? 'jovem' : idade < 60 ? 'adulto' : 'senior';
  return INTRODUCOES[objetivo]?.[faixaEtaria] || INTRODUCOES[objetivo]?.adulto || 'Confira nossa seleção personalizada de suplementos para seu objetivo.';
}

function gerarLinkAmazon(asin) {
  const tag = process.env.AFF_AMAZON_TAG;
  if (tag) {
    return `https://www.amazon.com.br/dp/${asin}?tag=${tag}`;
  }
  return `https://www.amazon.com.br/dp/${asin}`;
}

function gerarLinkShopee(query) {
  const affiliateId = process.env.AFF_SHOPEE_ID;
  const searchUrl = `https://shopee.com.br/search?keyword=${query}`;
  
  if (affiliateId) {
    return `${searchUrl}`;
  }
  return searchUrl;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { idade, nivelAtividade, objetivo } = req.body;

    if (!idade || !nivelAtividade || !objetivo) {
      return res.status(400).json({ 
        error: 'Dados incompletos. Envie idade, nivelAtividade e objetivo.' 
      });
    }

    if (!PRODUTOS_POR_OBJETIVO[objetivo]) {
      return res.status(400).json({ 
        error: 'Objetivo inválido.' 
      });
    }

    const produtosBase = PRODUTOS_POR_OBJETIVO[objetivo];
    let introducao;
    
    if (openai) {
      try {
        const prompt = `Você é um especialista em saúde e suplementação. Um usuário com as seguintes características pediu recomendações:

- Idade: ${idade} anos
- Nível de atividade física: ${nivelAtividade}
- Objetivo principal: ${objetivo}

Produtos sugeridos:
${produtosBase.map((p, i) => `${i + 1}. ${p.nome} - ${p.beneficio}`).join('\n')}

Tarefa: Escreva uma breve introdução personalizada (2-3 linhas) explicando por que esses 3 produtos são ideais para esse perfil específico. Seja direto, motivador e profissional.

Não liste os produtos novamente, apenas escreva a introdução.`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { 
              role: 'system', 
              content: 'Você é um especialista em nutrição e suplementação que cria recomendações personalizadas concisas e motivadoras.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.7,
        });

        introducao = completion.choices[0].message.content.trim();
      } catch (aiError) {
        console.warn('OpenAI falhou, usando introdução pré-escrita');
        introducao = getIntroducao(objetivo, parseInt(idade));
      }
    } else {
      introducao = getIntroducao(objetivo, parseInt(idade));
    }

    const produtosComLinks = produtosBase.map(produto => ({
      nome: produto.nome,
      beneficio: produto.beneficio,
      linkAmazon: gerarLinkAmazon(produto.asin),
      linkShopee: gerarLinkShopee(produto.shopeeQuery),
      asin: produto.asin
    }));

    return res.status(200).json({
      introducao,
      produtos: produtosComLinks,
      perfil: { idade, nivelAtividade, objetivo }
    });

  } catch (error) {
    console.error('Erro:', error);
    
    try {
      const produtosBase = PRODUTOS_POR_OBJETIVO[req.body.objetivo];
      const introducao = getIntroducao(req.body.objetivo, parseInt(req.body.idade));
      
      const produtosComLinks = produtosBase.map(produto => ({
        nome: produto.nome,
        beneficio: produto.beneficio,
        linkAmazon: gerarLinkAmazon(produto.asin),
        linkShopee: gerarLinkShopee(produto.shopeeQuery),
        asin: produto.asin
      }));

      return res.status(200).json({
        introducao,
        produtos: produtosComLinks,
        perfil: req.body
      });
    } catch (fallbackError) {
      return res.status(500).json({ 
        error: 'Erro ao gerar recomendação.' 
      });
    }
  }
}
