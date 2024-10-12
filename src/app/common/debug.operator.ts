import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum rxjsLoggingLevels {
  Trace,
  Debug,
  Info,
  Error,
}

let loggingLevel = rxjsLoggingLevels.Trace;

export function setLoggingLevel(level) {
  loggingLevel = level;
}

export const debug =
  (level: number, message: string) => (source: Observable<any>) =>
    source.pipe(
      tap((value) => {
        if (level <= loggingLevel) {
          console.log(message, value);
        }
      })
    );
