export default class FakeHistory {
  constructor () {
    this.location = {
      pathname: '',
      hash: '',
      search: ''
    };

    this.action = '';

    this._listeners = [];
  }

  listen (listener) {
    this._listeners = this._listeners.concat([ listener ]);

    return () => {
      this._listeners = this._listeners.filter((_listener) => _listener !== listener);
    };
  }

  _fire () {
    this._listeners.forEach((listener) => {
      listener(this.location, this.action);
    });
  }

  replace (location) {
    this.location = Object.assign({}, this.location, location);
    this.action = 'REPLACE';

    this._fire();
  }

  push (location) {
    this.location = Object.assign({}, this.location, location);
    this.action = 'PUSH';

    this._fire();
  }

  createHref (location) {
    return `${location.pathname}${location.search ? `?${location.search}` : ''}${location.hash ? `#${location.hash}` : ''}`;
  }
}
