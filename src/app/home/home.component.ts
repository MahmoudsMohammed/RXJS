import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retry,
  retryWhen,
  shareReplay,
  take,
  tap,
} from "rxjs/operators";
import { createHttpRequest } from "../create.request";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  http$: Observable<Course[]> = createHttpRequest("/api/courses").pipe(
    map((data) => {
      return data["payload"];
    }),
    tap(() => console.log("Three")),
    catchError((e) => {
      // console.log("from catch", e);
      if (e.status === 500) {
        // console.log("the logic to handle status 500");
      }
      return throwError(() => e);
    }),
    retryWhen((e) => {
      return e.pipe(delay(4000), take(3));
    }),
    finalize(() => console.log("Before")),
    shareReplay()
  );

  Beginner$: Observable<Course[]> = this.http$.pipe(
    map((data) => data.filter((e) => e.category === "BEGINNER"))
  );
  ADVANCED$: Observable<Course[]> = this.http$.pipe(
    map((data) => data.filter((e) => e.category === "ADVANCED"))
  );

  ngOnInit() {}
}
