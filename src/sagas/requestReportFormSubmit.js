/* eslint-disable no-constant-condition */
import { put, select, take } from 'redux-saga/effects';
import {
  destroy,
  getFormValues,
  reset,
  startSubmit,
  stopSubmit,
  change
} from 'redux-form';
import errorAction from '../actions/error';
import { FORM_SUBMIT } from '../actions/formSubmit';
import { REQUEST_REPORT_FORM } from '../constants/formNames';
import graphqlClient from '../consumers/graphqlClient';
import CreateMarketSurveyReportMutation from '../graphql/mutations/CreateMarketSurveyReport';
import CreateOptimizationReportMutation from '../graphql/mutations/CreateOptimizationReport';
import NotifyRequestReport from '../graphql/mutations/NotifyRequestReport';
import ConchRequest from '../graphql/queries/ConchRequest';
import OptimizationRequest from '../graphql/queries/OptimizationRequest';
import AllMarketSurveyReportQuery from '../graphql/queries/AllMarketSurveyReportQuery';
import AllOptimizationReportQuery from '../graphql/queries/AllOptimizationReportQuery';
import selectWorkspaceProducerId from '../selectors/workspaceProducerId';
import selectViewerUserId from '../selectors/viewerUserId';
import { labelObjectsToCsv, labelObjectsToValue } from '../utils/sagaHelper';
import { union } from 'lodash';
import { MARKET_SURVEY, PRODUCT, OPTIMIZATION } from '../constants/report';

const getReportType = type => {
  switch (type) {
    case MARKET_SURVEY:
      return 'market_survey';
    case PRODUCT:
      return 'product';
    case OPTIMIZATION:
      return 'optimization';
  }
};

export default function* panelFormSubmitSaga() {
  while (true) {
    yield take(
      ({ type, payload }) =>
        type === FORM_SUBMIT && payload === REQUEST_REPORT_FORM
    );

    yield put(startSubmit(REQUEST_REPORT_FORM));

    const formValues = yield select(getFormValues(REQUEST_REPORT_FORM));
    const viewerUserId = yield select(selectViewerUserId);
    const workspaceProducerId = yield select(selectWorkspaceProducerId);
    try {
      // Add request to DB
      const report = {
        userId: viewerUserId,
        producerId: workspaceProducerId,
        projectName: formValues.projectName,
        // demographic: formValues.demographic,
        demographic: formValues.targetGroup,
        client: formValues.client,
        productIds: formValues.products.map(product => product.id),
        selectedCountries:
          formValues.countries && labelObjectsToCsv(formValues.countries),
        selectedAges: formValues.ages
          .map(age => `${age[0]}-${age[1]}`)
          .join(','),
        selectedEthnicities:
          formValues.countries && formValues.countries.code == 'US'
            ? labelObjectsToCsv(formValues.raceEthnicity)
            : undefined,
        selectedGenders:
          formValues.gender && labelObjectsToCsv(formValues.gender),
        // selectedSmokingHabits: formValues.smokingHabits,
        // selectedSocioEcon: formValues.socioEcon
        //   ? labelObjectsToCsv(formValues.socioEcon)
        //   : undefined,
        selectedRegionTarget: formValues.regionTarget
          ? labelObjectsToCsv(formValues.regionTarget)
          : undefined,
        status: 'In Progress',
        versionNo: 1
      };

      const refetchQueries = [
        {
          query: AllMarketSurveyReportQuery,
          variables: {
            condition: {
              producerId: workspaceProducerId
            },
            orderBy: 'ID_DESC'
          }
        },
        {
          query: AllOptimizationReportQuery,
          variables: {
            condition: {
              producerId: workspaceProducerId
            },
            orderBy: 'ID_DESC'
          }
        }
      ];

      // TODO
      // For Multiple Countries
      // formValues.countries.map(country => {
      //   report.selectedEthnicities[country.value] = labelObjectsToValue(formValues[`raceEthnicity_${country.value}`]);
      // });
      // report.selectedEthnicities = JSON.stringify(report.selectedEthnicities);

      const reportType = formValues.type.value;

      let clts_map = new Set();
      clts_map.add('AFS CLT Toronto');
      clts_map.add('AFS CLT Mexico City');
      clts_map.add('AFS CLT El Paso');
      clts_map.add('AFS CLT Bogota');
      clts_map.add('AFS CLT Salvador');
      clts_map.add('AFS CLT AFS CLT Rio de Janeiro');
      clts_map.add('AFS CLT AFS CLT Buenos Aires');
      clts_map.add('AFS CLT AFS CLT Porto');
      clts_map.add('AFS CLT Madrid');
      clts_map.add('AFS CLT London');
      clts_map.add('AFS CLT Rome');
      clts_map.add('AFS CLT Milan');
      clts_map.add('AFS CLT Berlin');
      clts_map.add('AFS CLT Moscos');
      clts_map.add('AFS CLT Saint Petersburg');
      clts_map.add('AFS CLT Shanghai');
      clts_map.add('AFS CLT HCMC');
      clts_map.add('AFS CLT Hanoi');
      clts_map.add('AFS CLT Manila');
      clts_map.add('AFS CLT Bangkok');
      clts_map.add('AFS CLT Singapore');
      clts_map.add('AFS CLT Australia');

      let country_clt_string = formValues.countries.value;
      let clts_s = 'NULL';
      let countries_s = 'NULL';
      if (clts_map.has(country_clt_string)) {
        clts_s = country_clt_string;
      } else {
        countries_s = country_clt_string;
      }

      let renamedProducts = {
        product_id: [],
        new_product: []
      };
      let competitiveSetProducts = [];
      formValues.products.forEach(prod => {
        if (prod['visible'] && prod['rename'] && prod['rename'].length > 0) {
          renamedProducts['product_id'].push(prod['id']);
          renamedProducts['new_product'].push(prod['rename']);
          competitiveSetProducts.push(prod['rename']);
        } else {
          competitiveSetProducts.push(prod['name']);
        }
      });

      const conchRequestPayload = {
        producerId: workspaceProducerId,
        resource_name: 'reporting-multi-report',
        report_type: getReportType(reportType),
        project_name_p: report.projectName,
        demographic_name_p: report.demographic,
        client_name_p: report.client,
        countries_p: countries_s,
        clts_p: clts_s,
        competitive_set_products_p: competitiveSetProducts,
        ages: report.selectedAges.split(','),
        productIds: report.productIds,
        include_male: JSON.stringify(false),
        include_female: JSON.stringify(false),
        // socioEcon: report.selectedSocioEcon.split(',')[0]
        socioEcon: '',
        productWorkspaceIds: formValues.products.map(
          product => product.productWorkspaceId
        ),
        productWorkspaceNames: formValues.products.map(
          product => product.productWorkspaceName
        ),
        product_rename_p: JSON.stringify(renamedProducts)
      };
      report.renamedProducts = JSON.stringify(renamedProducts);
      const optimizationRequestPayload = {
        producerId: workspaceProducerId,
        resource_name: 'reporting-multi-report',
        // report_type: getReportType(reportType),
        report_type: 'tune_taste_tune',
        project_name: report.projectName,
        client_name: report.client,
        demographic_name: report.demographic,
        countries: formValues.countries.value,
        products_to_opt: formValues.products.map(product => product.name),
        constraint_levels:
          formValues.constraintLevel && formValues.constraintLevel.value,
        // constraint_levels:
        //   formValues.constraintLevel &&
        //   formValues.constraintLevel[0] &&
        //   formValues.constraintLevel[0].value,
        new_reference_flavors_allowed: 'FALSE',
        is_opt_test_mode: 'F',
        productIds: report.productIds,
        ages: report.selectedAges.split(','),
        include_male: JSON.stringify(false),
        include_female: JSON.stringify(false),
        // socioEcon: report.selectedSocioEcon.split(',')[0]
        socioEcon: ''
      };

      const notificationPayload = {
        projectName: report.projectName,
        demographic: report.demographic,
        client: report.client,
        userId: report.userId,
        producerId: workspaceProducerId,
        reportType: reportType,
        countries: report.selectedCountries.split(','),
        ages: report.selectedAges.split(','),
        raceEthnicity: report.selectedEthnicities
          ? report.selectedEthnicities.split(',')
          : ['General'],
        gender: report.selectedGenders.split(','),
        // socioEcon: report.selectedSocioEcon
        //   ? report.selectedSocioEcon.split(',')
        //   : ['Default'],
        socioEcon: '',
        regionTarget: report.selectedRegionTarget
          ? report.selectedRegionTarget.split(',')
          : ['Default'],
        products: report.productIds
      };

      if (reportType === MARKET_SURVEY || reportType === PRODUCT) {
        if (reportType === MARKET_SURVEY) {
          formValues.folders.map(folderId => {
            const currFolderProducts = formValues.folderProducts[folderId];
            if (currFolderProducts)
              report.productIds = union(
                report.productIds,
                currFolderProducts.map(prod => prod.id)
              );

            conchRequestPayload.competitive_set_products_p = union(
              conchRequestPayload.competitive_set_products_p,
              currFolderProducts.map(prod => prod.name)
            );
          });
        }
        let c = function(name) {
          return `\\\"${name}\\\"`;
        };

        //Format string of products for conchRequest
        conchRequestPayload.competitive_set_products_p = `[\\"${conchRequestPayload.competitive_set_products_p.join(
          '\\",\\"'
        )}\\"]`;
        // conchRequestPayload.competitive_set_folders_p =
        //   conchRequestPayload.competitive_set_products_p;

        report.includeTexture = !!formValues.includeTexture;
        notificationPayload.includeTexture = report.includeTexture;

        notificationPayload.products = report.productIds;
        conchRequestPayload.productIds = report.productIds;
        report.productIds = report.productIds.join(',');

        report.selectedGenders.split(',').map(userGenderOption => {
          if (userGenderOption == 'All') {
            conchRequestPayload.include_male = JSON.stringify(null);
            conchRequestPayload.include_female = JSON.stringify(null);
          } else if (userGenderOption == 'Male') {
            conchRequestPayload.include_male = JSON.stringify(true);
          } else if (userGenderOption == 'Female') {
            conchRequestPayload.include_female = JSON.stringify(true);
          } else if (userGenderOption == 'Female & Male') {
            conchRequestPayload.include_female = JSON.stringify(true);
            conchRequestPayload.include_male = JSON.stringifytrue;
          } else if (userGenderOption == 'Skewed to Male (80/20)') {
            conchRequestPayload.include_male = JSON.stringify(0.8);
            conchRequestPayload.include_female = JSON.stringify(0.2);
          } else if (userGenderOption == 'Skewed to Female (80/20)') {
            conchRequestPayload.include_male = JSON.stringify(0.2);
            conchRequestPayload.include_female = JSON.stringify(0.8);
          }
        });
        if (
          formValues.experienceLevel[0][0] == formValues.experienceLevel[0][1]
        ) {
          conchRequestPayload.experience_range = `[${
            formValues.experienceLevel[0][0]
          }]`;
        } else if (
          formValues.experienceLevel[0][0] == 1 &&
          formValues.experienceLevel[0][1] == 3
        ) {
          conchRequestPayload.experience_range = '[1,2,3]';
        } else {
          conchRequestPayload.experience_range = `[${
            formValues.experienceLevel[0][0]
          },${formValues.experienceLevel[0][1]}]`;
        }

        report.experienceRange = conchRequestPayload.experience_range;
        const reportResult = yield graphqlClient.mutate({
          mutation: CreateMarketSurveyReportMutation,
          variables: {
            marketSurveyReport: report
          },
          refetchQueries
        });
        notificationPayload.reportId =
          reportResult.data.createMarketSurveyReport.report.id;
        conchRequestPayload.reportId =
          reportResult.data.createMarketSurveyReport.report.id;
      } else if (reportType === OPTIMIZATION) {
        report.productIds = report.productIds.join(',');

        report.constraintLevel = labelObjectsToCsv(formValues.constraintLevel);
        notificationPayload.constraintLevel = report.constraintLevel.split(',');

        // report.gravityConstraint = labelObjectsToCsv(
        //   formValues.gravityConstraint
        // );
        // notificationPayload.gravityConstraint = report.gravityConstraint.split(
        //   ','
        // );
        report.gravityConstraint = 'Medium';
        notificationPayload.gravityConstraint = 'Medium';

        report.newRefFlavors = formValues.newReferenceFlavors;
        notificationPayload.newRefFlavors = formValues.newReferenceFlavors;

        optimizationRequestPayload.products_to_opt = optimizationRequestPayload.products_to_opt.join(
          '\\",\\"'
        );

        if (formValues.testMode) {
          optimizationRequestPayload.is_opt_test_mode = 'T';
        }

        report.selectedGenders.split(',').map(userGenderOption => {
          if (userGenderOption == 'All') {
            optimizationRequestPayload.include_male = JSON.stringify(null);
            optimizationRequestPayload.include_female = JSON.stringify(null);
          } else if (userGenderOption == 'Male') {
            optimizationRequestPayload.include_male = JSON.stringify(true);
          } else if (userGenderOption == 'Female') {
            optimizationRequestPayload.include_female = JSON.stringify(true);
          } else if (userGenderOption == 'Female & Male') {
            optimizationRequestPayload.include_female = JSON.stringify(true);
            optimizationRequestPayload.include_male = JSON.stringify(true);
          } else if (userGenderOption == 'Skewed to Male (80/20)') {
            optimizationRequestPayload.include_male = JSON.stringify(0.8);
            optimizationRequestPayload.include_female = JSON.stringify(0.2);
          } else if (userGenderOption == 'Skewed to Female (80/20)') {
            optimizationRequestPayload.include_male = JSON.stringify(0.2);
            optimizationRequestPayload.include_female = JSON.stringify(0.8);
          }
        });

        if (
          formValues.experienceLevel[0][0] == formValues.experienceLevel[0][1]
        ) {
          optimizationRequestPayload.experience_range = `[${
            formValues.experienceLevel[0][0]
          }]`;
        } else if (
          formValues.experienceLevel[0][0] == 1 &&
          formValues.experienceLevel[0][1] == 3
        ) {
          conchRequestPayload.experience_range = '[1,2,3]';
        } else {
          optimizationRequestPayload.experience_range = `[${
            formValues.experienceLevel[0][0]
          },${formValues.experienceLevel[0][1]}]`;
        }

        report.experienceRange = optimizationRequestPayload.experience_range;
        const reportResult = yield graphqlClient.mutate({
          mutation: CreateOptimizationReportMutation,
          variables: {
            optimizationReport: report
          },
          refetchQueries
        });
        notificationPayload.reportId =
          reportResult.data.createOptimizationReport.report.id;
        optimizationRequestPayload.reportId =
          reportResult.data.createOptimizationReport.report.id;
      }

      if (reportType === OPTIMIZATION) {
        const optiRequestReport = yield graphqlClient.query({
          query: OptimizationRequest,
          variables: {
            input: optimizationRequestPayload
          }
        });

        if (optiRequestReport.error) {
          throw 'Issue with Optimization Request\n' + optiRequestReport.error;
        }
      } else {
        const requestReport = yield graphqlClient.query({
          query: ConchRequest,
          variables: {
            input: conchRequestPayload
          }
        });

        if (requestReport.error) {
          throw 'Issue with Conch Request\n' + requestReport.error;
        }
      }

      // const notification = yield graphqlClient.mutate({
      //   mutation: NotifyRequestReport,
      //   variables: {
      //     input: notificationPayload
      //   }
      // });

      // if (notification.error) {
      //   throw 'Unable to send notification, but report has been successfully requested!\n' +
      //     notification.error;
      // }

      // If this point is reached, the form was submitted without error
      yield put(stopSubmit(REQUEST_REPORT_FORM));
      yield put(reset(REQUEST_REPORT_FORM));
      yield put(change(REQUEST_REPORT_FORM, 'submittedType', formValues.type));
      yield put(
        change(
          REQUEST_REPORT_FORM,
          'submittedProjectName',
          formValues.projectName
        )
      );
    } catch (error) {
      yield put(stopSubmit(REQUEST_REPORT_FORM, error));
      yield put(
        errorAction({
          error,
          title: 'Failed to Request Report',
          description: error.message
        })
      );
    }
  }
}
