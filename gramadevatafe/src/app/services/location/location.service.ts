import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  URL=""

  constructor(private httpclient:HttpClient) { }

  GetAllCountries():Observable<any>{
    return this.httpclient.get(URL+"country")
  }

  getAllStates():Observable<any>{
    return this.httpclient.get(URL+"state")
  }


  getbyStates(_id:string):Observable<any> {
    return this.httpclient.get(URL+"state?country="+_id)
  }

  getNameByStates(name:string):Observable<any>{
    return this.httpclient.get(URL+"state?name="+name)
  }

  getdistricts(_id:string):Observable<any>{
    return this.httpclient.get(URL+"district?state="+_id)
  }

  getblocks(_id:string):Observable<any>{
    return this.httpclient.get(URL+"block?district_id="+_id)
  }

  getvillages(_id:string):Observable<any>{
    return this.httpclient.get(URL+"village?block="+_id)
  }


  getNameByCountry(name:string):Observable<any>{
    return this.httpclient.get(URL+"country?name="+name)
  }

  
  getIdByCountry(id:string):Observable<any>{
    return this.httpclient.get(URL+"country?_id="+id)
  }

  getDistrictDetails(_id:string):Observable<any>{
    return this.httpclient.get(URL+"district/"+_id)
  }


  getMandalDetails(_id:string):Observable<any>{
    return this.httpclient.get(URL+"block/"+_id)
  }

    getstateDetails(_id:string):Observable<any>{
    return this.httpclient.get(URL+"state/"+_id)
  }



countrygoshala(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}


countryevents(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}


countrytemples(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType,
        
      }
    }
  );
}

countrytourism(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}

countrywelfare(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countryveterinary(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countryhospital(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countryhotel(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countryrestaurant(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countrytour_operator(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}
countrypooja_store(pageType: string): Observable<any> {
  return this.httpclient.get(
    `${URL}country`,
    {
      params: {
        page_type: pageType
      }
    }
  );
}

}
