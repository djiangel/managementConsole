import React from 'react';
import { Radar } from 'react-chartjs-2';

Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.enabled = false;
const data = {
  labels: [
    'Wet',
    'Roasted',
    'Earthy',
    'Astringent',
    'Marine',
    'Mineral',
    'Retronasal',
    'Gamey',
    'Woody',
    'Bitter',
    'Meaty',
    'Smoked',
    'Dry',
    'Rich',
    'Dairy',
    'Mouth Feel',
    'Nuts & Seeds',
    'Herbaceous',
    'Cold Finish',
    'Floral',
    'Spices',
    'Sour & Acidity',
    'Fruit',
    'Sugars'
  ],
  datasets: [
    {
      label: 'Objective Flavor Profile',
      backgroundColor: 'rgba(70,93,186,0.5)',
      pointBackgroundColor: '#022950',
      pointBorderColor: '#022950',
      pointHoverBackgroundColor: '#fff',
      pointStyle: 'circle',
      pointRadius: 4,
      borderCapStyle: 'round',
      pointHoverBorderColor: '#022950',
      borderColor: 'black',
      borderWidth: 1,
      labelSize: 17,
      data: [
        3,
        1,
        2,
        0,
        0,
        1,
        2,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        0,
        3,
        3
      ]
    },
    {
      label: ' ',
      display: false,
      pointBackgroundColor: '#fff',
      hoverBackgroundColor: 'f4f6f9',
      hoverBorderWidth: 0,
      pointHoverBackgroundColor: 'f4f6f9',
      pointHoverBorderColor: 'f4f6f9',
      fill: false,
      borderColor: 'black',
      borderWidth: 0,
      pointBorderColor: 'black',
      pointRadius: 4,
      pointStyle: 'circle',
      borderCapStyle: 'round',
      pointHoverBorderColor: 'black',
      data: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    },
    {
      label: '  ',
      display: false,
      pointBackgroundColor: '#fff',
      fill: false,
      borderColor: 'black',
      borderWidth: 0,
      pointBorderColor: 'black',
      pointRadius: 4,
      pointStyle: 'circle',
      borderCapStyle: 'round',
      pointHoverBorderColor: 'black',
      data: [
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2
      ]
    },
    {
      label: '   ',
      display: false,
      pointBackgroundColor: '#fff',
      fill: false,
      borderColor: 'black',
      borderWidth: 0,
      pointBorderColor: 'black',
      pointRadius: 4,
      pointStyle: 'circle',
      borderCapStyle: 'round',
      pointHoverBorderColor: 'black',
      data: [
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3,
        3
      ]
    },
    {
      label: '    ',
      display: false,
      pointBackgroundColor: '#fff',
      fill: false,
      borderColor: 'black',
      borderWidth: 0,
      pointBorderColor: 'black',
      pointRadius: 4,
      pointStyle: 'circle',
      borderCapStyle: 'round',
      pointHoverBorderColor: 'black',
      data: [
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4,
        4
      ]
    },
    {
      label: '     ',
      display: false,
      pointBackgroundColor: '#fff',
      fill: false,
      borderColor: 'black',
      borderWidth: 0,
      pointBorderColor: 'black',
      pointRadius: 4,
      pointStyle: 'circle',
      borderCapStyle: 'round',
      pointHoverBorderColor: 'black',
      data: [
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ],
      tooltips: { enabled: false },
      hover: { mode: null },
      legend: {
        display: false
      }
    }
  ]
};

const options = {
  scale: {
    angleLines: {
      display: true,
      lineWidth: 1,
      color: 'black'
    },
    gridLines: {
      display: true,
      circular: false,
      color: 'black',
      lineWidth: 1.2,

      drawTicks: false
    },
    ticks: {
      min: 0,
      max: 5,
      maxTicksLimit: 6,
      beginAtZero: 0,
      display: false
    },
    pointLabels: {
      fontColor: [
        '#00e500',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        '#00e500',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        'black',
        '#00e500'
      ],
      fontSize: 15
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem.datasetIndex].label || '';

          return tooltipItem;
        }
      }
    }
  }
};

class MyResponsiveRadar extends React.Component {
  render() {
    return (
      <div>
        <Radar data={data} options={options} />
      </div>
    );
  }
}

export default MyResponsiveRadar;
// import { ResponsiveRadar } from '@nivo/radar'

// const LabelComponent = ({ id, anchor }) => {
//   console.log(id, anchor)
//   return (
//   <g>
//       <text style={{fontSize: 15,
//                 fontWeight: 'bold',
//                 fill: 'black'}}>{id}</text>

//       </g>
// )}
// const MyResponsiveRadar = ({ data }) => (
//     <ResponsiveRadar
//         data={[
//           {
//             "GGVar":"Wet",
//             "intensity": 3
//           },
//           {
//             "GGVar":"Roasted",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Earthy",
//             "intensity": 2
//           },
//           {
//             "GGVar":"Astringent",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Marine",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Mineral",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Retronasal",
//             "intensity": 2
//           },
//           {
//             "GGVar":"Gamey",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Woody",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Bitter",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Meaty",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Smoked",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Dry",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Rich",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Dairy",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Mouth Feel",
//             "intensity": 2
//           },
//           {
//             "GGVar":"Nuts & Seeds",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Herbaceous",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Cold Finish",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Floral",
//             "intensity": 2
//           },
//           {
//             "GGVar":"Spices",
//             "intensity": 1
//           },
//           {
//             "GGVar":"Sour & Acidity",
//             "intensity": 0
//           },
//           {
//             "GGVar":"Fruit",
//             "intensity": 3
//           },
//           {
//             "GGVar":"Sugars",
//             "intensity": 3
//           }
//         ]}
//         keys={[ 'intensity' ]}
//         indexBy="GGVar"
//         maxValue={5}
//         margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
//         curve="linearClosed"
//         borderWidth={1}
//         borderColor='black'
//         gridLevels={5}
//         gridShape="circular"

//         gridLabelOffset={36}
//         enableDots={true}
//         dotSize={7}
//         dotColor='#465dba'
//         dotBorderWidth={1}
//         dotBorderColor='black'
//         enableDotLabel={false}
//         dotLabel="value"
//         dotLabelYOffset={-12}
//         colors='#465dba'
//         fillOpacity={0.25}
//         blendMode="multiply"
//         animate={false}
//         motionStiffness={90}
//         motionDamping={15}
//         isInteractive={false}
//         gridLabel={LabelComponent}
//     />
// )

// export default MyResponsiveRadar;
