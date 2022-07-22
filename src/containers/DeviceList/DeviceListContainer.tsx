import * as React from 'react';
import { compose } from 'redux';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { Link } from 'react-router-dom';
import { ADD_DEVICES } from '../../constants/routePaths';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { COLORS } from '../../styles/theme';
import MaterialButton from '../../components/MaterialButton';
import { Search as SearchIcon, HighlightOffOutlined } from '@material-ui/icons';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { graphql } from 'react-apollo';
import AllDevicesQuery from '../../graphql/queries/AllDevicesQuery';

interface Props {
  devicesResult?: any;
  handleDeleteDevice: (deviceId: number) => void;
  producerId?: number;
}

const styles = require('./DeviceList.module.css');

class DeviceListContainer extends React.Component<Props & WithTranslation> {
  getDevices = () =>
    this.props.devicesResult.allCorporateDevices.nodes.map(device => ({
      id: device.id,
      name: device.deviceName && device.deviceName,
      deviceUid: device.deviceUid,
      action: (
        <IconButton
          size="small"
          onClick={() => this.props.handleDeleteDevice(device.id)}
        >
          <HighlightOffOutlined color="primary" fontSize="small" />
        </IconButton>
      )
    }));

  render() {
    const { devicesResult, t } = this.props;

    const columns = [
      {
        dataField: 'id',
        text: t('device.deviceId'),
        sort: true,
        headerClasses: styles.deviceIdColumn,
        classes: styles.tableHeader
      },
      {
        dataField: 'name',
        text: t('device.deviceName'),
        sort: true
      },
      {
        dataField: 'deviceUid',
        text: t('device.deviceUid')
      },
      {
        dataField: 'action',
        text: t('general.delete'),
        headerClasses: styles.deviceIdColumn
      }
    ];

    const SearchComponent = ({ onSearch, placeholder }) => (
      <Input
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        onChange={event => onSearch(event.target.value)}
        placeholder={placeholder}
      />
    );

    return (
      <Paper className={styles.deviceList}>
        {devicesResult.loading ? (
          <LinearProgress />
        ) : (
          <ToolkitProvider
            keyField="id"
            data={this.getDevices()}
            columns={columns}
            search
          >
            {props => (
              <div>
                <div className={styles.actionContainer}>
                  <div className={styles.headerTextContainer}>
                    <h5 className={styles.deviceHeader}>Manage Devices</h5>
                    <h3 className={styles.deviceTitle}>Devices</h3>
                  </div>
                  <SearchComponent
                    {...props.searchProps}
                    placeholder={t('general.search')}
                  />
                  <Link to={ADD_DEVICES}>
                    <MaterialButton variant="outlined" soft>
                      {t('device.addDevice')}
                    </MaterialButton>
                  </Link>
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4
                  bordered={false}
                  defaultSorted={[{ dataField: 'id', order: 'asc' }]}
                  pagination={paginationFactory({ sizePerPage: 10 })}
                  noDataIndication={() => t('device.noDevice')}
                  rowStyle={(_, index) => ({
                    backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY,
                    fontSize: 12,
                    fontFamily: 'OpenSans',
                    color: COLORS.MARINE,
                    wordWrap: 'break-word'
                  })}
                  headerClasses={styles.tableHeader}
                />
              </div>
            )}
          </ToolkitProvider>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

const mapDispatchToProps = dispatch => ({
  handleDeleteDevice: deviceId =>
    dispatch({ type: 'DELETE_DEVICE', payload: deviceId })
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation(),
  graphql(AllDevicesQuery, {
    options: ({ producerId }: Props) => ({
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }),
    name: 'devicesResult'
  })
)(DeviceListContainer);
