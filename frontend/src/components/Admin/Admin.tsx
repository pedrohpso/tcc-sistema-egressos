import React, { useState, useEffect } from 'react'
import './Admin.css'
import { fetchGraphData } from './mockData'
import Chart from '../Chart/Chart'
import { FaChartPie, FaChartBar, FaTable } from "react-icons/fa"
import { IoMdDownload } from "react-icons/io";
import { useIndicators } from './hooks/useIndicators'
import { useGroupings } from './hooks/useGroupings'
import { useYears } from './hooks/useYears'
import Button from '../Button/Button'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'



const handleDownloadClick = async (type: 'pdf' | 'png') => {
  const input = document.getElementById('chart-container') as HTMLElement

  try {
    const canvas = await html2canvas(input)
    const imgData = canvas.toDataURL('image/png')
    if(type === 'pdf'){
      const pdf = new jsPDF({orientation: 'portrait', unit: 'px', format: 'a4'})
      const width = pdf.internal.pageSize.getWidth()
      const height = (canvas.height * width) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, width, height)
      pdf.save(`gráfico.${type}`)
    }else {
      const link = document.createElement('a')
      link.href = imgData
      link.download = `gráfico.${type}`
      link.click()
    }
  } catch (error) {
    console.log('error: ', error)
  }
}


const Admin: React.FC = () => {
  const [course, setCourse] = useState<string>('TADS')
  const [year, setYear] = useState<string>('')
  const [indicator, setIndicator] = useState<string>('')
  const [grouping, setGrouping] = useState<string>('')
  const [chartType, setChartType] = useState<string>('')
  const [data, setData] = useState<Record<string, string>[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { years, isLoading: loadingYears } = useYears(course);

  const { indicators, isLoading: loadingIndicators } = useIndicators(year);

  const { groupings, isLoading: loadingGroupings } = useGroupings(indicator);
    
  const chartTypeButtonClass = !course || !year || !indicator || !grouping || loadingYears || loadingIndicators || loadingGroupings ? "chart-type-button disabled" : "chart-type-button"

  useEffect(() => {
    const fetchData = async () => {
      if (course && year && indicator && grouping) {
        setIsLoading(true);
        const graphData = await fetchGraphData({ course, year, indicator, grouping });
        setData(graphData);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [course, year, indicator, grouping]);

  const handleChartTypeClick = (type: 'bar' | 'pie' | 'table') => {
    if (course && year && indicator && grouping) {
      setChartType(type);
    }
  };

  return (
    <div className="admin-container">
      <div className="filters-container">
        <div className="select-container">
          <label>Curso:</label>
          <br />
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="1">Tecnologia em análise e desenvolvimento de sistemas </option>
          </select>
        </div>
        <div className="select-container">
          <label>Ano de ingresso:</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={loadingYears || years.length === 0}
          >
            {loadingYears ? (
              <option value="">Carregando...</option>
            ) : (
              <>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="select-container">
          <label>Indicador:</label>
          <select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            disabled={loadingIndicators || indicators.length === 0}
          >
            {loadingIndicators ? (
              <option value="">Carregando...</option>
            ) : (
              <>
                {indicators.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="select-container">
          <label>Agrupamento:</label>
          <select
            value={grouping}
            onChange={(e) => setGrouping(e.target.value)}
            disabled={loadingGroupings || groupings.length === 0}
          >
            {loadingGroupings ? (
              <option value="">Carregando...</option>
            ) : (
              <>
                {groupings.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </>
            )}
          </select>
        </div>
        <div className="select-container">
          <label>Tipo de visualização:</label>
          <div className='chart-type-container'>
            <FaChartBar className={chartTypeButtonClass} onClick={() =>  handleChartTypeClick('bar')} />
            <FaChartPie className={chartTypeButtonClass} onClick={() =>  handleChartTypeClick('pie')} />
            <FaTable className={chartTypeButtonClass} onClick={() =>  handleChartTypeClick('table')} />
          </div>
        </div>
        {data.length > 0 && (chartType === 'bar' || chartType === 'pie' || chartType === 'table') ? <div className='select-container'>
          <label>Download</label> 
          <div className='download-button-container'>
            <Button label='PNG' icon={<IoMdDownload />} onClick={() => handleDownloadClick('png')}></Button>
            <Button label='PDF' icon={<IoMdDownload />} onClick={() => handleDownloadClick('pdf')}></Button>
          </div>
        </div> : null}
      </div>
      <div id= "chart-container" className="chart-container">
        {isLoading ? <div className="loading">Carregando...</div>: data.length > 1 && <Chart type={chartType} data={data}/>}
      </div>
    </div>
  )
}

export default Admin
