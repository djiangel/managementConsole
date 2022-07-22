import * as React from 'react';
import { useState, useEffect } from 'react';

import { chain } from 'lodash';
import { WithTranslation, withTranslation } from 'react-i18next';
import ReportMarketPreferencesQuery from '../../../graphql/queries/ReportMarketPreferencesQuery';
import ReportLineGraph from '../ReportLineGraph/ReportLineGraph';
import { compose, graphql } from 'react-apollo';

interface ReportProps extends WithTranslation {
  reportId: string;
  reportMarketPreferences ?: ReportMarketPreferencesResponse;
}

interface ReportMarketPreferencesResponse {
  loading: boolean,
  error: any,
  allRpMarketPreferences: {
    nodes: [{
      product: {
        id: string,
        name: string
      },
      pqRating: number,
      percentPop: string
    }]
  }
}

const data = [
    {
      "id": "product",
      "color": "hsl(170, 70%, 50%)",
      "data": [
        {
          "x": 1,
          "y": 10
        },
        {
          "x": 2,
          "y": 20
        },
        {
          "x": 3,
          "y": 30
        },
        {
          "x": 4,
          "y": 40
        },
        {
          "x": 5,
          "y": 50
        },
        {
          "x": 6,
          "y": 60
        },
        {
          "x": 7,
          "y": 70
        }
      ]
    }
]

const ReportMarketPreferences: React.FC<ReportProps> = (props) => {
  const { t, reportMarketPreferences } = props;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (reportMarketPreferences
      && !reportMarketPreferences.loading
      && reportMarketPreferences.error === undefined) {
      setIsLoading(false);
    }
  });

  const getReshapedData = (reportMarketPreferences: ReportMarketPreferencesResponse) => {
    let rawData = chain(reportMarketPreferences.allRpMarketPreferences.nodes)
    .groupBy("product.id").value();
    return rawData;
  }

  if (isLoading) {
    return (<div />);
  }


  return (
    <div>
      <h4>Market Preferences</h4>
      {Object.entries(getReshapedData(reportMarketPreferences)).map(([k, v]) => {
          return (<div style={{marginTop: "30px"}}><h5>{v[0].product.name}</h5><ReportLineGraph key={k} data={[{
            "id": v[0].product.name,
            "color": "hsl(58, 70%, 50%)",
            "data": v.map(eachPQ => ({
              "x": eachPQ.pqRating,
              "y": eachPQ.percentPop
            }))
          }]}></ReportLineGraph></div>
      )})
      }
    </div>
  );
}

export default compose(
    withTranslation(),
    graphql(ReportMarketPreferencesQuery, {
      options: ({ reportId }: ReportProps) => ({
        variables: {
          reportID: reportId
        }
      }),
      name: "reportMarketPreferences"
    })
)(ReportMarketPreferences);