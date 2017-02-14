

export default (location = {}) => ({
  location: {
    pathname: '',
    hash: '',
    search: '',
    ...location
  },
  push: () => {},
  replace: () => {},
  createHref (location) {
    return `${location.pathname}${location.search ? `?${location.search}` : ''}${location.hash ? `#${location.hash}` : ''}`;
  },
  listen: () => () => {}
});
