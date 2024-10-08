import { Observable } from "rxjs";

export function createHttpRequest(url) {
  return Observable.create((observer) => {
    const controller = new AbortController(),
      signal = controller.signal;
    fetch(url, { signal })
      .then((res) => res.json())
      .then((data) => {
        observer.next(data);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });
    return () => controller.abort(); // this is teardown function will return and invocate when unsubscribe to clean up resources
  });
}
