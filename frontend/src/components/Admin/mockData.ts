const possibleAges = ['18-20', '21-23', '24-26', '27-29', '30+'];

const possibleGenders = ['Homem Cis', 'Mulher Cis', 'Homem Trans', 'Mulher Trans', 'Não-binário', 'Outro'];

const possibleRegions = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

const indicadorPos = ['Sim', 'Não', 'Estou cursando'];

const indicadorEstadoAtual = ['Estudando', 'Trabalhando', 'Estudando e trabalhando', 'Nem estudando, nem trabalhando'];

const indicadorSatisfacaoProfissão = ['Muito satisfeito', 'Satisfeito', 'Pouco satisfeito', 'Indiferente', 'Insatisfeito', 'Muito insatisfeito'];


// Função que gera os dados mockados para o gráfico:
export const generateRandomData = (indicator: string, grouping: string): object[] => {
  const possibleGroups = grouping === 'Por idade' ?  possibleAges : grouping === 'Por gênero' ? possibleGenders : possibleRegions;
  const chosenIndicator = indicator === 'Cursou pós graduação' ? indicadorPos : indicator === 'Estado atual' ? indicadorEstadoAtual : indicadorSatisfacaoProfissão;

  return possibleGroups.map(group => {
    return chosenIndicator.reduce((acc: { [key: string]: any }, indicator) => {
      acc[indicator] = Math.floor(Math.random() * 50);
      return acc;
    }, { name: group });
  });
}


export const fetchGraphData = async (params: {
  course: string,
  year: string,
  indicator: string,
  grouping: string
}): Promise<any> => {
  
  const data = generateRandomData(params.indicator, params.grouping);
  console.log('data:', data);

  // Simulação de dados do gráfico
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}