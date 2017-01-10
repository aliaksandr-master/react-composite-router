import { PropTypes } from 'react';



export default () =>
  PropTypes.shape({ // instance of history.js
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string
    }).isRequired,
    createHref: PropTypes.func.isRequired,
    listen: PropTypes.func.isRequired
  }).isRequired;
