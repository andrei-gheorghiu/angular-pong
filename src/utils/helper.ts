import { BehaviorSubject, distinctUntilChanged, Subscription } from "rxjs";
import { isEqual } from "lodash-es";

export const safeUnsubscribe = (subs: Subscription[]) => {
  subs.forEach(sub => sub && sub.unsubscribe())
}

export const reactive = (o: BehaviorSubject<any>, compareFn = isEqual) =>
  o.asObservable().pipe(
    distinctUntilChanged(compareFn)
  );

export const randomBetween = (min: number, max: number) => (max - min) * Math.random() + min
