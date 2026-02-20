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
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { NotificationHelper } from '../commons/notification';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { VillageService } from '../../services/villageservice/village.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AddWelfareHomeComponent } from '../add-welfare-home/add-welfare-home.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { AddTourismComponent } from '../add-tourism/add-tourism.component';
import { NzModalModule } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-statewise-temples-page',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzFormModule,NzUploadModule ,NzButtonModule,NgxSpinnerModule,MatDialogModule,
    RouterModule,
    MatButtonModule,
    NzModalModule
  ],
  templateUrl: './statewise-temples-page.component.html',
  styleUrl: './statewise-temples-page.component.css'
})
export class StatewiseTemplesPageComponent {

  dialogRef!: MatDialogRef<any>
  validatorForm!:FormGroup;
   temples: any[] = [];
   templegoshalas: any[] = [];
   events: any[] = [];
   locationId: any; 
   selectedLocationId: any;
   village_id:any;
   MandalOptions:any[]=[];
   VillageOptions:any[]=[];
   CategoryOptions:any[]=[];
   selectedDistrictName: string = '';
   touroperator: any[] = [];
   transport: any[] = [];
   guides: any[] = [];
   tenplefacilities: any[] = [];
   socialactivities: any[] = [];
   prayersandbenfits: any[] = [];
   nearestplaces: any[] = [];
   nearesthotels: any[] = [];
   nearesthospitals: any[] = [];
   famoustemples: any[] = [];
   iconictemples: any[] = [];
   tourguides: any[] = [];
   showSocialActivities = false;
   showFacilities = false;
   showFestivals = false;
   showPrayers = false;
   showTransportFacility = false;
  tourguideForm!:FormGroup;
  bloodbankForm!:FormGroup;
   ambulanceForm!:FormGroup;
 templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions:any[]=[];
  allTemples: any[] = [];
 InVillage = false;
 Welfarehomes:any[]=[];
   
 
   constructor(private templeservice:TempleserviceService, private route:ActivatedRoute,private locationservice:LocationService,
     private fb:FormBuilder, private router:Router,
     private dialog:MatDialog,       private notificationHelper:NotificationHelper,
     private authenticationService:AuthenticationService,private renderer: Renderer2,   private villageservice:VillageService,private spinner: NgxSpinnerService,
 
 
   ) {
    this.tourismplaces();
    this.TourismLocations();
   }
 



 @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;




@HostListener('document:click', ['$event'])
handleOutsideClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  const isInsideDropdown = this.dropdownContainer?.nativeElement?.contains(target);
  const isInsideDialog = !!target.closest('mat-dialog-container');
  const isDialogOpen = !!document.querySelector('mat-dialog-container');

  // Close dropdown only if:
  // - dropdown is open
  // - clicked outside dropdown
  // - and NO dialog is open
  if (this.dropdownOpen && !isInsideDropdown && !isDialogOpen) {
    this.dropdownOpen = false;
  }
}


// ngOnInit(): void {
//   this.route.paramMap.subscribe(params => {
//     this.selectedLocationId = params.get('id');
//     console.log('Route ID:', this.selectedLocationId); // ✅ check if this prints the ID

//     if (this.selectedLocationId) {
//       this.loadFilteredTemples(); 
//     }
//   });


//  this.validatorForm = this.fb.group({
//     country: [''],
//     state: ['', [Validators.required]],
//     district: ['', Validators.required],
//     mandal: ['', Validators.required],
//     village: ['', Validators.required]
//   });

//   this.locationservice.getNameByCountry('INDIA').subscribe(data => {
//     if (data?.length) {
//       this.country = data[101]._id;
//       this.validatorForm.patchValue({ country: this.country },{ emitEvent: false });

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



//     }
//   });

//   this.validatorForm.get('district')?.valueChanges.subscribe(districtId => {
//     if (this.mandalDialogRef) {
//       this.mandalDialogRef.close();
//       this.mandalDialogRef = null;
//     }
    

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

//       if (!this.isFormInitializing) {
//         this.locationservice.getDistrictDetails(districtId).subscribe(districtData => {
//           if (districtData?.name?.includes('')) {
//             this.districtDialogRef = this.dialog.open(this.districtDetailsTemplate, {
//               width: '400px',
//               data: districtData,
//               position: { top: '5%', right: '2%' },
//               //  disableClose: true,
//             });
//           }
//         });
//       }
//     }
//   });

//   this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalId => {
//     if (this.mandalDialogRef) {
//       this.mandalDialogRef.close();
//       this.mandalDialogRef = null;
//     }

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

//       if (!this.isFormInitializing) {
//         this.locationservice.getMandalDetails(mandalId).subscribe(mandalData => {
//           if (mandalData?.name?.includes('')) {
//             this.mandalDialogRef = this.dialog.open(this.mandalDetailsTemplate, {
//               width: '400px',
//               data: mandalData,
//               position: { top: '5%', left: '2%' },
//               //  disableClose: true,
//             });
//           }
//         });
//       }
//     }
//   });

// }



//   closeDropdown(): void {
//   this.dropdownOpen = false;
// }

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


ngOnInit(): void {

  // ---------- ROUTE PARAM ----------
  this.route.paramMap.subscribe(params => {
    this.selectedLocationId = params.get('id');
    console.log('Route ID:', this.selectedLocationId);

    if (this.selectedLocationId) {
      this.loadFilteredTemples();
    }
  });

  // ---------- FORM ----------
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



  onVillageChange(villageId: string): void {
  if (villageId) {
    this.router.navigate(['villages', villageId]);
  }
}


  onstateChange(stateId: string): void {
  if (stateId) {
    this.router.navigate(['statewisetemples', stateId]);
  }
}
 
   handleImageError(event: Event) {
     const imgElement = event.target as HTMLImageElement;
     imgElement.src = 'assets/ohm.jpg';
   }
 

 

     
     handlevillageImageError(event: Event) {
       const imgElement = event.target as HTMLImageElement;
       imgElement.src = 'assets/villagechatimage.jpg';
     }
 
 
     country: string = '';
     state: string = '';
     level: string = '';
     othertemples:any[]=[];
     locationdetails:any
     GramadevataTemples:any;

 


scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

loadFilteredTemples() {
  this.spinner.show();

  if (this.selectedLocationId) {
    this.templeservice.statewisefiltertemples(this.selectedLocationId).subscribe(
      (data: any) => {
        const result = data.results;

        this.country = result.location_details?.country || '';
        this.state = result.location_details?.state || '';
        this.temples = result.temples || [];
        this.templegoshalas = result.goshalas || [];
        this.events = result.events || [];
        this.nearestplaces = result.nearby_tourism_places || [];
        this.iconictemples = result.iconic_temples || [];
        this.famoustemples = result.famous_temples || [];
        this.GramadevataTemples = result.gramadevata_temples || [];
        this.Welfarehomes = result.welfare_homes || [];

        this.othertemples = result.other_temples || [];

        this.allTemples = [
          ...this.iconictemples,
          ...this.famoustemples,
          ...this.GramadevataTemples,
          ...this.othertemples
        ];

        this.locationdetails = result.location_details;

        if (this.locationdetails?.village) {
          this.level = 'village';
        } else if (this.locationdetails?.block) {
          this.level = 'block';
        } else if (this.locationdetails?.district) {
          this.level = 'district';
        } else if (this.locationdetails?.state) {
          this.level = 'state';
        }

        console.log(this.temples, "Filtered Temples with Location");
        this.spinner.hide(); // ✅ Hide spinner on success
      },
      (error) => {
        console.error('Error fetching Filtered Temples with Location:', error);
        this.spinner.hide(); // ✅ Hide spinner on error
      }
    );
  } else {
    this.spinner.hide(); // ✅ Hide spinner if no location ID is set
  }
}

 
 
 getDescriptionByLevel(): string {
      if (this.level === 'state') {
     return this.locationdetails?.state_desc || '';
   }
  else if (this.level === 'district') {
     return this.locationdetails?.district_desc || '';
   } else if (this.level === 'block') {
     return this.locationdetails?.block_desc || '';
   } else if (this.level === 'village') {
     return this.locationdetails?.village_desc || '';
   }
   
   return '';
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
 

  //  navigateTempleDetail(_id:string):void{
  //    this.router.navigate(["getbytemples",_id])
  //    .then(() => {
  //      console.log("Navigation successful");
  //      window.scrollTo({ top: 0, behavior: 'smooth' });
  //    })
  //    .catch(error => console.error("Navigation failed:", error));
  //  }
 
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
 
 
   templeId: any;
   templeStatus: any;
 
 

   city_id:any;
   detailsForm!:FormGroup;
   bannerFileList: NzUploadFile[] = [];

   handleimageRemove(): void {
     if (this.bannerFileList.length === 0) {
       this.bannerFileList = [];
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
 
 

   
   openMap(mapLocation: string) {
     if (mapLocation) {
       window.open(mapLocation, '_blank');
     } else {
       console.error('Map location URL is invalid');
     }
   }
 



 getRemainingAddress(address: string): string {
   const parts = address.split(',');
   return parts.length > 1 ? ', ' + parts.slice(1).join(',').trim() : '';
 }
 getVillageName(address: string): string {
   return address.split(',')[0].trim();
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
 

 
    goshalaId: any;
   goshalaStatus: any;
 

 
 
 Addmore() {
   if (this.detailsForm.valid) {
       this.villageservice.villageaddmoredetails(this.detailsForm.value).subscribe(
           response => {
               console.log('village added successfully:', response);
         if (this.dialogRef) {
           this.dialogRef.close();
         }
               
           },
           error => {
               console.error('Error adding village:', error);
           }
       );
   } else {
       this.detailsForm.markAllAsTouched();
   }
 }
 
 Addmoredetails(): void {
   this.detailsForm = this.fb.group({
 
     image_location:['',Validators.required],
     desc:[''],
    //  map_location:[''],
     village_id :this.route.snapshot.paramMap.get("_id"),
     user_id : localStorage.getItem('user'),
     status: ['INACTIVE']
 
   });
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
     disableClose: false,
     width: '600px',
   });
     this.Addmoredetails(); // Initialize the form
   // this.getCurrentLocation(); // Fetch location
 }
 

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




 

 
   getImageByPriority(index: number): string {
   const images = [
     ...(this.locationdetails.village_images || []),
     ...(this.locationdetails.block_images || []),
     ...(this.locationdetails.district_images || []),
      ...(this.locationdetails.state_images || []),
   ];
   return images[index] || 'assets/ohm.jpg';
 }
 


     dropdownOpen = false;
 

 toggleDropdown(): void {
   this.dropdownOpen = !this.dropdownOpen;
 }
 
 



ngAfterViewInit() {
  this.isFormInitializing = false;
}


  districtDialogRef: MatDialogRef<any> | null = null;
  mandalDialogRef: MatDialogRef<any> | null = null;
  @ViewChild('districtDetailsTemplate') districtDetailsTemplate!: TemplateRef<any>;
  @ViewChild('mandalDetailsTemplate') mandalDetailsTemplate!: TemplateRef<any>;
      @ViewChild('stateDetailsTemplate') stateDetailsTemplate!: TemplateRef<any>;

 
   DistrictOptions:any[]=[];
   isFormInitializing = true;
  StateOptions:any[]=[];
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

viewstate(stateId: string, dialogRef: MatDialogRef<any>): void {
  this.dialog.closeAll(); 
  this.router.navigate(['/statewisetemples', stateId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}



@ViewChild('tourplacesDialog') tourplacesDialog!: TemplateRef<any>;
opentourismplaces(): void {
  this.dialogRef = this.dialog.open(this.tourplacesDialog, {
    disableClose: false,
    width: '600px'
  });
}



OpenAddtourismDilog(): void {

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
  const dialogRef = this.dialog.open(AddTourismComponent, {
    width: '600px',
    autoFocus: false,
    backdropClass: 'dialog-backdrop'
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed', result);
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
    desc:[''],
    timings:[''],
    type:[''],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

  });
}



  tourismForm!: FormGroup;



Addtourismplaces() {
  if (this.tourismForm.valid) {
      this.templeservice.addTempletourismplaces(this.tourismForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);


              this.tourismForm.reset();

              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              
          },
          error => {
              console.error('Error adding temple:', error);
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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




// getDynamicLabel(type: string): string {
//   const districtValue = this.validatorForm.get('district')?.value;
//   const districtLabel = this.DistrictOptions.find(opt => opt.value === districtValue)?.label;
//   const isCity = districtLabel?.endsWith('_City');

//   switch (type) {
//     case 'district':
//       return 'District / City';
//     case 'mandal':
//       return isCity ? 'Division' : 'Town / Mandal';
//     case 'village':
//       return isCity ? 'Area / Colony' : 'Village / Area';
//     default:
//       return type.charAt(0).toUpperCase() + type.slice(1);
//   }
// }


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

stopDropdownClose(_open: boolean) {
  // Prevent dropdown from closing when select panel opens or closes
  event && event.stopPropagation?.();
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
        this.tourismForm.get('state')?.enable();
      }
    });

  // State -> Districts
   this.tourismForm.get('state')?.valueChanges.subscribe(stateId => {
    console.log('Selected State ID:', stateId);
      this.resetFormFields(['district', 'mandal', 'village_id']);
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


    private resetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.tourismForm.get(field)?.reset();
      this.tourismForm.get(field)?.disable();
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
 
 