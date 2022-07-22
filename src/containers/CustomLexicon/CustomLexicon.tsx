import * as React from 'react';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { groupBy, without } from 'lodash';
import { CSVLink } from "react-csv";
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';
import MaterialButton from '../../components/MaterialButton';

import GetWorkspaceReferenceFlavorForUpdateQuery from '../../graphql/queries/GetWorkspaceReferenceFlavorForUpdateQuery';
import CustomLexiconList from './CustomLexiconList';
import LoadingScreen from '../../components/LoadingScreen';
import { CsvFields } from './CustomLexiconCsvHelper';

const styles = require('./CustomLexicon.module.css');

const CustomLexicon = props => {
  const { t, workspaceReferenceFlavorForUpdate, workspaceProducerId } = props;
  const [lexicons, setLexicons] = useState([]);
  const [retrievedLanguages, setRetrievedLanguages] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const groupAndUpdateLexicons = (referenceFlavorNodes) => {
    if (referenceFlavorNodes && referenceFlavorNodes.length) {
      const groupedReferenceFlavors = groupBy(referenceFlavorNodes, 'flavorAttribute');
      // Shape data like translation files in i18n
      const listOfReferenceFlavors = groupedReferenceFlavors && Object.entries(groupedReferenceFlavors).map(([key, value])=>{
        return ({ key, value})
      });
      setLexicons(listOfReferenceFlavors);
    }
  };

  const getUpdatedReferenceFlavorsByAttribute = (attribute) => {
    if (!lexicons) return [];
    const filteredLexicon = lexicons.filter(f => f.key === attribute);
    return (filteredLexicon && filteredLexicon[0]) ? filteredLexicon[0].value : [];
  };
  
  useEffect(() => {
    if (workspaceReferenceFlavorForUpdate
      && !workspaceReferenceFlavorForUpdate.loading
      && workspaceReferenceFlavorForUpdate.error === undefined) {
      const groupedReferenceFlavorNodes = 
      workspaceReferenceFlavorForUpdate
        && workspaceReferenceFlavorForUpdate.workspaceReferenceFlavorForUpdate
        && workspaceReferenceFlavorForUpdate.workspaceReferenceFlavorForUpdate.nodes;

      groupAndUpdateLexicons(groupedReferenceFlavorNodes);

      // get the language list
      const nodeLanguages = Object.keys(groupedReferenceFlavorNodes[0]).map(i => i);
      setRetrievedLanguages(without(nodeLanguages, 'id', 'value', 'flavorAttribute', 'version', '__typename', 'base', 'producerId', 'visible', 'isDeleted'));
    }    
  }, [workspaceReferenceFlavorForUpdate.loading]);

  
  const downloadCsv = () => {
    
    setIsLoading(true);
    if (workspaceReferenceFlavorForUpdate
      && !workspaceReferenceFlavorForUpdate.loading
      && workspaceReferenceFlavorForUpdate.error === undefined) {
      const groupedReferenceFlavorNodes = 
      workspaceReferenceFlavorForUpdate
        && workspaceReferenceFlavorForUpdate.workspaceReferenceFlavorForUpdate
        && workspaceReferenceFlavorForUpdate.workspaceReferenceFlavorForUpdate.nodes;
      setCsvData(CsvFields(groupedReferenceFlavorNodes, retrievedLanguages));
      if (!workspaceReferenceFlavorForUpdate.loading) return setIsLoading(false);
    }
    setIsLoading(false);
  };

  const renderCustomList = () => {
    return !workspaceReferenceFlavorForUpdate.loading && lexicons && lexicons.map(item => 
      <CustomLexiconList
        key={item.key}
        name={item.key}
        referenceFlavors={item.value}
        languages={retrievedLanguages}
        groupAndUpdateLexicons={groupAndUpdateLexicons}
        getUpdatedReferenceFlavorsByAttribute={getUpdatedReferenceFlavorsByAttribute}
        {...props}
      />
    );
  };

  if (workspaceReferenceFlavorForUpdate.loading) return <LoadingScreen />;
  
  if (!workspaceReferenceFlavorForUpdate.error === undefined) return <div>Producer Data Not Found!</div>;

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h5 className={styles.reviewHeader}>{i18n.t('navigation.customLexicons')}</h5>
          <h3 className={styles.reviewTitle}>{i18n.t('navigation.customLexicons')}</h3> 
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: '10px' }}>
          <CSVLink
            data={csvData}
            filename="All_Reference_Flavors.csv"
            asyncOnClick={true}
          >
            <MaterialButton
              variant="outlined"
              soft
              teal
              disabled={lexicons.length < 1}
              onClick={downloadCsv}
            >
              {isLoading ? 'Downloading...' : `${t('customLexicon.downloadAll')}`}
            </MaterialButton>
          </CSVLink>
        </div>
      </div>
      <div className={styles.container}>      
        {renderCustomList()}
      </div>
    </div>
  );
};

interface Props {
  workspaceProducerId: any;
}

const mapStateToProps = state => ({
  workspaceProducerId: selectWorkspaceProducerId(state)
});

export default compose(
  connect(
    mapStateToProps
  ),
  graphql(GetWorkspaceReferenceFlavorForUpdateQuery, {
    name: 'workspaceReferenceFlavorForUpdate',
    options: (props: Props) => ({
      variables: {
        workspaceId: props.workspaceProducerId
      },
      fetchPolicy: "no-cache"
    })
  }),
  withTranslation()
)(CustomLexicon);
