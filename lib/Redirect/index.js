/* eslint-env browser */

import React from 'react';
import Redirect from './Redirect';



export const redirectRender = (state, params = {}) => () => (<Redirect state={state} params={params} />); // eslint-disable-line



export default Redirect;
