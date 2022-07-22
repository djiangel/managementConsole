import * as React from 'react';
import HeatMapComponent from 'components/Nivo/HeatMap/HeatMapComponent';
import simpleResponse from './sampleData';
import { set } from 'lodash';

export default class HeatmapWrapper extends React.Component<any, any> {
  getReshapedData = response => {
    const xVariables = new Set(response.map(item => item.GGVar1));
    const yVariables = new Set(response.map(item => item.GGVar2));
    const max = Math.max(...response.map(item => item.normDiff));
    const min = Math.min(...response.map(item => item.normDiff));

    const reshapedData = {
      max,
      min,
      xVariables: Array.from(xVariables),
      yVariables: Array.from(yVariables)
    };

    xVariables.forEach(xAttribute => {
      yVariables.forEach(yAttribute => {
        const dataSlice = response.filter(
          item => item.GGVar1 == xAttribute && item.GGVar2 == yAttribute
        );
        const valueMatrix = [];

        for (let i = 0; i <= 5; i++) {
          const values = [];
          for (let j = 0; j <= 5; j++) {
            let value = dataSlice.find(
              item => item.value2 === i && item.value1 === j
            );
            value = value ? value.normDiff : 0;

            if (value < 0) {
              value = (value - min) * -1;
            }

            values.push(value);
          }
          valueMatrix.push(values);
        }

        set(reshapedData, `${xAttribute}.${yAttribute}`, valueMatrix);
      });
    });
    
    return reshapedData;
  };

  getNames = reshapedData => {
    const columnNames = [];
    const rowNames = [];
    const { yVariables, xVariables } = reshapedData;

    xVariables.forEach((xAttribute, xIndex) => {
      yVariables.forEach((yAttribute, yIndex) => {
        if (yIndex === 0) {
          rowNames.push(xAttribute);
        }

        if (xIndex === xVariables.length - 1) {
          columnNames.push(yAttribute);
        }
      });
    });

    return { columnNames, rowNames };
  };

  renderColumn = (xAttribute, xIndex, reshapedData) => {
    const { yVariables } = reshapedData;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {yVariables.map((attribute, yIndex) => {
          const values = reshapedData[xAttribute][attribute];
          const combinedData = [];

          for (let i = 0; i <= 5; i++) {
            const name = i.toString();
            const data = values[i].map((value, index) => ({
              x: index,
              y: value
            }));

            combinedData.push({ name, data });
          }

          return (
            <HeatMapComponent
              data={combinedData}
              showYAxis={xIndex == 0}
              min={reshapedData.min}
              max={reshapedData.max}
              showXAxis={yIndex == yVariables.length - 1}
            />
          );
        })}
      </div>
    );
  };

  render() {
    const reshapedData = this.getReshapedData(simpleResponse);
    const names = this.getNames(reshapedData);

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            {names.rowNames.map(name => <span>{name}</span>)}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}
          >
            {reshapedData.xVariables.map((attribute, index) =>
              this.renderColumn(attribute, index, reshapedData)
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around'
          }}
        >
          {names.columnNames.map(name => <span>{name}</span>)}
        </div>
      </div>
    );
  }
}
