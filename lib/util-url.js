import URIjs from 'urijs';



export const parseSearchString = (string) =>
  URIjs.parseQuery(string);



export const calcSearchString = (params) =>
  URIjs.buildQuery(params, true);
