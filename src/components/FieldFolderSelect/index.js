import React from 'react';
import FolderSystem from '../../containers/ProductFolder/FolderSystem';
import { foldersToTree } from '../../utils/folderHelper';
import styles from './FieldFolderSelect.module.css';

// Adds a folder and its ancestors to the tree
const addFolderToTree = (foldersById, id) => {
  let node = foldersById[id];
  if (id === 0) {
    return;
  }
  let parent = foldersById[node.parentId];
  addFolderToTree(foldersById, node.parentId);
  if (parent.children.includes(id)) {
    return;
  }
  parent.children.push(id);
};

export default props => {
  let { input, folderResults, label } = props;
  let { value, onChange } = input;

  let folderTree = foldersToTree(folderResults.folders);

  return (
    <div>
      <p className={styles.label}> {label} </p>
      {!folderResults.loading && (
        <FolderSystem
          folderTree={folderTree}
          id={0}
          setFolderId={onChange}
          openFolder={value || 0}
          dispatch={props.meta.dispatch}
          field
        />
      )}{' '}
    </div>
  );
};
