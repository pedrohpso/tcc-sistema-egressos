export interface iOption {
  id: number;
  text: string;
}

export interface iDependency { 
  fieldId: number;
  optionIds: number[];
}

export interface iField {
  id: number;
  type: 'text' | 'single_choice' | 'multiple_choice' | 'date';
  question: string;
  options?: iOption[]; 
  position: number;
  dependencies?: iDependency[];
  indicator?: string;
}

export interface iForm {
  id: number;
  title: string;
  status: 'draft' | 'published';
  fields: iField[];
}

export async function getMockFormData(): Promise<iForm> {
  return Promise.resolve(egressoForm);
}

const egressoForm: iForm = {
  id: 1,
  title: "Formulário de Egressos do curso TADS do IFSP",
  status: 'published',
  fields: [
    {
      id: 5,
      type: 'single_choice',
      question: 'Quando você entrou no curso de TADS do IFSP, você trabalhava?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' }
      ],
      position: 5,
      indicator: 'Trabalhava quando ingressou'
    },
    {
      id: 6,
      type: 'single_choice',
      question: 'Você trabalhava em?',
      options: [
        { id: 1, text: 'Na área de T.I.' },
        { id: 2, text: 'Outra área.' }
      ],
      position: 6,
      dependencies: [
      { fieldId: 5, optionIds: [1] } 
      ],
      indicator: 'Que área trabalhava quando ingressou'
    },
    {
      id: 7,
      type: 'single_choice',
      question: 'Atualmente, você se encontra?',
      options: [
        { id: 1, text: 'Estudando' },
        { id: 2, text: 'Trabalhando' },
        { id: 3, text: 'Estudando e trabalhando' },
        { id: 4, text: 'Nem estudando, nem trabalhando' }
      ],
      position: 7,
      indicator: 'Situação atual'
    },
    {
      id: 8,
      type: 'single_choice',
      question: 'Atualmente você trabalha com T.I?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' }
      ],
      position: 8,
      dependencies: [
      { fieldId: 7, optionIds: [2, 3] }
      ],
      indicator: 'Trabalha com T.I.'
    },
    {
      id: 9,
      type: 'single_choice',
      question: 'Indique a principal razão pela qual não esteja atuando em atividade relativa à sua área de formação:',
      options: [
        { id: 1, text: 'Não há oferecimento de vagas' },
        { id: 2, text: 'Desisti de atuar na área' },
        { id: 3, text: 'Outra atividade oferece remuneração melhor' },
        { id: 4, text: 'Não há oportunidade para pessoas sem experiência na área' },
        { id: 5, text: 'Exigência de comprovação de experiência' },
        { id: 6, text: 'Outros' }
      ],
      position: 9,
      dependencies: [
      { fieldId: 8, optionIds: [2] } 
      ],
      indicator: 'Razão de não trabalhar com T.I.'
    },
    {
      id: 10,
      type: 'single_choice',
      question: 'Que área da T.I você atua?',
      options: [
        { id: 1, text: 'Desenvolvimento' },
        { id: 2, text: 'Segurança da Informação' },
        { id: 3, text: 'Suporte Técnico' },
        { id: 4, text: 'Qualidade de Software' },
        { id: 5, text: 'Administração de Redes' },
        { id: 6, text: 'Administração de banco de dados' },
        { id: 7, text: 'Ciência de Dados' },
        { id: 8, text: 'Inteligência Artificial' },
        { id: 9, text: 'Computação em nuvem' }
      ],
      position: 10,
      dependencies: [
      { fieldId: 8, optionIds: [1] } 
      ],
      indicator: 'Área de atuação'
    },
    {
      id: 11,
      type: 'single_choice',
      question: 'Qual sua faixa de salário atual?',
      options: [
        { id: 1, text: 'Menos de R$ 2.000,00' },
        { id: 2, text: 'Entre R$ 2.000,00 e R$ 3.000,00' },
        { id: 3, text: 'Entre R$ 3.000,00 e R$ 5.000,00' },
        { id: 4, text: 'Entre R$ 5.000,00 e R$ 7.000,00' },
        { id: 5, text: 'Entre R$ 7.000,00 e R$ 10.000,00' },
        { id: 6, text: 'Mais de R$ 10.000,00' }
      ],
      position: 11,
      dependencies: [
      { fieldId: 8, optionIds: [1] } 
      ],
      indicator: 'Faixa salarial'
    },
    {
      id: 12,
      type: 'single_choice',
      question: 'Qual o seu regime de trabalho atual?',
      options: [
        { id: 1, text: 'Presencial' },
        { id: 2, text: 'Home Office' },
        { id: 3, text: 'Híbrido' }
      ],
      position: 12,
      dependencies: [
        { fieldId: 8, optionIds: [1] } 
      ],
      indicator: 'Regime de trabalho'
    },
    {
      id: 13,
      type: 'single_choice',
      question: 'Qual é o porte da empresa da área de TI que você trabalha atualmente?',
      options: [
        { id: 1, text: 'Micro (Até 9 empregados)' },
        { id: 2, text: 'Pequena (10 a 49 empregados)' },
        { id: 3, text: 'Média (50 a 99 empregados)' },
        { id: 4, text: 'Grande (Acima de 100 empregados)' }
      ],
      position: 13,
      dependencies: [
        { fieldId: 8, optionIds: [1] }
      ],
      indicator: 'Porte da empresa'
    },
    {
      id: 14,
      type: 'single_choice',
      question: 'A empresa da área de TI que você trabalha se encontra fora do país?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' }
      ],
      position: 14,
      dependencies: [
        { fieldId: 8, optionIds: [1] }
      ],
      indicator: 'Empresa fora do país'
    },
    {
      id: 15,
      type: 'single_choice',
      question: 'Você vive em que estado?',
      options: [
        { id: 1, text: 'AC' },
        { id: 2, text: 'AL' },
        { id: 3, text: 'AP' },
        { id: 4, text: 'AM' },
        { id: 5, text: 'BA' },
        { id: 6, text: 'CE' },
        { id: 7, text: 'DF' },
        { id: 8, text: 'ES' },
        { id: 9, text: 'GO' },
        { id: 10, text: 'MA' },
        { id: 11, text: 'MT' },
        { id: 12, text: 'MS' },
        { id: 13, text: 'MG' },
        { id: 14, text: 'PA' },
        { id: 15, text: 'PB' },
        { id: 16, text: 'PR' },
        { id: 17, text: 'PE' },
        { id: 18, text: 'PI' },
        { id: 19, text: 'RJ' },
        { id: 20, text: 'RN' },
        { id: 21, text: 'RS' },
        { id: 22, text: 'RO' },
        { id: 23, text: 'RR' },
        { id: 24, text: 'SC' },
        { id: 25, text: 'SP' },
        { id: 26, text: 'SE' },
        { id: 27, text: 'TO' }
      ],
      position: 15,
      dependencies: [
        { fieldId: 14, optionIds: [2] } 
      ],
      indicator: 'Estado'
    },
    {
      id: 16,
      type: 'single_choice',
      question: 'Quanto tempo decorreu entre a colação de grau e o início da atuação profissional na área de TI?',
      options: [
        { id: 1, text: 'Até 06 meses' },
        { id: 2, text: 'De 06 a 12 meses' },
        { id: 3, text: 'De 12 a 24 meses' },
        { id: 4, text: 'Acima de 24 meses' }
      ],
      position: 16,
      dependencies: [
        { fieldId: 8, optionIds: [1] }
      ],
      indicator: 'Tempo entre colação e início da atuação profissional'
    },
    {
      id: 17,
      type: 'multiple_choice',
      question: 'Quais foram/são os maiores obstáculos à entrada no mundo do trabalho?',
      options: [
        { id: 1, text: 'Necessidade de prévia especialização' },
        { id: 2, text: 'Exigência de experiência' },
        { id: 3, text: 'Pequena quantidade de vagas no mercado local' },
        { id: 4, text: 'Falta de conhecimento técnico específico' },
        { id: 5, text: 'Falta de domínio de uma língua estrangeira' },
        { id: 6, text: 'Outros' }
      ],
      position: 17,
      indicator: 'Obstáculos à entrada no mundo do trabalho'
    },
    {
      id: 18,
      type: 'single_choice',
      question: 'Em termos de realização pessoal, qual é o seu grau de satisfação com a sua profissão?',
      options: [
        { id: 1, text: 'Muito satisfeito' },
        { id: 2, text: 'Satisfeito' },
        { id: 3, text: 'Pouco satisfeito' },
        { id: 4, text: 'Indiferente' },
        { id: 5, text: 'Insatisfeito' },
        { id: 6, text: 'Muito insatisfeito' }
      ],
      position: 18,
      indicator: 'Satisfação com a profissão'
    },
    {
      id: 19,
      type: 'single_choice',
      question: 'Como você se sentiu, em relação à sua atuação profissional, logo que se formou?',
      options: [
        { id: 1, text: 'Totalmente preparado' },
        { id: 2, text: 'Razoavelmente preparado' },
        { id: 3, text: 'Preparado' },
        { id: 4, text: 'Pouco preparado' },
        { id: 5, text: 'Despreparado' }
      ],
      position: 19,
      indicator: 'Preparo profissional ao se formar'
    },
    {
      id: 20,
      type: 'single_choice',
      question: 'Como você classifica o foco do conteúdo de seu Curso, com relação às necessidades do mundo do trabalho?',
      options: [
        { id: 1, text: 'Correto' },
        { id: 2, text: 'Incorreto' },
        { id: 3, text: 'Parcialmente correto' },
        { id: 4, text: 'Parcialmente incorreto' }
      ],
      position: 20,
      indicator: 'Foco do conteúdo do curso em relação ao mercado de trabalho'
    },
    {
      id: 21,
      type: 'single_choice',
      question: 'Como você avalia sua situação profissional atual comparada àquela em que você se encontrava quando ingressou no curso no IFSP?',
      options: [
        { id: 1, text: 'Melhor' },
        { id: 2, text: 'Igual' },
        { id: 3, text: 'Pior' }
      ],
      position: 21,
      indicator: 'Situação profissional atual comparada àquela em que ingressou no curso'
    },
    {
      id: 22,
      type: 'single_choice',
      question: 'Você considera que a sua formação em Análise e Desenvolvimento de Sistemas no IFSP foi relevante para entrar no mercado de trabalho?',
      options: [
        { id: 1, text: 'Sim, extremamente relevante' },
        { id: 2, text: 'Sim, pouco relevante' },
        { id: 3, text: 'Não sei responder' },
        { id: 4, text: 'Não, foi irrelevante' },
        { id: 5, text: 'Não, foi completamente irrelevante' }
      ],
      position: 22,
      indicator: 'Relevância da formação para entrar no mercado de trabalho'
    },
    {
      id: 23,
      type: 'single_choice',
      question: 'Você tem interesse em ministrar palestras, sobre sua área de atuação profissional, aos atuais alunos de seu Curso?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' }
      ],
      position: 23,
      indicator: 'Interesse em ministrar palestras'
    },
    {
      id: 24,
      type: 'single_choice',
      question: 'Uma vez formado, você cursou pós-graduação?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' },
        { id: 3, text: 'Estou cursando' }
      ],
      position: 24,
      indicator: 'Cursou pós-graduação'
    },
    {
      id: 25,
      type: 'single_choice',
      question: 'Qual é o nível da pós-graduação que cursa/cursou?',
      options: [
        { id: 1, text: 'Especialização' },
        { id: 2, text: 'Mestrado' },
        { id: 3, text: 'Doutorado' },
        { id: 4, text: 'Pós-doutorado' }
      ],
      position: 25,
      dependencies: [
        { fieldId: 24, optionIds: [1, 3] }
      ],
      indicator: 'Nível da pós-graduação'
    },
    {
      id: 26,
      type: 'single_choice',
      question: 'Você mantém contato com o IFSP, desde a sua colação de grau?',
      options: [
        { id: 1, text: 'Sim' },
        { id: 2, text: 'Não' }
      ],
      position: 26,
      indicator: 'Mantém contato com o IFSP'
    },
    {
      id: 27,
      type: 'multiple_choice',
      question: 'Indique o tipo de contato mantido:',
      options: [
        { id: 1, text: 'Visita' },
        { id: 2, text: 'Uso de serviços' },
        { id: 3, text: 'Participação em eventos' },
        { id: 4, text: 'Participação em cursos de atualização' },
        { id: 5, text: 'Outra graduação' },
        { id: 6, text: 'Cursando Pós-Graduação' },
        { id: 7, text: 'Empresa Junior' },
        { id: 8, text: 'Participação em grupo de pesquisa' }
      ],
      position: 27,
      dependencies: [
        { fieldId: 26, optionIds: [1] } 
      ],
      indicator: 'Tipo de contato mantido'
    }
  ]
};