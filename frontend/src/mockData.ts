type DashboardData = {
  publishedFormsAmount: number;
  indicatorsAmount: number;
  registeredAlumniAmount: number;
  lastPublishedFormTitle: string;
  formReachAverage: number;
}

export async function getDashboardData(courseId: number): Promise<DashboardData>  {
  // Simulação de dados do dashboard pegos no backend
  console.log('Fazer requisição para o backend para pegar os dados do dashboard do curso com id:', courseId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        publishedFormsAmount: 2,
        indicatorsAmount: 36,
        registeredAlumniAmount: 150,
        lastPublishedFormTitle: 'Formulário de Egressos TADS Edição 2024',
        formReachAverage: 67.5
      });
    }, 1000);
  });
}
  
