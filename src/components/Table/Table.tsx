import * as React from 'react';
import { ReactElement } from 'react';

const styles = require('./Table.module.css');

interface Props {
  items?: Object[];
  renderBodyRow?: (item: Object) => ReactElement;
  renderHeaderRow?: () => ReactElement;
  children?: ReactElement[];
}

const Table: React.FunctionComponent<Props> = ({
  items,
  renderBodyRow,
  renderHeaderRow,
  children
}) => (
  <table className={styles.tableContainer}>
    {renderHeaderRow && <thead>{renderHeaderRow()}</thead>}
    {renderBodyRow && <tbody>{items.map(renderBodyRow)}</tbody>}
    {children && <tbody>{children}</tbody>}
  </table>
);

Table.defaultProps = {
  renderHeaderRow: () => null
};
Table.displayName = 'Table';

export default Table;
