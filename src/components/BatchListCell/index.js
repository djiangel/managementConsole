import React from 'react';
import flexContainer from '../../styles/flexContainer';
import Button from '../Button';
import Panel from '../Panel';
import PanelHeader from '../PanelHeader';

type Props = {
  batchIdentifier: string,
  children: React$Element[],
  onPressDelete: ?() => any,
  productName: ?string
};

const BatchListCell = ({
  batchIdentifier,
  children,
  onPressDelete,
  productName,
  ...rest
}: Props) => (
  <Panel {...rest}>
    <PanelHeader
      renderRightContents={() => (
        <Button onPress={onPressDelete}>Delete</Button>
      )}
      title={`${batchIdentifier} • ${productName}`}
    />
    <div style={{ ...flexContainer, flexDirection: 'row' }}>{children}</div>
  </Panel>
);

BatchListCell.displayName = 'BatchListCell';

export default BatchListCell;
