/*eslint-env jest, browser*/

import Route from '../Route';

describe('Route', () => {
  it('should parse location', () => {
    const route = new Route('some.state', { url: '/hello/:id?hello' });

    const result = route.parseLocationParams({ pathname: '/hello/123', search: 'hello=123', hash: '' });

    expect(result).toMatchSnapshot();
  });

  it('should calc new location', () => {
    const route = new Route('some.state', { url: '/hello/:id?hello', params: { hello: 123, _some: 123 } });

    const result = route.calcLocation({ id: 123 });

    expect(result).toMatchSnapshot();
  });
});
