/**
 * Camada de Dados - Busca as vagas do arquivo JSON
 */
export async function buscarVagasDoServidor() {
  // Caminho correto considerando a raiz do projeto no navegador
  const resposta = await fetch('./assets/dados/vagas.json');
  
  if (!resposta.ok) {
    throw new Error('Não foi possível carregar a lista de vagas do servidor.');
  }

  return await resposta.json();
}