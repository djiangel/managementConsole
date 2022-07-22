import * as React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import ProducerByIdQuery from '../../graphql/queries/ProducerByIdQuery';
import DataQualityQuery from '@graphql/queries/DataQualityQuery';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { useTranslation } from 'react-i18next';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { get, isEmpty } from 'lodash';
import { COLORS } from '../../styles/theme';
import { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import { PANELS } from '../../constants/routePaths';
import { KeyboardBackspace as KeyboardBackspaceIcon } from '@material-ui/icons';
import PanelProductDataQualityTable from 'containers/DataQualityDashboard/PanelProductDataQualityTable';
import UserCategoryTable from 'containers/DataQualityDashboard/UserCategoryTable';
import UserProductDataQualityTable from 'containers/DataQualityDashboard/UserProductDataQualityTable';
import NotFoundContainer from '../NotFound';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Modal, Tooltip } from '@material-ui/core';
import ProductReviewTable from 'containers/DataQualityDashboard/ProductReviewTable';
import LatestAppBuildHistoriesQuery from '@graphql/queries/LatestAppBuildHistoriesQuery';

const styles = require('./DataDashboard.module.css');
const { ExportCSVButton } = CSVExport;

const DataQualityDashboard = ({ loading, panel, workspaceId, appBuild }) => {
  const [windowDimensionWidth, setWindowDimensionWidth] = useState(
    window.innerWidth
  );

  const latestAppBuild = get(appBuild, 'allAppBuildHistories.nodes[0].build');

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensionWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { t } = useTranslation();

  const getAllSelectedReferenceFlavors = () => {
    const result = {};

    get(panel, 'productReviews.nodes', []).forEach(review => {
      if (!review.referenceFlavors) {
        return;
      }

      const referenceFlavors = JSON.parse(review.referenceFlavors);
      const selectedGgVars = Object.keys(referenceFlavors);

      selectedGgVars.forEach(ggVar => {
        referenceFlavors[ggVar].forEach(refFlavor => {
          const key = `${refFlavor.referenceFlavor}`.trim().toLowerCase();
          if (result.hasOwnProperty(key)) {
            result[key]++;
          } else {
            result[key] = 1;
          }
        });
      });
    });
    return result;
  };

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  const getPanelReviewCount = () => {
    let result = [];
    let totalPanelists = 0;
    let totalPanelistsArray = [];
    let totalPanelistsReviews = 0;
    const allPanelistsX = new Set();
    get(panel, 'panelists.nodes', [])
      .map(panelist => {
        if (!allPanelistsX.has(panelist.id)) {
          allPanelistsX.add(panelist.id);
          totalPanelists += 1;
          totalPanelistsArray.push(totalPanelists);
          totalPanelistsReviews += panelist.panelProductReviews.totalCount;
        }
      })
      .filter(entry => !!entry);

    result.push(totalPanelists);
    result.push(totalPanelistsReviews);
    result.push(totalPanelistsArray);

    return result;
  };

  const allSelectedReferenceFlavors = getAllSelectedReferenceFlavors();

  const allPanelists = new Set();
  const data = get(panel, 'panelists.nodes', [])
    .map(panelist => {
      if (!allPanelists.has(panelist.id)) {
        allPanelists.add(panelist.id);

        const panelReviews = panelist.panelProductReviews.nodes;
        const panelReviewCount = panelist.panelProductReviews.totalCount;

        const myPanelReviewCount = getPanelReviewCount();
        const runningPanelReviewCount = myPanelReviewCount[1];
        const runningPanelistCount = myPanelReviewCount[0];
        const runningPanelistArray = myPanelReviewCount[2];

        // Calculations relating to time taken to complete reviews
        // # of reviews that were completed < 30s
        const fastReviewCount = panelReviews
          .map(review => get(review, 'dataQuality.shortReviewTime', null))
          .reduce((a, b) => +a + +b, 0);

        // calculates the total time taken for all reviews
        const totalTimeTaken = panelReviews
          .map(review => get(review, 'dataQuality.timeTaken', null))
          .reduce((a, b) => a + b, 0);

        // average time taken to complete a single review
        const averageTimeTaken = totalTimeTaken / panelReviewCount;

        // Calculations relating to reference flavors
        // # of reviews with no reference flavors selected
        const emptyReferenceFlavorCount = panelReviews
          .map(review => get(review, 'dataQuality.noRefFlavor', null))
          .reduce((a, b) => +a + +b, 0);

        let totalReferenceFlavorCount = 0; // total # of reference flavors selected across all reviews

        // # of reviews with more than forty reference flavors selected
        const excessiveReferenceFlavorCount = panelReviews
          .map(review => get(review, 'dataQuality.excessiveRefFlavor', null))
          .reduce((a, b) => +a + +b, 0);

        // # of reviews that have more than time taken / 3 reference flavors
        const buttonMashingCount = panelReviews
          .map(review => get(review, 'dataQuality.buttonMashing', null))
          .reduce((a, b) => +a + +b, 0);

        let agreeReferenceFlavorCount = 0; // # of reference flavors that have global observations of >= 4
        let maxEndTime = 0;
        panelReviews.forEach((review, index) => {
          if (maxEndTime < Date.parse(review.endTime)) {
            maxEndTime = Date.parse(review.endTime);
          }

          let reviewReferenceFlavorCount = 0;
          const reviewReferenceFlavor = new Set(); // selected reference flavors for a particular review -- use to de-dup similar reference flavors
          const referenceFlavors = JSON.parse(review.referenceFlavors);
          if (!isEmpty(referenceFlavors)) {
            const selectedGgVars = Object.keys(referenceFlavors);
            selectedGgVars.forEach(ggVar => {
              referenceFlavors[ggVar].forEach(refFlavor => {
                const key = `${refFlavor.referenceFlavor}`
                  .replace(/\s/g, '')
                  .toLowerCase();

                // We only want to consider reference flavors that didn't appear in this particular review before
                if (!reviewReferenceFlavor.has(key)) {
                  reviewReferenceFlavor.add(key);
                  totalReferenceFlavorCount++;
                  reviewReferenceFlavorCount++;
                  allSelectedReferenceFlavors[key] >= 4 &&
                    agreeReferenceFlavorCount++;
                }
              });
            });
          }
        });
        const avgReferenceFlavorPerReview =
          totalReferenceFlavorCount / panelReviewCount;
        const agreementScore =
          agreeReferenceFlavorCount / totalReferenceFlavorCount;

        // Calculations relating to GGVar
        // # of reviews that marked all GGVars
        const allGgVarCount = panelReviews
          .map(review => get(review, 'dataQuality.allGgVar', null))
          .reduce((a, b) => +a + +b, 0);

        // # of reviews that marked <= 3 GGVars
        const insufficientGgVarCount = panelReviews
          .map(review => get(review, 'dataQuality.insufficientGgVar', null))
          .reduce((a, b) => +a + +b, 0);

        // # of reviews that marked all selected GG Var as 5
        const allMarksAtFive = panelReviews
          .map(review => get(review, 'dataQuality.ggVarMax', null))
          .reduce((a, b) => +a + +b, 0);

        let agreementFlag = 0;
        if (runningPanelistCount > 2 && runningPanelReviewCount > 3) {
          agreementFlag = agreementScore < 0.3 ? 1 : 0;
        }

        // Total # of flags
        const allFlagCount =
          allGgVarCount +
          allMarksAtFive +
          emptyReferenceFlavorCount +
          insufficientGgVarCount +
          excessiveReferenceFlavorCount +
          fastReviewCount +
          buttonMashingCount +
          agreementFlag;

        let userIdentification = panelist.email || panelist.phoneNumber || panelist.id;

        const rowId = allPanelists.size;

        return {
          rowId: rowId,
          userId: panelist.id,
          userEmail: panelist.email,
          userRef:  userIdentification,
          userIdentification: (
            <a
              onClick={e => {
                e.preventDefault();
                const user = { ...panelist, userIdentification };
                setSelectedUser(user);
                setShowModal(true);
              }}
              href="#"
            >
              {userIdentification}
            </a>
          ),
          mostRecentSubmission: maxEndTime,
          runningPanelistCount: runningPanelistCount,
          runningPanelReviewCount: runningPanelReviewCount,
          runningPanelistArray: runningPanelistArray,
          panelReviewCount: panelReviewCount,
          totalReviewCount: panelist.totalProductReviews.totalCount,
          interfaceLanguage:
            panelist.interfaceLanguage != null
              ? panelist.interfaceLanguage
              : 'en',
          averageTime: averageTimeTaken.toFixed(2),
          averageReferenceFlavor: avgReferenceFlavorPerReview.toFixed(2),
          allGgVar: allGgVarCount,
          allMarksAtFive: allMarksAtFive,
          noReferenceFlavor: emptyReferenceFlavorCount,
          insufficientGgVar: insufficientGgVarCount,
          excessiveReferenceFlavor: excessiveReferenceFlavorCount,
          fastReview: fastReviewCount,
          buttonMashing: buttonMashingCount,
          agreement: (agreementScore * 100).toFixed(2), //agreementScore < 0.5 ? 1 : 0,
          allFlagCount: allFlagCount,
          age: getAge(panelist.dateOfBirth),
          gender: panelist.gender,
          userCategory: panelist.userCategory
        };
      }
    })
    .filter(entry => !!entry);

  function cellFormatter(cell) {
    if (isNaN(cell)) {
      return (
        <span>
          <strong>0.00% </strong>
        </span>
      );
    }
    return (
      <span>
        <strong>{cell}% </strong>
      </span>
    );
  }

  function dateCellFormatter(cell) {
    let temp = new Date(cell);
    let displayDate = temp.toString().substring(0, 25);
    return (
      <span>
        <p style={{ marginBottom: 0 }}>{displayDate}</p>
      </span>
    );
  }

  const sortFloat = (a, b, order) => {
    const floatA = parseFloat(a);
    const floatB = parseFloat(b);
    if (order === 'asc') {
      return floatB - floatA;
    }
    return floatA - floatB;
  };

  const columns = [
    {
      dataField: 'rowId',
      text: '',
      sort: true,
      csvExport: false,
      style: (row, cell, rowIndex) =>
        rowIndex != null && { verticalAlign: 'middle', fontSize: 11 }
    },
    {
      dataField: 'userId',
      text: 'User ID',
      hidden: true,
      sort: true,
      csvExport: false,
      style: (row, cell, rowIndex) =>
        rowIndex != null && { verticalAlign: 'middle' }
    },
    {
      dataField: 'userRef',
      text: 'User Email',
      csvText: 'User ID',
      hidden: true,
      sort: true,
      style: (row, cell, rowIndex) =>
        rowIndex != null && { verticalAlign: 'middle' }
    },
    {
      dataField: 'runningPanelistCount',
      text: 'runningPanelistCount',
      hidden: true,
      csvExport: false
    },
    {
      dataField: 'runningPanelReviewCount',
      text: 'runningPanelReviewCount',
      hidden: true,
      csvExport: false
    },
    {
      dataField: 'userIdentification',
      text: 'User ID',
      sort: true,
      csvExport: false,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          wordBreak: 'break-all',
          fontSize: 11,
          padding: 7
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'totalReviewCount',
      text: 'Total # of Reviews',
      sort: true,
      sortFunc: sortFloat,
      hidden: windowDimensionWidth < 1350,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'panelReviewCount',
      text: '# of Reviews this Panel',
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'mostRecentSubmission',
      text: 'Most Recent',
      sort: true,
      sortFunc: sortFloat,
      formatter: dateCellFormatter,
      hidden: windowDimensionWidth < 1250,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          wordBreak: 'break-all',
          fontSize: 11
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'interfaceLanguage',
      text: 'Current Interface Language',
      sort: true,
      sortFunc: sortFloat,
      hidden: true,
      csvExport: false,
      style: (row, cell, rowIndex) =>
        rowIndex != null && { verticalAlign: 'middle' },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'averageTime',
      text: 'Mean Time of Review (s)',
      sort: true,
      sortFunc: sortFloat,
      hidden: windowDimensionWidth < 1250,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          wordBreak: 'break-all',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'averageReferenceFlavor',
      text: 'Ave # Ref. Flav / Review',
      sort: true,
      sortFunc: sortFloat,
      hidden: windowDimensionWidth < 1250,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'allGgVar',
      text: (
        <Tooltip title={t('dataQuality.tooltip.allGgVar')}>
          <span>All 24 GGVar Marked</span>
        </Tooltip>
      ),
      csvText: "All 24 GGVar marked",
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderLeft: '2px solid',
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderLeftColor: 'black',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : {
              borderLeft: '2px solid',
              verticalAlign: 'middle',
              borderLeftColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            },
      headerStyle: {
        borderLeft: '2px solid',
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.allGgVar > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'allMarksAtFive',
      csvText: 'Marked GGVars All 5',
      text: (
        <Tooltip title={t('dataQuality.tooltip.maxGgVar')}>
          <span>Marked GGVars All 5</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : {
              verticalAlign: 'middle',
              borderLeftColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.allMarksAtFive > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'noReferenceFlavor',
      csvText: 'No Reference Flavors Marked',
      text: (
        <Tooltip title={t('dataQuality.tooltip.noReferenceFlavor')}>
          <span>No Reference Flavors Marked</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : { verticalAlign: 'middle', fontSize: 14, textAlign: 'center' },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.noReferenceFlavor > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'insufficientGgVar',
      csvText: '< 4 GGVar Marked',
      text: (
        <Tooltip title={t('dataQuality.tooltip.insufficientGgVar')}>
          <span>{'< 4 GGVar Marked'}</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : { verticalAlign: 'middle', fontSize: 14, textAlign: 'center' },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.insufficientGgVar > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'excessiveReferenceFlavor',
      csvText: "> 40 Reference Flavors Marked",
      text: (
        <Tooltip title={t('dataQuality.tooltip.excessiveReferenceFlavor')}>
          <span>{'> 40 Reference Flavors Marked'}</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : { verticalAlign: 'middle', fontSize: 14, textAlign: 'center' },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.excessiveReferenceFlavor > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'fastReview',
      csvText: 'Review Time < 30 Seconds',
      text: (
        <Tooltip title={t('dataQuality.tooltip.fastReview')}>
          <span>{'Review Time < 30 Seconds'}</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : { verticalAlign: 'middle', fontSize: 14, textAlign: 'center' },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: windowDimensionWidth < 1000,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.fastReview > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'buttonMashing',
      csvText: 'Button Mashing',
      text: (
        <Tooltip title={t('dataQuality.tooltip.buttonMashing')}>
          <span>Button Mashing</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderBottom: '2px solid',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              fontSize: 14,
              textAlign: 'center'
            }
          : { verticalAlign: 'middle', fontSize: 14, textAlign: 'center' },
      headerStyle: {
        borderTop: '2px solid',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: true,
      csvExport: false,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.buttonMashing > 0) {
          return styles.redColumn;
        }
      }
    },
    {
      dataField: 'agreement',
      csvText: 'Agreement Score',
      text: (
        <Tooltip title={t('dataQuality.tooltip.agreementScore')}>
          <span>Agreement Score</span>
        </Tooltip>
      ),
      sort: true,
      sortFunc: sortFloat,
      formatter: cellFormatter,
      classes: (cell, row, rowIndex, colIndex) => {
        if (row.runningPanelistCount > 2 && row.runningPanelReviewCount > 3) {
          if (row.agreement < 30 || isNaN(row.agreement)) {
            return styles.redColumn;
          }
        }
      },
      style: (row, cell, rowIndex) =>
        rowIndex == allPanelists.size - 1
          ? {
              borderRight: '2px solid black',
              borderBottom: '2px solid black',
              verticalAlign: 'middle',
              borderBottomColor: 'black',
              wordBreak: 'break-all',
              fontSize: 14,
              textAlign: 'center'
            }
          : {
              borderRight: '2px solid black',
              verticalAlign: 'middle',
              wordBreak: 'break-all',
              fontSize: 14,
              textAlign: 'center'
            },
      headerStyle: {
        borderRight: '2px solid',
        borderTop: '2px solid black',
        wordBreak: 'break-all',
        fontSize: 13,
        fontWeight: 550
      },
      hidden: true,
      csvExport: false
    },
    {
      dataField: 'age',
      text: 'Age',
      sort: true,
      hidden: windowDimensionWidth < 1350,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'gender',
      text: 'Gender',
      sort: true,
      hidden: windowDimensionWidth < 1350,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'userCategory',
      text: 'User Category',
      sort: true,
      hidden: windowDimensionWidth < 1350,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    },
    {
      dataField: 'allFlagCount',
      text: 'Flag Total',
      sort: true,
      sortFunc: sortFloat,
      classes: styles.flagStyle,
      style: (row, cell, rowIndex) =>
        rowIndex != null && {
          verticalAlign: 'middle',
          fontSize: 14,
          textAlign: 'center'
        },
      headerStyle: { wordBreak: 'break-all', fontSize: 13, fontWeight: 550 }
    }
  ];

  if (loading) {
    return (
      <Paper
        style={{
          width: '100%',
          maxWidth: '100%',
          padding: '10px',
          position: 'relative'
        }}
      >
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainerTop}>
            <IconButton
              component={Link}
              to={{ pathname: PANELS, state: undefined }}
              size="small"
              style={{ marginLeft: -26 }}
            >
              <KeyboardBackspaceIcon fontSize="small" />
              <h5 className={styles.panelHeaderSize}>
                {t('navigation.panels')}
              </h5>
            </IconButton>
          </div>
        </div>

        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <h2 className={styles.panelTitle}>
              Data Quality Dashboard: Loading
            </h2>
          </div>
        </div>

        <LinearProgress />
      </Paper>
    );
  }

  if (panel.producerId !== workspaceId) {
    return <NotFoundContainer />;
  }

  const panelEndTime = new Date(panel.endTime)

  return (
    <Paper
      style={{
        width: '100%',
        maxWidth: '100%',
        padding: '10px',
        position: 'relative'
      }}
    >
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainerTop}>
          <IconButton
            component={Link}
            to={{ pathname: PANELS, state: undefined }}
            size="small"
            style={{ marginLeft: -26 }}
          >
            <KeyboardBackspaceIcon fontSize="small" />
            <h5 className={styles.panelHeaderSize}>{t('navigation.panels')}</h5>
          </IconButton>
        </div>
      </div>

      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h2 className={styles.panelTitle}>
            Data Quality Dashboard: {panel.name ? panel.name : panel.pin}
          </h2>
        </div>
      </div>

      <h3 className={styles.panelTitle} style={{ paddingLeft: 20 }}>
        Reviews
      </h3>
      <ToolkitProvider
        keyField="id"
        data={data}
        columns={columns}
        exportCSV
        defaultSorted={[{ dataField: 'allFlagCount', order: 'asc' }]}
        pagination={paginationFactory({
          sizePerPage: 25
        })}
        rowStyle={(_, index) => ({
          backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY,
          overflowWrap: 'anywhere'
        })}
        rowClasses={styles.tableRow}
        headerClasses={styles.tableHeader}
        bordered={true}
        noDataIndication={() => 'No Data Currently'}
      >
        {props => (
          <div>
            <div className={styles.downloadButton}>
              <ExportCSVButton {...props.csvProps}>
                <CloudDownloadIcon color="primary" />
              </ExportCSVButton>
            </div>
            <BootstrapTable {...props.baseProps} />
          </div>
        )}
      </ToolkitProvider>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ProductReviewTable panelist={selectedUser} />
      </Modal>

      <br />
      <br />
      <h3 className={styles.panelTitle}>Products</h3>
      <PanelProductDataQualityTable
        panel={panel}
        panelProducts={panel.panelProducts.nodes}
        panelUsers={panel.panelists.nodes}
      />
      {panelEndTime &&
        panelEndTime < new Date() && (
          <div className={styles.legendContainer}>
            <div className={styles.legendItemContainer}>
              <div className={styles.legendGreenBlock} />
              <span>Flag Percentage ≥ 0.95</span>
            </div>
            <div className={styles.legendItemContainer}>
              <div className={styles.legendYellowBlock} />
              <span>Flag Percentage 0.75 - 0.94</span>
            </div>
            <div className={styles.legendItemContainer}>
              <div className={styles.legendRedBlock} />
              <span>Flag Percentage ≤ 0.74</span>
            </div>
          </div>
        )}
      <h2 className={styles.refreshMsg}>Data Refresh Rate: 30 seconds</h2>

      <br />
      <br />
      <h3 className={styles.panelTitle}>User Flags</h3>
      <UserProductDataQualityTable
        panelProducts={panel.panelProducts.nodes}
        panelUsers={panel.panelists.nodes}
        latestAppBuild={latestAppBuild}
      />
      <div className={styles.footerContainer}>
        <span className={styles.refreshMsg}>
          Latest App Version: {latestAppBuild}
        </span>
        <span className={styles.refreshMsg}>Data Refresh Rate: 30 seconds</span>
      </div>
      <br />
      <br />
      <UserCategoryTable 
        panelUsers={panel.panelists.nodes}
      />
    </Paper>
  );
};

interface Props {
  workspaceId: any;
}

const mapStateToProps = state => ({
  workspaceId: selectWorkspaceProducerId(state)
});

export default compose(
  connect(mapStateToProps),
  graphql(ProducerByIdQuery, {
    name: 'producer',
    options: (props: Props) => ({
      variables: {
        id: props.workspaceId
      }
    })
  }),
  graphql(DataQualityQuery, {
    options: ({
      match: {
        params: { panelId }
      }
    }: any) => ({
      pollInterval: 30000,
      variables: {
        panelId: Number(panelId)
      },
      fetchPolicy: 'no-cache'
    }),
    props: (props: any) => {
      const {
        data: { loading, panel }
      } = props;
      return {
        loading,
        panel
      };
    }
  }),
  graphql(LatestAppBuildHistoriesQuery, {
    options: props => {
      return {
        variables: {
          date: get(props, 'panel.endTime')
        }
      };
    },
    name: 'appBuild'
  })
)(DataQualityDashboard);
