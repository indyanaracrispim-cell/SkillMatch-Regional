/**
 * Arquivo Principal (Main) - Ponto de entrada da aplicação
 */

import { buscarVagasDoServidor } from './dados.js';
import { Vaga, VagaRemota, analisarCandidato, contarProcessamento } from './motor.js';
import { exibirResultadosNaTela, mostrarCarregamento, mostrarErroNaTela } from './ui.js';

let bancoDeVagasInstanciadas = [];

async function inicializarAplicacao() {
  mostrarCarregamento();

  try {
    const vagasBrutas = await buscarVagasDoServidor();

    bancoDeVagasInstanciadas = vagasBrutas.map((dadosVaga) => {
      if (dadosVaga.modalidade === "Remoto") {
        return new VagaRemota(dadosVaga);
      }
      return new Vaga(dadosVaga);
    });

    const statusElement = document.getElementById('status');
    if (bancoDeVagasInstanciadas.length === 0) {
      if (statusElement) statusElement.textContent = "Nenhuma vaga encontrada no servidor.";
      const containerResultados = document.getElementById('resultados');
      if (containerResultados) containerResultados.innerHTML = '';
      return;
    }

    carregarPerfilSalvo();

    if (statusElement) {
      statusElement.textContent = `Banco de dados carregado com sucesso! ${bancoDeVagasInstanciadas.length} vagas mapeadas para análise.`;
    }

    const containerResultados = document.getElementById('resultados');
    if (containerResultados) containerResultados.innerHTML = '';

  } catch (erro) {
    mostrarErroNaTela(erro.message);
  }
}

function gerenciarSubmissao(evento) {
  if (evento) evento.preventDefault();

  const formulario = document.getElementById('form-perfil');
  const elementoErro = document.getElementById('mensagem-erro');

  if (!formulario) return;

  const marcados = formulario.querySelectorAll('input[name="habilidades"]:checked');
  const habilidades = Array.from(marcados).map((input) => input.value);

  if (habilidades.length < 2) {
    if (elementoErro) {
      elementoErro.textContent = "Selecione ao menos 2 habilidades para realizar a análise.";
    } else {
      alert("Selecione ao menos 2 habilidades.");
    }
    return;
  }

  if (elementoErro) elementoErro.textContent = "";

  const campoNome = document.getElementById('nome');
  const campoEstado = document.getElementById('estado');
  const campoRemotas = document.getElementById('incluirRemotas');

  const perfilCandidato = {
    nome: campoNome && campoNome.value ? campoNome.value.trim() : "Candidato",
    estado: campoEstado ? campoEstado.value : "SC",
    habilidades: habilidades,
    incluirRemotas: campoRemotas ? campoRemotas.checked : true
  };

  localStorage.setItem('skillmatch_perfil', JSON.stringify(perfilCandidato));

  const resultadoDaAnalise = analisarCandidato(perfilCandidato, bancoDeVagasInstanciadas);
  const dadosAuditoria = contarProcessamento();

  exibirResultadosNaTela(resultadoDaAnalise, dadosAuditoria);

  const secaoResultados = document.getElementById('resultados');
  if (secaoResultados) {
    secaoResultados.scrollIntoView({ behavior: 'smooth' });
  }
}

function carregarPerfilSalvo() {
  const perfilSalvo = localStorage.getItem('skillmatch_perfil');

  if (perfilSalvo) {
    try {
      const perfil = JSON.parse(perfilSalvo);

      if (document.getElementById('nome') && perfil.nome) {
        document.getElementById('nome').value = perfil.nome;
      }

      if (document.getElementById('estado') && perfil.estado) {
        document.getElementById('estado').value = perfil.estado;
      }

      if (perfil.habilidades && Array.isArray(perfil.habilidades)) {
        const checkboxes = document.querySelectorAll('input[name="habilidades"]');
        checkboxes.forEach((chk) => {
          chk.checked = perfil.habilidades.includes(chk.value);
        });
      }

      if (document.getElementById('incluirRemotas') && perfil.incluirRemotas !== undefined) {
        document.getElementById('incluirRemotas').checked = perfil.incluirRemotas;
      }

    } catch (e) {
      console.error("Erro ao ler dados salvos no LocalStorage:", e);
    }
  }
}

// INICIALIZAÇÃO DIRETA E BIND DOS EVENTOS
inicializarAplicacao();

const formularioElemento = document.getElementById('form-perfil');
if (formularioElemento) {
  formularioElemento.onsubmit = gerenciarSubmissao;
}

const botaoLimparElemento = document.getElementById('btnLimpar');
if (botaoLimparElemento && formularioElemento) {
  botaoLimparElemento.onclick = (e) => {
    e.preventDefault();
    formularioElemento.reset();
    localStorage.removeItem('skillmatch_perfil');
    const elementoErro = document.getElementById('mensagem-erro');
    if (elementoErro) elementoErro.textContent = "";
    const containerResultados = document.getElementById('resultados');
    if (containerResultados) containerResultados.innerHTML = '';
    const statusElement = document.getElementById('status');
    if (statusElement) statusElement.textContent = "Aguardando preenchimento do perfil.";
  };
}