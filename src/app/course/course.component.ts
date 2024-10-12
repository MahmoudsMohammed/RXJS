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
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import { fromEvent, Observable, concat } from "rxjs";
import { createHttpRequest } from "../create.request";
import { HttpClient } from "@angular/common/http";
import {
  debug,
  rxjsLoggingLevels,
  setLoggingLevel,
} from "../common/debug.operator";

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
    this.course$ = createHttpRequest(`/api/courses/${courseId}`).pipe(
      debug(rxjsLoggingLevels.Trace, "Course")
    );

    setLoggingLevel(rxjsLoggingLevels.Info);

    this.lessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
      debounceTime(400),
      map((e: Event) => e.target["value"]),
      startWith(""),
      debug(rxjsLoggingLevels.Debug, "Search"),
      distinctUntilChanged(),
      switchMap((data) =>
        createHttpRequest(
          `/api/lessons?courseId=${courseId}&pageSize=100&filter=${data}`
        )
      ),
      debug(rxjsLoggingLevels.Debug, "Lesson"),
      map((data) => data["payload"])
    );
  }

  ngAfterViewInit() {}
}
