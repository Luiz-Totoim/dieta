import { useState } from 'react';

function App() {
  const [idade, setIdade] = useState('');
  const [nivelAtividade, setNivelAtividade] = useState('sedentario');
  const [objetivo, setObjetivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');
  const [tentativas, setTentativas] = useState(0);

  const objetivosDisponiveis = [
    { value: 'emagrecimento', label: '🔥 Emagrecimento e Perda de Gordura' },
    { value: 'ganho-muscular', label: '💪 Ganho de Massa Muscular' },
    { value: 'energia-disposicao', label: '⚡ Mais Energia e Disposição' },
    { value: 'imunidade', label: '🛡️ Fortalecer Imunidade' },
    { value: 'saude-mental', label: '🧠 Saúde Mental e Foco' },
    { value: 'sono-qualidade', label: '😴 Melhorar Qualidade do Sono' },
    { value: 'digestao-intestino', label: '🥗 Saúde Digestiva e Intestinal' },
    { value: 'ossos-articulacoes', label: '🦴 Fortalecer Ossos e Articulações' }
  ];

  const niveisAtividade = [
    { value: 'sedentario', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'leve', label: 'Leve (1-3x por semana)' },
    { value: 'moderado', label: 'Moderado (3-5x por semana)' },
    { value: 'intenso', label: 'Intenso (6-7x por semana)' },
    { value: 'atleta', label: 'Atleta (treinos diários pesados)' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limite simples de tentativas (3 grátis por sessão)
    if (tentativas >= 3) {
      setErro('Você atingiu o limite de 3 recomendações gratuitas. Recarregue a página para continuar.');
      return;
    }

    if (!idade || !objetivo) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');
    setResultado(null);

    try {
      // Altere essa URL para o endereço do seu backend em produção
      const apiUrl = import.meta.env.VITE_API_URL || '/api/recommend';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idade: parseInt(idade),
          nivelAtividade,
          objetivo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar recomendação');
      }

      setResultado(data);
      setTentativas(tentativas + 1);
    } catch (error) {
      console.error('Erro:', error);
      setErro(error.message || 'Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const resetar = () => {
    setResultado(null);
    setErro('');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>💚 Minha Saúde Ideal</h1>
        <p className="subtitle">Recomendações personalizadas de suplementos com IA</p>
      </header>

      {!resultado ? (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="idade">Sua idade:</label>
            <input
              id="idade"
              type="number"
              min="18"
              max="100"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Ex: 30"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="atividade">Nível de atividade física:</label>
            <select
              id="atividade"
              value={nivelAtividade}
              onChange={(e) => setNivelAtividade(e.target.value)}
            >
              {niveisAtividade.map(nivel => (
                <option key={nivel.value} value={nivel.value}>
                  {nivel.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="objetivo">Seu objetivo principal:</label>
            <select
              id="objetivo"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
            >
              <option value="">Selecione seu objetivo</option>
              {objetivosDisponiveis.map(obj => (
                <option key={obj.value} value={obj.value}>
                  {obj.label}
                </option>
              ))}
            </select>
          </div>

          {erro && <div className="error">{erro}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? '⏳ Gerando recomendação...' : '✨ Gerar Recomendação Personalizada'}
          </button>

          <p className="info">
            💡 Tentativas restantes: {3 - tentativas}/3 (modo demonstração)
          </p>
        </form>
      ) : (
        <div className="resultado">
          <h2>Suas Recomendações Personalizadas</h2>
          
          <div className="introducao">
            <p>{resultado.introducao}</p>
          </div>

          <div className="produtos">
            {resultado.produtos.map((produto, index) => (
              <div key={index} className="produto-card">
                <div className="produto-numero">{index + 1}</div>
                <h3>{produto.nome}</h3>
                <p className="beneficio">{produto.beneficio}</p>
                <div className="links">
                  <a 
                    href={produto.linkAmazon} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-amazon"
                  >
                    🛒 Ver na Amazon
                  </a>
                  <a 
                    href={produto.linkShopee} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-shopee"
                  >
                    🛍️ Ver na Shopee
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button onClick={resetar} className="btn btn-secondary">
            ↩️ Fazer Nova Recomendação
          </button>

          <div className="disclaimer">
            <p>⚠️ <strong>Aviso:</strong> Consulte um profissional de saúde antes de iniciar qualquer suplementação. Este conteúdo é informativo e pode conter links de afiliado.</p>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Powered by OpenAI • Links de afiliado Amazon & Shopee</p>
      </footer>
    </div>
  );
}

export default App;
