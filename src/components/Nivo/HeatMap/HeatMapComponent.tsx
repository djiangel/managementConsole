import * as React from 'react';
import ApexCharts from 'react-apexcharts';

interface Props {
  data: any;
  title?: string;
  titleAlign?: string;
  showXAxis: boolean;
  showYAxis: boolean;
  min: number;
  max: number;
}

const HeatMapComponent: React.FunctionComponent<Props> = ({
  data,
  title,
  titleAlign,
  showXAxis,
  showYAxis,
  min,
  max
}) => {
  const options = {
    chart: {
      height: 200,
      width: 200,
      type: 'heatmap',
      toolbar: {
        show: false
      }
    },
    legend: {
      show: false
    },
    title: {
      text: title && title,
      align: titleAlign && titleAlign
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        // radius: 0,
        enableShades: true,
        useFillColorAsStroke: true,
        // reverseNegativeShade: true,
        colorScale: {
          ranges: [
            {
              from: min,
              to: -0.000001,
              name: 'low',
              color: '#FF0000'
            },
            {
              from: -0.000001,
              to: 0.000001,
              name: 'neutral',
              color: '#FFFFFF'
            },
            {
              from: 0.000002,
              to: max,
              name: 'extreme',
              color: '#00A100'
            }
          ]
        }
      }
    },
    yaxis: {
      labels: {
        show: showYAxis
      },
      axisTicks: {
        show: showYAxis
      }
    },
    xaxis: {
      labels: {
        show: showXAxis
      },
      axisTicks: {
        show: showXAxis
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1
    }
  };

  return (
    <ApexCharts
      options={options}
      series={data}
      type="heatmap"
      height={200}
      width={200}
    />
  );
};

export default HeatMapComponent;
