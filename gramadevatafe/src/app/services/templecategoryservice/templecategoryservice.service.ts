import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TemplecategoryserviceService {
  URL = ''

  constructor(private httpclient:HttpClient) { }
  GetallCategories():Observable<any>{
   
    return this.httpclient.get(URL+"templeCategeory")
  }

  GetMainByCategories(id: any): Observable<any> {
    console.log("2113435466")
    const url = `${URL}templeCategeory?main_category=${id}`;
    return this.httpclient.get(url);
  }
  

  getpriority():Observable<any>{
    return this.httpclient.get(URL+"templepriority")
  }
  
}
