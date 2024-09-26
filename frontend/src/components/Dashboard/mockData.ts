const possibleAges = ['18-20', '21-23', '24-26', '27-29', '30+'];
const possibleGenders = ['Homem Cis', 'Mulher Cis', 'Homem Trans', 'Mulher Trans', 'Não-binário', 'Outro'];
const possibleEthnicities = ['Amarela', 'Branca', 'Parda', 'Preta', 'Indígena', 'Desejo não declarar'];

const indicadorPos = ['Sim', 'Não', 'Estou cursando'];
const indicadorEstadoAtual = ['Estudando', 'Trabalhando', 'Estudando e trabalhando', 'Nem estudando, nem trabalhando'];
const indicadorSatisfacaoProfissao = ['Muito satisfeito', 'Satisfeito', 'Pouco satisfeito', 'Indiferente', 'Insatisfeito', 'Muito insatisfeito'];

const indicatorsData: { [key: number]: string[] } = {
  1: indicadorPos,
  2: indicadorEstadoAtual,
  3: indicadorSatisfacaoProfissao
};

export const generateRandomData = (indicatorId: number, grouping: string): object[] => {
  const possibleGroups = grouping === 'age' 
    ? possibleAges 
    : grouping === 'gender' 
    ? possibleGenders 
    : grouping === 'ethnicity' 
    ? possibleEthnicities 
    : null;

  const chosenIndicator = indicatorsData[indicatorId] || [];

  if (grouping === 'Total' || !possibleGroups) {
    return [{
      name: 'Total',
      ...chosenIndicator.reduce((acc: { [key: string]: number }, indicator) => {
        acc[indicator] = Math.floor(Math.random() * 50);
        return acc;
      }, {})
    }];
  }

  return possibleGroups.map(group => {
    return chosenIndicator.reduce((acc: { [key: string]: any }, indicator) => {
      acc[indicator] = Math.floor(Math.random() * 50);
      return acc;
    }, { name: group });
  });
}

export const fetchGraphData = async (params: {
  courseId: number,
  year: string,
  indicatorId: number,
  grouping: string
}): Promise<any> => {
  
  const data = generateRandomData(params.indicatorId, params.grouping);
  console.log('data:', data);

  // Simulação de dados do gráfico
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}
