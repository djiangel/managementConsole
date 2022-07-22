import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { COLORS } from '../../styles/theme';
import CustomLexiconListTable from './CustomLexiconListTable';

const styles = require('./CustomLexiconList.module.css');

interface Props {
  name?: string;
  referenceFlavors?: [],
  languages?: [],
  toggleExpansion?: () => void;
  hasExpanded?: boolean;
  colorCode?: string;
  groupAndUpdateLexicons: Function;
  getUpdatedReferenceFlavorsByAttribute: Function;
}

const CustomLexiconList: React.FunctionComponent<Props> = (props) => {
  const {
    name,
    referenceFlavors,
    languages,
    colorCode,
    groupAndUpdateLexicons,
    getUpdatedReferenceFlavorsByAttribute
  } = props;
  const { t } = useTranslation();

  const [referenceFlavorList, setReferenceFlavorList] = useState([]);
  const [hasExpanded, setHasExpanded] = useState(false);

  const reShapeReferenceFlavors = (refFlavors) => {
    if (!refFlavors) return [];
    return refFlavors.map((item: object) => {
      let itemMap = {};
      languages.forEach(language => {
        // ProducerId is the field used to indicated if the reference flavour is being used by the current workspace or not
        itemMap[language + "Enabled"] = !!(item[language] && !item["isDeleted"]);
      });
      return ({
        ...item,
        referenceFlavorDeleted: !!item["isDeleted"],
        ...itemMap
      })
    });
  };

  useEffect(() => {
    if (referenceFlavors.length) {
      setReferenceFlavorList(reShapeReferenceFlavors(referenceFlavors));
    }
  }, []);

  const updateReferenceFlavorList = (refList) => setReferenceFlavorList(reShapeReferenceFlavors(refList));

  const toggleExpansion = () => {
    setHasExpanded(!hasExpanded);
    if (!hasExpanded) {
      updateReferenceFlavorList(getUpdatedReferenceFlavorsByAttribute(name));
    }
  };

  return (
    <>
      <div
        className={styles.root}
        style={
          colorCode && {
            backgroundColor:
              colorCode === 'green' ? COLORS.AQUA_MARINE : COLORS.CORAL_PINK
          }
        }
      >
        <div className={styles.container}>
          <div className={styles.panelName}>
            {name}
          </div>
        </div>
        <div className={styles.minimizeContainer}>
          <IconButton onClick={toggleExpansion}>
            {hasExpanded ? (
              <KeyboardArrowUp color="primary" />
            ) : (
              <KeyboardArrowDown color="primary" />
            )}
          </IconButton>
        </div>
      </div>
      {hasExpanded && (
        <div className={styles.tableContainer}>
          <div className="productsWrapper">
            <div className={styles.tableBox}>
              <CustomLexiconListTable producersReferenceFlavors={referenceFlavorList} languages={languages} groupAndUpdateLexicons={groupAndUpdateLexicons} />
            </div>       
          </div>
        </div>
      )}
      <br />
    </>
  );
};

CustomLexiconList.displayName = 'CustomLexiconList';

export default CustomLexiconList;
