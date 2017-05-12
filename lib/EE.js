

const EE = class EE {
  constructor () {
    this._destroyed = false;
    this._listeners = [];
  }

  destroy () {
    this._destroyed = true;
    this._listeners = [];
  }

  publish (...args) {
    if (this._destroyed) {
      return;
    }

    this._listeners.forEach((listener) => {
      listener(args);
    });
  }

  subscribe (listenerFunc) {
    let removed = false;
    let listener = (args) => {
      if (removed || this._destroyed) {
        return;
      }

      listenerFunc(...args);
    };

    this._listeners.push(listener);

    return () => {
      if (removed) {
        return;
      }

      removed = true;
      this._listeners = this._listeners.filter((_listener) => _listener !== listener);
      listener = null;
      listenerFunc = null;
    };
  }
};


export default EE;
