import { Component, TemplateRef, ViewChild } from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon'
import { HomeserviceService } from '../../services/homeservice/homeservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { GoshalaService } from '../../services/goshalaservice/goshala.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { AddTourismComponent } from '../add-tourism/add-tourism.component';
import { AddHospitalComponent } from '../add-hospital/add-hospital.component';
import { AddHotelComponent } from '../add-hotel/add-hotel.component';
import { AddRestaurantComponent } from '../add-restaurant/add-restaurant.component';
import { DialogService ,DialogType } from '../../services/dialog.service';
import { PujariComponent } from '../pujari/pujari.component';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { NotificationHelper } from '../commons/notification';
import { NzModalRef } from 'ng-zorro-antd/modal/modal-ref';



@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NzIconModule,CommonModule, NzUploadModule, ReactiveFormsModule,MatDialogModule,NzFormModule,NzSelectModule,
    NgxSpinnerModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  dialogRef!: MatDialogRef<any>;
  templeCategories:any;
  poojastoreForm!:FormGroup;
  hospitalform!:FormGroup;
  veterinaryhospitalform!: FormGroup;
  hotelmForm!:FormGroup;
  touroperatorForm!:FormGroup;
  restaurantForm!:FormGroup;
  tourguideForm!:FormGroup;
  bloodbankForm!: FormGroup;
  templeVillageOptions: any[] = [];
  constructor(
    
    private homeservice: HomeserviceService,
    private router: Router,
    private authenticationService:AuthenticationService,
    private dialog: MatDialog,
    private fb:FormBuilder,
    private route:ActivatedRoute,  
    private templeservice:TempleserviceService ,private notificationHelper:NotificationHelper,
    private goshalaservice:GoshalaService,private spinner: NgxSpinnerService,private dialogService: DialogService
    ) {
      // this.addpoojastoreform();
      // this.addnearbyhospitalss();
      // this.registerbloodbanksform();
      // this.addvectinarynearbyhospitals();
      // this.addnearbyhotels();
      // this.addrestaurantsform();
      this.addtouroperatorsform();
      // this.addtourguideform();
      
     }

  ngOnInit(): void {
    this.FetchHomeData();
    // this.TourGuideLocations();
    this.TourOperatorLocations();
    // this.RestuarantssLocations();
    // this.PujaStoreLocations();
    // this.HospitalLocations();
    // this.BloodBankLocations();
    // this.HotelLocations();
    // this.VetinaryHospitalLocations();
      this.dialogService.dialog$.subscribe(type => {
      this.openDialog(type);
    });
  }

  FetchHomeData(): void {
  this.homeservice.getHomeData().subscribe({
    next: (data) => {
      this.templeCategories = data.templeCategories;
    },
    error: (error) => {
      console.error("Error fetching home data", error);
    }
  });
}



navigateToCategoryDetail(templeCategory: any): void {
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  
  this.router.navigate(["temple", templeCategory._id], { state: { templeCategory } })

    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    })
    .catch(error => console.error("Navigation failed:", error));
    
}


navigatetovisionmission(){
  this.router.navigate(["vision/mision"]).then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    })
    .catch(error => console.error("Navigation failed:", error));
}

aboutus(){
  this.router.navigate(["aboutus"]).then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    })
    .catch(error => console.error("Navigation failed:", error));
}

bannerFileList: NzUploadFile[] = [];
handleimageRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}

Uploadpoojastoreimage(info:NzUploadChangeParam):void {
  this.addpoojaimage(info, 'image_location');
 }

// Uploadhospitalimage(info:NzUploadChangeParam):void {
//   this.adddhospitalimage(info, 'image_location');
//  }

 Uploadtouroperatorimage(info:NzUploadChangeParam):void {
  this.addhospitalimage(info, 'image_location');
 }


//  Uploadhotelimage(info:NzUploadChangeParam):void {
//     this.adddhotelimage(info, 'image_location');
//    }
 Uploadbllodbankimage(info:NzUploadChangeParam):void {
  this.adddbloodbanktimage(info, 'image_location');
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



//  adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
//     const fileList = [...info.fileList];
  
//     // Initialize an empty array to store base64 strings
//     const base64Images: string[] = [];
  
//     fileList.forEach((file: NzUploadFile) => {
//       this.getBase64(file.originFileObj!, (base64String: string) => {
//         file['base64'] = base64String;
//         base64Images.push(base64String);
  
//         // Update the form control once all images are processed
//         if (base64Images.length === fileList.length) {
//           this.hotelmForm.patchValue({ image_location: base64Images });
//           console.log('Updated images form:', this.hotelmForm.value);
//         }
//       });
//     });
  
//     if (formControlName === 'image_location') {
//       this.bannerFileList = fileList;
//     }
  
//     console.log('File upload:', info.fileList);
//   }

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


addhospitalimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.touroperatorForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.touroperatorForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}


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

// adddhospitalimage(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   // Initialize an empty array to store base64 strings
//   const base64Images: string[] = [];

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       file['base64'] = base64String;
//       base64Images.push(base64String);

//       // Update the form control once all images are processed
//       if (base64Images.length === fileList.length) {
//         this.veterinaryhospitalform.patchValue({ image_location: base64Images });
//         console.log('Updated images form:', this.veterinaryhospitalform.value);
//       }
//     });
//   });

//   if (formControlName === 'image_location') {
//     this.bannerFileList = fileList;
//   }

//   console.log('File upload:', info.fileList);
// }

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

addpoojaimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.poojastoreForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.poojastoreForm.value);
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




 getveterinaryhospitalLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.veterinaryhospitalform.patchValue({
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


//   getvetinaryhospitalLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         this.hospitalform.patchValue({
//           map_location: `https://www.google.com/maps?q=${lat},${lng}`,
//         });
//       },
//       (error) => {
//         console.error('Error getting location', error);
//         alert('Unable to retrieve your location. Please try again.');
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   } else {
//     alert('Geolocation is not supported by this browser.');
//   }
// }

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


  getpoojastoreLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.poojastoreForm.patchValue({
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


@ViewChild('touroperatorDialog') touroperatorDialog!: TemplateRef<any>;
openaddtoutoperator(): void {
  this.dialogRef = this.dialog.open(this.touroperatorDialog, {
    disableClose: false,
    width: '600px'
  });
}



@ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
openrestaurantform(): void {
  this.dialogRef = this.dialog.open(this.restaurantDialog, {
    disableClose: false,
    width: '600px'
  });
  this.addrestaurantsform();
}

  @ViewChild('poojastoresDialog') poojastoresDialog!: TemplateRef<any>;
  openpoojastoresform(): void {
    this.dialogRef = this.dialog.open(this.poojastoresDialog, {
      disableClose: false,
      width: '600px'
    });
  }
  
  @ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
openaddnearbyhospitals(): void {
  this.dialogRef = this.dialog.open(this.nearbyhospitalsDialog, {
    disableClose: false,
    width: '600px'
  });
}

@ViewChild('BloodbankDialog') BloodbankDialog!: TemplateRef<any>;
openbloodbank(): void {
  this.dialogRef = this.dialog.open(this.BloodbankDialog, {
    disableClose: false,
    width: '600px'
  });
}


@ViewChild('hotelsDialog') hotelsDialog!: TemplateRef<any>;
  opennearbyhotels(): void {
    this.dialogRef = this.dialog.open(this.hotelsDialog, {
      disableClose: false,
      width: '600px'
    });
  }

@ViewChild('nearbyvetinaryhospitalsDialog') nearbyvetinaryhospitalsDialog!: TemplateRef<any>;
openaddvectinarynearbyhospitals(): void {
  this.dialogRef = this.dialog.open(this.nearbyvetinaryhospitalsDialog, {
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

  addpoojastoreform(): void {
    this.poojastoreForm = this.fb.group({
      map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
      address:[''],
      name:[''],
      owener_name:[''],
  
      temple_id :this.route.snapshot.paramMap.get("id"),
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
      this.bloodbankForm.markAllAsTouched();
      this.spinner.hide(); 
  }
}


addnearbyhotels(): void {
    this.hotelmForm = this.fb.group({
      map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
      address:[''],
      name:[''],
      // hotel_rating:[''],
      city_id :this.route.snapshot.paramMap.get("id"),
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

addtourguideform(): void {
  this.tourguideForm = this.fb.group({
    tourist_spot_covered:[''],
    language:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    mobile:[''],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

  });
}


Addtyourtourguide() {
  this.spinner.show();
  if (this.tourguideForm.valid) {
      this.templeservice.addttourguide(this.tourguideForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);

              this.tourguideForm.reset();
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
      this.tourguideForm.markAllAsTouched();
      this.spinner.hide(); 
  }
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
      // this.restaurantForm.markAllAsTouched();
      this.spinner.hide(); 
  }
}



addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    // rating:[''],
    tour_operator_name:['',Validators.required],
    mobile_number:['',Validators.required],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    image_location:['',Validators.required],
    status:['INACTIVE'],
    email:['',Validators.required],
website: [
  '',
  Validators.pattern(/^(https?:\/\/).+/)
],

    contact_address:['',Validators.required],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

  });
}


Addtouroperator() {
  this.spinner.show();
  if (this.touroperatorForm.valid) {
      this.templeservice.addtouroperatordetails(this.touroperatorForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
                        this.notificationHelper.showSuccessNotification('Tour Operator added successfully');

              this.bannerFileList = [];
              this.touroperatorForm.reset();
               window.location.reload();

        if (this.dialogRef) {
          this.dialogRef.close();
        }
            this.spinner.hide();   
          },
          error => {
              console.error('Error adding temple:', error);
              this.spinner.hide(); 
              this.notificationHelper.showErrorNotification('Tour Operator added failed');
          }
      );
  } else {
      this.touroperatorForm.markAllAsTouched();
      this.spinner.hide(); 
  }
}

Addhotels() {
  this.spinner.show();
    if (this.hotelmForm.valid) {
        this.templeservice.addnearbyhotels(this.hotelmForm.value).subscribe(
            response => {
                console.log('Temple added successfully:', response);
  
                this.hotelmForm.reset();
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
        this.hotelmForm.markAllAsTouched();
        this.spinner.hide(); 
    }
  }

  addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    
          contact_number:[''],
      owner_name:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
          license_copy:[''],

  });
}
  
addvectinarynearbyhospitals(): void {
  this.veterinaryhospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    goshala_id: this.route.snapshot.paramMap.get("id"),
    desc:[''],
    doctor_name:[''],

    // temple_id :this.route.snapshot.paramMap.get("id"),
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


addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    email_id:[''],
    contact_number:[''],
    website:[''],
    city_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],
      // country: ['', Validators.required ],
      // state: [{ value: '', disabled: true }, ],
      // district: [{ value: '', disabled: true },],
      // mandal: [{ value: '', disabled: true }, ],
      // village_id: [{ value: this.village_id, disabled: true }, ],

    
  });
}

registerbloodbanksform(): void {
  this.bloodbankForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    blood_group:[''],
        owner_name:[''],


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


Addpoojastore() {
  this.spinner.show();
  if (this.poojastoreForm.valid) {
    this.templeservice.addpoojastore(this.poojastoreForm.value).subscribe(
      response => {
        console.log('poojastore added successfully:', response);

       

        this.poojastoreForm.reset();
        this.bannerFileList = [];

        if (this.dialogRef) {
          this.dialogRef.close();
        }
this.spinner.hide(); 
        window.location.reload();
      },
      error => {
        console.error('Error adding pooja store:', error);
        this.spinner.hide(); 

       
      }
    );
  } else {
    this.poojastoreForm.markAllAsTouched();
    this.spinner.hide(); 
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
              console.error('Error adding Hospital:', error);
this.spinner.hide(); 
       
          }
      );
  } else {
      this.hospitalform.markAllAsTouched();
      this.spinner.hide(); 
  }
}
 
Addvetinaryhospital() {
  this.spinner.show();
  if (this.veterinaryhospitalform.valid) {
      this.goshalaservice.addvectinaryhospital(this.veterinaryhospitalform.value).subscribe(
          response => {
              console.log('Hospital added successfully:', response);
             
              this.veterinaryhospitalform.reset();
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
      this.veterinaryhospitalform.markAllAsTouched();
      this.spinner.hide(); 
  }
} 




  templeForm!: FormGroup;
  templeCategoryOptions: any[] = [];
  templePriorityOptions: any[] = [];
  templeStyleOptions: any[] = [];
  containsLocationDetails = false;
  countries: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;
  templeMapLocation: string = '';
  village_id: any;
  InVillage = false;
  village: any;







  TourGuideLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.tourguideForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.tourguideForm.get('country')?.valueChanges.subscribe(countryId => {
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
        this.tourguideForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.tourguideForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.resetFormFields(['district', 'mandal', 'village_id']);
      this.tourguideForm.get('district')?.disable();
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
        this.tourguideForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.tourguideForm.get('district')?.valueChanges.subscribe(districtId => {
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
        this.tourguideForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.tourguideForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.tourguideForm.get('village_id')?.reset();
      this.tourguideForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.tourguideForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private resetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.tourguideForm.get(field)?.reset();
      this.tourguideForm.get(field)?.disable();
    });

  
  }





  VetinaryHospitalLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.veterinaryhospitalform.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.veterinaryhospitalform.get('country')?.valueChanges.subscribe(countryId => {
      this.VetinaryHospitalresetFormFields(['state', 'district', 'mandal', 'village_id']);
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
        this.veterinaryhospitalform.get('state')?.enable();
      }
    });

  // State -> Districts
   this.veterinaryhospitalform.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.VetinaryHospitalresetFormFields(['district', 'mandal', 'village_id']);
      this.veterinaryhospitalform.get('district')?.disable();
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
        this.veterinaryhospitalform.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.veterinaryhospitalform.get('district')?.valueChanges.subscribe(districtId => {
      this.VetinaryHospitalresetFormFields(['mandal', 'village_id']);
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
        this.veterinaryhospitalform.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.veterinaryhospitalform.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.veterinaryhospitalform.get('village_id')?.reset();
      this.veterinaryhospitalform.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.veterinaryhospitalform.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private VetinaryHospitalresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.veterinaryhospitalform.get(field)?.reset();
      this.veterinaryhospitalform.get(field)?.disable();
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



  RestuarantssLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.restaurantForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.restaurantForm.get('country')?.valueChanges.subscribe(countryId => {
      this.restuarantresetFormFields(['state', 'district', 'mandal', 'village_id']);
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
        this.restaurantForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.restaurantForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.restuarantresetFormFields(['district', 'mandal', 'village_id']);
      this.restaurantForm.get('district')?.disable();
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
        this.restaurantForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.restaurantForm.get('district')?.valueChanges.subscribe(districtId => {
      this.restuarantresetFormFields(['mandal', 'village_id']);
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
        this.restaurantForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.restaurantForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.restaurantForm.get('village_id')?.reset();
      this.restaurantForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.restaurantForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private restuarantresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.restaurantForm.get(field)?.reset();
      this.restaurantForm.get(field)?.disable();
    });

  
  }



PujaStoreLocations() {

  this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.poojastoreForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  

    
    

  this.poojastoreForm.get('country')?.valueChanges.subscribe(countryId => {
      this.pujastoreresetFormFields(['state', 'district', 'mandal', 'village_id']);
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
        this.poojastoreForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.poojastoreForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.pujastoreresetFormFields(['district', 'mandal', 'village_id']);
      this.poojastoreForm.get('district')?.disable();
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
        this.poojastoreForm.get('district')?.enable();
      }
    });

  // District -> Mandals
   this.poojastoreForm.get('district')?.valueChanges.subscribe(districtId => {
      this.pujastoreresetFormFields(['mandal', 'village_id']);
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
        this.poojastoreForm.get('mandal')?.enable();
      }
    });

  // Mandal -> Villages
  this.poojastoreForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.poojastoreForm.get('village_id')?.reset();
      this.poojastoreForm.get('village_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.poojastoreForm.get('village_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
}


    private pujastoreresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.poojastoreForm.get(field)?.reset();
      this.poojastoreForm.get(field)?.disable();
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






  
  BloodBankLocations() {

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
      this.BloodBankresetFormFields(['state', 'district', 'mandal', 'village_id']);
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
      this.BloodBankresetFormFields(['district', 'mandal', 'village_id']);
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
      this.BloodBankresetFormFields(['mandal', 'village_id']);
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

private BloodBankresetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.bloodbankForm.get(field)?.reset();
      this.bloodbankForm.get(field)?.disable();
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


  navigatetowelfarehomes(){
  this.router.navigate(["Welfare-Home-Form"]).then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    })
    .catch(error => console.error("Navigation failed:", error));
}



navigateTowelfarehomesfilters():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Welfare-Homes","WelfareHomes"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}


openpoojastores():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["pooja-stores"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}


OpenhospitalDilog():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Hospitals"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}

bloodbank():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Blood-Banks"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}

openvectinarynearbyhospitals():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["vertinary-hospitals"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}
OpenhotelDilog():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Hotels"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}


OpenrestaurantDilog():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Restaurants"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}

OpentouroperatorsDilog():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["tour-operator"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}




 openDialog(type: DialogType) {
    let template!: TemplateRef<any>;

    if (type === 'pooja') template = this.poojastoresDialog;
    if (type === 'bloodbank') template = this.BloodbankDialog;
    if (type === 'vet') template = this.nearbyvetinaryhospitalsDialog;
    if (type === 'operator') template = this.touroperatorDialog;

    this.dialog.open(template, {
      width: '600px',
      maxHeight: '90vh',
      autoFocus: false
    });
  }



navigatevillage():void{
  this.router.navigate(["village"])  .then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top
  }).catch(error => console.error("Navigation failed:", error));
}
  categorydata:any;


navigateToTempleFilters(): void {
  this.templeservice.gettemplecategorybyname("Ayyappa Swamy").subscribe(
    data => {
      this.categorydata = data._Id;
      this.router.navigate(["temple", "e9e8933f-81ee-42bd-9b6d-e923d30d2e5b"]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
      });
    },
    error => {
      console.error("Failed to fetch category:", error);
    }
  );
}
navigateToGoshalaCategoryDetail():void{
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["goshala",'AllGoshalas'])
  // .then(() => console.log("Navigation successful"))
  //   .catch(error => console.error("Navigation failed:", error));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}


navigateTonearesttourplaces():void{
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["tourism"])
  // .then(() => console.log("Navigation successful"))
  //   .catch(error => console.error("Navigation failed:", error));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}

navigateToEventsCategoryDetail():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["events","AllEvents"])
  // .then(()=> console.log("navigation succesfull"))
  // .catch(eroror =>console.error("navigation failed"));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}

// OpenPujariDilog(): void {
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }
//   this.villageid = this.route.snapshot.paramMap.get("_id")
//   console.log(this.villageid,"55454")
//   const dialogRef = this.dialog.open(PujariComponent, {
//     data: { displayName: 'addpujari', villageid: this.villageid },
//     autoFocus: false,
//     backdropClass: 'dialog-backdrop'
//   });
// }

OpenPujariDilog(): void {

  // 1️⃣ Login check
  const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Membership check
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  // 3️⃣ Logged in + member → open Pujari dialog
  this.villageid = this.route.snapshot.paramMap.get('_id');

  const dialogRef = this.dialog.open(PujariComponent, {
    data: {
      displayName: 'addpujari',
      villageid: this.villageid
    },
    autoFocus: false,
    backdropClass: 'dialog-backdrop'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Pujari dialog closed', result);
  });
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
      // Handle after dialog close actions here
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
previewVisible = false;



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
    };
    reader.readAsDataURL(file.originFileObj);
  }

  this.previewVisible = true;
};




}