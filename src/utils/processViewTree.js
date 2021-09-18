export function processViewTree(viewTree) {
  return viewTree.map(viewItem => {
    return viewItem.children && viewItem.children.length ? {
      ...viewItem,
      label: viewItem.name,
      children: processViewTree(viewItem.children)
    } : {
      ...viewItem,
      label: viewItem.name
    }
  })
}
