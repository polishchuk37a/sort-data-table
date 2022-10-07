import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Person} from "../interfaces/person";

@Injectable({
  providedIn: 'root'
})
export class PersonInfoService {

  constructor(private readonly http: HttpClient) { }

  getPersonInfo(): Observable<Person[]> {
    return this.http.get<Person[]>('https://jsonplaceholder.typicode.com/users');
  }
}
