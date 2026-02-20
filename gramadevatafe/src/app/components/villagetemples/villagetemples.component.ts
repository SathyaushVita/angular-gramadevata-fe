import { Component, HostListener, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VillageService } from '../../services/villageservice/village.service';
import { Router,ActivatedRoute } from '@angular/router';
import { state } from '@angular/animations';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { GetmemberComponent } from '../member/getmember/getmember.component';
import { AddmemberComponent } from '../member/addmember/addmember.component';
import { PujariComponent } from '../pujari/pujari.component';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { UserService } from '../../services/userservice/user.service';
import { SharedService } from '../../services/sharedservice/shared.service';
import { MemberService } from '../../services/memberservice/member.service';
import { FormGroup,FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';

import { Subscription } from 'rxjs';
import { NotificationHelper } from '../commons/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';

import { ReactiveFormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { AddvoluantryComponent } from '../member/addvoluantry/addvoluantry.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LocationService } from '../../services/location/location.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AddTourismComponent } from '../add-tourism/add-tourism.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { NzModalModule } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-villagetemples',
  standalone: true,
  imports: [CommonModule,NgxSpinnerModule,ReactiveFormsModule,MatButtonModule,MatDialogModule,NzSelectModule,NzFormModule,RouterModule,
    NzUploadModule,NzButtonModule,NzCardModule,FormsModule,NzModalModule],
  templateUrl: './villagetemples.component.html',
  styleUrl: './villagetemples.component.css'
})
export class VillagetemplesComponent {
  
  dialogRef!: MatDialogRef<any>;
  private subscription: Subscription = new Subscription();
  ConnectForm!: FormGroup;
  ConnectvoluantryForm!: FormGroup;
  detailsForm!: FormGroup;
  tourismForm!: FormGroup;
  hotelmForm!: FormGroup;
  hospitalform!: FormGroup;
  restaurantForm!: FormGroup;
  bloodbankForm!: FormGroup;
  ambulanceForm!: FormGroup;
  schoolForm!: FormGroup;
  villagedata:any;
  gramadevatatemples:any;
  iconictemples:any;
  famoustemples:any;
  othertemples:any;
  goshalas:any;
  events:any;
  connection:any;
  village_id:any;
  villageid:any;
  isConnected=false;
  currentUser: any;
  userdata:any;
  membertype:any;
  isMemberIn = false
  isPujariIn = false
  isvolunary =false
  
  pujariConnections: any[] = [];
  memberConnections: any[] = [];
  volunterConnections: any[] = [];
  ambulancefacility: any[] = [];
  bloodbank: any[] = [];
  firestation: any[] = [];
  policestation: any[] = [];
  allTemples: any[] = [];
  connectedId: any;
  connected_as: any;
  isMemberConnected: any;
  isPujariConnected : any;
  isvoluntaryconnected:any;
  templeId: any;
  templeStatus: any;
  goshalaId: any;
  goshalaStatus: any;
  eventId: any;
  eventStatus: any;

  nearestplaces:any;
  nearesthotels:any;
  touroperator:any;
  transport:any;
  nearesthospitals:any;
  resturant:any;
  touroperatorForm!:FormGroup;
  tourguideForm!:FormGroup;
  validatorForm!: FormGroup;
  GeographicalForm!: FormGroup;
  StateOptions:any[]=[];
  DistrictOptions:any[]=[];
  MandalOptions:any[]=[];
  VillageOptions:any[]=[];
  country: any;
  villageartists: any[] = [];
  villagedevelopmentfacilities: any[] = [];
  villageculturalprofile: any[] = [];
  famouspersonalities: any[] = [];
  geographic: any[] = [];




    postoffice: any[] = [];
  sportsground: any[] = [];
  markets: any[] = [];
  colleges: any[] = [];
  schools: any[] = [];
  banks: any[] = [];
  welfare_homes:any[]=[];
  mediaDetails: any[] = [];









  districtDialogRef: MatDialogRef<any> | null = null;
  mandalDialogRef: MatDialogRef<any> | null = null;
  statetDialogRef: MatDialogRef<any> | null = null;
  @ViewChild('districtDetailsTemplate') districtDetailsTemplate!: TemplateRef<any>;
  @ViewChild('mandalDetailsTemplate') mandalDetailsTemplate!: TemplateRef<any>;
  
 

  constructor(private route:ActivatedRoute,
       private router:Router,
       private fb: FormBuilder,
       private villageservice:VillageService,
       private dialog:MatDialog,
       private authenticationService:AuthenticationService,
       protected userservice:UserService,
       protected sharedService: SharedService,
       private memberservice:MemberService,
       private spinner: NgxSpinnerService,
       private notificationHelper:NotificationHelper,
       private templeservice:TempleserviceService,private renderer: Renderer2,
       private locationservice:LocationService,private sanitizer: DomSanitizer
      ){ 

        this.Addmoredetails();
        this.tourismplaces();
        this.addnearbyhotels();
        this.addtouroperatorsform();
        this.addtourguideform();
        this.addnearbyhospitalss();
        this.addrestaurantsform();
        this.registerbloodbanksform();
        this.ambulanceregisterform();
        this.addfirestationform();
        this.PolicestationdataForm();
        this.Addgeographicalfields();
        this.Addecnomicprofile();
        this.Addcultural();
        this.famouspersonalites();
        this.villagefamouspersons();
        this.villagfescoolform();
        this.villagcollegeform();
        this.villagbankform();
        this.villagmarketform();
        this.villagpostofficeform();
        this.villagsportsgroundform();
      }


  // ngOnInit():void{
  //   this.fetchvillages();
  //   let currentUser = this.authenticationService.getCurrentUser()
    
  // }

  
  OnSubmit():void{
    
    
    const VillageId = this.validatorForm.value.village
    this.router.navigate(["villages",VillageId])
    // this.dialogRef.close();
          this.dropdownOpen = false;

    this.validatorForm.reset();

    

  }



    
  closeDropdown(): void {
  this.dropdownOpen = false;
}

  


  // scrollToTop(): void {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }
  connectionsForm(): void {
    this.ConnectForm = this.fb.group(
      {
      connected_as:"PUJARI",
      village: this.route.snapshot.paramMap.get("_id"),
      user : localStorage.getItem('user')
      }
    );
  }


  connectionsvoluantryForm(): void {
    this.ConnectvoluantryForm = this.fb.group(
      {
      connected_as:"VOLUNTARY",
      village: this.route.snapshot.paramMap.get("_id"),
      user : localStorage.getItem('user')
      }
    );
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

    handleblooodImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/bloodbank.webp';
  }
    handleambulanceImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ambulance.webp';
  }
    handlefireImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/fire-station.webp';
  }
    handlepoliceImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/police-station.webp';
  }

  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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



isvoluanterUser() {
  const isvolunary = localStorage.getItem("type") === "VOLUNTARY";
  console.log(isvolunary,"isvluantry")
if (isvolunary) {
  this.isvolunary = true
} else {
  this.isvolunary = false
} 
}


isFormInitializing = true;


private loadStates(countryId: string) {
  this.locationservice.getbyStates(countryId).subscribe(res => {
    this.StateOptions = res
      .map((s: any) => ({ label: s.name, value: s._id }))
      
  });
}

private resetControls(controls: string[]) {
  controls.forEach(c => {
    this.validatorForm.get(c)?.reset();
    this.validatorForm.get(c)?.disable();
  });
}

private closeDialogs() {
  this.mandalDialogRef?.close();
  this.districtDialogRef?.close();
  this.mandalDialogRef = null;
  this.districtDialogRef = null;
}

private closeMandalDialog() {
  this.mandalDialogRef?.close();
  this.mandalDialogRef = null;
}

ngOnInit() {

  
  this.subscription.add(
    this.sharedService.triggerFetchVillageData$.subscribe(() => {
      this.fetchvillages();
    })
  );

  this.route.paramMap.subscribe(params => {
    this.village_id = params.get("_id");
    if (this.village_id) {
      this.fetchvillages();
    }
  });

  this.connectionsForm();
  this.connectionsvoluantryForm();
  this.isMemberUser();
  this.isPujariUser();
  this.isvoluanterUser();

//   this.validatorForm = this.fb.group({
//     country: [''],
//     state: ['', [Validators.required]],
//     district: ['', Validators.required],
//     mandal: ['', Validators.required],
//     village: ['', Validators.required]
//   });

//   this.locationservice.getNameByCountry('INDIA').subscribe(data => {
//     if (data?.length) {
//       this.country = data[101]._id;
//       this.validatorForm.patchValue({ country: this.country });

//       this.locationservice.getbyStates(this.country).subscribe(res => {
//         this.StateOptions = res.map((state: any) => ({
//           label: state.name,
//           value: state._id,
//         }));
//         this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
//       });
//     }
//   });

//   this.validatorForm.get('state')?.valueChanges.subscribe(stateId => {
//     if (this.mandalDialogRef) {
//       this.mandalDialogRef.close();
//       this.mandalDialogRef = null;
//     }
//     if (this.districtDialogRef) {
//       this.districtDialogRef.close();
//       this.districtDialogRef = null;
//     }
//     if (this.statetDialogRef) {
//       this.statetDialogRef.close();
//       this.statetDialogRef = null;
//     }
//     this.validatorForm.get('district')?.reset();
//     this.validatorForm.get('district')?.disable();
//     this.validatorForm.get('mandal')?.reset();
//     this.validatorForm.get('mandal')?.disable();
//     this.validatorForm.get('village')?.reset();
//     this.validatorForm.get('village')?.disable();

//     if (stateId) {
//       this.locationservice.getdistricts(stateId).subscribe(res => {
//         this.DistrictOptions = res.map((district: any) => ({
//           label: district.name,
//           value: district._id,
//         }));
//         this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
//         this.validatorForm.get('district')?.enable();
//       });

//       //       if (!this.isFormInitializing) {
//       //   this.locationservice.getstateDetails(stateId).subscribe(statedata => {
//       //     if (statedata?.name?.includes('')) {
//       //       this.statetDialogRef = this.dialog.open(this.stateDetailsTemplate, {
//       //         width: '400px',
//       //         data: statedata,
//       //         position: { top: '5%', right: '2%' }
//       //       });
//       //     }
//       //   });
//       // }


//     }
//   });

//   this.validatorForm.get('district')?.valueChanges.subscribe(districtId => {
//     //         if (this.statetDialogRef) {
//     //   this.statetDialogRef.close();
//     //   this.statetDialogRef = null;
//     // }
//     // if (this.mandalDialogRef) {
//     //   this.mandalDialogRef.close();
//     //   this.mandalDialogRef = null;
//     // }
//     //     if (this.statetDialogRef) {
//     //   this.statetDialogRef.close();
//     //   this.statetDialogRef = null;
//     // }

//     this.validatorForm.get('mandal')?.reset();
//     this.validatorForm.get('mandal')?.disable();
//     this.validatorForm.get('village')?.reset();
//     this.validatorForm.get('village')?.disable();

//     if (districtId) {
//       this.locationservice.getblocks(districtId).subscribe(res => {
//         this.MandalOptions = res.map((mandal: any) => ({
//           label: mandal.name,
//           value: mandal._id,
//         }));
//         this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
//         this.validatorForm.get('mandal')?.enable();
//       });

//       // Only open dialog if not initializing form
//       if (!this.isFormInitializing) {
//         this.locationservice.getDistrictDetails(districtId).subscribe(districtData => {
//           if (districtData?.name?.includes('')) {
//             this.districtDialogRef = this.dialog.open(this.districtDetailsTemplate, {
//               width: '400px',
//               data: districtData,
//               position: { top: '5%', right: '2%' }
//             });
//           }
//         });
//       }
//     }
//   });

//   this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalId => {
//     //         if (this.statetDialogRef) {
//     //   this.statetDialogRef.close();
//     //   this.statetDialogRef = null;
//     // }
//     if (this.mandalDialogRef) {
//       this.mandalDialogRef.close();
//       this.mandalDialogRef = null;
//     }
//     //     if (this.statetDialogRef) {
//     //   this.statetDialogRef.close();
//     //   this.statetDialogRef = null;
//     // }

//     this.validatorForm.get('village')?.reset();
//     this.validatorForm.get('village')?.disable();

//     if (mandalId) {
//       this.locationservice.getvillages(mandalId).subscribe(res => {
//         this.VillageOptions = res.map((village: any) => ({
//           label: village.name,
//           value: village._id,
//         }));
//         this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
//         this.validatorForm.get('village')?.enable();
//       });

//       // Only open dialog if not initializing form
//       if (!this.isFormInitializing) {
//         this.locationservice.getMandalDetails(mandalId).subscribe(mandalData => {
//           if (mandalData?.name?.includes('')) {
//             this.mandalDialogRef = this.dialog.open(this.mandalDetailsTemplate, {
//               width: '400px',
//               data: mandalData,
//               position: { top: '5%', left: '2%' }
//             });
//           }
//         });
//       }
//     }
//   });
// }

  this.validatorForm = this.fb.group({
    country: [''],
    state: ['', Validators.required],
    district: ['', Validators.required],
    mandal: ['', Validators.required],
    village: ['', Validators.required]
  });

  // ---------- COUNTRY ----------
  this.locationservice.getNameByCountry('INDIA').subscribe(data => {
    if (data?.length) {

      const countryObj = data.find(
        (c: any) => c.name?.toUpperCase() === 'INDIA'
      );

      if (!countryObj) return;

      this.country = countryObj._id;

      // 🚫 prevent triggering valueChanges
      this.validatorForm.patchValue(
        { country: this.country },
        { emitEvent: false }
      );

      this.loadStates(this.country);
    }
  });

  // ---------- STATE ----------
  this.validatorForm.get('state')?.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(stateId => {

      this.closeDialogs();
      this.resetControls(['district', 'mandal', 'village']);

      if (stateId) {
        this.locationservice.getdistricts(stateId).subscribe(res => {
          this.DistrictOptions = res
            .map((d: any) => ({ label: d.name, value: d._id }))
            

          this.validatorForm.get('district')?.enable();
        });
      }
    });

  // ---------- DISTRICT ----------
  this.validatorForm.get('district')?.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(districtId => {

      this.closeMandalDialog();
      this.resetControls(['mandal', 'village']);

      if (districtId) {
        this.locationservice.getblocks(districtId).subscribe(res => {
          this.MandalOptions = res
            .map((m: any) => ({ label: m.name, value: m._id }))
            

          this.validatorForm.get('mandal')?.enable();
        });

        if (!this.isFormInitializing) {
          this.locationservice.getDistrictDetails(districtId).subscribe(data => {
            this.districtDialogRef = this.dialog.open(
              this.districtDetailsTemplate,
              {
                width: '400px',
                data,
                position: { top: '5%', right: '2%' }
              }
            );
          });
        }
      }
    });

  // ---------- MANDAL ----------
  this.validatorForm.get('mandal')?.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(mandalId => {

      this.closeMandalDialog();
      this.resetControls(['village']);

      if (mandalId) {
        this.locationservice.getvillages(mandalId).subscribe(res => {
          this.VillageOptions = res
            .map((v: any) => ({ label: v.name, value: v._id }))
            

          this.validatorForm.get('village')?.enable();
        });

        if (!this.isFormInitializing) {
          this.locationservice.getMandalDetails(mandalId).subscribe(data => {
            this.mandalDialogRef = this.dialog.open(
              this.mandalDetailsTemplate,
              {
                width: '400px',
                data,
                position: { top: '5%', left: '2%' }
              }
            );
          });
        }
      }
    });
}

fetchvillages(): void {
  this.spinner.show();
  this.isConnected = false;

  this.villageservice.getbyvillage(this.village_id).subscribe(data => {
    this.villagedata = data;

    this.iconictemples = this.villagedata.iconictemples;
    this.famoustemples = this.villagedata.famoustemples;
    this.nearesthotels = this.villagedata.nearby_hotels;
    this.nearestplaces = this.villagedata.tourismplace;
    this.touroperator = this.villagedata.touroperator;
    this.transport = this.villagedata.transport;
    this.nearesthospitals = this.villagedata.near_by_hospitals;
    this.resturant = this.villagedata.resturents;
    this.gramadevatatemples = this.villagedata.gramdeavatatemples;
    this.othertemples = this.villagedata.othertemples;
    this.goshalas = this.villagedata.goshalas;
    this.events = this.villagedata.events;
    this.mediaDetails =this.villagedata.village_video;
    this.connection = this.villagedata.Connections;
      this.allTemples = [
  ...(this.villagedata.iconictemples || []),
  ...(this.villagedata.famoustemples || []),
  ...(this.villagedata.gramdeavatatemples || []),
  ...(this.villagedata.othertemples || [])
];

    this.policestation = this.villagedata.police_station;
    this.firestation = this.villagedata.fire_station;
    this.bloodbank = this.villagedata.blood_bank;
    this.ambulancefacility = this.villagedata.ambulance_facility;

    this.geographic = this.villagedata.geographic;
    this.famouspersonalities = this.villagedata.famous_personalities;
    this.villageculturalprofile = this.villagedata.village_cultural_profile;
    this.villagedevelopmentfacilities = this.villagedata.village_development_facilities;
    this.villageartists = this.villagedata.village_artists;

    this.sportsground = this.villagedata.sportsground;
    this.postoffice = this.villagedata.postoffice;
    this.markets = this.villagedata.markets;
    this.colleges = this.villagedata.colleges;
    this.banks = this.villagedata.banks;
    this.schools = this.villagedata.schools;
    this.welfare_homes=this.villagedata.welfare_homes;

    


    this.currentUser = this.authenticationService.getCurrentUser();
    this.pujariConnections = this.connection.filter((conn: any) => conn.connected_as === 'PUJARI');
    this.memberConnections = this.connection.filter((conn: any) => conn.connected_as === 'MEMBER');
    this.volunterConnections = this.connection.filter((conn: any) => conn.connected_as === 'VOLUNTARY');

    if (Array.isArray(this.villagedata.Connections)) {
      const connection = this.villagedata.Connections.find(
        (conn: any) => conn.user && conn.user._id === this.currentUser
      );
      if (connection) {
        this.isConnected = true;
        this.connectedId = connection._id;
        this.connected_as = connection.connected_as;
        this.isPujariConnected = (this.connected_as === 'PUJARI');
        this.isMemberConnected = (this.connected_as === 'MEMBER');
        this.isvoluntaryconnected = (this.connected_as === 'VOLUNTARY');
      }
    }

    if (this.villagedata?.block?.district?.state) {
      const stateId = this.villagedata.block.district.state.stateid;
      const districtId = this.villagedata.block.district.districtid;
      const mandalId = this.villagedata.block.id;

      this.validatorForm.get('state')?.enable();
      this.validatorForm.get('district')?.enable();
      this.validatorForm.get('mandal')?.enable();
      this.validatorForm.get('village')?.enable();

      // ✅ Suppress dialogs while initializing
      this.isFormInitializing = true;

      this.validatorForm.patchValue({
        state: stateId,
        district: districtId,
        mandal: mandalId
      });

      this.locationservice.getdistricts(stateId).subscribe(res => {
        this.DistrictOptions = res.map((d: any) => ({ label: d.name, value: d._id }));
        this.validatorForm.get('district')?.enable();

        this.locationservice.getblocks(districtId).subscribe(res => {
          this.MandalOptions = res.map((m: any) => ({ label: m.name, value: m._id }));
          this.validatorForm.get('mandal')?.enable();

          this.validatorForm.patchValue({ mandal: mandalId });

          this.locationservice.getvillages(mandalId).subscribe(res => {
            this.VillageOptions = res.map((v: any) => ({ label: v.name, value: v._id }));
            this.validatorForm.get('village')?.enable();

            this.spinner.hide();
            // ✅ Done initializing
            this.isFormInitializing = false;
          });
        });
      });
    }
  }, error => {
    console.error("Error fetching village data", error);
    this.spinner.hide();
  });
}


  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
    dropdownOpen = false;



isconnect():void{
  const connectdata = this.ConnectForm.value;
  const contactedPujari = {
    village: this.route.snapshot.paramMap.get("_id"),
    user : localStorage.getItem('user'),
    connected_as:'PUJARI'

  }
  this.memberservice.connect(contactedPujari).subscribe(
    response => {
      console.log(response);
      this.ConnectForm.reset()
      
      this.fetchvillages()
    })
}


isvoluantryconnect():void{
  console.log("Connect button clicked");

  const connectdata = this.ConnectvoluantryForm.value;
  const contactedvaluntary = {
    village: this.route.snapshot.paramMap.get("_id"),
    user : localStorage.getItem('user'),
    connected_as:'VOLUNTARY'

  }
  this.memberservice.connect(contactedvaluntary).subscribe(
    response => {
      console.log(response);
      this.ConnectvoluantryForm.reset()
      this.fetchvillages()
    })
}




  // navigateTo(route: string): void {
  //   const ismemberin = localStorage.getItem('is_member') === 'true';
  //   if (ismemberin === false) {
  //     this.openmemberDialog();
  //   } else {

  //     // this.router.navigate([route, this.village_id]);
  //     this.router.navigate([route], { state: { village_id: this.village_id } });
  //   }

  // }

  navigateTo(route: string): void {

  const isLoggedIn = this.authenticationService.isLoggedInUser();

  // ------ 1. NOT LOGGED IN ------
  if (!isLoggedIn) {

    this.authenticationService.showLoginModal().afterClosed().subscribe(() => {

      // Check again after login popup
      if (!this.authenticationService.isLoggedInUser()) return;

      const isMember = localStorage.getItem('is_member') === 'true';

      // ---- 1.1 After login → Still NOT member → Show member dialog ----
      if (!isMember) {
        this.openmemberDialog().afterClosed().subscribe(() => {
          const memberNow = localStorage.getItem('is_member') === 'true';

          if (memberNow) {
            this.router.navigate([route], {
              state: { village_id: this.village_id }
            });
          }
        });
      }

      // ---- 1.2 After login → Already a member ----
      else {
        this.router.navigate([route], {
          state: { village_id: this.village_id }
        });
      }

    });

    return;
  }

  // ------ 2. ALREADY LOGGED IN ------
  const isMember = localStorage.getItem('is_member') === 'true';

  // ---- 2.1 Logged in but NOT a member ----
  if (!isMember) {
    this.openmemberDialog().afterClosed().subscribe(() => {
      const memberNow = localStorage.getItem('is_member') === 'true';

      if (memberNow) {
        this.router.navigate([route], {
          state: { village_id: this.village_id }
        });
      }
    });
  }

  // ---- 2.2 Logged in AND member ----
  else {
    this.router.navigate([route], {
      state: { village_id: this.village_id }
    });
  }
}


  // openmemberDialog(): void {
  //   console.log('sssssssssss');
  //   const dialogRef = this.dialog.open(OnlymemberComponent, {
  //     data: { displayName: 'signup' },
  //     autoFocus: false,
  //     backdropClass: 'dialog-backdrop',
  //   });
  
  //   dialogRef.afterClosed().subscribe(() => {
  //     // Handle after dialog close actions here
  //   });
  // }

  openmemberDialog() {
  return this.dialog.open(OnlymemberComponent, {
    data: { displayName: 'member' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
     disableClose: true,
  });
}



  OpenMemberDialog(member: any): void {
    console.log(member,"member")

    const dialogRef = this.dialog.open(GetmemberComponent, {

        data: { displayName: 'getmember', member },
        autoFocus: false,
        backdropClass: 'dialog-backdrop'
    });

    dialogRef.afterClosed().subscribe(() => {
        // Optional: Add logic to handle actions after dialog is closed
    });
}




OpenAddmemberDilog(): void {
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.villageid = this.route.snapshot.paramMap.get("_id")
  console.log(this.villageid,"55454")
  const dialogRef = this.dialog.open(AddmemberComponent, {
    data: { displayName: 'addmember', villageid: this.villageid },
    autoFocus: false,
    disableClose: true,
    backdropClass: 'dialog-backdrop'
  });
}

OpenPujariDilog(): void {
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.villageid = this.route.snapshot.paramMap.get("_id")
  console.log(this.villageid,"55454")
  const dialogRef = this.dialog.open(PujariComponent, {
    data: { displayName: 'addpujari', villageid: this.villageid },
    autoFocus: false,
    disableClose: true,
    backdropClass: 'dialog-backdrop',
    
  });
}


OpenAddvoluanterDilog(): void {
  let userId = this.authenticationService.getCurrentUser();
  if (userId == undefined || userId == null) {
    this.authenticationService.showLoginModal();
    return;
  }

  this.villageid = this.route.snapshot.paramMap.get("_id");
  console.log(this.villageid, "55454");

  const dialogRef = this.dialog.open(AddmemberComponent, {
    data: { 
      displayName: 'addmember', 
      villageid: this.villageid, 
      type: 'VOLUNTARY',
      heading: 'Sanatana Volunteer Registration' // Pass the heading dynamically
    },
    autoFocus: false,
    disableClose: true,
    backdropClass: 'dialog-backdrop'
  });
}



// OpenAddvoluanterDilog(): void {
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }

    
//   this.villageid = this.route.snapshot.paramMap.get("_id")
  
//   console.log(this.villageid,"55454")
//   const dialogRef = this.dialog.open(AddmemberComponent, {
//     data: { displayName: 'addmember', villageid: this.villageid,type: 'VOLUNTARY' },
//     autoFocus: false,
//     backdropClass: 'dialog-backdrop'
//   });
// }

// navigateTotempleDetail(data:any): void{
//   this.templeId = data._id
//   this.templeStatus = data.status
//   if (this.templeStatus === 'INACTIVE')
//   console.log(this.templeId,"qwer")
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }
//   this.router.navigate(['getbytemples',this.templeId])
// }

navigateTotempleDetail(data: any): void {
  this.templeId = data._id;
  this.templeStatus = data.status;

  
  if (this.templeStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This temple is under review', '');
    return;
  }

  
  let userId = this.authenticationService.getCurrentUser();

  
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  
  this.router.navigate(['templedetailsview', this.templeId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }).catch(error => console.error("Navigation failed:", error));
}




navigateTogramadevata(data: any): void {
  this.templeId = data._id;
  this.templeStatus = data.status;

  
  if (this.templeStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This temple is under review', '');
    return;
  }

  
  let userId = this.authenticationService.getCurrentUser();

  
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  
  this.router.navigate(['getbytemple', this.templeId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }).catch(error => console.error("Navigation failed:", error));
}


navigateTofamousandiconic(data: any): void {
  this.templeId = data._id;
  this.templeStatus = data.status;

  
  if (this.templeStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This temple is under review', '');
    return;
  }

  
  let userId = this.authenticationService.getCurrentUser();

  
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  
  this.router.navigate(['Famousandiconic', this.templeId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }).catch(error => console.error("Navigation failed:", error));
}



navigategoshaladata(goshala: any): void {
  this.goshalaId = goshala._id;
  this.goshalaStatus = goshala.status;
  

  // Check if the goshala is inactive
  if (this.goshalaStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This Goshala is under review', '');
    return;
  }

  // Check if the user is logged in
  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  // Navigate to the detail view with the goshala ID
  this.router.navigate(['getbygoshala',this.goshalaId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(error => console.error("Navigation failed:", error));
}


navigateEventdata(event:any):void{

  this.eventId = event._id;
  this.eventStatus = event.status;
  
  if (this.eventStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This Event is under review', '');
    return;
  }

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(['detailviewevent',this.eventId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }).catch(error => console.error("Navigation failed:", error));
}



disconnect(){
  this.memberservice.DisconnectMember(this.connectedId).subscribe(
    data =>{
      console.log('deleted succesfully')
      this.fetchvillages()
    }
  )
}
NavigateToChatRoom(): void {
  const userId = this.authenticationService.getCurrentUser();

  // Check if user is logged in
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  const isMemberIn = localStorage.getItem('is_member') === 'true';;

  // Check if user is a member
  if (!isMemberIn) {
    // this.openmemberDialog();
    this.notificationHelper.showSuccessNotification('Join as a member to chat with village residents', '');
    return;
  }

  // Check if the user is connected
  if (!this.isConnected) {
    // this.openmemberDialog();
    this.notificationHelper.showSuccessNotification('Join as a member to chat with village residents', '');
    return;
  }

  // Get village ID from the route parameters
  this.village_id = this.route.snapshot.paramMap.get("_id");

  // Handle case if village_id is not found
  if (!this.village_id) {
    console.error("Village ID not found in route parameters");
    return;
  }

  console.log(this.village_id, "village id");

  // Navigate to chatroom with village ID
  this.router.navigate(['chat']);
}


// sharegetbytemple(temple: any) {
//   if (!temple || !temple._id) {
//     console.error('Invalid temple data provided.');
//     return;
//   }

//   const shareUrl = `${window.location.origin}/villages/${temple._id}`; 
//   console.log('Share URL:', shareUrl);

//   if (navigator.share) {
//     navigator.share({
//       title: temple.name,
//       text: temple.desc || 'Check out this temple!',
//       url: shareUrl
//     }).then(() => {
//       console.log('Sharing successful');
//     }).catch((error) => {
//       console.error('Error sharing:', error);
//     });
//   } else {
//     alert(`Share URL: ${shareUrl}`);
//   }
// }

// async sharegetbytemple(temple: any) {
//   if (!temple || !temple._id) {
//     console.error('Invalid temple data provided.');
//     return;
//   }

//   // ✅ Construct Share URL
//   const shareUrl = temple.share_url 
//     ? temple.share_url 
//     : `${window.location.origin}/villages/${temple._id}`;

//   // ✅ Shorten description
//   const maxLength = 250;
//   let shortDesc = temple.desc || "Check out this temple!";
//   if (shortDesc.length > maxLength) {
//     shortDesc = shortDesc.substring(0, maxLength).trim() + "...";
//   }

//   // ✅ Prepare share text (with link)
//   let shareText =
//     `${temple.name}\n\n` +
//     `${shortDesc}\n\n` +
//     `More details: ${shareUrl}`;

//   // ✅ Get first image URL (if available)
//   const imageUrl = temple.image_location?.[0]
//     ? temple.image_location[0].replace(/ /g, "%20")
//     : null;

//   try {
//     let shared = false;

//     // ✅ Try sharing with image if supported
//     if (imageUrl && navigator.canShare && navigator.canShare({ files: [] })) {
//       try {
//         const response = await fetch(imageUrl);
//         const blob = await response.blob();

//         if (blob.type.startsWith("image/")) {
//           const file = new File([blob], 'temple.jpg', { type: blob.type });

//           await navigator.share({
//             title: temple.name,
//             text: shareText,
//             files: [file]
//           });
//           shared = true;
//         }
//       } catch (err) {
//         console.warn("Image fetch/share failed:", err);
//       }
//     }

//     // ✅ Fallback to text + image link
//     if (!shared) {
//       if (imageUrl) {
//         shareText += `\n\nImage: ${imageUrl}`;
//       }

//       if (navigator.share) {
//         await navigator.share({
//           title: temple.name,
//           text: shareText
//         });
//       } else {
//         alert(`Temple details:\n\n${shareText}`);
//       }
//     }

//   } catch (error) {
//     console.error('Error sharing:', error);
//   }
// }


async sharegetbytemple(temple: any) {
  if (!temple || !temple._id) {
    console.error('Invalid temple data provided.');
    return;
  }

  // ✅ Construct Share URL
  // const shareUrl = temple.share_url 
  //   ? temple.share_url 
  //   : `${window.location.origin}/villages/${temple._id}`;

      const templeLink = temple.share_url 
    ? temple.share_url 
    : `https://gramadevata.com/villages/${temple._id}`;

  // ✅ Shorten description
  const maxLength = 250;
  let shortDesc = temple.desc || "Check out this temple!";
  if (shortDesc.length > maxLength) {
    shortDesc = shortDesc.substring(0, maxLength).trim() + "...";
  }

  // ✅ Prepare share text
  const shareText =
    `${temple.name}\n\n` +
    `${shortDesc}\n\n` +
    `URL: ${templeLink}`;

  // ✅ First image (optional)
  const imageUrl = temple.image_location?.[0]
    ? temple.image_location[0].replace(/ /g, "%20")
    : null;

  try {
    let shared = false;

    // ✅ Share with image (if supported)
    if (imageUrl && navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (blob.type.startsWith("image/")) {
          const file = new File([blob], 'temple.jpg', { type: blob.type });

          await navigator.share({
            title: temple.name,
            text: shareText,
            files: [file]
          });
          shared = true;
        }
      } catch (err) {
        console.warn("Image fetch/share failed:", err);
      }
    }

    // ✅ Fallback to text-only share (with image link if available)
    if (!shared) {
      let fallbackText = shareText;
      if (imageUrl) {
        fallbackText += `\n\nImage: ${imageUrl}`;
      }

      if (navigator.share) {
        await navigator.share({
          title: temple.name,
          text: fallbackText
        });
      } else {
        alert(`Temple details:\n\n${fallbackText}`);
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
}



@ViewChild('memberListDialog') memberListDialog!: TemplateRef<any>;
openMemberListDialog(): void {
  this.dialog.open(this.memberListDialog, {
    width: '600px',
  });
}



@ViewChild('AddmoreListDialog') AddmoreListDialog!: TemplateRef<any>;
// openAddMoreDetailsDialog(): void {
//   this.dialogRef = this.dialog.open(this.AddmoreListDialog, {
//     disableClose: false,
//     width: '600px',
//   });
// }


openAddMoreDetailsDialog(): void {

  // 1️⃣ Login check
  const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  // 3️⃣ Logged in + member → open dialog
  this.dialogRef = this.dialog.open(this.AddmoreListDialog, {
    disableClose: true,
    width: '600px',
  });
}




Addmoredetails(): void {
  this.detailsForm = this.fb.group({

  //   image_location:['',
  // [
  //   Validators.required,
  //   Validators.pattern(/^https?:\/\/.+/)
  // ]],
    desc:['',Validators.required],
    mapUrl:['',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    village_video:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status: ['INACTIVE']

  });
}


addmoreVideoList: NzUploadFile[] = [];

handleaddmoreVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.detailsForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'village_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.detailsForm.patchValue({ [controlName]: '' });

  if (controlName === 'village_video') {
    this.addmoreVideoList = [];
  }
}








getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.detailsForm.patchValue({
          mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0,  
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}




bannerFileList: NzUploadFile[] = [];
bannerFileList1: NzUploadFile[] = [];



handleimageRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}

handleimageChange(info:NzUploadChangeParam):void {
  this.handleUploadimage(info, 'image_location');
 }

 handleUploadimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.detailsForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.detailsForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}


getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = (reader.result as string).split(',')[1]; 
    callback(base64String);
  };
  reader.readAsDataURL(file);
}








Addmore() {
  this.spinner.show();
  if (this.detailsForm.valid) {
      this.villageservice.villageaddmoredetails(this.detailsForm.value).subscribe(
          response => {
              console.log('village added successfully:', response);
                            this.notificationHelper.showSuccessNotification('Village Details Added Successfully', '');
                             window.location.reload();
                             this.detailsForm.reset();
                             this.bannerFileList = [];
                             this.bannerFileList1 = [];
                             this.addmoreVideoList = [];


        if (this.dialogRef) {
          this.dialogRef.close();
        }
            this.spinner.hide();  
          },
          error => {
              console.error('Error adding village:', error);
 this.notificationHelper.showErrorNotification('Failed to Add Village', '');
              this.spinner.hide();
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
  }
}




getTransportIcon(type: string): string {
  if (type.toLowerCase().includes('train')) return '🚆';
  if (type.toLowerCase().includes('air')) return '✈️';
  if (type.toLowerCase().includes('road') || type.toLowerCase().includes('bus')) return '🚌';
  return '🚗';
}



handlehotelImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/hotel.jpg';
}

handlehospitalImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/image.png';
}

handlefamouspersonality(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/profile1.webp';
}

handlevillageImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/villagechatimage.jpg';
}




@ViewChild('tourplacesDialog') tourplacesDialog!: TemplateRef<any>;
opentourismplaces(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  this.dialogRef = this.dialog.open(this.tourplacesDialog, {
    disableClose: true,
    
    width: '600px'
  });
    this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

}

tourismplaces(): void {
  this.tourismForm = this.fb.group({
    map_location: ['',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    address:['', Validators.required],
    name:['', Validators.required],
     desc:['',Validators.required],
    timings:['', Validators.required],
    type:['',Validators.required],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],


  });
}






Addtourismplaces() {
  this.spinner.show();
  if (this.tourismForm.valid) {
      this.templeservice.addTempletourismplaces(this.tourismForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
                            this.notificationHelper.showSuccessNotification('Tour Place Details Added Successfully', '');



              this.tourismForm.reset();
               window.location.reload();


              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
                             this.notificationHelper.showErrorNotification('Failed to Add Tour Place Details', '');

              this.spinner.hide();
          }
      );
  } else {
      this.tourismForm.markAllAsTouched();
      this.spinner.hide();
  }
}


Uploadtouismimage(info:NzUploadChangeParam):void {
  this.adddtourismplaceimage(info, 'image_location');
 }

 adddtourismplaceimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.tourismForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.tourismForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}



gettourismCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.tourismForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}




@ViewChild('hotelsDialog') hotelsDialog!: TemplateRef<any>;
opennearbyhotels(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.hotelsDialog, {
    disableClose: true,
    width: '600px'
  });
}



addnearbyhotels(): void {
  this.hotelmForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    // hotel_rating:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
          contact_number:['',Validators.required],
          owner_name:['',Validators.required],
          restaurent:['YES'],
              license_copy:[''],


  });
}





Addhotels() {
  this.spinner.show();
  if (this.hotelmForm.valid) {
      this.templeservice.addnearbyhotels(this.hotelmForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              this.notificationHelper.showSuccessNotification('Hotel Details Added Successfully', '');
                            this.hotelmForm.reset();
               window.location.reload();
                             this.bannerFileList = [];

              
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Hotel Details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.hotelmForm.markAllAsTouched();
      this.spinner.hide();
  }
}


getnearbyhotels() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.hotelmForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}


// Uploadhotelimage(info:NzUploadChangeParam):void {
//   this.adddhotelimage(info, 'image_location');
//  }

//  adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   // Initialize an empty array to store base64 strings
//   const base64Images: string[] = [];

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       file['base64'] = base64String;
//       base64Images.push(base64String);

//       // Update the form control once all images are processed
//       if (base64Images.length === fileList.length) {
//         this.hotelmForm.patchValue({ image_location: base64Images });
//         console.log('Updated images form:', this.hotelmForm.value);
//       }
//     });
//   });

//   if (formControlName === 'image_location') {
//     this.bannerFileList = fileList;
//   }

//   console.log('File upload:', info.fileList);
// }



Uploadhotelimage(info: NzUploadChangeParam): void {
  this.adddhotelimage(info, 'image_location');
}

UploadLicenseCopy(info: NzUploadChangeParam): void {
  this.adddhotelimage(info, 'license_copy');
}

adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      if (base64Images.length === fileList.length) {
        this.hotelmForm.patchValue({ [formControlName]: base64Images });
        console.log(`Updated ${formControlName}:`, this.hotelmForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'license_copy') {
    this.licenseFileList = fileList;
  }

  console.log('File upload:', fileList);
}






@ViewChild('touroperatorDialog') touroperatorDialog!: TemplateRef<any>;
openaddtoutoperator(): void {
  this.dialogRef = this.dialog.open(this.touroperatorDialog, {
    disableClose: false,
    width: '600px'
  });
}


@ViewChild('tourguideDialog') tourguideDialog!: TemplateRef<any>;
openaddtoutguide(): void {
  this.dialogRef = this.dialog.open(this.tourguideDialog, {
    disableClose: false,
    width: '600px'
  });
}


addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    // rating:[''],
    tour_operator_name:[''],
    mobile_number:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    email:[''],
    website:[''],
    contact_address:['']

  });
}



addtourguideform(): void {
  this.tourguideForm = this.fb.group({
    tourist_spot_covered:[''],
    language:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    mobile:[''],


  });
}



Addtouroperator() {
  this.spinner.show();
  if (this.touroperatorForm.valid) {
      this.templeservice.addtouroperatordetails(this.touroperatorForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              this.notificationHelper.showSuccessNotification('Tour Operator Details Added Successfully', '');
                            this.touroperatorForm.reset();
               window.location.reload();
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Tour Operator Details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
  }
}



Addtyourtourguide() {
  this.spinner.show();
  if (this.tourguideForm.valid) {
      this.templeservice.addttourguide(this.tourguideForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              this.notificationHelper.showSuccessNotification('Tour Guide Details Added Successfully', '');
                            this.tourguideForm.reset();
               window.location.reload();
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Tour Guide details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
  }
}




gethospitalLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.hospitalform.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}


Addhospital() {
  this.spinner.show();
  if (this.hospitalform.valid) {
      this.templeservice.addnearbyhospital(this.hospitalform.value).subscribe(
          response => {
              console.log('Hospital added successfully:', response);
              this.notificationHelper.showSuccessNotification('Hospital Details Added Successfully', '');

              this.hospitalform.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];


        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Hospital Details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.hospitalform.markAllAsTouched();
      this.spinner.hide();
  }
}

addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
          contact_number:['',Validators.required],
      owner_name:['',Validators.required],

    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
    license_copy:['']

  });
}



@ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
openaddnearbyhospitals(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.nearbyhospitalsDialog, {
    disableClose: true,
    width: '600px'
  });
}


// Uploadhospitalimage(info:NzUploadChangeParam):void {
//   this.adddhospitalimage(info, 'image_location');
//  }

//  adddhospitalimage(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   // Initialize an empty array to store base64 strings
//   const base64Images: string[] = [];

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       file['base64'] = base64String;
//       base64Images.push(base64String);

//       // Update the form control once all images are processed
//       if (base64Images.length === fileList.length) {
//         this.hospitalform.patchValue({ image_location: base64Images });
//         console.log('Updated images form:', this.hospitalform.value);
//       }
//     });
//   });

//   if (formControlName === 'image_location') {
//     this.bannerFileList = fileList;
//   }

//   console.log('File upload:', info.fileList);
// }


// bannerFileList: NzUploadFile[] = [];
licenseFileList: NzUploadFile[] = [];

Uploadhospitalimage(info: NzUploadChangeParam): void {
  this.processImageUpload(info, 'image_location');
}

Uploadlicensecopy(info: NzUploadChangeParam): void {
  this.processImageUpload(info, 'license_copy');
}

processImageUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      if (base64Images.length === fileList.length) {
        this.hospitalform.patchValue({ [formControlName]: base64Images });
        console.log(`Updated ${formControlName} images:`, this.hospitalform.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  } else if (formControlName === 'license_copy') {
    this.licenseFileList = fileList;
  }
}

// handleimageRemove(): void {
//   this.hospitalform.patchValue({ image_location: [] });
//   this.bannerFileList = [];
// }

handleLicenseRemove(): void {
  this.hospitalform.patchValue({ license_copy: [] });
  this.licenseFileList = [];
}




openConfirmDialog(templateRef: TemplateRef<any>) {
  this.dialogRef = this.dialog.open(templateRef);

  this.dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.disconnect();
    }
  });
}

@ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
openrestaurantform(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.restaurantDialog, {
    disableClose: true,
    width: '600px'
  });
}


@ViewChild('BloodbankDialog') BloodbankDialog!: TemplateRef<any>;
openbloodbank(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.BloodbankDialog, {
    disableClose: true,
    width: '600px'
  });
}



addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    email_id:['',Validators.required],
    contact_number:['',Validators.required],
    owner_name:['',Validators.required],
    website:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
   
   
    

  });
}

registerbloodbanksform(): void {
  this.bloodbankForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    blood_group:[''],
    organization_name:['',Validators.required],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
    owner_name:['',Validators.required],

    license_copy:[''],
    whatsapp_number:[''],
    license_number:['',Validators.required],
    contact_number:['',Validators.required],

  });
}


Addbloodbank() {
  this.spinner.show();
  if (this.bloodbankForm.valid) {
      this.templeservice.addnearestbloodbanks(this.bloodbankForm.value).subscribe(
          response => {
              console.log('Bloodbank added successfully:', response);
              this.notificationHelper.showSuccessNotification('Blood Bank Added Successfully', '');

              this.bloodbankForm.reset();
              //  window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
           this.spinner.hide();   
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Blood Bank', '');
              this.spinner.hide();
          }
      );
  } else {
      this.bloodbankForm.markAllAsTouched();
      this.spinner.hide();
  }
}


Uploadbllodbankimage(info:NzUploadChangeParam):void {
  this.adddbloodbanktimage(info, 'image_location');
 }

 adddbloodbanktimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.bloodbankForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.bloodbankForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}



Uploadbllodbanklicenseimage(info:NzUploadChangeParam):void {
  this.adddbloodbanktlicenseimage(info, 'license_copy');
 }

 adddbloodbanktlicenseimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.bloodbankForm.patchValue({ license_copy: base64Images });
        console.log('Updated images form:', this.bloodbankForm.value);
      }
    });
  });

  if (formControlName === 'license_copy') {
    this.bannerFileList1 = fileList;
  }

  console.log('File upload:', info.fileList);
}




getbloodbankLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.bloodbankForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}



Addrestaurant() {
  this.spinner.show();
  if (this.restaurantForm.valid) {
      this.templeservice.addrestaurants(this.restaurantForm.value).subscribe(
          response => {
              console.log('restaurants added successfully:', response);
              this.notificationHelper.showSuccessNotification('Restaurant Details Added Successfully', '');

              this.restaurantForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Restaurant Details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.restaurantForm.markAllAsTouched();
      this.spinner.hide();
  }
}



Uploadrestaurantimage(info:NzUploadChangeParam):void {
  this.adddrestaurantimage(info, 'image_location');
 }

 adddrestaurantimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.restaurantForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.restaurantForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}







getrestruntantLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.restaurantForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

viewdistrict(districtId: string, dialogRef: MatDialogRef<any>) {
  this.dialog.closeAll(); 
  this.router.navigate(['/district-details', districtId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}

viewMandal(districtId: string,dialogRef: MatDialogRef<any>) {
  this.dialog.closeAll(); 
  this.router.navigate(['/mandal-details', districtId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}

selectedCategory: string | null = null;


selectCategory(categoryId: string): void {
  this.selectedCategory = categoryId;

  this.scrollToSection(categoryId);
}

scrollToSection(sectionId: string): void {
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}



selectedDescription: string = '';

openModal(desc: string): void {
  this.selectedDescription = desc;
}






@ViewChild('ambulanceDialog') ambulanceDialog!: TemplateRef<any>;
ambulanceservice(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.ambulanceDialog, {
    disableClose: true,
    width: '600px'
  });
}


ambulanceregisterform(): void {
  this.ambulanceForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    contact_number:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],

  });
}


Addambulace() {
  this.spinner.show();
  if (this.ambulanceForm.valid) {
      this.templeservice.addambulaceservices(this.ambulanceForm.value).subscribe(
          response => {
              console.log('Bloodbank added successfully:', response);
              this.notificationHelper.showSuccessNotification('Ambulance Details Added Successfully', '');

              this.ambulanceForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
               this.notificationHelper.showErrorNotification('Failed to Add Ambulance Details', '');
              this.spinner.hide();
          }
      );
  } else {
      this.ambulanceForm.markAllAsTouched();
      this.spinner.hide();
  }
}


Uploadambulanceimage(info:NzUploadChangeParam):void {
  this.adddambulaceimage(info, 'image_location');
 }

 adddambulaceimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.ambulanceForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.ambulanceForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}







getambulaceLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.ambulanceForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}






// fire station

  FirestationForm!: FormGroup;

@ViewChild('FireStationDialog') FireStationDialog!: TemplateRef<any>;
openfirestationform(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.FireStationDialog, {
    disableClose: true,
    width: '600px'
  });
}



addfirestationform(): void {
  this.FirestationForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    contact_number:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['', Validators.required],

  });
}





AddFireStation() {
  this.spinner.show();
  if (this.FirestationForm.valid) {
      this.templeservice.addfirestation(this.FirestationForm.value).subscribe(
          response => {
              console.log('restaurants added successfully:', response);
              this.notificationHelper.showSuccessNotification('Fire Station Added Successfully', '');

              this.FirestationForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        this.spinner.hide();      
          },
          error => {
              console.error('Error adding temple:', error);
        this.notificationHelper.showErrorNotification('Failed to Add Fire Station', '');
               this.spinner.hide();
          }
      );
  } else {
      this.FirestationForm.markAllAsTouched();
      this.spinner.hide();
  }
}



UploadFireStationimage(info:NzUploadChangeParam):void {
  this.adddfirestationimage(info, 'image_location');
 }

 adddfirestationimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.FirestationForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.FirestationForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}




getFireStationLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.FirestationForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}




// police station


PolicestationForm!:FormGroup;
PolicestationdataForm(): void {
  this.PolicestationForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['', Validators.required],
    name:['', Validators.required],
    contact_number:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    // village_id :this.route.snapshot.paramMap.get("id"),
    village_id: this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['', Validators.required],

  });
}



@ViewChild('policestationDialog') policestationDialog!: TemplateRef<any>;
openpolicastationform(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.policestationDialog, {
    disableClose: true,
    width: '600px'
  });
}
Addpolicestation() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.PolicestationForm.valid) {
      this.templeservice.addpolicestation(this.PolicestationForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Police Station Added Successfully', '');


              this.PolicestationForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Police Station', '');

              this.spinner.hide();
          }
      );
  } else {
      this.PolicestationForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getpolicestationLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.PolicestationForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

Uploadpolicestationimage(info:NzUploadChangeParam):void {
  this.adddpolicestationimage(info, 'image_location');
 }

  adddpolicestationimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.PolicestationForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.PolicestationForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}



    @ViewChild('stateDetailsTemplate') stateDetailsTemplate!: TemplateRef<any>;
viewstate(stateId: string, dialogRef: MatDialogRef<any>): void {
  this.dialog.closeAll(); 
  this.router.navigate(['/statewisetemples', stateId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}



getDynamicLabel(type: string): string {
  const districtValue = this.validatorForm.get('district')?.value;
  const districtLabel = this.DistrictOptions.find(opt => opt.value === districtValue)?.label;
  const isCity = districtLabel?.endsWith('_City');

  switch (type) {
    case 'district':
      return 'Please Select District / City';
    case 'mandal':
      return isCity ? 'Please Select Division' : 'Please Select Town / Mandal';
    case 'village':
      return isCity ? 'Please Select Area / Colony' : 'Please Select Village / Area';
    default:
      return `Please Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
}






currentSection = 'geo-Ancient';

sections = [
  { id: 'geo-Ancient', title: '1. Geographical & Demographic' },
  { id: 'eco-facilities', title: '2. Economic Information' },
  { id: 'eco-healthcentres', title: '3. Public Services' },
  { id: 'culture-festivals', title: '4. Cultural Profile' },
  { id: 'famous-personalities', title: '5. Famous Personalities' },
  { id: 'village-Artists', title: '6. Village Artists' }
];

selectSection(sectionId: string): void {
  this.currentSection = sectionId;
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}












//   currentSection = 'geo-Ancient';
//   activeSectionId = 'geo-Ancient';

//   @HostListener('window:scroll', [])






//   ngAfterViewInit(): void {
//     // Scroll to the section after view is fully initialized
//     setTimeout(() => {
//       const el = document.getElementById(this.currentSection);
//       // if (el) {
//       //   el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       // }
//     }, 200); // slight delay ensures DOM is fully rendered
//   }

// selectSection(main: string, sub: string): void {
//   this.currentSection = `${main}-${sub}`; // DO NOT lowercase
//   this.activeSectionId = this.currentSection;

//   setTimeout(() => {
//     const el = document.getElementById(this.currentSection);
//     el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   }, 100);
// }


@ViewChild('Geographicaldata') Geographicaldata!: TemplateRef<any>;
opengeographical(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.Geographicaldata, {
    disableClose: true,
    width: '600px'
  });
}



Addgeographicalfields(){
      this.GeographicalForm = this.fb.group({
      ancient_name: ['', Validators.required],
      geographic_location: [''],
      primary_language: ['', Validators.required],
      languages: [''],
      population: ['', Validators.required],
      male_population: [''],
      female_population: [''],
      others_population: [''],
      map_location:['',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      village_id: this.route.snapshot.paramMap.get("_id"),
      user_id : localStorage.getItem('user'),
      status:['INACTIVE'],


    });
}




Addgeographicalfieldsdata() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.GeographicalForm.valid) {
      this.templeservice.addgeographic(this.GeographicalForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Geographical Information Added Successfully', '');


              this.GeographicalForm.reset();
              //  window.location.reload();
                    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Geographical Information', '');

              this.spinner.hide();
          }
      );
  } else {
      this.GeographicalForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getgerogrpahicalLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.GeographicalForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

@ViewChild('villageDevelopmentFacilitiesTemplate') villageDevelopmentFacilitiesTemplate!: TemplateRef<any>;
opendevelopementecnomicprofile(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villageDevelopmentFacilitiesTemplate, {
    disableClose: true,
    width: '600px'
  });
}


villageDevelopmentFacilitiesForm!: FormGroup;
villageCulturalProfileForm!: FormGroup;
artistProfileForm!: FormGroup;
famousPersonForm!: FormGroup;

  yesNoFields = [

    { control: 'water_and_irrigation', label: 'Water and Irrigation' },
    { control: 'tap_water', label: 'Tap Water' },
    { control: 'toilet', label: 'Toilet Facility' },
    { control: 'health_centre', label: 'Health Centre' },
    { control: 'school', label: 'School' },
    { control: 'electricity', label: 'Electricity' },
    { control: 'gas', label: 'Gas Supply' },
    { control: 'post_office', label: 'Post Office' },
    { control: 'bank', label: 'Bank Facility' },
    { control: 'telephone', label: 'Telephone Service' },
    { control: 'college', label: 'College' },
    { control: 'internet', label: 'Internet Facility' },
    { control: 'street_drainage_system', label: 'Street Drainage System' },
  ];


  Addecnomicprofile(){

     this.villageDevelopmentFacilitiesForm = this.fb.group({
      agriculture: [''],
      handicraft: [''],
      handloom: [''],
      smallscale_industry: [''],
      dairy: [''],
      poultry: [''],
      fisheries: [''],
      cattle_breeding: [''],
      shepherding: [''],
      horticulture: [''],
      others: [''],
      water_and_irrigation: [''],
      tap_water: [''],
      toilet: [''],
      health_centre: [''],
      school: [''],
      electricity: [''],
      gas: [''],
      post_office: [''],
      bank: [''],
      telephone: [''],
      college: [''],
      internet: [''],
      street_drainage_system: [''],
      primarysource_of_livelihood_image:['',Validators.required],
      status: ['INACTIVE'],
      village_id: [this.route.snapshot.paramMap.get('_id')],
      user_id: [localStorage.getItem('user')],
    }, { validators: this.atLeastOneCheckedValidator });
  }

atLeastOneCheckedValidator(group: AbstractControl): ValidationErrors | null {
  const fields = [
    'agriculture','handicraft','handloom','smallscale_industry',
    'dairy','poultry','fisheries','cattle_breeding',
    'shepherding','horticulture','others'
  ];

  const hasOneChecked = fields.some(field => group.get(field)?.value);

  return hasOneChecked ? null : { atLeastOneRequired: true };
}

  onToggleChange(fieldName: string) {
  const control = this.villageDevelopmentFacilitiesForm.get(fieldName);

  if (this.toggleFields[fieldName]) {
    control?.setValidators([Validators.required]);
  } else {
    control?.clearValidators();
    control?.setValue('');
  }

  control?.updateValueAndValidity();
}



submitDevelopmentFacilities() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.villageDevelopmentFacilitiesForm.valid) {
      this.templeservice.villagedevelopementecnomicprofile(this.villageDevelopmentFacilitiesForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Village Developement Facilities Added Successfully', '');


              this.villageDevelopmentFacilitiesForm.reset();
              this.villageDevelopmentFacilitiesForm.clearValidators();
              this.villageDevelopmentFacilitiesForm.updateValueAndValidity();
              this.ecnomicimageList = [];
              //  window.location.reload();
                    setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);

              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Village Developement Facilities', '');

              this.spinner.hide();
          }
      );
  } else {
      this.villageDevelopmentFacilitiesForm.markAllAsTouched();
      this.spinner.hide();
  }
}



@ViewChild('villageculturalprofileTemplate') villageculturalprofileTemplate!: TemplateRef<any>;
openculturalprofile(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  this.dialogRef = this.dialog.open(this.villageculturalprofileTemplate, {
    disableClose: true,
    width: '600px'
  });
}


  Addcultural(){
     this.villageCulturalProfileForm = this.fb.group({
      famous_for: ['', Validators.required],
      religious_beliefs: ['', Validators.required],
      traditional_food: ['', Validators.required],
      traditional_dress: ['', Validators.required],
      traditional_ornaments: ['', Validators.required],
      specific_rituals: ['', Validators.required],
      festivals_name: ['', Validators.required],
      festival_participants: [''],
      festival_organizers: [''],
      festival_special_dishes: ['', Validators.required],
      art_forms_practiced: ['', Validators.required],
      linked_to_rituals: [''],
      production_techniques: [''],
      display_sale_occasions: [''],
      stories_songs: [''],
      present_status_of_art: [''],
      suggestions_for_revitalization: [''],
      suggestions_for_self_reliant: [''],
      status: ['INACTIVE'],
      village_id: [this.route.snapshot.paramMap.get('_id')],
      user_id: [localStorage.getItem('user')],
      religios_beliefs_image: [[]],
      traditional_food_image: [[]],
      traditional_dress_image: [[],Validators.required],
      traditional_ornaments_image: [[]],
      festivals_image: [[],Validators.required],
      art_forms_practiced_image: [[]]
    });
  }



    
submitCulturalProfile() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.villageCulturalProfileForm.valid) {
      this.templeservice.villageculturalprofile(this.villageCulturalProfileForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Cultural Profile Added Successfully', '');


              this.villageCulturalProfileForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Cultural Profile', '');

              this.spinner.hide();
          }
      );
  } else {
      this.villageCulturalProfileForm.markAllAsTouched();
      this.spinner.hide();
  }
}



@ViewChild('artistTraditionalProfileTemplate') artistTraditionalProfileTemplate!: TemplateRef<any>;
openartists(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.artistTraditionalProfileTemplate, {
    disableClose: true,
    width: '600px'
  });
}



famouspersonalites(): void {
    this.artistProfileForm = this.fb.group({
      artist_name: ['', Validators.required],
      traditional_occupation: ['', Validators.required],
      trained_under: [''],
      other_artists_list: [''],
      artist_image: ['',Validators.required],
      traditional_occupation_pics: [''],
      traditional_occupation_video: [''],
      trained_under_pics: [''],
      audio_recordings:[''],
      status: ['INACTIVE'],
      village_id: [this.route.snapshot.paramMap.get('_id')],
      user_id: [localStorage.getItem('user')],
    });

  }


  submitArtistProfile() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.artistProfileForm.valid) {
      this.templeservice.villageartists(this.artistProfileForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Village Artist Added Successfully', '');


              this.artistProfileForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Village Artist', '');

              this.spinner.hide();
          }
      );
  } else {
      this.artistProfileForm.markAllAsTouched();
      this.spinner.hide();
  }
}


artistImageList: NzUploadFile[] = [];
traditionalOccupationPicsList: NzUploadFile[] = [];
trainedUnderPicsList: NzUploadFile[] = [];
ecnomicimageList: NzUploadFile[] = [];



handleImageUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.artistProfileForm.patchValue({ [controlName]: base64Images });
      }
    });
  });

  switch (controlName) {
    case 'artist_image':
      this.artistImageList = fileList;
      break;
    case 'traditional_occupation_pics':
      this.traditionalOccupationPicsList = fileList;
      break;
    case 'trained_under_pics':
      this.trainedUnderPicsList = fileList;
      break;
  }
}

handleImageRemove(controlName: string): void {
  this.artistProfileForm.patchValue({ [controlName]: [] });
}



traditionalOccupationVideoList: NzUploadFile[] = [];

handleVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.artistProfileForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'traditional_occupation_video') {
    this.traditionalOccupationVideoList = fileList.slice(0, 1);
  }
}

handleVideoRemove(controlName: string): void {
  this.artistProfileForm.patchValue({ [controlName]: '' });

  if (controlName === 'traditional_occupation_video') {
    this.traditionalOccupationVideoList = [];
  }
}



audioRecordingsFileList: NzUploadFile[] = [];

handleAudioUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one audio file
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.artistProfileForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'audio_recordings') {
    this.audioRecordingsFileList = fileList.slice(0, 1);
  }
}

handleAudioRemove(controlName: string): void {
  this.artistProfileForm.patchValue({ [controlName]: '' });

  if (controlName === 'audio_recordings') {
    this.audioRecordingsFileList = [];
  }
}


@ViewChild('villagefamouspersonsTemplate') villagefamouspersonsTemplate!: TemplateRef<any>;
openvillagefamousperson(): void {
    const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagefamouspersonsTemplate, {
    disableClose: true,
    width: '600px'
  });
}


villagefamouspersons(){
  this.famousPersonForm = this.fb.group({
  person_name: ['', Validators.required],
  personal_details: ['', Validators.required],
  legends_stories: [''],
  person_family: ['', Validators.required],
  person_image: ['',Validators.required],
  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
});

}



personImageList: NzUploadFile[] = [];


  submitfamouspersons() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.famousPersonForm.valid) {
      this.templeservice.villagefamouspersons(this.famousPersonForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Village Famous Person Details Added Successfully', '');


              this.famousPersonForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Village Famous Person Details', '');

              this.spinner.hide();
          }
      );
  } else {
      this.famousPersonForm.markAllAsTouched();
      this.spinner.hide();
  }
}




// removePersonImage(): void {
//   this.personImageList = [];
//   this.famousPersonForm.patchValue({ person_image: '' });
// }

removePersonImage(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}




handlePersonImageUpload(info:NzUploadChangeParam):void {
  this.handlefamousPersonImageUpload(info, 'person_image');
 }

  handlefamousPersonImageUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.famousPersonForm.patchValue({ person_image: base64Images });
        console.log('Updated images form:', this.famousPersonForm.value);
      }
    });
  });

  if (formControlName === 'person_image') {
    this.personImageList  = fileList;
  }

  console.log('File upload:', info.fileList);
}



handleprimarysource_of_livelihood_image(info:NzUploadChangeParam):void {
  this.handleprimarysource_of_livelihood_imageecnomic(info, 'primarysource_of_livelihood_image');
 }

  handleprimarysource_of_livelihood_imageecnomic(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.villageDevelopmentFacilitiesForm.patchValue({ primarysource_of_livelihood_image: base64Images });
        console.log('Updated images form:', this.villageDevelopmentFacilitiesForm.value);
      }
    });
  });

  if (formControlName === 'primarysource_of_livelihood_image') {
    this.ecnomicimageList  = fileList;
  }

  console.log('File upload:', info.fileList);
}




religiosBeliefsImageList: NzUploadFile[] = [];
traditionalFoodImageList: NzUploadFile[] = [];
traditionalDressImageList: NzUploadFile[] = [];
traditionalOrnamentsImageList: NzUploadFile[] = [];
festivalsImageList: NzUploadFile[] = [];
artFormsPracticedImageList: NzUploadFile[] = [];
schoolImageList: NzUploadFile[] = [];

// Image Upload Handler
handleImageUploadcultural(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.villageCulturalProfileForm.patchValue({ [formControlName]: base64Images });
        console.log(`Updated ${formControlName}:`, this.villageCulturalProfileForm.value);
      }
    });
  });

  // Update image preview list
  switch (formControlName) {
    case 'religios_beliefs_image':
      this.religiosBeliefsImageList = fileList;
      break;
    case 'traditional_food_image':
      this.traditionalFoodImageList = fileList;
      break;
    case 'traditional_dress_image':
      this.traditionalDressImageList = fileList;
      break;
    case 'traditional_ornaments_image':
      this.traditionalOrnamentsImageList = fileList;
      break;
    case 'festivals_image':
      this.festivalsImageList = fileList;
      break;
    case 'art_forms_practiced_image':
      this.artFormsPracticedImageList = fileList;
      break;
  }
}


toggleFields: any = {
  agriculture: false,
  handicraft: false,
  handloom: false,
  smallscale_industry: false,
  dairy: false,
  poultry: false,
  fisheries: false,
  cattle_breeding: false,
  shepherding: false,
  horticulture: false,
  others: false,
};




@ViewChild('villageschoolTemplate') villageschoolTemplate!: TemplateRef<any>;
openvillageschool(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villageschoolTemplate, {
    disableClose: true,
    width: '600px'
  });
}


villagfescoolform(){
  this.schoolForm = this.fb.group({
  name: ['', Validators.required],
  address: ['', Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  school_type: ['PRIVATE'],
  desc: [''],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
email_id: ['', [Validators.required, Validators.email]],
  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[], Validators.required]
});

}



handleSchoolImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      if (base64Images.length === fileList.length) {
        this.schoolForm.patchValue({ image_location: base64Images });
      }
    });
  });

  this.schoolImageList = fileList;
}

removeSchoolImage(): void {
  this.schoolImageList = [];
  this.schoolForm.patchValue({ image_location: [] });
}




Addschool() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.schoolForm.valid) {
      this.templeservice.addschoolinfo(this.schoolForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('School Added Successfully', '');


              this.schoolForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add School', '');

              this.spinner.hide();
          }
      );
  } else {
      this.schoolForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getschoolLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.schoolForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}




@ViewChild('villagebankTemplate') villagebankTemplate!: TemplateRef<any>;
openvillagebanks(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagebankTemplate, {
    disableClose: true,
    width: '600px'
  });
}

@ViewChild('villagecollegeTemplate') villagecollegeTemplate!: TemplateRef<any>;
openvillagecollege(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagecollegeTemplate, {
    disableClose: true,
    width: '600px'
  });
}

@ViewChild('villagemarketTemplate') villagemarketTemplate!: TemplateRef<any>;
openvillagemarkets(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagemarketTemplate, {
    disableClose: true,
    width: '600px'
  });
}

@ViewChild('villagepostofficeTemplate') villagepostofficeTemplate!: TemplateRef<any>;
openvillagepost(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagepostofficeTemplate, {
    disableClose: true,
    width: '600px'
  });
}

@ViewChild('villagesportsTemplate') villagesportsTemplate!: TemplateRef<any>;
openvillagesports(): void {
      const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Member check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }
  this.dialogRef = this.dialog.open(this.villagesportsTemplate, {
    disableClose: true,
    width: '600px'
  });
}



getcollegeLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.collegeForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

collegeImageList: NzUploadFile[] = [];
collegeForm!:FormGroup;
bankForm!:FormGroup;
marketForm!:FormGroup;
postOfficeForm!:FormGroup;
sportsGroundForm!:FormGroup;

villagcollegeform(){
  this.collegeForm  = this.fb.group({
  name: ['', Validators.required],
  college_type: ['PRIVATE'],
  address: ['',Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  desc: [''],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  // email_id: ['',Validators.required],
  email_id: ['', [Validators.required, Validators.email]],
  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[],Validators.required]
});

}



handleCollegeImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.collegeForm.patchValue({ image_location: base64Images });
        console.log('Uploaded Images:', base64Images);
      }
    });
  });

  this.collegeImageList = fileList;
}


removeCollegeImage(): void {
  this.collegeImageList = [];
  this.collegeForm.patchValue({ image_location: [] });
}



Addcollege() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.collegeForm.valid) {
      this.templeservice.addcollegeinfo(this.collegeForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('College Added Successfully', '');


              this.collegeForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.collegeImageList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add College', '');

              this.spinner.hide();
          }
      );
  } else {
      this.collegeForm.markAllAsTouched();
      this.spinner.hide();
  }
}

bankImageList: NzUploadFile[] = [];

villagbankform(){
  this.bankForm   = this.fb.group({
 name: ['', Validators.required],
  branch_name: ['', Validators.required],
  manager_name: ['', Validators.required],
  bank_type: ['PUBLIC'],
  address: ['', Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  email_id: ['', [Validators.required, Validators.email]],
  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[], Validators.required] 
});

}


handleBankImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.bankForm.patchValue({ image_location: base64Images });
        console.log('Image Location:', base64Images);
      }
    });
  });

  this.bankImageList = fileList;
}



removeBankImage(): void {
  this.bankImageList = [];
  this.bankForm.patchValue({ image_location: [] });
}


getbankLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.bankForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}



Addbank() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.bankForm.valid) {
      this.templeservice.addbankinfo(this.bankForm.value).subscribe(
          response => {
              console.log('bank added successfully:', response);
              this.notificationHelper.showSuccessNotification('Bank Added Successfully', '');


              this.bankForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.bankImageList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding bank:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Bank', '');

              this.spinner.hide();
          }
      );
  } else {
      this.bankForm.markAllAsTouched();
      this.spinner.hide();
  }
}

marketImageList: NzUploadFile[] = [];


villagmarketform(){
  this.marketForm    = this.fb.group({
  name: ['', Validators.required],
  address: ['', Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  desc: [''],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  email_id: ['', [Validators.required, Validators.email]],

  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[],Validators.required] 
});

}


handleMarketImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.marketForm.patchValue({ image_location: base64Images });
      }
    });
  });

  this.marketImageList = fileList;
}


removeMarketImage(): void {
  this.marketImageList = [];
  this.marketForm.patchValue({ image_location: [] });
}


Addmarket() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.marketForm.valid) {
      this.templeservice.addmarketinfo(this.marketForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Market Added Successfully', '');


              this.marketForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.marketImageList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Market', '');

              this.spinner.hide();
          }
      );
  } else {
      this.marketForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getmarketLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.marketForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}


postOfficeImageList: NzUploadFile[] = [];


villagpostofficeform(){
  this.postOfficeForm     = this.fb.group({
  name: ['', Validators.required],
  branch_name: [''],
  address: ['', Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  desc: [''],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  email_id: ['', [Validators.email]],

  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[],Validators.required] 
});

}

handlePostOfficeImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64Images.push(base64);

      if (base64Images.length === fileList.length) {
        this.postOfficeForm.patchValue({ image_location: base64Images });
      }
    });
  });

  this.postOfficeImageList = fileList;
}


removePostOfficeImage(): void {
  this.postOfficeImageList = [];
  this.postOfficeForm.patchValue({ image_location: [] });
}


Addpostoffice() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.postOfficeForm.valid) {
      this.templeservice.addpostofficeinfo(this.postOfficeForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Post Office Added Successfully', '');


              this.postOfficeForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.postOfficeImageList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Post Office', '');

              this.spinner.hide();
          }
      );
  } else {
      this.postOfficeForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getpostofficeLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.postOfficeForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

onlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  // this.sportsGroundForm.get('contact_number')?.setValue(input.value);
}
villagsportsgroundform(){
  this.sportsGroundForm      = this.fb.group({
  name: ['', Validators.required],
  address: ['', Validators.required],
  map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
  desc: [''],
  contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
  email_id: [''],

  status: ['INACTIVE'],
  village_id: [this.route.snapshot.paramMap.get('_id')],
  user_id: [localStorage.getItem('user')],
  image_location: [[],Validators.required] 
});

}

handleSportsGroundImageUpload(info: NzUploadChangeParam): void {
  const fileList = [...info.fileList];
  const base64List: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      base64List.push(base64);

      if (base64List.length === fileList.length) {
        this.sportsGroundForm.patchValue({ image_location: base64List });
      }
    });
  });

  this.sportsGroundImages = fileList;
}



removeSportsGroundImage(): void {
  this.sportsGroundImages = [];
  this.sportsGroundForm.patchValue({ image_location: [] });
}


Addsportsground() {
  this.spinner.show();
  console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm")
  if (this.sportsGroundForm.valid) {
      this.templeservice.addsportsgroundinfo(this.sportsGroundForm.value).subscribe(
          response => {
              console.log('policestation added successfully:', response);
              this.notificationHelper.showSuccessNotification('Sports Ground Added Successfully', '');


              this.sportsGroundForm.reset();
               window.location.reload();


              // ✅ Clear the uploaded images
              this.sportsGroundImages = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide();
          },
          error => {
              console.error('Error adding temple:', error);
              this.notificationHelper.showErrorNotification('Failed to Add Sports Ground', '');

              this.spinner.hide();
          }
      );
  } else {
      this.sportsGroundForm.markAllAsTouched();
      this.spinner.hide();
  }
}

getsportsgroundLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.sportsGroundForm.patchValue({
          map_location: `https://www.google.com/maps?q=${lat},${lng}`,
        });
      },
      (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
sportsGroundImages: NzUploadFile[] = [];





navigatewelfarehome(goshala: any): void {
  this.goshalaId = goshala._id;
  this.goshalaStatus = goshala.status;
  

  // Check if the goshala is inactive
  if (this.goshalaStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This WElfare Home is under review', '');
    return;
  }

  // Check if the user is logged in
  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  // Navigate to the detail view with the goshala ID
  this.router.navigate(['DetailviewofWelfareHome',this.goshalaId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(error => console.error("Navigation failed:", error));
}




  selectedImage: any;


  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;
  // openImage(image: string) {
  //   this.selectedImage = image;

  //   this.dialog.open(this.imageDialog, {
  //     width: '75%',
  //     maxWidth: '700px',
  //     panelClass: 'image-preview-dialog'
  //   });
  // }
currentIndex = 0;
imageList: string[] = [];

  openImage(image: string, images: string[]) {
  this.imageList = images;
  this.currentIndex = images.indexOf(image);
  this.selectedImage = image;

  this.dialog.open(this.imageDialog, {
    width: '75%',
    maxWidth: '700px',
    panelClass: 'image-preview-dialog'
  });
}

nextImage() {
  if (this.currentIndex < this.imageList.length - 1) {
    this.currentIndex++;
    this.selectedImage = this.imageList[this.currentIndex];
  }
}

prevImage() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.selectedImage = this.imageList[this.currentIndex];
  }
}

  closeDialog() {
    this.dialog.closeAll();
  }
openGalleryFromButton(images: string[]) {
  if (!images || images.length === 0) {
    return;
  }

  this.imageList = images;
  this.currentIndex = 0;
  this.selectedImage = images[0];

  this.dialog.open(this.imageDialog, {
    width: '75%',
    maxWidth: '700px',
    panelClass: 'image-preview-dialog'
  });
}

getVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([\w-]{11})/);
  return match ? match[1] : '';
}

  preventLeadingSpace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }
  validateNameInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const key = event.key;

    // ✅ Allow control keys
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'Tab'
    ) {
      return;
    }

    // ✅ Allow letters, numbers and space only
    if (!/^[A-Za-z0-9 ]$/.test(key)) {
      event.preventDefault();
      return;
    }

    // ❌ Block leading space
    if (key === ' ' && value.length === 0) {
      event.preventDefault();
      return;
    }

    // ❌ Block double space
    if (key === ' ' && value.endsWith(' ')) {
      event.preventDefault();
      return;
    }
  }


  previewImage: string = '';
  previewVisible: boolean = false;



  handlePreview = (file: NzUploadFile): void => {
    console.log('Full file object:', file);

    if (file.url) {
      this.previewImage = file.url;
    } else if (file.thumbUrl) {
      this.previewImage = file.thumbUrl;
    } else if (file.originFileObj) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        console.log('Base64 image:', this.previewImage);
      };
      reader.readAsDataURL(file.originFileObj);
    }

    this.previewVisible = true;
  };


validatenumberInput(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  const key = event.key;

  // Allow control keys (Backspace, Delete, Arrow keys, Tab)
  if (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Tab'
  ) {
    return;
  }

  // Block numbers and special characters
  if (!/^[A-Za-z ]$/.test(key)) {
    event.preventDefault();
    return;
  }

  // Block leading space
  if (key === ' ' && value.length === 0) {
    event.preventDefault();
    return;
  }

  // Block double space
  if (key === ' ' && value.endsWith(' ')) {
    event.preventDefault();
    return;
  }
}

}
