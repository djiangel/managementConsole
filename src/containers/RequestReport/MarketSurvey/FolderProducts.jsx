import React from 'react';
import { useState } from 'react';
import styles from '../RequestReport.module.css';
import { LinearProgress, IconButton, Grid } from '../../../material/index';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import Tag from '../../../components/FormInputTag/Tag';
import { useQuery } from 'react-apollo-hooks';
import ProductNamesByFolderQuery from '../../../graphql/queries/ProductNamesByFolderQuery';

export default function FolderProducts({
  folder,
  folderName,
  removeFolder,
  displayMode,
  folderProducts,
  change
}) {
  const [open, setOpen] = useState(true);

  const { data, loading } = useQuery(ProductNamesByFolderQuery, {
    variables: {
      folderId: folder
    }
  });

  if (!loading && data && !folderProducts[folder]) {
    change('folderProducts', {
      [folder]: data.allProducts.nodes,
      ...folderProducts
    });
  }

  const toggleOpen = () => setOpen(!open);

  return (
    <div className={styles.competitiveSetTable}>
      <table>
        <tbody>
          <tr>
            <td>
              <div className={styles.folderProductTitleRow}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={10}>
                    <img
                      src={require('../../../../public/assets/folder/folder.svg')}
                      style={{ height: 15, marginRight: 9 }}
                      alt="folder-img"
                    />
                    {folderName}
                  </Grid>
                  <Grid item xs={1}>
                    {!displayMode && (
                      <IconButton onClick={removeFolder}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={toggleOpen}>
                      {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            </td>
          </tr>
          {open && (
            <tr>
              <td>
                {loading && <LinearProgress />}
                <div className={styles.tag}>
                  {folderProducts[folder] &&
                    folderProducts[folder].map(product => (
                      <div key={product.id}>
                        <Tag
                          label={product.name}
                          onDelete={() => {
                            const currFolderRemoved = folderProducts[
                              folder
                            ].filter(
                              storedProd => storedProd.id !== product.id
                            );
                            change('folderProducts', {
                              ...folderProducts,
                              [folder]: currFolderRemoved
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
