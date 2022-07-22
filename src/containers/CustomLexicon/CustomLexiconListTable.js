import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { useTranslation } from 'react-i18next';
import { Select, MenuItem, Box, TextField } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import Search from '@material-ui/icons/Search';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Alert from 'react-s-alert';
import Checkbox from '@material-ui/core/Checkbox';
import graphqlClient from '../../consumers/graphqlClient';
import CreateReferenceFlavorMutation from '../../graphql/mutations/CreateReferenceFlavor';
import CreateReferenceFlavorWithExistingFlavorMutation from '../../graphql/mutations/CreateReferenceFlavorWithExistingFlavor';
import DeleteReferenceFlavorMutation from '../../graphql/mutations/DeleteReferenceFlavor';
import MapReferenceFlavorMutation from '../../graphql/mutations/MapReferenceFlavor';
import GetWorkspaceReferenceFlavorForUpdateQuery from '../../graphql/queries/GetWorkspaceReferenceFlavorForUpdateQuery';
import LoadingScreen from '../../components/LoadingScreen';
import CustomLexiconCreateContainer from './CustomLexiconCreate';
import CustomLexiconAddMappingContainer from './CustomLexiconAddMapping';
import MaterialButton from '../../components/MaterialButton';
import Table from '../../components/Table';
import CustomLexiconModal from '../CustomLexicon/CustomLexiconModal';
import CustomLexiconTablePagination from './CustomLexiconTablePagination';
import {
  capitalizeFirstLetter,
  splitCamelCase,
  reWord
} from './CustomLexiconLanguageFormatter';
import { CsvFields } from './CustomLexiconCsvHelper';
import styles from './CustomLexiconListTable.module.css';

const CustomLexiconListTable = ({
  producersReferenceFlavors,
  languages,
  workspaceProducerId,
  groupAndUpdateLexicons
}) => {
  const duplicateFlag = 23505;
  const deletedFlag = 23514;
  const { t } = useTranslation();
  const [baseData, setBaseData] = useState(producersReferenceFlavors);
  const [tableData, setTableData] = useState(producersReferenceFlavors);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openMappingModal, setOpenMappingModal] = useState(false);
  const [changedReferenceFlavors, setChangedReferenceFlavors] = useState(
    new Map()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [pageLimit, setPageLimit] = useState(10);
  const [searchData, setSearchData] = useState('');
  const [csvData, setCsvData] = useState([]);

  const getPaginatedList = list => {
    const offset = page * pageLimit;
    return list.slice(offset, offset + pageLimit);
  };

  const renderList = () => {
    return getPaginatedList(tableData);
  };

  const resetSearchData = () => {
    setSearchData('');
    setTableData(baseData);
  };

  const AlertType = {
    success: 'success',
    error: 'error'
  };

  const PageAlert = (type, message) => {
    return Alert[AlertType[type]](message, {
      position: 'top-right',
      effect: 'slide',
      beep: false,
      timeout: 4000
    });
  };

  const searchLanguage = param => {
    const sievedData = baseData.filter(
      item =>
        item[selectedLanguage] &&
        item[selectedLanguage]
          .toString()
          .toLowerCase()
          .includes(param.toString().toLowerCase())
    );
    setTableData(sievedData);
  };

  const updateSearchData = e => {
    e.preventDefault();
    setSearchData(e.target.value);
    searchLanguage(e.target.value);
    if (page !== 0) setPage(0);
  };

  useEffect(
    () => {
      renderList();
    },
    [pageLimit]
  );

  const renderPagination = () => {
    return (
      <CustomLexiconTablePagination
        currentPage={page}
        pages={tableData.length}
        setPage={setPage}
        pageLimit={pageLimit}
      />
    );
  };

  const searchBox = () => (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end' }}
    >
      <TextField
        label={`Search ${selectedLanguage}`}
        variant="standard"
        size="small"
        fontSize="11px"
        value={searchData}
        onChange={updateSearchData}
      />
      {searchData && <HighlightOff fontSize="11px" onClick={resetSearchData} />}
      <Search fontSize="11px" />
    </div>
  );

  const languageSelection = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <Select
        value={selectedLanguage}
        placeholder="Language"
        fullWidth
        style={{
          fontSize: '11px'
        }}
        onChange={e => {
          resetSearchData();
          onCancelChanges();
          setSelectedLanguage(e.target.value.toString());
        }}
      >
        {languages &&
          languages.map(item => (
            <MenuItem
              style={{
                fontSize: '11px'
              }}
              key={item}
              value={item}
            >
              {capitalizeFirstLetter(splitCamelCase(item))}
            </MenuItem>
          ))}
      </Select>
    </div>
  );

  const markVisibleReferenceFlavorForProducer = id => {
    const itemIndex = tableData.findIndex(i => i.id === id);
    const currState = tableData[itemIndex][`${selectedLanguage}Enabled`];
    tableData[itemIndex][`${selectedLanguage}Enabled`] = !currState;

    const baseItemIndex = baseData.findIndex(i => i.id === id);
    baseData[baseItemIndex][`${selectedLanguage}Enabled`] = !currState;
  };

  // Refresh the lexicon list from Database
  const refreshLexiconListFromDatabase = async flavorAttribute => {
    const lexicons = await graphqlClient.query({
      query: GetWorkspaceReferenceFlavorForUpdateQuery,
      variables: {
        workspaceId: workspaceProducerId
      },
      fetchPolicy: 'no-cache'
    });
    if (!lexicons.loading) {
      const newTableData = lexicons.data.workspaceReferenceFlavorForUpdate.nodes.filter(
        f => f.flavorAttribute === flavorAttribute
      );
      const updatedData = newTableData.map(item => {
        let itemMap = {};
        languages.forEach(language => {
          itemMap[`${language}Enabled`] = !!(item[language] && !item.isDeleted);
        });
        return {
          ...item,
          referenceFlavorDeleted: !!item.isDeleted,
          ...itemMap
        };
      });
      groupAndUpdateLexicons(
        lexicons.data.workspaceReferenceFlavorForUpdate.nodes
      );
      setBaseData(updatedData);
      setTableData(updatedData);
    }
  };

  const downloadCsv = () => {
    setCsvData(CsvFields(tableData, languages));
  };

  const createReferenceFlavor = async (
    producerId,
    existingFlavorId = 0,
    flavorAttribute = null,
    value = null,
    label = null,
    language = null
  ) => {
    try {
      if (existingFlavorId > 0) {
        const createReference = await graphqlClient.mutate({
          mutation: CreateReferenceFlavorWithExistingFlavorMutation,
          variables: {
            producerId: producerId,
            existingFlavorId: existingFlavorId
          }
        });
        return createReference;
      } else {
        const createReference = await graphqlClient.mutate({
          mutation: CreateReferenceFlavorMutation,
          variables: {
            producerId: producerId,
            flavorAttribute: flavorAttribute,
            value: value,
            label: label,
            language: language
          }
        });
        return createReference;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteReferenceFlavor = async (
    producerId,
    existingFlavorId,
    deleted
  ) => {
    try {
      const deleteReference = await graphqlClient.mutate({
        mutation: DeleteReferenceFlavorMutation,
        variables: {
          producerId: producerId,
          existingFlavorId: existingFlavorId,
          deleted: deleted
        }
      });
      return deleteReference;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const mapReferenceFlavor = async (
    producerId,
    flavorAttribute,
    value,
    label,
    language
  ) => {
    try {
      const mapReference = await graphqlClient.mutate({
        mutation: MapReferenceFlavorMutation,
        variables: {
          producerId: producerId,
          flavorAttribute: flavorAttribute,
          value: value,
          label: label,
          language: language
        }
      });
      return mapReference;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const onVisibleToggled = row => {
    const tempChangedReferenceFlavors = new Map(changedReferenceFlavors);
    if (tempChangedReferenceFlavors.has(row.id)) {
      tempChangedReferenceFlavors.delete(row.id);
    } else {
      tempChangedReferenceFlavors.set(row.id, {
        id: row.id,
        value: !row.referenceFlavorDeleted
      });
    }
    setChangedReferenceFlavors(tempChangedReferenceFlavors);
  };

  const createCustomLexicon = async (
    flavorAttribute,
    value,
    label,
    language
  ) => {
    setIsLoading(true);
    const result = await createReferenceFlavor(
      workspaceProducerId,
      0,
      flavorAttribute,
      value,
      label,
      language
    );
    if (result === undefined) {
      setIsLoading(false);
      closeCreateModal();
      return PageAlert(AlertType.error, 'Changes not saved. Please try again');
    }
    if (result.errors && result.errors[0].message.length) {
      setIsLoading(false);
      closeCreateModal();
      return PageAlert(AlertType.error, 'Changes not saved. Please try again');
    }
    if (result.data.createReferenceFlavorFunction.integer === deletedFlag) {
      setIsLoading(false);
      closeCreateModal();
      return PageAlert(
        AlertType.error,
        'Creating a duplicate reference flavor is not allowed.'
      );
    }
    if (result.data.createReferenceFlavorFunction.integer === duplicateFlag) {
      setIsLoading(false);
      closeCreateModal();
      return PageAlert(
        AlertType.error,
        'You cannot create a duplicate reference flavor.'
      );
    }
    await refreshLexiconListFromDatabase(flavorAttribute);
    setIsLoading(false);
    closeCreateModal();
    renderPagination();
    return PageAlert(AlertType.success, 'Changes saved successfully');
  };

  const mapLexicons = async (flavorAttribute, lexicons) => {
    if (!lexicons.length || !lexicons[0].value)
      return PageAlert(
        AlertType.error,
        'You have not made any changes. Please fill all required fields'
      );
    setIsLoading(true);
    Promise.all(
      lexicons.map(async item => {
        const { value, label, language } = item;
        await mapReferenceFlavor(
          workspaceProducerId,
          flavorAttribute,
          value,
          label,
          language
        );
      })
    )
      .then(async () => {
        await refreshLexiconListFromDatabase(flavorAttribute);
        setIsLoading(false);
        closeMappingModal();
        renderPagination();
        return PageAlert(AlertType.success, 'Changes saved successfully');
      })
      .catch(e => {
        setIsLoading(false);
        closeMappingModal();
        return PageAlert(
          AlertType.error,
          'Changes not saved. Please try again'
        );
      });
  };

  const onCancelChanges = () => {
    if (changedReferenceFlavors.size > 0) {
      const referenceList = Array.from(changedReferenceFlavors.values());
      referenceList.forEach(refFlavor => {
        const itemIndex = tableData.findIndex(i => i.id === refFlavor.id);
        const currState = tableData[itemIndex][`${selectedLanguage}Enabled`];
        tableData[itemIndex][`${selectedLanguage}Enabled`] = !currState;

        const baseItemIndex = baseData.findIndex(i => i.id === refFlavor.id);
        baseData[baseItemIndex][`${selectedLanguage}Enabled`] = !currState;
      });
      resetSearchData();
      setChangedReferenceFlavors(new Map());
    }
  };

  const onSaveChanges = async () => {
    setIsLoading(true);
    const referenceList = Array.from(changedReferenceFlavors.values());
    Promise.all(
      referenceList.map(async item => {
        const { id, value } = item;
        await deleteReferenceFlavor(workspaceProducerId, id, value);
      })
    )
      .then(async () => {
        await refreshLexiconListFromDatabase(
          producersReferenceFlavors[0].flavorAttribute
        );
        setIsLoading(false);
        setChangedReferenceFlavors(new Map());
        return PageAlert(AlertType.success, 'Changes saved successfully');
      })
      .catch(e => {
        setIsLoading(false);
        setChangedReferenceFlavors(new Map());
        return PageAlert(
          AlertType.error,
          'Changes not saved. Please try again'
        );
      });
  };

  const closeCreateModal = () => {
    setOpenCreateModal(false);
  };

  const closeMappingModal = () => {
    setOpenMappingModal(false);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div>
      <div className={styles.tableFooterButtonGroup}>
        <div style={{ paddingBottom: '10px' }}>
          {`${producersReferenceFlavors[0].flavorAttribute} - Reference Flavor`}
        </div>
        <div className={styles.languageSelectionGroup}>
          {languageSelection()}
        </div>
      </div>
      <div className={styles.tableBox}>
        <Table
          renderHeaderRow={() => (
            <tr>
              <th style={{ width: 200 }}>{t('customLexicon.value')}</th>
              <th style={{ width: 200 }}>{searchBox()}</th>
              <th style={{ width: 200 }}>{t('customLexicon.visible')}?</th>
            </tr>
          )}
        >
          {renderList() &&
            renderList().map((item, index) => {
              return (
                <tr key={index}>
                  <td className="name">
                    {item.value.includes('_') ? reWord(item.value) : item.value}
                  </td>
                  <td className="attributes">{item[selectedLanguage]}</td>
                  <td className="name">
                    <Checkbox
                      checked={item[`${selectedLanguage}Enabled`]}
                      disabled={!item[selectedLanguage]}
                      onChange={() => {
                        markVisibleReferenceFlavorForProducer(item.id);
                        onVisibleToggled(item);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
        </Table>
        <div className={styles.paginationGroup}>
          <div>
            <Select
              value={pageLimit}
              onChange={e => {
                setPage(0);
                setPageLimit(e.target.value);
              }}
            >
              <MenuItem key={1} value={5}>
                5
              </MenuItem>
              <MenuItem key={2} value={10}>
                10
              </MenuItem>
              <MenuItem key={3} value={25}>
                25
              </MenuItem>
              <MenuItem key={4} value={50}>
                50
              </MenuItem>
              <MenuItem key={5} value={100}>
                100
              </MenuItem>
            </Select>
          </div>
          {renderPagination()}
        </div>
        <div className={styles.buttonGroup}>
          <div className={styles.buttonSubGroupLeft}>
            <div className={styles.tableFooter}>
              <MaterialButton
                variant="outlined"
                soft
                disabled={changedReferenceFlavors.size < 1}
                onClick={onCancelChanges}
              >
                {t('customLexicon.cancel')}
              </MaterialButton>
            </div>
            <div className={styles.tableFooter}>
              <MaterialButton
                variant="outlined"
                soft
                teal
                disabled={changedReferenceFlavors.size < 1}
                onClick={onSaveChanges}
              >
                {t('customLexicon.save')}
              </MaterialButton>
            </div>
          </div>
          <div className={styles.buttonSubGroupRight}>
            <CSVLink
              data={csvData}
              filename={`${
                producersReferenceFlavors[0].flavorAttribute
              }_Reference_Flavors.csv`}
              asyncOnClick={true}
            >
              <MaterialButton
                variant="outlined"
                soft
                teal
                disabled={producersReferenceFlavors.length < 1}
                onClick={downloadCsv}
              >
                {isCsvLoading
                  ? 'Downloading...'
                  : `${t('customLexicon.download')}`}
              </MaterialButton>
            </CSVLink>
          </div>
        </div>
      </div>
      <div className={styles.tableFooterButtonGroup}>
        <div className={styles.tableFooterButton}>
          <MaterialButton
            variant="outlined"
            soft
            teal
            onClick={() => setOpenMappingModal(true)}
          >
            {t('customLexicon.mapToAnExistingLexicon')}
          </MaterialButton>
        </div>
        <div className={styles.tableFooterButton}>
          <MaterialButton
            variant="outlined"
            soft
            teal
            onClick={() => setOpenCreateModal(true)}
          >
            {t('customLexicon.createNewLexicon')}
          </MaterialButton>
        </div>
        <CustomLexiconModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title="Create New Lexicon"
        >
          {isSaving ? (
            <LoadingScreen />
          ) : (
            <CustomLexiconCreateContainer
              flavor={producersReferenceFlavors[0].flavorAttribute}
              languages={languages}
              createCustomLexicon={createCustomLexicon}
              closeCreateModal={closeCreateModal}
            />
          )}
        </CustomLexiconModal>
        <CustomLexiconModal
          open={openMappingModal}
          onClose={() => setOpenMappingModal(false)}
          title={`${
            producersReferenceFlavors[0].flavorAttribute
          } - Add Mapping`}
        >
          <CustomLexiconAddMappingContainer
            flavor={producersReferenceFlavors[0].flavorAttribute}
            lexes={baseData.map(i => i.value).sort()}
            languages={languages}
            mapLexicons={mapLexicons}
            closeMappingModal={closeMappingModal}
          />
        </CustomLexiconModal>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  workspaceProducerId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(CustomLexiconListTable);
