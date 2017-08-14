import PropTypes from 'prop-types';
import RouterContext from './RouterContext';
import Route from './Route';



export const router = PropTypes.instanceOf(RouterContext);

export const routes = PropTypes.objectOf(PropTypes.instanceOf(Route).isRequired);
