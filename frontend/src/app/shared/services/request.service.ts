// request.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({providedIn: 'root'})
export class RequestService {
  constructor(private http: HttpClient) {
  }

  // Принимаем объект с данными заявки
  postRequest(data: {
    name: string,
    phone: string,
    service: string,
    type: string
  }): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data);
  }
}
