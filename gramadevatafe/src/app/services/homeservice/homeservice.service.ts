import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class HomeserviceService {
  URL = ''
  

  constructor(private httpclient:HttpClient) { }
  
  getHomeData(): Observable<any> {
     
    return this.httpclient.get(URL+"home")
  }


 
  
}

