import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class VillageService {

  constructor(private httpclient:HttpClient) { }

  getbyvillage(_id:string):Observable<any>{
    return this.httpclient.get(URL+"village/"+_id)
  }

  addvillage(villagedata:any):Observable<any>{
    return this.httpclient.post(URL+"village",villagedata)
  }


  villageaddmoredetails(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"add_more_village_details", templeData);
  }
}
