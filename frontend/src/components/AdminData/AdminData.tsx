import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './AdminData.css';
import { fetchGraphData } from '../../mockData';
import Chart from './Chart/Chart';
import { FaChartPie, FaChartBar, FaTable } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { useIndicators } from './hooks/useIndicators';
import { useForms } from './hooks/useForms';
import Button from '../Button/Button';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useCourse } from '../../context/CourseContext';
import { YearRangeSelector } from './YearRangeSelector/YearRangeSelector';
import Tooltip from '../Tooltip/Tooltip';


const debouncedFetchData = debounce(async (fetchData: Function) => {
  await fetchData();
}, 1500);

const convertToCSV = (data: Record<string, string>[]) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]).filter(key => key !== 'name');
  const csvRows = [];

  csvRows.push(['', ...headers].join(','));

  data.forEach((row) => {
    const values = headers.map(header => row[header] || '');
    csvRows.push([row.name, ...values].join(','));
  });

  return csvRows.join('\n');
};

const AdminData: React.FC = () => {
  const { selectedCourse } = useCourse();
  const [indicator, setIndicator] = useState<number | null>(null);
  const [formId, setFormId] = useState<number | null>(null);
  const [grouping, setGrouping] = useState<string>('total');
  const [chartType, setChartType] = useState<string>('');
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [minValue, setMinValue] = useState<{ value: number, group: string, indicator: string } | null>(null);
  const [maxValue, setMaxValue] = useState<{ value: number, group: string, indicator: string } | null>(null);
  const [yearRange, setYearRange] = useState([2017, 2024]);

  const [minYear, maxYear] = yearRange;

  const { forms, isLoading: loadingForms } = useForms(selectedCourse!.id || null);
  const { indicators, isLoading: loadingIndicators } = useIndicators(formId);

  useEffect(() => {
    if (forms.length > 0) {
      setFormId(forms[0].id); 
    }
  }, [forms]);

  useEffect(() => {
    if (formId && indicators.length > 0) {
      setIndicator(indicators[0].id);
    }
  }, [formId, indicators]);

  const chartTypeButtonClass = !minYear || !maxYear || !indicator || !grouping || loadingForms || loadingIndicators ? "chart-type-button disabled" : "chart-type-button";

  const findMinMaxValues = (data: Record<string, string | number>[]) => {
    let minValue = { value: Infinity, group: '', indicator: '' };
    let maxValue = { value: -Infinity, group: '', indicator: '' };

    data.forEach((item) => {
      Object.keys(item).forEach(key => {
        if (key !== 'name' && typeof item[key] === 'number') {
          const value = item[key] as number;
          if (value < minValue.value) {
            minValue = { value, group: item.name as string, indicator: key };
          }
          if (value > maxValue.value) {
            maxValue = { value, group: item.name as string, indicator: key };
          }
        }
      });
    });

    setMinValue(minValue);
    setMaxValue(maxValue);
  };

  const fetchData = useCallback(async () => {
    if (selectedCourse && minYear && maxYear && indicator && grouping) {
      setIsLoading(true);
      const graphData = await fetchGraphData({
        courseId: selectedCourse.id,
        year: `${minYear}-${maxYear}`,
        indicatorId: indicator,
        grouping,
      });
      setData(graphData);
      setIsLoading(false);
      findMinMaxValues(graphData);
    }
  }, [selectedCourse, minYear, maxYear, indicator, grouping]);

   useEffect(() => {
    if (selectedCourse && formId && indicator) {
      debouncedFetchData(fetchData);
    }
  }, [selectedCourse, formId, minYear, maxYear, indicator, grouping, fetchData]);

  const handleYearRangeChange = (newRange: number[]) => {
    setYearRange(newRange);
  };

  const handleChartTypeClick = (type: 'bar' | 'pie' | 'table') => {
    if (minYear && maxYear && indicator && grouping) {
      setChartType(type);
    }
  };

  const handleDownloadClick = async (type: 'pdf' | 'png' | 'csv') => {
    const input = document.getElementById('chart-container') as HTMLElement;
  
    if(type !== 'csv') {
      try {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        if (type === 'pdf') {
          const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
          const width = pdf.internal.pageSize.getWidth();
          const height = (canvas.height * width) / canvas.width;
  
          pdf.addImage(imgData, 'PNG', 0, 0, width, height);
          pdf.save(`gráfico.${type}`);
        } else {
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `gráfico.${type}`;
          link.click();
        }
      } catch (error) {
        console.log('error: ', error);
      }
    }else {
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${Date.now()}-${indicator}-${grouping}.csv`);
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
    }
  };

  
  return (
    <div className='admin-data-container'>
      <div className="graph-container">
        <div className="filters-container">
          <div className="select-container">
            <label>Formulário</label>
            <select
              value={formId || ''}
              onChange={(e) => setFormId(Number(e.target.value))} 
              disabled={loadingForms || forms.length === 0}
            >
              {loadingForms ? (
                <option value="">Carregando...</option>
              ) : (
                <>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>{form.title}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="select-container">
            <div className='label-tooltip-container'>
              <label>Ano de graduação</label>
              <Tooltip message="O primeiro curso (ADS) do campus Campinas do IFSP começou em 2014, e a primeira turma se formou em 2017. Por isso, 2017 é o ano mínimo para a seleção de graduação. Esse dado é utilizado no sistema para agrupar e analisar os egressos com base no ano de conclusão do curso." />
            </div>
            <div className='year-range-container'>
              <YearRangeSelector
                minYear={2017}
                maxYear={2024}
                onChange={handleYearRangeChange}
              />
            </div>
          </div>

          <div className="select-container">
          <div className='label-tooltip-container'>
              <label>Indicador</label>
              <Tooltip message="Indicador é uma métrica ou dado coletado a partir das respostas dos egressos. No sistema, os indicadores são usados para medir aspectos como satisfação com o curso, situação profissional ou educacional após a formatura, e outros dados importantes para análise institucional." />
            </div>
            <select
              value={indicator || ''}
              onChange={(e) => setIndicator(Number(e.target.value))}
              disabled={loadingIndicators || indicators.length === 0}
            >
              {loadingIndicators ? (
                <option value="">Carregando...</option>
              ) : (
                <>
                  {indicators.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.text}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="select-container">
            <div className='label-tooltip-container'>
              <label>Agrupamento</label>
              <Tooltip message="Agrupamento refere-se à forma como os dados são organizados para análise, como por faixa etária, gênero ou etnia. No sistema, você pode escolher diferentes critérios de agrupamento para visualizar como os egressos se distribuem entre esses critérios em relação a um determinado indicador." />
            </div>
            <select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
            >
              <option value="total">Total</option>
              <option value="age">Faixa Etária</option>
              <option value="gender">Gênero</option>
              <option value="ethnicity">Etnia</option>
            </select>
          </div>

          <div className="select-container">
            <label>Tipo de visualização:</label>
            <div className='chart-type-container'>
              <FaChartBar className={chartTypeButtonClass} onClick={() => handleChartTypeClick('bar')} />
              <FaChartPie className={chartTypeButtonClass} onClick={() => handleChartTypeClick('pie')} />
              <FaTable className={chartTypeButtonClass} onClick={() => handleChartTypeClick('table')} />
            </div>
          </div>

          {data.length > 0 && (chartType === 'bar' || chartType === 'pie' || chartType === 'table') ? (
            <div className='select-container'>
              <label>Download</label>
              <div className='download-button-container'>
                <Button label='PNG' icon={<IoMdDownload />} onClick={() => handleDownloadClick('png')} />
                <Button label='PDF' icon={<IoMdDownload />} onClick={() => handleDownloadClick('pdf')} />
                <Button label='CSV' icon={<IoMdDownload />} onClick={() => handleDownloadClick('csv')} />
              </div>
            </div>
          ) : null}
        </div>

        <div id="chart-container" className="chart-container">
          {isLoading ? <div className="loading">Carregando...</div> : data.length > 0 && <Chart type={chartType} data={data} />}
        </div>
      </div>
      <div>
        <div className='tiny-content'>
          {minValue && maxValue && (
            <>
              <div className='value-box'>
                <div className='value-label max-value'>Maior valor</div>
                <div className='value-number max-value'>{maxValue.value}</div>
                <div className='value-info max-value'>
                  <div>Agrupamento: {maxValue.group}</div>
                  <div>Resposta: {maxValue.indicator}</div>
                </div>
              </div>
              <div className='value-box'>
                <div className='value-label min-value'>Menor valor</div>
                <div className='value-number min-value'>{minValue.value}</div>
                <div className='value-info min-value'>
                  <div>Agrupamento: {minValue.group}</div>
                  <div>Resposta: {minValue.indicator}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminData;
