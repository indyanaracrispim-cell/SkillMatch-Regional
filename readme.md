# ⚡ SkillMatch Regional — DeV´agas

> Plataforma web acessível de triagem e alinhamento regional que compara perfis técnicos com requisitos de vagas em tecnologia e saúde digital.

Este projeto é a evolução do sistema SkillMatch para a **Recuperação Paralela (RP)** do curso de Desenvolvimento Front-End da *SCTEC* (Blumenau, SC). A aplicação foi reestruturada para suportar inteligência regional, seleção por competências (checkboxes), acessibilidade avançada (landmarks e leitores de tela) e filtragem por Unidades Federativas (UF).

---

## 📋 Sobre o Projeto

O sistema permite que o candidato cadastre seu perfil selecionando seu estado de residência e suas competências técnicas. A aplicação consome uma base de dados externa de vagas (`vagas.json`) e realiza a análise regional em tempo real, gerando:

- **Filtro de Elegibilidade Regional:** Exibição das vagas presenciais/híbridas do estado do candidato, além de vagas **Remotas** (nacionais/regionais) se habilitado.
- **Percentual de Compatibilidade:** Calculado dinamicamente direto no motor da vaga.
- **Polimorfismo e Herança:** Renderização de vagas convencionais (`Vaga`) e vagas remotas (`VagaRemota`).
- **Mapeamento de Competências:** Identificação visual de Match (requisitos atendidos) e Gap (habilidades faltantes).
- **Classificação por Tags:** Categorização em HIGH (Alta), MEDIUM (Média) ou LOW (Baixa) compatibilidade.
- **Melhor Match Regional:** Destaque automático da vaga mais alinhada.
- **Plano de Desenvolvimento:** Recomendação inteligente de estudos baseada nos gaps consolidados.
- **Acessibilidade e Usabilidade:** Formulário validado com `aria-live="polite"` e navegação via teclado sem recarregamento de página.
- **Persistência de Dados:** Perfil e preferências salvos no navegador via `localStorage`.

---

## 🛠️ Tecnologias e Conceitos Aplicados

- **HTML5 Semântico & Acessível:** Estrutura 100% livre de `divs` genéricas (uso de `<section>`, `<article>`, `<header>`, `<aside>`, `<fieldset>`, `<legend>`, `<ul>`, `<li>`), com atributos ARIA e landmarks W3C.
- **CSS3 Moderno:** Layout responsivo mobile-first construído com Flexbox.
- **JavaScript Avançado (ES6+):**
  - Programação Orientada a Objetos (POO) com classes, herança e polimorfismo (`Vaga` e `VagaRemota`).
  - Métodos modernos de array (`map`, `filter`, `reduce`, `some`, `every`).
  - Requisição assíncrona com `fetch` e `async/await`.
  - Controle de auditoria e escopo com Closure (`criarContadorDeAnalises`).
  - Arquitetura modular via Módulos ES (`import`/`export`).
  - Manipulação de dados com `localStorage` e `JSON`.

---

## 🚀 Como Executar

1. Clone este repositório para sua máquina local:
   ```bash
   git clone [https://github.com/indyanaracrispim-cell/SkillMatch-Regional.git](https://github.com/indyanaracrispim-cell/SkillMatch-Regional.git)
   Abra a pasta do projeto no VS Code.

Utilize a extensão Live Server para abrir o arquivo index.html no seu navegador.

Selecione seu estado, marque ao menos 2 habilidades técnicas e clique em Salvar Perfil e Analisar.

📋 Trello / Kanban do Projeto
Acompanhe o planejamento, as tarefas realizadas e a organização da Recuperação Paralela através do quadro público:(https://trello.com/b/5tmKN9Ip/meu-quadro-do-trello)

🎥 Demonstração em Vídeo
Assista à apresentação da Recuperação Paralela (link do Google Drive com permissão pública):(Cole aqui o link do seu vídeo gravado para a RP)

🗂️ Estrutura de Pastas do Projeto
Plaintext
SkillMatch-Regional/
├── assets/
│   ├── css/
│   │   └── estilo.css        # Estilização responsiva
│   ├── dados/
│   │   └── vagas.json        # Base JSON com estado, modalidade e abrangência
│   └── js/
│       ├── dados.js          # Requisição assíncrona (fetch)
│       ├── main.js           # Ponto de entrada, eventos e orquestração
│       ├── motor.js          # Cérebro lógico (POO, Herança, Algoritmo e Filtros)
│       └── ui.js             # Renderização DOM com HTML semântico
├── index.html                # Estrutura acessível e semântica (W3C)
└── README.md                 # Documentação completa do projeto
👩‍💻 Autora
Indyanara Crispim

Projeto de Recuperação Paralela (RP) desenvolvido durante o curso de Desenvolvimento Front-End SCTEC — Blumenau, SC.