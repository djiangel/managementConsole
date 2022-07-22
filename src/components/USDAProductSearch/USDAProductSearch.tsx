import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { withTranslation, WithTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { COLORS } from '../../styles/theme';

interface Props {
    change: any;
    data?: any;
    getNutrients: any;
    loading?: boolean;
}

const styles = require('./USDAProductSearch.module.css');

class USDAProductSearch extends React.Component<Props & WithTranslation> {

  rowEvents = {
    onClick: (e, row, rowIndex) => this.props.getNutrients(row.id)
  }

	getProductData = () => {
        const { data, getNutrients } = this.props;
        if(data && data.foods){
            return data.foods.map(food => ({
                id: food.fdcId,
                name: food.description,
                brand: food.brandOwner && food.brandOwner,
            }))
        }

        return []
    }

	render() {
        const { t, loading } = this.props;

    const columns = [
      {
        dataField: 'id',
        text: 'User ID',
        sort: true,
        hidden: true
      },
      {
        dataField: 'name',
        text: 'Name'
      },
      {
        dataField: 'brand',
        text: 'Brand',
        // headerStyle: { width: '20%' }
      }
    ];

		return (
            // <span>Hey!</span>
			<ToolkitProvider keyField="id" columns={columns} data={this.getProductData()}>
				{(props) => (
					<Paper className={styles.container}>
            {loading
            ? <LinearProgress />
            :
              <div className={styles.tableContainer}>
                <BootstrapTable
                  {...props.baseProps}
                  bordered={false}
                  rowStyle={(_, index) => ({
                    backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                  })}
                  noDataIndication={() => 'No Data'}
                  rowClasses={styles.tableRow}
                  headerClasses={styles.tableHeader}
                  rowEvents={this.rowEvents}
                />
              </div>
            }
					</Paper>
				)}
			</ToolkitProvider>
		);
	}
}

export default compose(
    connect(),
    withTranslation()
)(USDAProductSearch);
