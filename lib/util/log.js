export const throwHiddenError = (message) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(message);
  } else {
    window.console && console.error && console.error(message); // eslint-disable-line no-console
  }
};
