
import { Component, } from '@angular/core';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { CommonModule } from '@angular/common';
import {  ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { MatDialog } from '@angular/material/dialog';
import { PujariComponent } from '../pujari/pujari.component';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { MemberService } from '../../services/memberservice/member.service';
import { UserService } from '../../services/userservice/user.service';
import { LocationService } from '../../services/location/location.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { VillageService } from '../../services/villageservice/village.service';
import { SharedService } from '../../services/sharedservice/shared.service';
import { Subscription } from 'rxjs';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';



@Component({
  selector: 'app-temples',
  standalone: true,
  imports: [CommonModule,NzSelectModule,NzFormModule,ReactiveFormsModule,AddSpaceComponent,AddSpace1Component],
  templateUrl: './temples.component.html',
  styleUrls: ['./temples.component.css']
})
export class TemplesComponent {
  private subscription: Subscription = new Subscription();
  templedata: any;
  villageId: any;
  ConnectForm!:FormGroup;
  templeId:any;
  connectionsdata: any;
  isConnected= false;
  StateOptions:any[]=[];
  DistrictOptions:any[]=[];
  MandalOptions:any[]=[];
  VillageOptions:any[]=[];
  CountryOptions: any[]=[];
  validatorForm!:FormGroup;
  selectedLocationId: any;
  villagedata: any;
  isMemberIn = false;
  isPujariIn = false;
  connectedId:any;



  constructor(
      private templeservice:TempleserviceService,
      private route:ActivatedRoute,
      private fb:FormBuilder,
      private dialog: MatDialog,
      private authenticationService:AuthenticationService,
      private memberservice:MemberService,
      protected userservice:UserService,
      private router:Router,
      private locationservice:LocationService,
      private villageservice:VillageService,
      private sharedService: SharedService


    ){}

  ngOnInit():void{

    this.subscription.add(
      this.sharedService.triggerFetchTempleData$.subscribe(() => {
        this.fecthtempledata();
      })
    );

    this.connectionsForm();
    this.fecthtempledata();
    this.loadlocations();
    this.isMemberUser();
    this.isPujariUser();

    this.selectedLocationId = this.route.snapshot.paramMap.get('id');
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }



  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
  if (isMemberIn) {
    this.isMemberIn = true
  } else {
    this.isMemberIn = false
  } 
}

isPujariUser() {
  const isPujariIn = localStorage.getItem("type") === "PUJARI";
  console.log(isPujariIn,"isPujariIn")
if (isPujariIn) {
  this.isPujariIn = true
} else {
  this.isPujariIn = false
} 
}

  applyFilters() {
    this.templedata = [];
    this.fecthtempledata();
    
  }


  
  

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = null;
    // this.selectedCategoryId = null;
    this.applyFilters();
    
  }


  fecthtempledata(): void {
    
    let userId = this.authenticationService.getCurrentUser();
    this.villageId = this.route.snapshot.paramMap.get("id");
    
    
    this.templeservice.filteryourtemples(this.villageId).subscribe(
      (data: any) => { 
        console.log(data, "full data response");
    
       
        this.templedata = [];
        this.connectionsdata = []; 
    
        
        if (data.results && Array.isArray(data.results)) {
          
          data.results.forEach((record:any) => {
            
            if (record.Connections && Array.isArray(record.Connections)) {
              
              this.connectionsdata = this.connectionsdata.concat(record.Connections);
              
              
              const isUserConnected = record.Connections.some(
                (conn: any) => conn.user && conn.user._id === userId
              );
  
              this.connectedId = isUserConnected
              
              record.isConnected = isUserConnected;
            } else {
              
              record.isConnected = false;
            }
          });
  
          
          this.templedata = data.results;
          this.villageservice.getbyvillage(this.villageId).subscribe(
            data =>{
              this.villagedata = data
            }
          )
        } else {
          console.warn("No temple data found or incorrect format", data);
        }
  
        
        console.log(this.connectionsdata, "extracted connections");
      },
      (error) => {
       
        console.error("Error fetching temple data", error);
      }
    );
  }



  disconnect(){
    this.memberservice.DisconnectMember(this.connectedId).subscribe(
      data =>{
        console.log('deleted succesfully')
        this.fecthtempledata()
      }
    )
  }
  
  

  connectionsForm(): void {
    this.ConnectForm = this.fb.group(
      {
      // connected_as:"PUJARI",
      temple: this.route.snapshot.paramMap.get("_id"),
      user : localStorage.getItem('user')
      }
    );
  }

  OpenAddmemberDilog(templeid:any): void {
    // let userId = this.authenticationService.getCurrentUser();
    //   if (userId == undefined || userId == null) {
    //     this.authenticationService.showLoginModal()
    //     return;
    //   }
    this.templeId = this.route.snapshot.paramMap.get("_id")
    console.log(this.templeId,"55454")
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'addmember', templeId: templeid,api:"Connection Temples"},
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }



  OpenPujariDilog(templeid:any): void {
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    this.templeId = templeid
    console.log(this.templeId,"55454")
    const dialogRef = this.dialog.open(PujariComponent, {
      data: { displayName: 'addpujari', templeId: this.templeId },
      autoFocus: false,
      backdropClass: 'dialog-backdrop'
    });
  }

  isMemberconnect(templeid:any): void {
    const connectdata = this.ConnectForm.value;
    const contactedmember = {
      temple: templeid,
      user: localStorage.getItem('user'),
      connected_as: 'MEMBER'
    };
  
    this.memberservice.connect(contactedmember).subscribe(
      response => {
        console.log(response);
        this.ConnectForm.reset()
        this.fecthtempledata()
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  isPujariconnect(templeId:any):void{
    const connectdata = this.ConnectForm.value;
    const contactedPujari = {
      temple : templeId,
      user : localStorage.getItem('user'),
      connected_as:'PUJARI'

    }
    this.memberservice.connect(contactedPujari).subscribe(
      response => {
        console.log(response);
        this.ConnectForm.reset()
        this.fecthtempledata()
      })
  }

  loadlocations(): void {
    this.validatorForm = this.fb.group({
      country:['',[Validators.required]],
      state: ['', [Validators.required]],
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      village: ['', Validators.required]
    });


    // this.locationservice.GetAllCountries().subscribe(
    //   (res)=>{
    //     if (Array.isArray(res)) {
    //       this.CountryOptions = res.map((country:any) => ({
    //         label:country.name,
    //         value:country._id
    //       }));
    //       this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
    //     } else {
    //       console.error("Response is not an array type", res);
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // )

    this.locationservice.GetAllCountries().subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.CountryOptions = res.map((country: any) => ({
            label: country.name,
            value: country._id
          }));
          this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
    
          // Find the country object with the label "India"
          const defaultCountry = this.CountryOptions.find(option => option.label === 'India');
          
          // Set the default country if found
          if (defaultCountry) {
            this.validatorForm.controls['country'].setValue(defaultCountry.value);
          }
        } else {
          console.error("Response is not an array type", res);
          this.CountryFormControls();
        }
      },
      
      (err) => {
        console.log(err);
      }
    );
    
  
    this.validatorForm.get('country')?.valueChanges.subscribe(CountryID => {
      if (CountryID){
        this.selectedLocationId = CountryID; // Store state ID
        this.applyFilters()
        console.log('State ID selected:', this.selectedLocationId);
        console.log("qsdfbg")
        this.locationservice.getbyStates(CountryID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.StateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id
              }));
              this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );

      }

    })
   
    
  
    // Initialize form control states
    this.resetFormControls();
  
    // Handle state changes
    this.validatorForm.get('state')?.valueChanges.subscribe(stateID => {
      if (stateID) {
        this.selectedLocationId = stateID; // Store state ID
        console.log('State ID selected:', this.selectedLocationId);
        this.applyFilters()

        this.locationservice.getdistricts(stateID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.DistrictOptions = res.map((district: any) => ({
                label: district.name,
                value: district._id
              }));
              this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.resetDistrictMandalVillage();
        this.validatorForm.get('district')?.enable();
      } else {
        this.resetDistrictMandalVillage();
      }
    });
  
    // Handle district changes
    this.validatorForm.get('district')?.valueChanges.subscribe(districtID => {
      if (districtID) {
        this.selectedLocationId = districtID; // Replace state ID with district ID
        console.log('District ID selected:', this.selectedLocationId);
        this.applyFilters()
        this.locationservice.getblocks(districtID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.MandalOptions = res.map((mandal: any) => ({
                label: mandal.name,
                value: mandal._id
              }));
              this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.resetMandalVillage();
        this.validatorForm.get('mandal')?.enable();
      } else {
        this.resetMandalVillage();
      }
    });
  
    // Handle mandal changes
    this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalID => {
      if (mandalID) {
        this.selectedLocationId = mandalID; // Replace district ID with mandal ID
        console.log('Mandal ID selected:', this.selectedLocationId);
        this.applyFilters()
        this.locationservice.getvillages(mandalID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.VillageOptions = res.map((village: any) => ({
                label: village.name,
                value: village._id
              }));
              this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.validatorForm.get('village')?.enable();
      } else {
        this.resetVillage();
      }
    });

    this.validatorForm.get('village')?.valueChanges.subscribe(villageID => {
      if (villageID) {
        this.selectedLocationId = villageID; // Replace mandal ID with village ID
        this.applyFilters()
        console.log('Village ID selected:', this.selectedLocationId);
      } else {
        this.resetVillage();
      }
    });
  }

  CountryFormControls(): void {
    this.validatorForm.get('country')?.reset();
    this.validatorForm.get('state')?.reset();
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();
    
    // this.validatorForm.get('district')?.disable();
    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
  }




  resetFormControls(): void {
    this.validatorForm.get('state')?.reset();
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();
    
    // this.validatorForm.get('district')?.disable();
    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
  }
  
  resetDistrictMandalVillage(): void {
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();
    
    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
  }
  
  resetMandalVillage(): void {
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();
    
    // this.validatorForm.get('village')?.disable();
  }
  
  resetVillage(): void {
    this.validatorForm.get('village')?.reset();
  }

  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
  }

  NavigateToChatRoom(templeId:any):void{
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    
    this.router.navigate(['templechat',templeId])
  }

  navigateTempleDetail(_id:string):void{
    this.router.navigate(["getbytemples",_id])
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 

  sharegetbytemple(temple: any) {
    if (!temple || !temple._id) {
      console.error('Invalid temple data provided.');
      return;
    }
  
    const shareUrl = `${window.location.origin}/temples/${temple._id}`; 
    console.log('Share URL:', shareUrl);
  
    if (navigator.share) {
      navigator.share({
        title: temple.name,
        text: temple.desc || 'Check out this temple!',
        url: shareUrl
      }).then(() => {
        console.log('Sharing successful');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      alert(`Share URL: ${shareUrl}`);
    }
  }




  addtemple(): void {
    this.router.navigate(['addtemple'])
  }

  onVillageClick(_id:string): void {
    this.router.navigate(['villages',_id])
  }

  // onMandalClick(_id: string | null): void {
  //   if (_id && _id.toLowerCase().includes('town')) {
  //     console.log('Matched Town mandal:', _id);
  //     this.router.navigate(['mandal-details',_id])
  //   } else {
  //     console.log('Not a Town mandal:', _id);
  //   }
  // }
  


  

}
