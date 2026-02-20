import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../constants';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TempleserviceService {

  Url=""

  constructor(private httpclient:HttpClient) { }

  
  GetTemplesbyCategory(_id: string): Observable<any> {
    return this.httpclient.get(URL+"templeget/category/" + _id);
  }


  getTempleMain():Observable<any>{
        return this.httpclient.get(URL+"templemain")
      }

  getbytemple(_id:string):Observable<any>{
    return this.httpclient.get(URL+"templeget/_id/"+ _id)
  }



  GetAllCountries():Observable<any>{
    return this.httpclient.get(URL+"country")
  }


  getbyindiatemplesall(page = 1): Observable<any> {
    let params = new HttpParams();
    params = params.set('page', page.toString()); // Convert page to string
    return this.httpclient.get(URL + "indiatemples", { params });
  }


  getglobalTemples(page = 1):Observable<any> {
    let params = new HttpParams();
    params =params.set('page',page.toString());
    return this.httpclient.get(URL+"globaltemples",{ params });
  }

  getbycountrytemples(_id:string):Observable<any>{
    return this.httpclient.get(URL+'templeget/object_id/'+_id)
  }

  getStates():Observable<any> {
    return this.httpclient.get(URL+"state")
  }
  getbyStates(_id:string):Observable<any> {
    return this.httpclient.get(URL+"state?country="+_id)
  }

  getStatetemples(id:string):Observable<any>{
    return this.httpclient.get(URL+"temples/state_id/"+id)
  }

  getdistricts(_id:string):Observable<any>{
    return this.httpclient.get(URL+"district?state="+_id)
  }

  getDistrictsTemples(_id:string):Observable<any>{
    return this.httpclient.get(URL+"temples/district_id/"+_id)
  }

  getblocks(_id:string):Observable<any>{
    return this.httpclient.get(URL+"block?district_id="+_id)
  }

  getBlockTemples(_id:string):Observable<any>{
    return this.httpclient.get(URL+"temples/block_id/"+_id)
  }
  getvillages(_id:string):Observable<any>{
    return this.httpclient.get(URL+"village?block="+_id)
  }

  addTemple(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"temple", templeData);
  }

  getTempleCategorybyId(_id:string):Observable<any>{
    return this.httpclient.get(URL+'templeCategeory?_id='+_id)
  }


  getStatesbyCategoeyTemples(_id:string):Observable<any>{
    return this.httpclient.get(URL+'?object_id__block__district__state_id='+_id)
  }

  // filtertemples(categoryId:string,locationID:string):Observable<any>{
  //   return this.httpclient.get(URL+'locationByTemples/?category='+categoryId+'&input_value='+locationID)
  // }

  filtertemples(categoryId: string, locationId: string,search: string = '', page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}locationByTemples/`, {
      params: {
        category: categoryId,
        
        input_value: locationId,
        search: search,
        page: page.toString()
      }
    });
  }

  gettemplecategorybyname(id:string):Observable<any>{
    return this.httpclient.get(URL+"templeCategeory?name="+id)
  }


  getalltemples():Observable<any>{
    return this.httpclient.get(URL+"temple")
  }

    getalltourism():Observable<any>{
    return this.httpclient.get(URL+"tourism")
  }


      getallvillages():Observable<any>{
    return this.httpclient.get(URL+"village")
  }

  GetVillageByTemples(_id:any):Observable<any>{
    return this.httpclient.get(URL+"templeget/object_id/"+_id)
  }

  filteryourtemples(locationId: string): Observable<any> {
    return this.httpclient.get(`${URL}locationByTemples/`, {
      params: {
        
        input_value: locationId,
        
      }
    });
  }
  
  getmaincategorytemple():Observable<any>{
    return this.httpclient.get(URL+"temple_main_category")
  }

  getTempleCategoryByMain(mainCategoryId: string) {
    return this.httpclient.get<any[]>(`templeCategeory?main_category=${mainCategoryId}`);
  }



  addTempleMedia(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"media", templeData);
  }

  templeaddmoredetails(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"add_more_temple_details", templeData);
  }


  // Getbytemplemedia(_id:any):Observable<any>{
  //   return this.httpclient.get(URL+"add_more_temple_details/"+_id)
  // }
  GetByTempleMedia(temple_id: string): Observable<any> {
    return this.httpclient.get(URL + "add_more_temple_details", {
      params: { temple_id: temple_id }
    });
  }




  addTempletourismplaces(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"tourism", templeData);
  }
  updateTempletourismplaces(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'tourism/' + id, data);
}
  addnearbyhotels(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"temple-nearby-hotels", templeData);
  }


  addtouroperatordetails(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"tour-operators", templeData);
  }


  addttourguide(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"tour_guides", templeData);
  }



  addnearbyhospital(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"nearby_hospitals", templeData);
  }


  addrestaurants(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"restaurants", templeData);
  }

    addpoojastore(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"pooja_stores", templeData);
  }


  
  addnearestbloodbanks(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"blood_bank", templeData);
  }

    addpolicestation(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"police_station", templeData);
  }
    addfirestation(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"fire_station", templeData);
  }
    
  addambulaceservices(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"ambulance_facility", templeData);
  }


  districtfiltertemples(locationId: string): Observable<any> {
    return this.httpclient.get(`${URL}citytemples_bylocation`, {
      params: {
        
        input_value: locationId,
        
      }
    });
  }



  mandalfiltertemples(locationId: string): Observable<any> {
    return this.httpclient.get(`${URL}towntemples_bylocation`, {
      params: {
        
        input_value: locationId,
        
      }
    });
  }


    statewisefiltertemples(locationId: string): Observable<any> {
    return this.httpclient.get(`${URL}statetemples_bylocation`, {
      params: {
        
        input_value: locationId,
        
      }
    });
  }

  addvisitedtemples(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"visit_temples", templeData);
  }

  addtemplefavorite(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"favorite-temples", templeData);
  }


  removeTempleFavorite(_id:any):Observable<any>{
    return this.httpclient.delete(URL+"visit_temples/"+_id)
  }

  getUserFavorites(_id:any):Observable<any>{
    return this.httpclient.get(URL+"favorite-temples/"+_id)
  }
 
  addToFavorites(templeId: string, userId: string) {
    const url = 'https://gramadevata-api.in/gramadevata/favorite-temples';
    const body = {
      temple_id: templeId,
      user_id: userId
    };
  
    return this.httpclient.post(url, body);
  }


  // addrestaurants(templeData: any): Observable<any> {
  //   return this.httpclient.post(URL+"restaurants", templeData);
  // }
gettourismbylocation(_id:string):Observable<any>{
    return this.httpclient.get(URL+"tourism/"+ _id)
  }


  tourisms( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}tourism_bylocation`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }

  Village( locationId: string,search: string = '', page: number = 1,pageSize: number = 50): Observable<any> {
    return this.httpclient.get(`${URL}villages_by_location`, {
      params: {
       
        input_value: locationId,
         search: search,
        page: page.toString(),
        pageSize: pageSize.toString()

      }
    });
  }




    addgeographic(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village_geographic", templeData);
  }


      villagedevelopementecnomicprofile(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-development-facilities", templeData);
  }


  
      villageculturalprofile(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-cultural-profile", templeData);
  }

        villageartists(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-artists", templeData);
  }

          villagefamouspersons(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-famous-personalities", templeData);
  }



      addschoolinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village_school", templeData);
  }

        addcollegeinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-college", templeData);
  }

    addbankinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-bank", templeData);
  }

     addmarketinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-market", templeData);
  }

       addpostofficeinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-postoffice", templeData);
  }

     addsportsgroundinfo(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"village-sportsground", templeData);
  }



    filterWelfarehome(categoryId: string, locationId: string,search: string = '', page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}welfare-homes_by-location`, {
      params: {
        category: categoryId,
        
        input_value: locationId,
        search: search,
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



    templeshare(_id:any):Observable<any>{
    return this.httpclient.get(URL+"share/temple/"+_id)
  }






  Restaurants( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}restaurants_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }


    getallrestaurants():Observable<any>{
    return this.httpclient.get(URL+"restaurants")
  }

    vertinaryhospitals( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}veterinary_hospitals_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }
    getallvertinaryhospitals():Observable<any>{
    return this.httpclient.get(URL+"veterinary_hospital")
  }

    poojastores( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}pooja_stores_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }
    getallpoojastores():Observable<any>{
    return this.httpclient.get(URL+"pooja_stores")
  }

    hotels( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}hotels_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }
    getallhotels():Observable<any>{
    return this.httpclient.get(URL+"temple-nearby-hotels")
  }

      Hospital( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}hospitals_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }
    getallhospitals():Observable<any>{
    return this.httpclient.get(URL+"nearby_hospitals")
  }
      Bloodbanks( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}blood_banks_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }
    getallbloodbanks():Observable<any>{
    return this.httpclient.get(URL+"blood_bank")
  }


      gethospitalbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'nearby_hospitals/'+_id)
  }


      getpoojastorebyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'pooja_stores/'+_id)
  }


      getbloodbankbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'blood_bank/'+_id)
  }


      getvertinaryhospitalsbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'veterinary_hospital/'+_id)
  }

      gethotelbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'temple-nearby-hotels/'+_id)
  }

        getrestaurantsbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'restaurants/'+_id)
  }

    gettouroperatorbyid(_id:string):Observable<any>{
    return this.httpclient.get(URL+'tour-operators/'+_id)
  }

    updatehospital(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'nearby_hospitals/' + id, data);
}

    updatehotel(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'temple-nearby-hotels/' + id, data);
}

    updaterestaurants(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'restaurants/' + id, data);
}

    updatepooja(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'pooja_stores/' + id, data);
}

    updatebloodbank(id: string, data: any): Observable<any> {
  return this.httpclient.put(URL + 'blood_bank/' + id, data);
}


  touroperator( locationId: string, page: number = 1): Observable<any> {
    return this.httpclient.get(`${URL}tour-operators_by_location`, {
      params: {
       
        input_value: locationId,
        page: page.toString()
      }
    });
  }

    getalltouroperators():Observable<any>{
    return this.httpclient.get(URL+"tour-operators")
  }

  eventaddmoredetails(templeData: any): Observable<any> {
    return this.httpclient.post(URL+"add_more_event_details", templeData);
  }

}




