import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PersonInfo} from "../interfaces/person-info";

@Injectable({
  providedIn: 'root'
})
export class PersonInfoService {

  constructor(private readonly http: HttpClient) { }

  getPersonInfo(): Observable<PersonInfo[]> {
    return this.http.get<PersonInfo[]>('https://jsonplaceholder.typicode.com/users');
  }
}
