

export default (location = {}) => ({
  location: Object.assign({ pathname: '', hash: '', search: '' }, location),
  push: () => {},
  replace: () => {},
  createHref: (location) => `${location.pathname}${location.search ? `?${location.search}` : ''}${location.hash ? `#${location.hash}` : ''}`,
  listen: () => () => {}
});
