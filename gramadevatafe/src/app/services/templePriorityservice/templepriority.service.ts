import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TemplepriorityService {

  URL=""

  constructor(private httpclient:HttpClient) { }

  getpriority():Observable<any>{
    return this.httpclient.get(URL+"templepriority")
  }
}
