export const getDataType = (arg) => {
    if (arg === null ) {
      return 'Null'
    }
    if (arg === undefined) {
      return 'Undefined'
    }
    return arg.constructor && arg.constructor.name || 'Object'
}
export const getUrlParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};