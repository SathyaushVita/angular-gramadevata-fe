
import { Component, ElementRef, HostListener, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationHelper } from '../commons/notification';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VillageService } from '../../services/villageservice/village.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { RouterModule } from '@angular/router';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { AddHotelComponent } from '../add-hotel/add-hotel.component';
import { AddHospitalComponent } from '../add-hospital/add-hospital.component';
import { AddTourismComponent } from '../add-tourism/add-tourism.component';
import { AddWelfareHomeComponent } from '../add-welfare-home/add-welfare-home.component';
import { AddBloddBankComponent } from '../add-blodd-bank/add-blodd-bank.component';


@Component({
  selector: 'app-mandalview',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzUploadModule,NzButtonModule,NgxSpinnerModule,
    RouterModule
  ],
  templateUrl: './mandalview.component.html',
  styleUrl: './mandalview.component.css'
})
export class MandalviewComponent {

 validatorForm!:FormGroup;
 bloodbankForm!:FormGroup;
 hospitalform!:FormGroup;
 ambulanceForm!:FormGroup;
  temples: any[] = [];
  templegoshalas: any[] = [];
  events: any[] = [];
  locationId: any; 
  selectedLocationId: any;
  village_id:any;
  MandalOptions:any[]=[];
  VillageOptions:any[]=[];
  CategoryOptions:any[]=[];
  touroperator: any[] = [];
  transport: any[] = [];
  guides: any[] = [];
  tenplefacilities: any[] = [];
  socialactivities: any[] = [];
  prayersandbenfits: any[] = [];
  nearestplaces: any[] = [];
  nearesthotels: any[] = [];
  othertemples: any[] = [];
    villagedata: any[] = [];

allTemples: any[] = [];
  nearesthospitals: any[] = [];
  famoustemples: any[] = [];
  iconictemples: any[] = [];
  templeId: any;
  templeStatus: any;
  tourguides: any[] = [];
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions:any[]=[];
  InVillage = false;
  

  constructor(private templeservice:TempleserviceService, private route:ActivatedRoute,private locationservice:LocationService,
    private fb:FormBuilder, private router:Router,
    private dialog:MatDialog,private notificationHelper:NotificationHelper,
    private authenticationService:AuthenticationService,private renderer: Renderer2,private villageservice:VillageService,private spinner: NgxSpinnerService,
    


  ) {
      this.addrestaurantsform();
      this.tourismplaces();
      this.addnearbyhotels();
      this.addtouroperatorsform();
      this.addtourguideform();
      this.addnearbyhospitalss();
      this.addrestaurantsform();
      this.Addmoredetails();
      this.registerbloodbanksform();
      this.ambulanceregisterform();
      this.addfirestationform()
      this.PolicestationdataForm();
      this.BloodBankLocation();
      this.HospitalLocations();
      this.HotelLocations();
      this.TourismLocations();
      this.TourOperatorLocations();
      this.PoliceStationLocations();
      this.FireStationLocations();
      this.AmbulanceLocations();
  }


  
ngOnInit(): void {
  this.loadlocations(); // Always load locations

  // When route param (mandal) changes
  this.route.paramMap.subscribe(params => {
    this.selectedLocationId = params.get('id');

    if (this.selectedLocationId) {
      this.validatorForm.patchValue({ mandal: this.selectedLocationId });
      this.fetchVillages(this.selectedLocationId);

      // 🔐 Close the Find dropdown when mandal is updated from route
      this.dropdownOpen = false;
    }
  });

  // 🔁 When mandal is manually changed from UI, fetch villages & close dropdown
  this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalId => {
    if (mandalId) {
      this.fetchVillages(mandalId);
      this.validatorForm.get('village')?.reset();
      this.dropdownOpen = false; // 🔐 close dropdown
    }
  });
}

  // scrollToTop(): void {
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  applyFilters() {
    this.temples = []; 
    this.loadFilteredTemples()
  }



  clearvillage(): void {
    console.log("Village cleared");
    this.validatorForm.get('village')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('mandal')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }

  selectemandalName: string = '';


  loadlocations(): void {
    this.validatorForm = this.fb.group({
      mandal: ['', Validators.required],
      village: [{ value: '', disabled: true }, Validators.required]
    });
  


    
  
    this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalID => {
      if (mandalID) {
        this.selectedLocationId = mandalID;
        console.log('Mandal ID selected:', mandalID);  
        this.applyFilters(); 

        this.fetchVillages(mandalID);
        
        this.locationservice.getMandalDetails(mandalID).subscribe(
          (district: any) => {
            this.selectemandalName = district.name;
          },
          (error) => {
            console.error('Failed to fetch district name', error);
            this.selectemandalName = '';
          }
        );
           this.dropdownOpen = false;

      }
    });
    
  
    this.validatorForm.get('village')?.valueChanges.subscribe(villageID => {
      if (villageID) {
        this.selectedLocationId = villageID;
        console.log('Village ID selected:', villageID);
        this.applyFilters();
           this.dropdownOpen = false;

      }
    });
  }
  




    onReset(): void {
      this.validatorForm.reset();
      this.selectedLocationId = null;
      this.applyFilters();
    }


    
    fetchVillages(mandalID: string): void {
      this.locationservice.getvillages(mandalID).subscribe(
        (res) => {
          if (Array.isArray(res)) {
            this.VillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id
            })).sort((a, b) => a.label.localeCompare(b.label));
    
            this.validatorForm.get('village')?.enable();
          } else {
            console.error("Expected array for villages", res);
          }
        },
        (err) => console.error(err)
      );
    }
    

  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


GramadevataTemples:any;
    level: string = '';
    locationdetails:any
resturant:any;
 image: string = '';
  title: string = '';
  description: string = '';
  address: string = '';
    ambulancefacility: any[] = [];
  bloodbank: any[] = [];
  firestation: any[] = [];
  policestation: any[] = [];
   Welfarehomes:any[]=[];


loadFilteredTemples() {
  this.spinner.show();
 if (this.selectedLocationId) {
        this.templeservice.mandalfiltertemples(this.selectedLocationId).subscribe(
            (data) => {
                this.temples =  data.temples || [];
                this.templegoshalas=  data.goshalas || [];
                this.events=  data.events || [];
                this.othertemples=  data.other_temples || [];

                this.touroperator=  data.tour_operators || [];
                this.transport=  data.temple_transport || [];
                this.guides=  data.temple_guides || [];
                this.tenplefacilities=  data.temple_facilities || [];
                this.socialactivities=  data.social_activities || [];
                this.prayersandbenfits=  data.prayers_and_benefits || [];
                this.nearestplaces=  data.nearby_tourism_places || [];
                this.nearesthotels=  data.nearby_hotels || [];
                this.nearesthospitals=  data.nearby_hospitals || [];
                this.iconictemples = data.iconic_temples || [];
                this.famoustemples = data.famous_temples || [];
                this.tourguides=data.tour_guide|| [];
                this.policestation = data.police_station|| [];;
                this.firestation = data.fire_station|| [];;
                this.bloodbank = data.blood_bank|| [];;
                this.ambulancefacility = data.ambulance_facility|| [];;
                this.GramadevataTemples=data.gramadevata_temples||[];
                this.Welfarehomes = data.welfare_homes || [];

                      this.resturant = data.resturents;
                                this.allTemples = [
                                ...this.iconictemples,
                                ...this.famoustemples,
                                ...this.GramadevataTemples,
                                ...this.othertemples
                              ];
                  this.locationdetails=data.location_details;
                            //  if (this.locationdetails.village) {
                            //    this.level = 'village';
                            //  } else if (this.locationdetails.block) {
                            //    this.level = 'block';
                            //  } 
                            if (this.locationdetails.village) {
  this.level = 'village';
  this.image = this.locationdetails.village_image || 'assets/ohm.jpg';
  this.title = this.locationdetails.village;
  this.description = this.locationdetails.village_desc || '';
} else if (this.locationdetails.block) {
  this.level = 'block';
  this.image = this.locationdetails.block_image || 'assets/ohm.jpg';
  const blockName = this.locationdetails.block;
  this.title = blockName.includes('_Town') ? blockName : `${blockName} Block/Mandal`;
  this.description = this.locationdetails.block_desc || '';
}


                console.log(this.temples, "Filtered Temples with Location");
                        this.spinner.hide(); // ✅ Hide spinner after successful data fetch

            },
            (error) => {
                console.error('Error fetching Filtered Temples with Location:', error);
                        this.spinner.hide(); // ✅ Hide spinner after successful data fetch

            }
        );
    } 
    else {
    this.spinner.hide(); // ✅ Hide spinner if no location ID is selected
  }
  }




  navigateTo(route: string): void {
    const ismemberin = localStorage.getItem('is_member') === 'true';
    if (ismemberin === false) {
      this.openmemberDialog();
    } else {

      this.router.navigate([route], { state: { village_id: this.village_id } });
    }

  }

  openmemberDialog(): void {
    console.log('sssssssssss');
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  handlehospitalImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/image.png';
  }

  handlehotelImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/hotel.jpg';
  }
  
  navigateTempleDetail(_id:string):void{
    this.router.navigate(["getbytemples",_id])
    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error("Navigation failed:", error));
  }

  navigateEventdata(event: string): void {
    this.router.navigate(['detailviewevent', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }

  navigategoshala(event: string): void {
    this.router.navigate(['getbygoshala', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }


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
  handletourImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/world-tourism-day.jpg';
  }


  navigateTogramadevataDetail(data: any): void {
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

    goshalaId: any;
  goshalaStatus: any;

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




@ViewChild('tourplacesDialog') tourplacesDialog!: TemplateRef<any>;
opentourismplaces(): void {
  this.dialogRef = this.dialog.open(this.tourplacesDialog, {
    disableClose: true,
    width: '600px'
  });
}

tourismplaces(): void {
  this.tourismForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

  });
}






Addtourismplaces() {
  this.spinner.show();
  if (this.tourismForm.valid) {
      this.templeservice.addTempletourismplaces(this.tourismForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              window.location.reload();


              this.tourismForm.reset();

              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
               this.spinner.hide(); 
          },
          error => {
              console.error('Error adding temple:', error);
              this.spinner.hide(); 
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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

tourismForm!:FormGroup;


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
  this.dialogRef = this.dialog.open(this.hotelsDialog, {
    disableClose: true,
    width: '600px'
  });
}



addnearbyhotels(): void {
  this.hotelmForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    // hotel_rating:[''],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
          contact_number:[''],
          owner_name:[''],
          restaurent:[''],
              license_copy:[''],

    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
  });
}



Addhotels() {
   this.spinner.show();
  if (this.hotelmForm.valid) {
      this.templeservice.addnearbyhotels(this.hotelmForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              window.location.reload();
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide(); 
          },
          error => {
              console.error('Error adding temple:', error);
              this.spinner.hide(); 
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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
    disableClose: true,
    width: '600px'
  });
}


@ViewChild('tourguideDialog') tourguideDialog!: TemplateRef<any>;
openaddtoutguide(): void {
  this.dialogRef = this.dialog.open(this.tourguideDialog, {
    disableClose: true,
    width: '600px'
  });
}


addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    // rating:[''],
    tour_operator_name:['', Validators.required],
    mobile_number:['', Validators.required],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    email:['', Validators.required],
    website:['', Validators.required],
    contact_address:['', Validators.required],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
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
              window.location.reload();
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide(); 
          },
          error => {
              console.error('Error adding temple:', error);
              this.spinner.hide(); 
          }
      );
  } else {
      this.touroperatorForm.markAllAsTouched();
      this.spinner.hide(); 
  }
}

tourguideForm!:FormGroup;
touroperatorForm!:FormGroup;
hotelmForm!:FormGroup;




Addtyourtourguide() {
   this.spinner.show();
  if (this.tourguideForm.valid) {
      this.templeservice.addttourguide(this.tourguideForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
              window.location.reload();
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide(); 
          },
          error => {
              console.error('Error adding temple:', error);
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
    address:[''],
    name:[''],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
          contact_number:[''],
      owner_name:[''],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
          license_copy:[''],

  });
}



@ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
openaddnearbyhospitals(): void {
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







@ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
openrestaurantform(): void {
  this.dialogRef = this.dialog.open(this.restaurantDialog, {
    disableClose: true,
    width: '600px'
  });
}



addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    email_id:[''],
    contact_number:[''],
    website:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}





Addrestaurant() {
   this.spinner.show();
  if (this.restaurantForm.valid) {
      this.templeservice.addrestaurants(this.restaurantForm.value).subscribe(
          response => {
              console.log('restaurants added successfully:', response);

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
              this.spinner.hide(); 
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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

 detailsForm!:FormGroup;
restaurantForm!:FormGroup;
  bannerFileList: NzUploadFile[] = [];
  dialogRef!: MatDialogRef<any>;


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


getBase64(file: File, callback: (base64String: string) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = (reader.result as string).split(',')[1]; 
    callback(base64String);
  };
  reader.readAsDataURL(file);
}



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

getTransportIcon(type: string): string {
  if (type.toLowerCase().includes('train')) return '🚆';
  if (type.toLowerCase().includes('air')) return '✈️';
  if (type.toLowerCase().includes('road') || type.toLowerCase().includes('bus')) return '🚌';
  return '🚗';
}




Addmore() {
   this.spinner.show();
  if (this.detailsForm.valid) {
      this.villageservice.villageaddmoredetails(this.detailsForm.value).subscribe(
          response => {
              console.log('village added successfully:', response);
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              this.spinner.hide(); 
          },
          error => {
              console.error('Error adding village:', error);
              this.spinner.hide(); 
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide(); 
  }
}






getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.detailsForm.patchValue({
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


@ViewChild('AddmoreListDialog') AddmoreListDialog!: TemplateRef<any>;
openAddMoreDetailsDialog(): void {
  this.dialogRef = this.dialog.open(this.AddmoreListDialog, {
    disableClose: true,
    width: '600px',
  });
}



Addmoredetails(): void {
  this.detailsForm = this.fb.group({

    image_location:[''],
    desc:[''],
    map_location:[''],
    village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status: ['INACTIVE']

  });
}

// shareTemple(temple: any) {
//   const shareUrl = temple && temple._id 
//     ? `${window.location.origin}//mandal-details/${temple._id}`
//     : `${window.location.origin}//mandal-details/`; 

//   console.log('Share URL:', shareUrl);
//   // this.updateMetaTags(temple)

//   if (navigator.share) {
//     navigator.share({
//       title: temple ? temple.name : 'Temple',
//       text: temple && temple.desc ? temple.desc : 'Check out this temple!',
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
public siteWindow = window;

shareUrl(url: string) {
  if (!url) {
    alert("URL not found!");
    return;
  }

  if (navigator.share) {
    navigator.share({
      title: "Share Link",
      url: url   // <-- This makes it a clickable link
    }).catch(err => console.error("Share failed:", err));
  } else {
    alert(url);
  }
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

getImageByPriority(index: number): string {
  const allImages = [
    ...(this.locationdetails.village_images || []),
    ...(this.locationdetails.block_images || []),
    ...(this.locationdetails.district_images || [])
  ];
  return allImages[index] || 'assets/ohm.jpg';
}





@ViewChild('BloodbankDialog') BloodbankDialog!: TemplateRef<any>;
openbloodbank(): void {
  this.dialogRef = this.dialog.open(this.BloodbankDialog, {
    disableClose: true,
    width: '600px'
  });
}





registerbloodbanksform(): void {
  this.bloodbankForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    blood_group:[''],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
    license_copy:[''],
    whatsapp_number:[''],
    license_number:[''],
    contact_number:[''],
        owner_name:[''],

    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

  });
}

Addbloodbank() {
   this.spinner.show();
  if (this.bloodbankForm.valid) {
      this.templeservice.addnearestbloodbanks(this.bloodbankForm.value).subscribe(
          response => {
              console.log('Bloodbank added successfully:', response);

              this.bloodbankForm.reset();
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
              this.spinner.hide(); 
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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




@ViewChild('ambulanceDialog') ambulanceDialog!: TemplateRef<any>;
ambulanceservice(): void {
  this.dialogRef = this.dialog.open(this.ambulanceDialog, {
    disableClose: true,
    width: '600px'
  });
}


ambulanceregisterform(): void {
  this.ambulanceForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['',Validators.required],
    name:['',Validators.required],
    contact_number:['',Validators.required],

    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
  });
}


Addambulace() {
   this.spinner.show();
  if (this.ambulanceForm.valid) {
      this.templeservice.addambulaceservices(this.ambulanceForm.value).subscribe(
          response => {
              console.log('Bloodbank added successfully:', response);

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
  this.dialogRef = this.dialog.open(this.FireStationDialog, {
    disableClose: true,
    width: '600px'
  });
}



addfirestationform(): void {
  this.FirestationForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:['',Validators.required],
    name:['',Validators.required],
    contact_number:['',Validators.required],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
  });
}





AddFireStation() {
   this.spinner.show();
  if (this.FirestationForm.valid) {
      this.templeservice.addfirestation(this.FirestationForm.value).subscribe(
          response => {
              console.log('restaurants added successfully:', response);

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
    address:['',Validators.required],
    name:['',Validators.required],
    contact_number:['',Validators.required],
    // village_id :this.route.snapshot.paramMap.get("id"),
    // village_id: this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
  });
}



@ViewChild('policestationDialog') policestationDialog!: TemplateRef<any>;
openpolicastationform(): void {
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


bannerFileList1: NzUploadFile[] = [];

    
  closeDropdown(): void {
  this.dropdownOpen = false;
}
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
    dropdownOpen = false;

      @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;


  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    if (
      this.dropdownOpen &&
      this.dropdownContainer &&
      !this.dropdownContainer.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }


    BloodBankLocation() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.bloodbankForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.bloodbankForm.get('country')?.valueChanges.subscribe(countryId => {
      this.resetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.bloodbankForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.bloodbankForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.resetFormFields(['district', 'mandal', 'village_id']);
      this.bloodbankForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.bloodbankForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.bloodbankForm.get('district')?.valueChanges.subscribe(districtId => {
      this.resetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.bloodbankForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.bloodbankForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.bloodbankForm.get('village_id')?.reset();
      this.bloodbankForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.bloodbankForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private resetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.bloodbankForm.get(field)?.reset();
      this.bloodbankForm.get(field)?.disable();
    });

  
  }

      HospitalLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.hospitalform.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.hospitalform.get('country')?.valueChanges.subscribe(countryId => {
      this.HospitalresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.hospitalform.get('state')?.enable();
      }
    });

  // State -> Districts
   this.hospitalform.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.HospitalresetFormFields(['district', 'mandal', 'village_id']);
      this.hospitalform.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.hospitalform.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.hospitalform.get('district')?.valueChanges.subscribe(districtId => {
      this.HospitalresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.hospitalform.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.hospitalform.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.hospitalform.get('village_id')?.reset();
      this.hospitalform.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.hospitalform.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


 private HospitalresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.hospitalform.get(field)?.reset();
      this.hospitalform.get(field)?.disable();
    });

  
  }

      HotelLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.hotelmForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.hotelmForm.get('country')?.valueChanges.subscribe(countryId => {
      this.HotelresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.hotelmForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.hotelmForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.HotelresetFormFields(['district', 'mandal', 'village_id']);
      this.hotelmForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.hotelmForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.hotelmForm.get('district')?.valueChanges.subscribe(districtId => {
      this.HotelresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.hotelmForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.hotelmForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.hotelmForm.get('village_id')?.reset();
      this.hotelmForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.hotelmForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}

private HotelresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.hotelmForm.get(field)?.reset();
      this.hotelmForm.get(field)?.disable();
    });

  }


      TourismLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.tourismForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.tourismForm.get('country')?.valueChanges.subscribe(countryId => {
      this.tourismresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.tourismForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.tourismForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.tourismresetFormFields(['district', 'mandal', 'village_id']);
      this.tourismForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.tourismForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.tourismForm.get('district')?.valueChanges.subscribe(districtId => {
      this.tourismresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.tourismForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.tourismForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.tourismForm.get('village_id')?.reset();
      this.tourismForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.tourismForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private tourismresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.tourismForm.get(field)?.reset();
      this.tourismForm.get(field)?.disable();
    });

  
  }

     TourOperatorLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.touroperatorForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.touroperatorForm.get('country')?.valueChanges.subscribe(countryId => {
      this.touroperatorresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.touroperatorForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.touroperatorForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.touroperatorresetFormFields(['district', 'mandal', 'village_id']);
      this.touroperatorForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.touroperatorForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.touroperatorForm.get('district')?.valueChanges.subscribe(districtId => {
      this.touroperatorresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.touroperatorForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.touroperatorForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.touroperatorForm.get('village_id')?.reset();
      this.touroperatorForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.touroperatorForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private touroperatorresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.touroperatorForm.get(field)?.reset();
      this.touroperatorForm.get(field)?.disable();
    });

  
  }

      PoliceStationLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.PolicestationForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.PolicestationForm.get('country')?.valueChanges.subscribe(countryId => {
      this.PoliceStationresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.PolicestationForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.PolicestationForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.PoliceStationresetFormFields(['district', 'mandal', 'village_id']);
      this.PolicestationForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.PolicestationForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.PolicestationForm.get('district')?.valueChanges.subscribe(districtId => {
      this.PoliceStationresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.PolicestationForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.PolicestationForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.PolicestationForm.get('village_id')?.reset();
      this.PolicestationForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.PolicestationForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private PoliceStationresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.PolicestationForm.get(field)?.reset();
      this.PolicestationForm.get(field)?.disable();
    });

  
  }

     FireStationLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.FirestationForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.FirestationForm.get('country')?.valueChanges.subscribe(countryId => {
      this.FireStationresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.FirestationForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.FirestationForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.FireStationresetFormFields(['district', 'mandal', 'village_id']);
      this.FirestationForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.FirestationForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.FirestationForm.get('district')?.valueChanges.subscribe(districtId => {
      this.FireStationresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.FirestationForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.FirestationForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.FirestationForm.get('village_id')?.reset();
      this.FirestationForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.FirestationForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private FireStationresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.FirestationForm.get(field)?.reset();
      this.FirestationForm.get(field)?.disable();
    });

  
  }

      AmbulanceLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.ambulanceForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.ambulanceForm.get('country')?.valueChanges.subscribe(countryId => {
      this.AmbulanceresetFormFields(['state', 'district', 'mandal', 'village_id']);
      if (countryId) {
        this.templeservice.getbyStates(countryId).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.templeStateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id,
              }));
              this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error('Response is not an array:', res);
            }
          },
          (err) => console.log(err)
        );
        this.ambulanceForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.ambulanceForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.AmbulanceresetFormFields(['district', 'mandal', 'village_id']);
      this.ambulanceForm.get('district')?.disable();
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            console.log('Districts Response:', res);
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.ambulanceForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.ambulanceForm.get('district')?.valueChanges.subscribe(districtId => {
      this.AmbulanceresetFormFields(['mandal', 'village_id']);
      if (districtId) {
        this.templeservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.ambulanceForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.ambulanceForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.ambulanceForm.get('village_id')?.reset();
      this.ambulanceForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.ambulanceForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private AmbulanceresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.ambulanceForm.get(field)?.reset();
      this.ambulanceForm.get(field)?.disable();
    });

  
  }


  
  onVillageChange(villageId: string): void {
  if (villageId) {
    this.router.navigate(['villages', villageId]);
  }
}



  OpenAddtourismDilog(): void {
    const dialogRef = this.dialog.open(AddTourismComponent, {
      width: '600px', // optional
      data: { message: 'optional data' }, // optional
      autoFocus: false,
      backdropClass: 'dialog-backdrop' // optional custom class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }



    OpenAddhospitalmDilog(): void {
    const dialogRef = this.dialog.open(AddHospitalComponent, {
      width: '600px', // optional
      data: { message: 'optional data' }, // optional
      autoFocus: false,
      backdropClass: 'dialog-backdrop' // optional custom class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }


      OpenAddhotelDilog(): void {
    const dialogRef = this.dialog.open(AddHotelComponent, {
      width: '600px', // optional
      data: { message: 'optional data' }, // optional
      autoFocus: false,
      backdropClass: 'dialog-backdrop' // optional custom class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }



        OpenAddrestaurantDilog(): void {
    const dialogRef = this.dialog.open(AddRestaurantComponent, {
      width: '600px', // optional
      data: { message: 'optional data' }, // optional
      autoFocus: false,
      backdropClass: 'dialog-backdrop' // optional custom class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }


      OpenAddwelfarehomeDilog(): void {
        const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
          width: '80%',
          maxHeight: '90vh', // optional
          data: { message: 'optional data' }, // optional
          autoFocus: false,
          backdropClass: 'dialog-backdrop' // optional custom class
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed', result);
        });
      }


    OpenbloodbankDilog(): void {
    
      // 1️⃣ Check login first
      const user = this.authenticationService.getCurrentUser();
      if (!user) {
        this.authenticationService.showLoginModal();
        return;
      }
    
      // 2️⃣ Check membership
      const isMember = localStorage.getItem('is_member') === 'true';
      if (!isMember) {
        this.openmemberDialog();
        return;
      }
    
      // 3️⃣ Logged in + member → open Add Tourism dialog
      const dialogRef = this.dialog.open(AddBloddBankComponent, {
        width: '600px',
        autoFocus: false,
        disableClose: true,
        backdropClass: 'dialog-backdrop'
      });
    
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed', result);
      });
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

}
