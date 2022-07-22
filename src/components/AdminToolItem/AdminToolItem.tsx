import * as React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props {
  title: string;
  component: React.Component;
}

const AdminToolItem: React.FunctionComponent<Props> = ({
  title,
  component
}) => {

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
      >
        {title}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {component}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default AdminToolItem;




