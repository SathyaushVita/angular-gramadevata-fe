// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NzSelectModule } from 'ng-zorro-antd/select';
// import { LocationService } from '../../../services/location/location.service';
// import { state } from '@angular/animations';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';
// import { Router } from '@angular/router';
// import { VillageService } from '../../../services/villageservice/village.service';
// import { NotificationHelper } from '../../commons/notification';

// @Component({
//   selector: 'app-addvillage',
//   standalone: true,
//   imports: [
//     CommonModule,
//         NgxSpinnerModule,
//         NzFormModule,
//         NzInputModule,
//         NzSelectModule,
//         ReactiveFormsModule,
//         MatFormFieldModule,
//         MatSelectModule,
//         MatInputModule,
//         NzUploadModule
//   ],
//   templateUrl: './addvillage.component.html',
//   styleUrl: './addvillage.component.css'
// })
// export class AddvillageComponent {

//   templeForm!: FormGroup;
  
//   containsLocationDetails = false;
//   countries: any;
//   templeCountryOptions: any[] = [];
//   templeStateOptions: any[] = [];
//   templeDistrictOptions: any[] = [];
//   templeMandalOptions: any[] = [];
//   templeVillageOptions: any[] = [];
//   countryID:any[]=[];
//   formGroup: any;
//   bannerFileList: NzUploadFile[] = [];
//   imageLocation: string = '';
//   fileList: NzUploadFile[] = [];
//   villagedata: any;
//   villageid:any;

//   constructor(private fb: FormBuilder,
    
//     private spinner: NgxSpinnerService,
//     private locationservice: LocationService,
    
//     private router:Router,
//     private villageservice:VillageService,
//     private notificationHelper: NotificationHelper,

//   ) { }


//   ngOnInit() {
//     this.templeForm = this.fb.group({
//       name: ['', Validators.required],
//       pin_code: ['', Validators.required],
//       desc: [''],
//       status: ['INACTIVE'],
//       image_location: ['', Validators.required],
//       type: ['VILLAGE'],
//       country: ['', [Validators.required]],
//       state: [{ value: '', disabled: true }, [Validators.required]],
//       district: [{ value: '', disabled: true }, [Validators.required]],
//       block: [{ value: '', disabled: true }, [Validators.required]],
//       user: localStorage.getItem('user')
//     });
  
//     // Fetch all countries and populate dropdown
//     this.locationservice.GetAllCountries().subscribe(
//       (res) => {
//         this.templeCountryOptions = res.map((country: any) => ({
//           label: country.name,
//           value: country._id,
//         }));
//         this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));
//         this.spinner.hide();
//         const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
//         if (defaultCountry) {
//           this.templeForm.controls['country'].setValue(defaultCountry.value);
//         }
//       },
//       (err) => {
//         console.log(err);
//         this.spinner.hide();
//       }
//     );
  
//     // Listen for changes in the country dropdown and update states accordingly
//     this.templeForm.get('country')?.valueChanges.subscribe(countryId => {
//       if (countryId) {
//         this.locationservice.getbyStates(countryId).subscribe(
//           (res) => {
//             this.templeStateOptions = res.map((state: any) => ({
//               label: state.name,
//               value: state._id,
//             }));
//             this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
//             this.spinner.hide();
//           },
//           (err) => {
//             console.log(err);
//             this.spinner.hide();
//           }
//         );
//         // Reset and disable dependent fields
//         this.templeForm.get('state')?.reset();
//         this.templeForm.get('state')?.enable();
//         this.templeForm.get('district')?.reset();
//         this.templeForm.get('district')?.disable();
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.disable();
//       } else {
//         // Disable all dependent fields if no country is selected
//         this.templeForm.get('state')?.reset();
//         this.templeForm.get('state')?.disable();
//         this.templeForm.get('district')?.reset();
//         this.templeForm.get('district')?.disable();
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.disable();
//       }
//     });
  
//     // Listen for changes in the state dropdown and update districts accordingly
//     this.templeForm.get('state')?.valueChanges.subscribe(stateId => {
//       if (stateId) {
//         this.locationservice.getdistricts(stateId).subscribe(
//           (res) => {
//             this.templeDistrictOptions = res.map((district: any) => ({
//               label: district.name,
//               value: district._id,
//             }));
//             this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
//             this.spinner.hide();
//           },
//           (err) => {
//             console.log(err);
//             this.spinner.hide();
//           }
//         );
//         // Reset and disable dependent fields
//         this.templeForm.get('district')?.reset();
//         this.templeForm.get('district')?.enable();
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.disable();
//       } else {
//         // Disable district and block if no state is selected
//         this.templeForm.get('district')?.reset();
//         this.templeForm.get('district')?.disable();
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.disable();
//       }
//     });
  
//     // Listen for changes in the district dropdown and update blocks accordingly
//     this.templeForm.get('district')?.valueChanges.subscribe(districtId => {
//       if (districtId) {
//         this.locationservice.getblocks(districtId).subscribe(
//           (res) => {
//             this.templeMandalOptions = res.map((mandal: any) => ({
//               label: mandal.name,
//               value: mandal._id,
//             }));
//             this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
//             this.spinner.hide();
//           },
//           (err) => {
//             console.log(err);
//             this.spinner.hide();
//           }
//         );
//         // Enable block when a district is selected
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.enable();
//       } else {
//         // Disable block if no district is selected
//         this.templeForm.get('block')?.reset();
//         this.templeForm.get('block')?.disable();
//       }
//     });
//   }
  
  

//   onSubmit() {
//     this.spinner.show();
//     if (this.templeForm.valid) {
//       const { country, state, district, mandal, ...templeData } = this.templeForm.value;
//       console.log(this.templeForm, "999999999999999999")
//       this.villageservice.addvillage(templeData)
//         .subscribe(response => {
//           this.spinner.hide();
//           console.log('Temple added successfully:', response);
//           this.notificationHelper.showSuccessNotification('Village added successfully', '');

//           this.villageid = this.templeForm.value.object_id
//           console.log(this.villageid)
//           // this.router.navigate(["villages",templeData.object_id])
//           this.router.navigate(['home']);
//           // Handle response or redirect to another page
//         }, error => {
//           console.error('Error adding temple:', error);
//           this.notificationHelper.showErrorNotification('Village added Failed');

//           this.spinner.hide();
//           // Handle error
//         });
//     } else {
//       this.templeForm.markAllAsTouched();
//       console.log('Form is invalid.');
//       this.spinner.hide();
//     }
//   }


//   handleBannerFileRemove(): void {
//     // Handle file remove event if needed
//     if (this.bannerFileList.length === 0) {
//       // No files remaining, trigger validation message
//       this.bannerFileList = [];
//     }
//   }

//   handleBannerFileChange(info: NzUploadChangeParam): void {
//     this.handleUpload(info, 'bannerImage');
//   }

//   handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//     const fileList = [...info.fileList];

//     fileList.forEach((file: NzUploadFile) => {
//       this.getBase64(file.originFileObj!, (base64String: string) => {
//         file['base64'] = base64String;
//         this.templeForm.patchValue({ image_location: base64String });
        
//       });
//     });

//     this.templeForm.get(formControlName)?.setValue(fileList);

//     if (formControlName === 'images') {
//       this.fileList = fileList;
//     } else if (formControlName === 'bannerImage') {
//       this.bannerFileList = fileList;
//     }
//    console.log('image submit', this.templeForm.value);
//   }

  
 
//   getBase64(file: File, callback: (base64String: string) => void): void {
//     const reader = new FileReader();
//     reader.onload = () => {
//         let base64String = reader.result as string;
//         // Extract base64 string without the data URI scheme
//         base64String = base64String.split(',')[1];
//         console.log('Base64 string:', base64String); // Print base64 string
//         callback(base64String);
//     };
//     reader.readAsDataURL(file);
// }








// }



import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LocationService } from '../../../services/location/location.service';
import { state } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';

import { VillageService } from '../../../services/villageservice/village.service';
import { NotificationHelper } from '../../commons/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addvillage',
  standalone: true,
  imports: [
    CommonModule,
        NgxSpinnerModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        NzUploadModule
  ],
  templateUrl: './addvillage.component.html',
  styleUrl: './addvillage.component.css'
})
export class AddvillageComponent {

  templeForm!: FormGroup;
  
  containsLocationDetails = false;
  countries: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;

  constructor(private fb: FormBuilder,
    
    private spinner: NgxSpinnerService,
    private locationservice: LocationService,
    
    private router:Router,
    private villageservice:VillageService,
    private notificationHelper: NotificationHelper,

  ) { }


  ngOnInit() {
    this.templeForm = this.fb.group({
      name: ['', Validators.required],
      pin_code: ['', Validators.required],
      desc: [''],
      status: ['INACTIVE'],
      image_location: ['', Validators.required],
      type: ['VILLAGE',Validators.required],
      country: [null, Validators.required],
      //state: [{ value: '', disabled: true }, [Validators.required]],
      state: [null, Validators.required],
     // district: [{ value: '', disabled: true }, [Validators.required]],
      district: [null, Validators.required],
      //block: [{ value: '', disabled: true }, [Validators.required]],
       block: [null, Validators.required],
      user: localStorage.getItem('user')
    });
  
    // Fetch all countries and populate dropdown
    this.locationservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));
        this.spinner.hide();
        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.templeForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  
    // Listen for changes in the country dropdown and update states accordingly
    this.templeForm.get('country')?.valueChanges.subscribe(countryId => {
      if (countryId) {
        this.locationservice.getbyStates(countryId).subscribe(
          (res) => {
            this.templeStateOptions = res.map((state: any) => ({
              label: state.name,
              value: state._id,
            }));
            this.templeStateOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.spinner.hide();
          },
          (err) => {
            console.log(err);
            this.spinner.hide();
          }
        );
        // Reset and disable dependent fields
        this.templeForm.get('state')?.reset();
        this.templeForm.get('state')?.enable();
        this.templeForm.get('district')?.reset();
        this.templeForm.get('district')?.disable();
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.disable();
      } else {
        // Disable all dependent fields if no country is selected
        this.templeForm.get('state')?.reset();
        this.templeForm.get('state')?.disable();
        this.templeForm.get('district')?.reset();
        this.templeForm.get('district')?.disable();
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.disable();
      }
    });
  
    // Listen for changes in the state dropdown and update districts accordingly
    this.templeForm.get('state')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.locationservice.getdistricts(stateId).subscribe(
          (res) => {
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.spinner.hide();
          },
          (err) => {
            console.log(err);
            this.spinner.hide();
          }
        );
        // Reset and disable dependent fields
        this.templeForm.get('district')?.reset();
        this.templeForm.get('district')?.enable();
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.disable();
      } else {
        // Disable district and block if no state is selected
        this.templeForm.get('district')?.reset();
        this.templeForm.get('district')?.disable();
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.disable();
      }
    });
  
    // Listen for changes in the district dropdown and update blocks accordingly
    this.templeForm.get('district')?.valueChanges.subscribe(districtId => {
      if (districtId) {
        this.locationservice.getblocks(districtId).subscribe(
          (res) => {
            this.templeMandalOptions = res.map((mandal: any) => ({
              label: mandal.name,
              value: mandal._id,
            }));
            this.templeMandalOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.spinner.hide();
          },
          (err) => {
            console.log(err);
            this.spinner.hide();
          }
        );
        // Enable block when a district is selected
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.enable();
      } else {
        // Disable block if no district is selected
        this.templeForm.get('block')?.reset();
        this.templeForm.get('block')?.disable();
      }
    });
  }
  
  

  onSubmit() {
    this.spinner.show();
    if (this.templeForm.valid) {
      const { country, state, district, mandal, ...templeData } = this.templeForm.value;
      console.log(this.templeForm, "999999999999999999")
      this.villageservice.addvillage(templeData)
        .subscribe(response => {
          this.spinner.hide();
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Village added successfully', '');

          this.villageid = this.templeForm.value.object_id
          console.log(this.villageid)
          // this.router.navigate(["villages",templeData.object_id])
          this.router.navigate(['home']);
          // Handle response or redirect to another page
        }, error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Village added Failed');

          this.spinner.hide();
          // Handle error
        });
    } else {
      this.templeForm.markAllAsTouched();
      console.log('Form is invalid.');
      this.spinner.hide();
    }
  }

onCancel() {
   this.router.navigate(['/village']);
}

  handleBannerFileRemove(): void {
    // Handle file remove event if needed
    if (this.bannerFileList.length === 0) {
      // No files remaining, trigger validation message
      this.bannerFileList = [];
    }
  }

  handleBannerFileChange(info: NzUploadChangeParam): void {

  if (info.fileList.length > 10) {
    this.notificationHelper.showErrorNotification(
      'You can upload maximum 10 images only',
      ''
    );

    // Keep only first 10 files
    this.bannerFileList = info.fileList.slice(0, 10);
    return;
  }

  this.bannerFileList = info.fileList;
  this.handleUpload(info, 'bannerImage');
}


  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];

    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        this.templeForm.patchValue({ image_location: base64String });
         file.url = URL.createObjectURL(file.originFileObj!);
      });
    });

    this.templeForm.get(formControlName)?.setValue(fileList);

    if (formControlName === 'images') {
      this.fileList = fileList;
    } else if (formControlName === 'bannerImage') {
      this.bannerFileList = fileList;
    }
   console.log('image submit', this.templeForm.value);
  }

  
 
  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result as string;
        // Extract base64 string without the data URI scheme
        base64String = base64String.split(',')[1];
        console.log('Base64 string:', base64String); // Print base64 string
        callback(base64String);
    };
    reader.readAsDataURL(file);
}
handlePreview = (file: NzUploadFile) => {
  if (file.url) {
    window.open(file.url, '_blank'); // Opens in new tab
  } else if (file.originFileObj) {
    const url = URL.createObjectURL(file.originFileObj);
    window.open(url, '_blank');
  }
};

generatePreviewBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);   // This keeps full prefix
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}



    preventLeadingSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;

  if (event.key === ' ' && input.selectionStart === 0) {
    event.preventDefault(); 
  }
}
validateTempleName(event: KeyboardEvent) {
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

  // ✅ Allow letters, numbers and space
  if (!/^[A-Za-z0-9 ]$/.test(key)) {
    event.preventDefault();
    return;
  }

  // ✅ Prevent leading space
  if (key === ' ' && input.selectionStart === 0) {
    event.preventDefault();
    return;
  }

  // ✅ Prevent double space
  if (key === ' ' && value.endsWith(' ')) {
    event.preventDefault();
    return;
  }
}




}