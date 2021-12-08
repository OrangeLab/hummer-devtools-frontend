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
/**
 * 添加或者修改url参数
 * @param url 需要添加的url
 * @param key 参数的key
 * @param value 参数的value
 */
 export const updateQueryStringParameter = (url, key, value) => {
	if(!value) {
		return url;
	}
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = url.indexOf('?') !== -1 ? "&" : "?";
	if (url.match(re)) {
		return url.replace(re, '$1' + key + "=" + value + '$2');
	}
	else {
		return url + separator + key + "=" + value;
	}
}