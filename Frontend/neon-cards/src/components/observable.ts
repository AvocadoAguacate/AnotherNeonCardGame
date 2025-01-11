type Listener<T> = (value: T) => void;

export class MySubject<T> {
  private listeners: Listener<T>[] = [];
  private currentValue: T;

  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  get value(): T {
    return this.currentValue;
  }

  subscribe(listener: Listener<T>): void {
    this.listeners.push(listener);
    listener(this.currentValue);
  }

  next(value: T): void {
    this.currentValue = value;
    this.listeners.forEach(listener => listener(value));
  }
}
