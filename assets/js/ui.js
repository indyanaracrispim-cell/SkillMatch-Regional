/**
 * UI (Interface do Utilizador) - Manipulação do DOM e Renderização dos Cards
 * Utiliza apenas elementos semânticos do HTML5 (article, section, header, etc.)
 */

export function mostrarCarregamento() {
  const container = document.getElementById('resultados');
  if (container) {
    container.innerHTML = '<p style="text-align:center; padding: 20px;">Carregando vagas e processando dados...</p>';
  }
}

export function mostrarErroNaTela(mensagem) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = `Erro: ${mensagem}`;
    statusElement.style.color = 'red';
  }
}

/**
 * Coleta os dados do formulário regional para o perfil do candidato
 */
export function obterDadosDoFormulario() {
  const form = document.getElementById('form-perfil');
  if (!form) return null;

  const marcados = form.querySelectorAll('input[name="habilidades"]:checked');
  const habilidades = Array.from(marcados).map(input => input.value);

  return {
    nome: form.nome ? form.nome.value.trim() : 'Candidato',
    estado: form.estado ? form.estado.value : 'SC',
    habilidades: habilidades,
    incluirRemotas: form.incluirRemotas ? form.incluirRemotas.checked : true
  };
}

/**
 * Renderiza os resultados da análise regional na tela utilizando tags semânticas
 */
export function exibirResultadosNaTela(resultadoAnalise, dadosAuditoria) {
  const container = document.getElementById('resultados');
  if (!container) return;

  const { candidato, relatorioVagas, melhorVaga, todasFaltantes } = resultadoAnalise;

  // Se não houver vagas elegíveis no estado/remoto
  if (!relatorioVagas || relatorioVagas.length === 0) {
    container.innerHTML = `
      <article style="background: #fff; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; border: 1px solid #e2e8f0;">
        <h3>Nenhuma vaga encontrada para a região (${candidato.estado})</h3>
        <p>Tente marcar a opção de incluir vagas remotas de outros estados para expandir sua busca.</p>
      </article>
    `;
    return;
  }

  // Painel de Resumo
  let html = `
    <section style="background: #ebf8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #3182ce;">
      <header>
        <h3 style="margin:0 0 10px 0;">📊 Resumo da Análise Regional</h3>
      </header>
      <p><strong>Candidato:</strong> ${candidato.nome} (${candidato.estado})</p>
      <p><strong>Vagas Analisadas na Região:</strong> ${relatorioVagas.length}</p>
      <p style="margin-bottom:0;"><strong>Auditoria:</strong> ${dadosAuditoria.total} comparações realizadas desde ${dadosAuditoria.iniciadoEm}</p>
    </section>
  `;

  // Destaque da Melhor Vaga (Melhor Match)
  if (melhorVaga) {
    html += `
      <article style="background: #f0fff4; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #38a169;">
        <header style="display:flex; justify-content:space-between; align-items:center;">
          <span style="background: #38a169; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">MELHOR MATCH</span>
        </header>
        <h4 style="margin: 10px 0 5px 0;">${melhorVaga.instanciaVaga.rotulo()}</h4>
        <p><strong>Compatibilidade:</strong> ${melhorVaga.compatibilidade}% (${melhorVaga.tag})</p>
        <p style="margin-bottom:0;"><strong>Salário:</strong> ${melhorVaga.instanciaVaga.getSalarioFormatado()}</p>
      </article>
    `;
  }

  // Lista de Cards de Vagas em formato de Lista Semântica (ul > li > article)
  html += '<ul style="list-style: none; padding: 0; margin: 0; display: grid; gap: 15px;">';
  relatorioVagas.forEach(item => {
    const vaga = item.instanciaVaga;
    const corTag = item.tag === 'HIGH' ? '#2f855a' : item.tag === 'MEDIUM' ? '#d69e2e' : '#e53e3e';

    html += `
      <li>
        <article style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; border-top: 4px solid ${corTag};">
          <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0;">${vaga.rotulo()}</h4>
            <span style="background: ${corTag}; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">${item.compatibilidade}% - ${item.tag}</span>
          </header>
          <p style="margin: 5px 0;"><strong>Salário:</strong> ${vaga.getSalarioFormatado()}</p>
          <p style="margin: 5px 0;"><strong>Requisitos Atendidos:</strong> ${item.encontradas.join(', ') || 'Nenhum'}</p>
          <p style="margin: 5px 0; color: #c53030;"><strong>Gaps (A Estudar):</strong> ${item.faltantes.join(', ') || 'Nenhum gap!'}</p>
        </article>
      </li>
    `;
  });
  html += '</ul>';

  // Plano de Estudos Recomendado (aside semântico)
  if (todasFaltantes && todasFaltantes.length > 0) {
    html += `
      <aside style="background: #fffaf0; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #dd6b20;">
        <header>
          <h3 style="margin-top:0;">📚 Recomendação do Plano de Estudos</h3>
        </header>
        <p>Para aumentar sua empregabilidade nas vagas da sua região, foque no aprendizado das seguintes tecnologias:</p>
        <ul>
          ${todasFaltantes.map(hab => `<li><strong>${hab}</strong></li>`).join('')}
        </ul>
      </aside>
    `;
  }

  container.innerHTML = html;
}