import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserInfoType} from "../../../types/user-info.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserInfo(): Observable<UserInfoType> {
    return this.http.get<UserInfoType>(environment.api + 'users');
  }

}
