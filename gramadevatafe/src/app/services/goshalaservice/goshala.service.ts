import { Injectable } from '@angular/core';
import { URL } from '../../constants';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoshalaService {

  constructor(private httpclient:HttpClient) { }

  getGoshalaCatgeories():Observable<any>{
    return this.httpclient.get(URL+"goshalacategories")
  }

  getbynameGoshalaCategories(name:string):Observable<any>{
    return this.httpclient.get(URL+"goshalacategories?name="+name)
  }

  getByGoshalaCatgeories(id:string):Observable<any>{
    return this.httpclient.get(URL+"goshalacategories/"+id)
  }

  getgoshalas(id:string):Observable<any>{
    return this.httpclient.get(URL+"goshala?category="+id)
  }

  addgoshala(GoshalaData:any):Observable<any>{
    return this.httpclient.post(URL+"goshala",GoshalaData)
  }

  getgoshalamain():Observable<any>{
    return this.httpclient.get(URL+"goshalamain")
  }

  getindiagoshalas():Observable<any>{
    return this.httpclient.get(URL+"indiagoshalas")
  }


  getStateGoshalas(id:string):Observable<any>{
    return this.httpclient.get(URL+"goshalas/state_id/"+id)
  }

  getDistrictGoshalas(id:string):Observable<any>{
    return this.httpclient.get(URL+"goshalas/district_id/"+id)
  }

  getBlocksGoshals(id:string):Observable<any>{
    return this.httpclient.get(URL+"goshalas/block_id/"+id)
  }

  getGlobalGoshalas():Observable<any>{
    return this.httpclient.get(URL+"globalgoshala")
  }


  getCountryGoshalas(_id:string):Observable<any>{
    return this.httpclient.get(URL+'goshala?object_id='+_id)
  }

  getbyGoshala(_id:string):Observable<any>{
    return this.httpclient.get(URL+'goshala?_id='+_id)
  }


  filterGoshalas(categoryId: string, locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}locationByGoshalas/`, {
      params: {
        category: categoryId,
        input_value: locationId,
        page: page.toString()
      }
    });
  }

  GetallGoshalas():Observable<any>{
    return this.httpclient.get(URL+"goshala")
  }



  addvectinaryhospital(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"veterinary_hospital", templeData);
  }
    updatevectinaryhospital(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'veterinary_hospital/' + id, data);
}


    filterWelfarehome(categoryId: string, locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}welfare-homes_by-location`, {
      params: {
        category: categoryId,
        
        input_value: locationId,
        // search: search,
        page: page.toString()
      }
    });
  }


      getallWlfarehomes():Observable<any>{
    return this.httpclient.get(URL+"welfare_home")
  }


    getwelfarehomeCategorybyId(_id:string):Observable<any>{
    return this.httpclient.get(URL+'welfare_homes_category/'+_id)
  }

    getwelfarehomeCategory():Observable<any>{
    return this.httpclient.get(URL+"welfare_homes_category")
  }

      getwelfarehomebyId(_id:string):Observable<any>{
    return this.httpclient.get(URL+'welfare_home/'+_id)
  }
  adWelfarehome(GoshalaData:any):Observable<any>{
    return this.httpclient.post(URL+"welfare_home",GoshalaData)
  }


    updateWelfarehome(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'welfare_home/' + id, data);
}


  Goshalaaddmoredetails(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"add_more_goshala_details", templeData);
  }


}
