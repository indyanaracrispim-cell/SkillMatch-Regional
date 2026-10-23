/**
 * Motor Lógico - O Cérebro do SkillMatch Regional
 * Contém a Programação Orientada a Objetos (POO), herança, filtros e funções de match.
 */

// =====================================================
// MODELO 2: CLASSE BASE VAGA
// =====================================================
export class Vaga {
  constructor(dados) {
    this.id         = dados.id;
    this.empresa    = dados.empresa;
    this.cargo      = dados.cargo;
    this.requisitos = dados.requisitos || [];
    this.salario    = dados.salario;
    this.modalidade = dados.modalidade;
    this.estado     = dados.estado;
  }

  compatibilidade(habilidadesCandidato) {
    const encontradas = this.requisitos.filter((req) =>
      habilidadesCandidato.some((hab) => hab.toLowerCase() === req.toLowerCase())
    );

    const faltantes = this.requisitos.filter((req) =>
      !habilidadesCandidato.some((hab) => hab.toLowerCase() === req.toLowerCase())
    );

    const percentual = this.requisitos.length > 0
      ? Math.round((encontradas.length / this.requisitos.length) * 100)
      : 0;

    return { encontradas, faltantes, percentual };
  }

  rotulo() {
    return `${this.cargo} - ${this.empresa} (${this.estado})`;
  }

  getSalarioFormatado() {
    return `R$ ${Number(this.salario).toLocaleString('pt-BR')}`;
  }
}

// =====================================================
// MODELO 2: HERANÇA E POLIMORFISMO (VagaRemota EXPORTADA)
// =====================================================
export class VagaRemota extends Vaga {
  constructor(dados) {
    super(dados);
    this.modalidade = "Remoto";
    this.abrangencia = dados.abrangencia || "Nacional";
  }

  rotulo() {
    return `${super.rotulo()} - Remoto (${this.abrangencia})`;
  }
}

// =====================================================
// MODELO 3: FILTRO DE ELEGIBILIDADE REGIONAL
// =====================================================
export function elegivel(vaga, perfil, incluirRemotasDeOutrosEstados = true) {
  if (vaga.estado === perfil.estado) return true;
  return vaga.modalidade === "Remoto" && incluirRemotasDeOutrosEstados;
}

export function filtrarElegiveis(vagas, perfil, incluirRemotas = true) {
  return vagas.filter((vaga) => elegivel(vaga, perfil, incluirRemotas));
}

// =====================================================
// CLOSURE — AUDITORIA DE PROCESSAMENTO
// =====================================================
export function criarContadorDeAnalises() {
  let totalAnalises = 0;
  const inicioProcesso = new Date();
  return function () {
    totalAnalises++;
    return {
      total: totalAnalises,
      iniciadoEm: inicioProcesso.toLocaleTimeString('pt-BR')
    };
  };
}

export const contarProcessamento = criarContadorDeAnalises();

// =====================================================
// CLASSIFICAR COMPATIBILIDADE
// =====================================================
export function classificarCompatibilidade(porcentagem) {
  if (porcentagem >= 80) return { texto: "Alta compatibilidade",   tag: "HIGH"   };
  else if (porcentagem >= 50) return { texto: "Média compatibilidade", tag: "MEDIUM" };
  else                        return { texto: "Baixa compatibilidade",  tag: "LOW"    };
}

// =====================================================
// ALGORITMO DE ANÁLISE PRINCIPAL
// =====================================================
export function analisarCandidato(candidato, vagasInstanciadas) {
  const vagasElegiveis = filtrarElegiveis(
    vagasInstanciadas,
    candidato,
    candidato.incluirRemotas ?? true
  );

  const relatorioVagas = vagasElegiveis.map((vaga) => {
    contarProcessamento();

    const { encontradas, faltantes, percentual } = vaga.compatibilidade(candidato.habilidades);
    const classificacao = classificarCompatibilidade(percentual);

    const atendeTudo = vaga.requisitos.length > 0 && faltantes.length === 0;

    return {
      instanciaVaga: vaga,
      compatibilidade: percentual,
      encontradas,
      faltantes,
      atendeTudo,
      classificacao: classificacao.texto,
      tag: classificacao.tag
    };
  });

  if (relatorioVagas.length === 0) {
    return { candidato, relatorioVagas: [], melhorVaga: null, todasFaltantes: [] };
  }

  const melhorVaga = relatorioVagas.reduce(
    (maior, atual) => (atual.compatibilidade > maior.compatibilidade ? atual : maior),
    relatorioVagas[0]
  );

  const todasFaltantes = relatorioVagas.reduce((acc, atual) => {
    atual.faltantes.forEach((hab) => {
      if (!acc.some((h) => h.toLowerCase() === hab.toLowerCase())) {
        acc.push(hab);
      }
    });
    return acc;
  }, []);

  return { candidato, relatorioVagas, melhorVaga, todasFaltantes };
}