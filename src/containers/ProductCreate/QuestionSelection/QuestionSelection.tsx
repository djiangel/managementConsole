import * as React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormControlLabel,
} from '../../../material/index';
import { ExpandMoreIcon } from '../../../material/index';
import useStyles from './useStyles';
import { BEHAVIOR_QUESTION_TYPES, CUSTOM_BEHAVIOR_QUESTION_TYPES } from '../../../constants/behaviorQuestionTypes';
import { useTranslation } from 'react-i18next';
import { intersection, sortBy, concat, union, difference } from 'lodash';
import { COLORS } from '../../../styles/theme';
import BootstrapTable from 'react-bootstrap-table-next';
import selectWorkspaceProducerId from '../../../selectors/workspaceProducerId';
import { connect } from 'react-redux';

const styles = require('./QuestionSelection.module.css');

type Props = {
  input: any,
  data: Record<string, any>,
  workspaceProducerId: number,
  productCategory: string
};

const QuestionSelection: React.FunctionComponent<Props> = (props) => {
  const { data, productCategory } = props;
  const { value, onChange } = props.input;
  const { t } = useTranslation();
  const { workspaceProducerId } = props;
  
  const classes = useStyles(props);
  const getData = (type: string) => {
    const currentTypeQuestions = data.questions.nodes.filter(que => que.category === type);
    const selectedTypeQuestions = intersection(value, currentTypeQuestions.map(que => que.id));
    //const defaultQuestion = data.questions.nodes.filter(que => que.id === 18);
    
    
    return sortBy(currentTypeQuestions, ['qOrder']).map((que, index) => {
      let defaultQuestionLabel='';
      let defaultQuestion = '';
      if(que.id === 20){
        defaultQuestionLabel = t(`behaviorQuestion.${que.slug}.question`, {
                  productCategory: productCategory
                });
        defaultQuestion = t(`behaviorQuestion.${que.slug}.question`, {
          productCategory: productCategory
        })
      }else{
        defaultQuestionLabel=t(`behaviorQuestion.${que.slug}.question`);
        defaultQuestion=t(`behaviorQuestion.${que.slug}.question`);
      }
      
      return {
        description: (
          <FormControlLabel
            control={<Checkbox />}
            color="secondary"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              if (target.checked) {
                onChange(concat(value, que.id));
              } else {
                onChange(value.filter(val => val != que.id));
              }
            }}
            label={defaultQuestionLabel}
            checked={!!selectedTypeQuestions.find(val => val == que.id)}
            classes={{ label: classes.label, root: classes.label }}
          />
        ),
        question: defaultQuestion
      }
    });
  }

  const columns = [
    {
      dataField: 'description',
      text: 'Description',
      headerStyle: { width: '7rem' }
    },
    {
      dataField: 'question',
      text: 'Question',
      headerStyle: { width: '7rem' },
      style: { verticalAlign: 'middle' }
    },
  ]


  if (data.loading) {
    return <div>Loading...</div>
  }

  if (data.error) {
    return <div>Error</div>
  }
  
  return (
    <div>
      <div>
        <FormControlLabel
          key={`selectAll`}
          control={<Checkbox />}
          color="secondary"
          onClick={(event) => event.stopPropagation()}
          onFocus={(event) => event.stopPropagation()}
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            if (target.checked) {
              onChange(union(value, data.questions.nodes.map(que => que.id)));
            } else {
              onChange([]);
            }
          }}
          value={data.questions.nodes.map(que => que.id)}
          label={t(`behaviorQuestion.selectAll`)}
          checked={data.questions.nodes.length == value.length}
          classes={{ label: classes.headerLabel, root: classes.root  }}
        />
      </div>
      
      {(workspaceProducerId !== 199 && workspaceProducerId !== 284 && workspaceProducerId !== 287 && workspaceProducerId !== 320) && BEHAVIOR_QUESTION_TYPES.map((type, index) => {
        const currentTypeQuestions = data.questions.nodes.filter(que => que.category === type);
        const selectedTypeQuestions = intersection(value, currentTypeQuestions.map(que => que.id));
        
        //if(type === 'Default' && currentTypeQuestions.id ===  )
        const label = t(`behaviorQuestion.${type}`)
        return (
          <ExpansionPanel
            square
            key={`panel-${index}`}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              id={`summary-${index}`}
            >
              <FormControlLabel
                key={`checkbox-${index}`}
                control={<Checkbox />}
                color="secondary"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  if (target.checked) {
                    onChange(union(value, currentTypeQuestions.map(que => que.id)));
                  } else {
                    onChange(difference(value, currentTypeQuestions.map(que => que.id)));
                  }
                }}
                value={currentTypeQuestions.map(que => que.id)}
                
                
                label={t(`behaviorQuestion.${type}`)}
                checked={currentTypeQuestions.length == selectedTypeQuestions.length}
                classes={{ label: classes.headerLabel }}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <BootstrapTable
                keyField="id"
                data={getData(type)}
                columns={columns}
                bootstrap4
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                })}
                rowClasses={styles.tableRow}
                headerClasses={styles.tableHeader}
                noDataIndication={() => 'No results'}
                bordered={false}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
      {(workspaceProducerId == 199 || workspaceProducerId == 284 || workspaceProducerId == 287 || workspaceProducerId == 320 || workspaceProducerId == 331) && CUSTOM_BEHAVIOR_QUESTION_TYPES.map((type, index) => {
        const currentTypeQuestions = data.questions.nodes.filter(que => que.category === type);
        const selectedTypeQuestions = intersection(value, currentTypeQuestions.map(que => que.id));

        return (
          <ExpansionPanel
            square
            key={`panel-${index}`}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              id={`summary-${index}`}
            >
              <FormControlLabel
                key={`checkbox-${index}`}
                control={<Checkbox />}
                color="secondary"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  if (target.checked) {
                    onChange(union(value, currentTypeQuestions.map(que => que.id)));
                  } else {
                    onChange(difference(value, currentTypeQuestions.map(que => que.id)));
                  }
                }}
                value={currentTypeQuestions.map(que => que.id)}
                label={t(`behaviorQuestion.${type}`)}
                checked={currentTypeQuestions.length == selectedTypeQuestions.length}
                classes={{ label: classes.headerLabel }}
              />
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <BootstrapTable
                keyField="id"
                data={getData(type)}
                columns={columns}
                bootstrap4
                rowStyle={(_, index) => ({
                  backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
                })}
                rowClasses={styles.tableRow}
                headerClasses={styles.tableHeader}
                noDataIndication={() => 'No results'}
                bordered={false}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </div>
  )
};

const mapStateToProps = state => ({
  workspaceProducerId: selectWorkspaceProducerId(state)
});

export default connect(mapStateToProps)(QuestionSelection);