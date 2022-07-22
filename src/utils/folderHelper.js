import i18next from 'i18next';

export const foldersToTree = folders => {
  if (folders) {
    let foldersById = folders.nodes.reduce((a, c) => {
      a[c.id] = c;
      return a;
    }, {});
    folders.nodes.map(e => {
      e.children = [];
      e.products = [];
    });
    foldersById[0] = {
      name: i18next.t('product.allProducts'),
      id: 0,
      children: [],
      products: []
    };
    folders.nodes.map(e => addFolderToTree(foldersById, e.id));
    return foldersById;
  }
  return {
    [0]: {
      name: i18next.t('product.allProducts'),
      id: 0,
      children: [],
      products: []
    }
  };
};

export const addFolderToTree = (foldersById, id) => {
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

export const addProductToFolder = (folderById, product, folderId) => {
  let node = folderById[folderId];
  node.products.push(product);
  if (!folderId === 0) {
    addProductToFolder(folderById, product, node.parentId);
  }
};
