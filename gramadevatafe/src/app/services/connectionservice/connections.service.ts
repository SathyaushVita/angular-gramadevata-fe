import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

  constructor(private httpclient:HttpClient) { }


  GetConnnections(_id:any):Observable<any>{
    return this.httpclient.get(URL+'connect?user='+_id)
  }
}
