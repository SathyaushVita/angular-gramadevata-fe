import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MemberService {

  villageid: any;

  constructor(private  httpclient:HttpClient) { }







  AddMember(memberData: any, userId: any): Observable<any> {
    const url = `${URL}profile/`+userId;
    const data = { ...memberData,  };
  
    return this.httpclient.put(url, data);
  }

  AddFamilyImages(memberData: any, userId: any): Observable<any> {
    const url = `${URL}profileimages/`+userId;
    const data = { ...memberData,  };
  
    return this.httpclient.put(url, data);
  }

  connect(connectdata:any): Observable<any> {
    console.log(connectdata,"service connect")
    this.villageid = connectdata.village
    console.log(this.villageid,"this.villageid")
    // this.VillagetemplesComponent.fetchvillages(this.villageid)
    return this.httpclient.post(URL+"connect",connectdata)
    
  }


  DisconnectMember(id:string): Observable<any> {
    return this.httpclient.delete(URL+"connect/"+id)
  }



  
}
