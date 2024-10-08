import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  take,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval, of } from "rxjs";
import { Lesson } from "../model/lesson";
import { fromPromise } from "rxjs/internal-compatibility";
import { createHttpRequest } from "../create.request";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<any>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params["id"];
    this.course$ = createHttpRequest(`/api/courses/${courseId}`);
    const initialLessons$ = createHttpRequest(
      `/api/lessons?courseId=${courseId}&pageSize=100`
    ).pipe(map((data) => data["payload"]));

    const filterLessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
      debounceTime(400),
      map((e: Event) => e.target["value"]),
      distinctUntilChanged(),
      switchMap((data) =>
        createHttpRequest(
          `/api/lessons?courseId=${courseId}&pageSize=100&filter=${data}`
        )
      ),
      map((data) => data["payload"])
    );

    this.lessons$ = concat(initialLessons$, filterLessons$);
  }

  ngAfterViewInit() {}
}
