import { PropTypes } from 'react';


export const router = PropTypes.shape({
  getState: PropTypes.func.isRequired,
  moveTo: PropTypes.func.isRequired,
  calcLocation: PropTypes.func.isRequired,
  createHref: PropTypes.func.isRequired
});
