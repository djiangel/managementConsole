import * as React from 'react';
import { Link, RouteProps } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import i18n from '../../i18n';
import { ADD_DEMOGRAPHIC_TARGET, DEMOGRAPHIC_TARGET } from '../../constants/routePaths';
import { WithTranslation } from 'react-i18next';
import MaterialButton from 'components/MaterialButton';
import { COLORS } from '../../styles/theme';
import LoadingScreen from 'components/LoadingScreen';
import formatPath from 'utils/formatPath';

const styles = require('./DemographicTargetList.module.css');

const DATE_FORMAT = 'yyyy-MM-dd';

interface Props extends RouteProps {
  demographicTargetResults?: any;
  producerId?: number;
}

export default class DemographicTargetList extends React.Component<
  Props & WithTranslation
> {
  state = {
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false
  };

  updateDimensions() {
    if (window.innerWidth < 625) {
      this.setState({
        widthBelow600: true
      });
    } else {
      this.setState({
        widthBelow600: false
      });
    }
    if (window.innerWidth < 700) {
      this.setState({
        widthBelow700: true
      });
    } else {
      this.setState({
        widthBelow700: false
      });
    }

    if (window.innerWidth < 800) {
      this.setState({
        widthBelow800: true
      });
    } else {
      this.setState({
        widthBelow800: false
      });
    }

    if (window.innerWidth < 900) {
      this.setState({
        widthBelow900: true
      });
    } else {
      this.setState({
        widthBelow900: false
      });
    }

    if (window.innerWidth < 1000) {
      this.setState({
        widthBelow1000: true
      });
    } else {
      this.setState({
        widthBelow1000: false
      });
    }

    if (window.innerWidth < 1100) {
      this.setState({
        widthBelow1100: true
      });
    } else {
      this.setState({
        widthBelow1100: false
      });
    }

    if (window.innerWidth < 1200) {
      this.setState({
        widthBelow1400: true
      });
    } else {
      this.setState({
        widthBelow1400: false
      });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount(): void {
    document.body.style.overflow = 'unset';

    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  demographicNameFormatter = (cell, row) => (
		<Link
			key={row.id}
			to={formatPath(DEMOGRAPHIC_TARGET, { id: row.id })}
			className={styles.productName}
		>
			{cell}
		</Link>
	);

  getFormattedProductData = () => {
    const { demographicTargetResults } = this.props;

    return demographicTargetResults &&
      demographicTargetResults.demographicTargets &&
      demographicTargetResults.demographicTargets.nodes &&
      demographicTargetResults.demographicTargets.nodes.map(demographic => ({
        id: demographic.id,
        user: demographic.user.username,
        name: demographic.name,
        date: formatDate(parseISO(demographic.createdAt), DATE_FORMAT),
        countries: demographic.countries,
        ages: demographic.ages,
        genders: demographic.genders,
        socioEcon: demographic.socioEcon,
        regionTarget: demographic.regionTarget,
        smokingHabits: demographic.smokingHabits,
      }));
  };

  render() {
    const { demographicTargetResults, producerId, t } = this.props;

    if (!producerId) return <div />;

    if (demographicTargetResults.loading) {
      return <LoadingScreen />;
    }

    if (demographicTargetResults.error) {
      return <div>ERROR: Unable to fetch data!</div>;
    }

    const data = this.getFormattedProductData();

    const columns = [
      {
        dataField: 'id',
        sort: true,
        hidden: true
      },
      {
        dataField: 'name',
        text: i18n.t('demographicTarget.name'),
        sort: true,
        formatter: this.demographicNameFormatter,
      },
      {
        dataField: 'user',
        text: i18n.t('demographicTarget.creator'),
        sort: true
      },
      {
        dataField: 'date',
        text: i18n.t('general.dateCreated'),
        sort: true,
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'countries',
        text: i18n.t('reports.countries'),
        sort: true,
        hidden: this.state.widthBelow600
      },
      {
        dataField: 'ages',
        text: i18n.t('reports.ages'),
        sort: true,
        hidden: this.state.widthBelow700
      },
      {
        dataField: 'socioEcon',
        text: i18n.t('reports.socioEcon'),
        sort: true,
        hidden: this.state.widthBelow1100
      },
      {
        dataField: 'genders',
        text: i18n.t('reports.gender'),
        sort: true,
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'regionTarget',
        text: i18n.t('reports.regionTarget'),
        sort: true,
        hidden: this.state.widthBelow1000
      },
      {
        dataField: 'smokingHabits',
        text: i18n.t('reports.smokingHabits'),
        sort: true,
        hidden: this.state.widthBelow1400
      },
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
      <ToolkitProvider
        keyField="id"
        data={producerId ? data : []}
        columns={columns}
        search
      >
        {props => (
          <Paper className={styles.container}>
            <div className={styles.headerContainer}>
              <div className={styles.headerTextContainer}>
                <h5 className={styles.productHeader}>
                  {t('navigation.demographicTargets')}
                </h5>
                <h3 className={styles.productTitle}>{t('demographicTarget.savedDemographics')}</h3>
              </div>
              <SearchComponent
                {...props.searchProps}
                placeholder={t('general.search')}
              />
              <Link to={ADD_DEMOGRAPHIC_TARGET}>
                <MaterialButton variant="outlined" soft teal>
                  {t('demographicTarget.createDemographicTarget')}
                </MaterialButton>
              </Link>
            </div>
            <BootstrapTable
              {...props.baseProps}
              bootstrap4
              pagination={paginationFactory({
                sizePerPage: 25
              })}
              rowStyle={(_, index) => ({
                backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
              })}
              rowClasses={styles.tableRow}
              headerClasses={styles.tableHeader}
              noDataIndication={() => 'No results'}
              bordered={false}
            />
          </Paper>
        )}
      </ToolkitProvider>
    );
  }
}
