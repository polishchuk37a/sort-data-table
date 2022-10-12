import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Album} from "../interfaces/album";

@Injectable({
  providedIn: 'root'
})
export class PersonInfoService {

  constructor(private readonly http: HttpClient) { }

  getPersonAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>('https://jsonplaceholder.typicode.com/albums');
  }
}
