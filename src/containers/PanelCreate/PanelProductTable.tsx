import * as React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { get } from 'lodash';
import { COLORS } from '../../styles/theme';
import { CheckCircleOutline, CloseOutlined } from '../../material/index';
import DatePicker from '../../components/ProductClassAttributesInput/RenderDatePicker';
import formatPath from '../../utils/formatPath';
import { Link } from 'react-router-dom';
import { PRODUCT } from '../../constants/routePaths';
import { withTranslation, WithTranslation } from 'react-i18next';
import * as moment from 'moment';
import { Checkbox } from '../../material/index';
import WarningModal from '../../components/WarningModal';
const dragIcon = require('./img/dragIcon.png');
const styles = require('./PanelCreate.module.css');

interface PanelProductTableProps extends WithTranslation {
  data: any[];
  onClickRow: (a) => void;
  onRowDragged?: (removedIndex, draggedItem, index) => void;
  blindPanel: boolean;
  afsWorkspaceBool: boolean;
  setBlindLabel: (val, product) => void;
  setServingVessel: (val, product) => void;
  setClientName: (val, product) => void;
  setProjectName: (val, product) => void;
  setTotalCost: (val, product) => void;
  setProductionDate: (val, product) => void;
  setExpirationDate: (val, product) => void;
  setBehavioralQuestions: (val, product) => void;
  blindLabels: any;
  servingVessels: any;
  behavioralQuestions: any;
  clientNames: any;
  projectNames: any;
  totalCosts: any;
  productionDates: any;
  expirationDates: any;
  editable: boolean;
  allowBehavioralQuestions: boolean;
  editing?: boolean;
}

interface PanelProductTableState {
  draggedItem: any;
  hoverIndex: number;
  showModalReviewed: boolean;
  showModalBehavior: boolean;
}

class PanelProductTable extends React.Component<
  PanelProductTableProps,
  PanelProductTableState
> {
  state = {
    draggedItem: null,
    hoverIndex: null,
    showModalReviewed: false,
    showModalBehavior: false
  };

  closeModalReviewed = () => this.setState({ showModalReviewed: false });
  closeModalBehavior = () => this.setState({ showModalBehavior: false });

  onDragStart = (e, index) => {
    this.setState({ draggedItem: this.props.data[index] });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(
      'text/html',
      e.target.parentNode.parentNode.parentNode
    );
    e.dataTransfer.setDragImage(
      e.target.parentNode.parentNode.parentNode,
      20,
      20
    );
  };

  onDragOver = (e, index) => {
    e.preventDefault();
  };

  onDrop = (e, index) => {
    let { data } = this.props;
    let removeIndex = data.indexOf(this.state.draggedItem);
    this.props.onRowDragged(removeIndex, this.state.draggedItem, index);
    this.setState({ hoverIndex: null });
  };

  beginHover = index => {
    this.setState({ hoverIndex: index });
  };

  endHover = () => {
    this.setState({ hoverIndex: null });
  };

  porductPublicFormatter = (cell, row) =>
    cell ? (
      <CheckCircleOutline color="secondary" />
    ) : (
      <CloseOutlined color="error" />
    );
  aromaPublicFormatter = (cell, row) =>
    cell ? (
      <CheckCircleOutline color="secondary" />
    ) : (
      <CloseOutlined color="error" />
    );

  render() {
    let { t, allowBehavioralQuestions, editing } = this.props;
    let svOptions = Array<any>(t('servingVessel', { returnObjects: true }));
    let svRenderoptions =
      svOptions[0] instanceof Array &&
      svOptions[0].map(data => (
        <option key={data.value} value={data.value}>
          {' '}
          {data.label}{' '}
        </option>
      ));

    const columns = [
      {
        dataField: 'id',
        text: '',
        hidden: true
      },
      {
        dataField: 'drag',
        text: '',
        headerStyle: { width: '2rem' }
      },
      {
        dataField: 'name',
        text: 'Name'
      },
      {
        dataField: 'productionDate',
        text: 'Production Date'
      },
      {
        dataField: 'expirationDate',
        text: 'Expiration Date'
      },
      {
        dataField: 'productClass',
        text: 'Product Class',
        headerStyle: { width: '7rem' },
        hidden: this.props.afsWorkspaceBool
      },
      {
        dataField: 'public',
        text: 'Public',
        headerStyle: { width: '5rem' },
        formatter: this.porductPublicFormatter
      },
      {
        dataField: 'aroma',
        text: 'Aroma',
        headerStyle: { width: '5rem' },
        formatter: this.aromaPublicFormatter
      },
      {
        dataField: 'blindLabel',
        text: 'Blind Label',
        hidden: !this.props.blindPanel
      },
      {
        dataField: 'servingVessel',
        text: 'Serving Vessel'
      },
      {
        dataField: 'clientName',
        text: 'Client Name',
        hidden: !this.props.afsWorkspaceBool
      },
      {
        dataField: 'behavioralQuestions',
        text: t('panel.behaviorQuestion'),
        hidden: !allowBehavioralQuestions
      },
      {
        dataField: 'projectName',
        text: 'Project',
        hidden: !this.props.afsWorkspaceBool
      },
      {
        dataField: 'totalCost',
        text: 'Total Cost',
        hidden: !this.props.afsWorkspaceBool
      },
      {
        dataField: 'workspaceName',
        text: 'Workspace Name',
        hidden: !this.props.afsWorkspaceBool
      },
      {
        dataField: 'action',
        text: '',
        hidden: !this.props.editable,
        headerStyle: { width: '3rem' }
      }
    ];
    
    const products = this.props.data.map((product, index) => {
      const productClassFormatted =
        product.productClasses &&
        product.productClasses.nodes
          .map(pc => pc.productClassByProductClassId.name)
          .join(', ');

      return {
        id: product.id,
        workspaceName: get(product, 'producer.name', ''),
        drag: (
          <div
            draggable
            onDragStart={e => this.onDragStart(e, index)}
            onDragOver={e => this.onDragOver(e, index)}
            onDrop={e => this.onDrop(e, index)}
          >
            {/* {this.state.hoverIndex == index ? ( */}
            <img className={styles.drag} src={dragIcon} />
            {/* ) : ( */}
            {/* <div className={styles.drag} /> */}
            {/* )}{' '} */}
          </div>
        ),
        name: (
          <Link
            key={product.productId}
            // className={`restore-${product.id}`}
            to={{
              pathname: formatPath(PRODUCT, {
                productId: product.productId ? product.productId : product.id
              }),
              state: product.id
            }}
          >
            {product.name}
          </Link>
        ),
        productClass:
          productClassFormatted && productClassFormatted.length !== 0
            ? productClassFormatted
            : product.productClass
              ? product.productClass
              : 'Other',
        public: !!product.public,
        aroma: !!product.aroma,
        blindLabel: this.props.editable ? (
          <input
            type="text"
            onChange={e => this.props.setBlindLabel(e.target.value, product.id)}
            value={this.props.blindLabels[product.id] || ''}
            className={styles.blindLabelInput}
            placeholder="Blind Label"
          />
        ) : (
          <span>{this.props.blindLabels[product.id] || ''}</span>
        ),

        servingVessel: this.props.editable ? (
          // <input
          // 	type="text"
          // 	onChange={(e) => this.props.setServingVessel(e.target.value, product.id)}
          // 	value={this.props.servingVessels[product.id] || ''}
          // 	className={styles.blindLabelInput}
          // 	placeholder="Serving Vessel"
          // />

          <select
            style={{ width: '100%' }}
            value={this.props.servingVessels[product.id] || ''}
            onChange={e =>
              this.props.setServingVessel(e.target.value, product.id)
            }
          >
            {svRenderoptions}
          </select>
        ) : (
          <span>{this.props.servingVessels[product.id] || ''}</span>
        ),

        behavioralQuestions: this.props.editable ? (
          <Checkbox
            color="secondary"
            onChange={
              product &&
              product.selectedProductQuestions &&
              product.selectedProductQuestions.totalCount != null &&
              product.selectedProductQuestions.totalCount === 0
                ? () =>
                    this.setState({
                      showModalBehavior: true
                    })
                : e =>
                    this.props.setBehavioralQuestions(
                      e.target.checked,
                      product.id
                    )
            }
            disableRipple={this.state.showModalBehavior}
            value={this.props.behavioralQuestions[product.id] || false}
            checked={this.props.behavioralQuestions[product.id] || false}
          />
        ) : !!this.props.behavioralQuestions[product.id] ? (
          <CheckCircleOutline color="secondary" />
        ) : (
          <CloseOutlined color="error" />
        ),

        clientName: this.props.editable ? (
          <input
            type="text"
            onChange={e => this.props.setClientName(e.target.value, product.id)}
            value={this.props.clientNames[product.id] || ''}
            className={styles.blindLabelInput}
            placeholder="Client Name"
          />
        ) : (
          <span>{this.props.clientNames[product.id] || ''}</span>
        ),

        projectName: this.props.editable ? (
          <input
            type="text"
            onChange={e =>
              this.props.setProjectName(e.target.value, product.id)
            }
            value={this.props.projectNames[product.id] || ''}
            className={styles.blindLabelInput}
            placeholder="Project Name"
          />
        ) : (
          <span>{this.props.projectNames[product.id] || ''}</span>
        ),

        totalCost: this.props.editable ? (
          <input
            type="text"
            onChange={e => this.props.setTotalCost(e.target.value, product.id)}
            value={this.props.totalCosts[product.id] || ''}
            className={styles.blindLabelInput}
            placeholder="Total Cost"
          />
        ) : (
          <span>{this.props.totalCosts[product.id] || ''}</span>
        ),
        productionDate: this.props.editable ? (
          <DatePicker
            value={get(this.props.productionDates, `${product.id}`, null)}
            onChange={date => this.props.setProductionDate(date, product.id)}
            style={{ fontSize: '10' }}
            format="MM/dd/yyyy"
            placeholder="12/21/2012"
            disableFuture
            disablePast={false}
          />
        ) : (
          <span>
            {this.props.productionDates[product.id]
              ? moment(this.props.productionDates[product.id]).format('LL')
              : ''}
          </span>
        ),
        expirationDate: this.props.editable ? (
          <DatePicker
            value={get(this.props.expirationDates, `${product.id}`, null)}
            onChange={date => this.props.setExpirationDate(date, product.id)}
            format="MM/dd/yyyy"
            placeholder="12/21/2012"
            disablePast
          />
        ) : (
          <span>
            {this.props.expirationDates[product.id]
              ? moment(this.props.expirationDates[product.id]).format('LL')
              : ''}
          </span>
        ),
        action: (
          <button
            onClick={
              editing &&
              product &&
              product.productReviews &&
              product.productReviews.totalCount &&
              product.productReviews.totalCount > 0
                ? () =>
                    this.setState({
                      showModalReviewed: true
                    })
                : () => this.props.onClickRow(product)
            }
            className={styles.removeBtn}
          >
            <i className="fas fa-times" />
          </button>
        )
      };
    });

    const rowEvents = {
      onMouseEnter: (e, row, rowIndex) => this.beginHover(rowIndex),
      onMouseLeave: (e, row, rowIndex) => this.endHover()
    };

    return (
      <div>
        {this.props.data.length ? (
          // <BootstrapTable keyField="id" data={products} columns={columns} rowEvents={rowEvents} />
          <BootstrapTable
            keyField="id"
            data={products}
            columns={columns}
            rowEvents={rowEvents}
            bootstrap4
            rowStyle={(_, index) => ({
              backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
            })}
            rowClasses={styles.tableRow}
            headerClasses={styles.tableHeader}
            noDataIndication={() => 'No results'}
            bordered={false}
          />
        ) : null}
        <WarningModal
          open={this.state.showModalReviewed}
          handleClose={() => this.closeModalReviewed()}
          message={t('warningModal.warning')}
        />
        <WarningModal
          open={this.state.showModalBehavior}
          handleClose={() => this.closeModalBehavior()}
          message={t('panel.panelNoBehavioralQuestions')}
        />
      </div>
    );
  }
}

export default withTranslation()(PanelProductTable);
