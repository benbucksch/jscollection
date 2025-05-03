export class Observable {
  _observers = [];
  _properties = {};
  subscribe(observer) {
    this.callObserver(observer, null, null);
    this._observers.push(observer);
    let unsubscribe = () => {
      arrayRemove(this._observers, observer);
    }
    return unsubscribe;
  }
  notifyObservers(propertyName, oldValue) {
    for (let observer of this._observers) {
      this.callObserver(observer, propertyName, oldValue);
    }
  }
  callObserver(observer, propertyName, oldValue) {
    try {
      observer(this, propertyName, oldValue);
    } catch (ex) {
      console.error(ex);
    }
  }
}

/** Decorator for getters/setters.
 * Lets changes call `notifyObservers()`.
 * Setting the already current value is a no-op.
 */
export function notifyChangedAccessor(obj, propertyName, descriptor) {
  let original = descriptor.set;
  descriptor.set = (_obj, val) => {
    let oldValue = obj[propertyName];
    if (oldValue === val) {
      return;
    }
    original.call(obj, val);
    obj.notifyObservers(propertyName, oldValue);
  }
}

function arrayRemove(array, item) {
  let pos = array.indexOf(item);
  if (pos > -1) {
    array.splice(pos, 1);
  }
}
