import * as React from 'react';
import { ADD_FOLDER_FORM, EDIT_FOLDER_FORM } from '../../constants/formNames';
import { KeyboardArrowRight, KeyboardArrowDown } from '../../material/index';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import FormContainer from '../Form';
import { Field, registerField, change } from 'redux-form';
import AutosizeInput from 'react-input-autosize';
import { IconButton } from '../../material/index';
import './react-contextmenu.css';
import MaterialButton from 'components/MaterialButton';
import { CloseOutlined } from '../../material/index';

const styles = require('./ProductFolderContainer.module.css');

const folderNameInput = props => {
  let { value, name, onChange } = props.input;
  return (
    <AutosizeInput
      name={name}
      value={value || props.initialValue || ''}
      onChange={e => {
        onChange(e.target.value);
      }}
      inputStyle={{
        border: '1px solid rgb(156, 156, 156)',
        borderRadius: '5px',
        padding: '3px',
        paddingTop: '0px',
        paddingBottom: '0px',
        margin: '0px',
        marginRight: '10px',
        fontSize: '13px'
      }}
      placeholder={props.placeholder}
    />
  );
};

export default class FolderSystem extends React.Component<any, any> {
  state = {
    collapsed: true,
    editing: false,
    adding: this.props.id === -1,
  };

  children = this.props.id !== -1 && this.props.folderTree[this.props.id] && this.props.folderTree[this.props.id].children;

  componentWillReceiveProps(nextProps){
    this.children = this.props.id !== -1 && nextProps.folderTree[this.props.id] && nextProps.folderTree[this.props.id].children;
  }

  onDragStart = e => {
    e.persist();
    e.dataTransfer.setData('text/html', e.target);
    e.dataTransfer.setDragImage(e.target, 20, 20);
    this.props.dragProps.setDraggedId(this.props.id);
  };

  onDragOver = () => {
    this.props.dragProps.setDraggedOverId(this.props.id);
  };

  onDragEnd = () => {
    let { draggedId, draggedOverId, moveFolder } = this.props.dragProps;
    let { folderTree } = this.props;

    // Makes sure that user isn't trying to put an ancestor into a descendant
    let current = draggedOverId;
    let update = true;
    while (current !== 0) {
      if (current === draggedId) {
        update = false;
        break;
      }
      current = folderTree[current].parentId;
    }

    if (update) {
      moveFolder({
        draggedId,
        draggedOverId
      });
    }
    this.props.dragProps.setDraggedId(null);
    this.props.dragProps.setDraggedOverId(null);
  };

  handleClear = () => {
    this.setState(prevState => {
      return {
        collapsed: this.children.length < 1 ? !prevState.collapsed : prevState.collapsed,
      }
    });
    this.children = this.children.filter(child => child !== -1)
  };

  newFolderSubmit = (e, handleSubmit) => {
    this.props.handleClear();
    this.props.dispatch(registerField(ADD_FOLDER_FORM, 'parentId', 'Field'));
    this.props.dispatch(
      change(ADD_FOLDER_FORM, 'parentId', this.props.parentId)
    );
    handleSubmit(e);
  };

  editFolderSubmit = (e, handleSubmit) => {
    this.setState({
      editing: false
    });
    this.props.dispatch(registerField(EDIT_FOLDER_FORM, 'id', 'Field'));
    this.props.dispatch(change(EDIT_FOLDER_FORM, 'id', this.props.id));
    handleSubmit(e);
  };

  render() {
    let {
      folderTree,
      id,
      setFolderId,
      openFolder,
      dragProps,
      dispatch,
      deleteFolder,
      products,
      expandId,
      setExpandId,
      field,
      expanded
    } = this.props;

    const { collapsed } = this.state;

    if (id === expandId) {
      this.setState({
        collapsed: false
      });
      setExpandId(null);
    }

    if (!expanded) {
      expanded = [];
      let pointer = openFolder;
      while (pointer !== 0) {
        pointer = folderTree[pointer].parentId;
        expanded.push(pointer);
      }
    }

    if (this.state.collapsed && expanded.indexOf(id) > -1) {
      this.setState({ collapsed: false });
    }

    return folderTree ? (
      (id === -1 && this.state.adding) || this.state.editing ? (
        <FormContainer
          formName={this.state.editing ? EDIT_FOLDER_FORM : ADD_FOLDER_FORM}
          render={({ handleSubmit, invalid }) => (
            <form className={styles.horizontal} onSubmit={handleSubmit}>
              <img
                src={require('../../../public/assets/folder/folder.svg')}
                style={{ height: 15, marginRight: 9 }}
                alt="folder-img"
              />
              <Field
                component={folderNameInput}
                key="folder-name"
                name="name"
                initialValue={this.state.editing && folderTree[id].name}
                placeholder="New Folder"
              />
              <MaterialButton variant="outlined" soft teal 
                onClick={e =>
                  this.state.editing
                    ? this.editFolderSubmit(e, handleSubmit)
                    : this.newFolderSubmit(e, handleSubmit)
                }
                size="small"
              >
                {this.state.editing ? 'Rename' : 'Add'}
              </MaterialButton>
              <span><CloseOutlined onClick={() => {
                this.state.editing ? this.setState({editing: false }) : this.props.handleClear();
              }} /></span>
            </form>
          )}
        />
      ) : (id !== -1 && folderTree[id]) ? (
        <div>
          <ContextMenuTrigger id={id + ''}>
            <div
              className={styles.horizontal}
              draggable
              onDragStart={field ? () => {} : this.onDragStart}
              onDragOver={field ? () => {} : this.onDragOver}
              onDragEnd={field ? () => {} : this.onDragEnd}
            >
              {folderTree[id].children.length > 0 ? (
                <IconButton
                  size="small"
                  onClick={() => this.setState({ collapsed: !collapsed })}
                >
                  {collapsed ? (
                    <KeyboardArrowRight fontSize="small" />
                  ) : (
                    <KeyboardArrowDown fontSize="small" />
                  )}
                </IconButton>
              ) : (
                <div style={{ width: 26 }} />
              )}
              {id !== 0 && (
                <img
                  src={require('../../../public/assets/folder/folder.svg')}
                  className={styles.folderIcon}
                  onClick={() => setFolderId(id)}
                  alt="folder-img"
                />
              )}
              <span
                className={
                  openFolder === id
                    ? styles.textSelected
                    : styles.textUnselected
                }
                onClick={() => setFolderId(id)}
              >
                {folderTree[id].name}
              </span>
            </div>
          </ContextMenuTrigger>
          <ContextMenu id={id + ''}>
            <MenuItem
              onClick={() => {
                folderTree[id].children.push(-1);
                this.setState({ collapsed: false });
              }}
              attributes={{className: styles.menuItem}}
            >
              Add a subfolder
            </MenuItem>
            {id !== 0 && (
              <MenuItem
                onClick={() => {
                  this.setState({ editing: true });
                }}
                attributes={{className: styles.menuItem}}
              >
                Rename folder
              </MenuItem>
            )}
            {id !== 0 &&
              !field && (
                <MenuItem
                  onClick={() => {
                    deleteFolder({ folderTree, id, products });
                    setFolderId(0);
                  }}
                  attributes={{className: styles.menuItem}}
                >
                  Delete Folder
                </MenuItem>
              )}
          </ContextMenu>
          {!this.state.collapsed && this.children &&
            this.children.map(child => (
              <div className={styles.folderList} key={child}>
                <FolderSystem
                  folderTree={folderTree}
                  id={child}
                  setFolderId={setFolderId}
                  openFolder={openFolder}
                  dragProps={dragProps}
                  dispatch={dispatch}
                  parentId={id}
                  deleteFolder={deleteFolder}
                  products={products}
                  field={field}
                  expanded={expanded}
                  expandId={expandId}
                  setExpandId={setExpandId}
                  handleClear={this.handleClear}
                />
              </div>
            ))}
            {(!this.state.collapsed || id === 0 || openFolder==id) && this.children.indexOf(-1) === -1 &&
              <div className={styles.folderList}>
                <div className={styles.horizontal}>
                  <IconButton
                    size="small"
                    style={{visibility: 'hidden'}}
                  >
                    <KeyboardArrowRight fontSize="small" />
                  </IconButton>
                  <img
                    src={require('../../../public/assets/folder/folder_add.svg')}
                    className={styles.addFolderIcon}
                    onClick={() => {
                      this.children.push(-1);
                      this.setState({ collapsed: false });
                    }}
                    alt="add-folder-img"
                  />
                  <span
                    className={styles.addFolder}
                    onClick={() => {
                      this.children.push(-1);
                      this.setState({ collapsed: false });
                    }}
                  >
                    Add Folder
                  </span>
                </div>
              </div>
            }
        </div>
      ) : null
    ) : null;
  }
}
