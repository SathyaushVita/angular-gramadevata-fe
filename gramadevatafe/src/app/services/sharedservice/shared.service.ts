


// import { Injectable } from '@angular/core';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class SharedService {
//   private triggerFetchTempleData = new Subject<void>();
//   private triggerFetchVillageData = new Subject<void>(); // Added Subject for village data
//   private triggerFetchByTempleData = new Subject<void>();

//   triggerFetchTempleData$ = this.triggerFetchTempleData.asObservable();
//   triggerFetchVillageData$ = this.triggerFetchVillageData.asObservable(); // Added observable for village data
//   triggerFetchByTempleData = this.triggerFetchByTempleData.asObservable();

//   fetchTempleData() {
//     this.triggerFetchTempleData.next();
//   }

//   fetchVillagedata() {
//     this.triggerFetchVillageData.next(); // Corrected method call to use the correct Subject
//   }
//   fetchByTempledata() {
//     this.triggerFetchByTempleData.next(); // Corrected method call to use the correct Subject
//   }
// }


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private triggerFetchTempleData = new Subject<void>();
  private triggerFetchVillageData = new Subject<void>();
  private triggerFetchByTempleData = new Subject<void>();
  private triggerFetchprofileData = new Subject<void>();

  triggerFetchTempleData$ = this.triggerFetchTempleData.asObservable();
  triggerFetchVillageData$ = this.triggerFetchVillageData.asObservable();
  triggerFetchByTempleData$ = this.triggerFetchByTempleData.asObservable();
  triggerFetchprofileData$ = this.triggerFetchprofileData.asObservable(); 

  fetchTempleData() {
    this.triggerFetchTempleData.next();
  }

  fetchVillagedata() { // Updated to camelCase for consistency
    this.triggerFetchVillageData.next();
  }

  fetchByTempleData() { // Added method to trigger fetchByTempleData
    this.triggerFetchByTempleData.next();
  }

  fetchByProfiledata() { // Added method to trigger fetchByTempleData
    this.triggerFetchprofileData.next();
  }
}

