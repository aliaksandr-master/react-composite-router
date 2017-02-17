/* eslint-env browser, jest */

import FakeHistory from '../FakeHistory';


describe('FakeHistory', () => {

  it('should run listeners queue', () => {
    const history = new FakeHistory();

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    history.listen(listener1);

    history.push({ pathname: '', hash: '', search: '' });

    const destroy = history.listen(listener2);

    destroy();

    history.replace({ pathname: '', hash: '', search: '' });

    expect(listener1).toBeCalled();
    expect(listener2).not.toBeCalled();
  });

  it('calc href', () => {
    const history = new FakeHistory();

    expect(history.createHref({ pathname: '/', hash: 'some-hash', search: 'some=search' })).toMatchSnapshot();
    expect(history.createHref({ pathname: '/', hash: 'some-hash', search: '' })).toMatchSnapshot();
  });
});
