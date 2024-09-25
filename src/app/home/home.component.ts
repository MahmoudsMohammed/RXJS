import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { finalize, map, shareReplay } from "rxjs/operators";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  http$: Observable<Course[]> = Observable.create((sub) => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        sub.next(data);
        sub.complete();
      })
      .catch((err) => sub.error(err));
  }).pipe(
    map((data) => {
      return data["payload"];
    }),
    finalize(() => console.log("the request finish")),
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
