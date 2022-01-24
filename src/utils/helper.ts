import { BehaviorSubject, distinctUntilChanged, Subscription } from "rxjs";
import { isEqual } from "lodash-es";

export const safeUnsubscribe = (subs: Subscription[]) => {
  subs.forEach(sub => sub && sub.unsubscribe())
}

export const observe = (o: BehaviorSubject<any>, compareWith = isEqual) =>
  o.asObservable().pipe(
    distinctUntilChanged(compareWith)
  );

export const randomBetween = (min: number, max: number) => (max - min) * Math.random() + min
