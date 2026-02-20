
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { TemplecategoryserviceService } from '../../services/templecategoryservice/templecategoryservice.service';
import { TemplepriorityService } from '../../services/templePriorityservice/templepriority.service';
import { TempleStyle, enumToMap } from '../../enums/temple_style_enum';
import { LocationService } from '../../services/location/location.service';
import { state } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Route, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificationHelper } from '../commons/notification';
import { Location } from '@angular/common';



declare var google: any;

@Component({
  selector: 'app-addtemple',
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
        NzUploadModule,
        
      ],
  templateUrl: './addtemple.component.html',
  styleUrls: ['./addtemple.component.css']
})
export class AddtempleComponent implements OnInit {
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
  templeVillageOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;
  templeMapLocation: string = '';
  village_id: any;
  InVillage = false;
  village: any;
  


  // formGroup:any;

  constructor(private fb: FormBuilder,
    private templeservice: TempleserviceService,
    private spinner: NgxSpinnerService,
    private templecategoryservice: TemplecategoryserviceService,
    private templepriorityservice: TemplepriorityService,
    private locationservice: LocationService,
    private formBuilder: FormBuilder,
    private router:Router,
    private route:ActivatedRoute,
    private notificationHelper: NotificationHelper,private location: Location
  ) {}





  onCancel() {
    this.location.back();
      setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
  }


  ngOnInit() {
    this.fetchallCategorys();
    this.fetchAllPriority();
    this.InVillageId();




    this.village_id = history.state.village_id || null;
    console.log(this.village_id, "this.village_id");

    this.templeForm = this.fb.group({
      name: ['', Validators.required],
      is_navagraha_established: [false],
      construction_year: [],
      is_destroyed: [false],
      animal_sacrifice_status: [false],
      diety: ['', Validators.required],
      style: [''],
      // temple_map_location: ['', Validators.required,Validators.pattern(/^https?:\/\/.+/)],
      temple_map_location: [
  '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]
],

      address: [''],
      desc: [''],
      status: ['INACTIVE'],
      image_location: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      object_id: [{ value: this.village_id, disabled: true }, ],
      user: localStorage.getItem('user'),
      // temple_official_website: [''],
      temple_official_website: ['', [Validators.pattern('https?://.+')]],

      temple_timings: [''],
      temple_area: [''],
      contact_email: ['',[Validators.email]],
      contact_phone: [''],
      contact_name: [''],

      // country_name: [''],
      state_name: [''],
      district_name: [''],
      block_name: [''],
      village_name: [''],
      other_name: [''],
      temple_video:['']
    });

    // Conditionally update the form controls based on village_id
    if (this.village_id != null) {
      // Enable object_id before setting its value
      this.templeForm.get('object_id')?.enable();

      // Strictly set the value using setValue
      try {
        this.templeForm.get('object_id')?.setValue(this.village_id);
        console.log(this.templeForm.get('object_id')?.value, "Updated object_id value");
      } catch (error) {
        console.error("Error setting object_id:", error);
      }

      // Clear validators for location fields
      this.templeForm.get('country')?.clearValidators();
      this.templeForm.get('state')?.clearValidators();
      this.templeForm.get('district')?.clearValidators();
      this.templeForm.get('mandal')?.clearValidators();
    } else {
      // When village_id is null, disable object_id and require location fields
      this.templeForm.get('object_id')?.disable();
      this.templeForm.get('country')?.setValidators(Validators.required);
      this.templeForm.get('state')?.setValidators(null);
      this.templeForm.get('district')?.setValidators(null);
      this.templeForm.get('mandal')?.setValidators(null);
    }

    // Update validation status after changing validators
    this.templeForm.get('country')?.updateValueAndValidity();
    this.templeForm.get('state')?.updateValueAndValidity();
    this.templeForm.get('district')?.updateValueAndValidity();
    this.templeForm.get('mandal')?.updateValueAndValidity();
    this.templeForm.get('object_id')?.updateValueAndValidity();

    
  
    // Fetch all countries and populate dropdown
    this.templeservice.GetAllCountries().subscribe(
      (res) => {
        this.templeCountryOptions = res.map((country: any) => ({
          label: country.name,
          value: country._id,
        }));
        this.templeCountryOptions.sort((a, b) => a.label.localeCompare(b.label));

        const defaultCountry = this.templeCountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.templeForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  
    // Listen for changes in the country dropdown and update states accordingly
    this.templeForm.get('country')?.valueChanges.subscribe(countryId => {
      this.resetFormFields(['state', 'district', 'mandal', 'object_id']);
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
        this.templeForm.get('state')?.enable();
      }
    });
  
    // Listen for changes in the state dropdown and update districts accordingly
    this.templeForm.get('state')?.valueChanges.subscribe(stateId => {
      this.resetFormFields(['district', 'mandal', 'object_id']);
      if (stateId) {
        this.templeservice.getdistricts(stateId).subscribe(
          (res) => {
            this.templeDistrictOptions = res.map((district: any) => ({
              label: district.name,
              value: district._id,
            }));
            this.templeDistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
          },
          (err) => console.log(err)
        );
        this.templeForm.get('district')?.enable();
      }
    });
  
    // Listen for changes in the district dropdown and update mandals accordingly
    this.templeForm.get('district')?.valueChanges.subscribe(districtId => {
      this.resetFormFields(['mandal', 'object_id']);
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
        this.templeForm.get('mandal')?.enable();
      }
    });
  
    // Listen for changes in the mandal dropdown and update villages accordingly
    this.templeForm.get('mandal')?.valueChanges.subscribe(mandalId => {
      this.templeForm.get('object_id')?.reset();
      this.templeForm.get('object_id')?.disable();
      if (mandalId) {
        this.templeservice.getvillages(mandalId).subscribe(
          (res) => {
            this.templeVillageOptions = res.map((village: any) => ({
              label: village.name,
              value: village._id,
            }));
            this.templeVillageOptions.sort((a, b) => a.label.localeCompare(b.label));
            this.templeForm.get('object_id')?.enable();
          },
          (err) => console.log(err)
        );
      }
    });
  
    this.templeStyleOptions = enumToMap(TempleStyle);
    this.templeForm.controls['style'].setValue('O');
  
    this.formGroup = this.formBuilder.group({
      templeIsNavagraha: ['']
    });
  }
  
  // Utility function to reset and disable form fields
  private resetFormFields(fields: string[]) {
    fields.forEach(field => {
      this.templeForm.get(field)?.reset();
      this.templeForm.get(field)?.disable();
    });

  
  }
  

  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const lat = position.coords.latitude;
  //         const lng = position.coords.longitude;
  //         this.templeForm.patchValue({
  //           temple_map_location: `https://www.google.com/maps?q=${lat},${lng}`,
  //         });
  //       },
  //       (error) => {
  //         console.error('Error getting location', error);
  //       }
  //     );
  //   } else {
  //     alert('Geolocation is not supported by this browser.');
  //   }
  // }


  // getCurrentLocation() {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const lat = position.coords.latitude;
  //         const lng = position.coords.longitude;
  //         this.templeForm.patchValue({
  //           temple_map_location: `https://www.google.com/maps?q=${lat},${lng}`,
  //         });
  //       },
  //       (error) => {
  //         console.error('Error getting location', error);
  //         alert('Unable to retrieve your location. Please try again.');
  //       }
  //     );
  //   } else {
  //     alert('Geolocation is not supported by this browser.');
  //   }
  // }
 InVillageId(): void{

  this.village_id = history.state.village_id || null;

  if (this.village_id !== null) {
    this.InVillage = true;
    
  }else {
    this.InVillage = false
    console.log("fales")
  }
 }

  

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.templeForm.patchValue({
            temple_map_location: `https://www.google.com/maps?q=${lat},${lng}`,
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
  

  

  onSubmit() {
  this.spinner.show();
  console.log(this.templeForm, "Form Data at Submission");

  if (this.templeForm.valid) {
    // const { country, state, district, mandal, ...templeData } = this.templeForm.value;
    const { country, ...templeData } = this.templeForm.value;

    console.log(templeData, "Valid Form Data");

    // Get the village object_id
    this.village = this.templeForm.get('object_id')?.value||null;
    console.log(this.village, "Selected Village");

    // If village is not selected, use the fallback village_id
    if (!this.village) {
      this.templeForm.get('object_id')?.setValue(this.village_id);
      this.village = this.village_id;
      console.log(this.village_id, "Set object_id to village_id");
    }

    // Update the templeData with the correct object_id
    // templeData.object_id = this.village;
    templeData.object_id = this.village || null;

    // Add the temple using the service
    this.templeservice.addTemple(templeData).subscribe(
      response => {
        this.notificationHelper.showSuccessNotification('Temple added successfully', '');
        console.log('Temple added successfully:', response);
  
        // Navigate to the village page
        this.villageid = this.village;
        console.log(this.villageid, "Updated villageid");
        // this.router.navigate(["/home"]);
        this.spinner.hide();
        this.templeForm.reset();
        this.bannerFileList = [];
        this.addmoreVideoList = [];
        // window.location.reload();
//         setTimeout(() => {
//   window.location.reload();
// }, 1500);
    this.location.back();
      setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);

      
      },
      error => {
        console.error('Error adding temple:', error);
        this.notificationHelper.showErrorNotification('Temple added Failed');
        this.spinner.hide();
        this.templeForm.reset();

      }
    );
  } else {
          console.log("Form is invalid. Invalid fields:");
      Object.keys(this.templeForm.controls).forEach(field => {
        const control = this.templeForm.get(field);
        if (control && control.invalid) {
          console.log(`${field} is invalid with errors:`, control.errors);
        }
      });

    // Mark all fields as touched to trigger validation messages
      console.log("Form is invalid. Invalid fields:", this.templeForm.errors);
      console.log("Form Valid?", this.templeForm.valid);
console.log("Form Values:", this.templeForm.value);
    this.templeForm.markAllAsTouched();
    this.notificationHelper.showErrorNotification('Temple added Failed');
    this.spinner.hide();
  }
}


   
  

//   onSubmit() {
//     this.spinner.show();
//     console.log(this.templeForm, "Form Data at Submission");

//     if (this.templeForm.valid) {
//         const { country, state, district, mandal, ...templeData } = this.templeForm.value;
        
//         console.log(templeData, "Valid Form Data");
        
//         // Get the village object_id
//         this.village = this.templeForm.get('object_id')?.value;
//         console.log(this.village, "Selected Village");

//         // If village is not selected, set it to the village_id
//         if (this.village === null) {
//             this.templeForm.get('object_id')?.setValue(this.village_id);
//             console.log(this.village_id, "Set object_id to village_id");
//         }

//         // Update the templeData object with the correct object_id
//         templeData.object_id = this.templeForm.get('object_id')?.value;

//         // Add the temple using the service
//         this.templeservice.addTemple(templeData).subscribe(
//             response => {
//               this.notificationHelper.showSuccessNotification('Temple added successfully', '');
//                 console.log('Temple added successfully:', response);
                
//                 // Update villageid and navigate to the village page
//                 this.villageid = templeData.object_id;
//                 console.log(this.villageid, "Updated villageid");
//                 this.router.navigate(["villages", this.villageid]);

//                 this.spinner.hide();
//             },
//             error => {
//                 console.error('Error adding temple:', error);
//                 this.notificationHelper.showErrorNotification('Temple added Failed');
//                 // Hide spinner on error
//                 this.spinner.hide();
//             }
//         );
//     } else {
//         // Mark all fields as touched to trigger validation messages
//         this.templeForm.markAllAsTouched();
//         this.notificationHelper.showErrorNotification('Temple added Failed');
//         this.spinner.hide();
//     }
// }
// fetchallCategorys(): void {
//   this.templecategoryservice.GetallCategories().subscribe(
//     (res) => {
//       this.templeCategoryOptions = res
//         .filter((category: any) => 
//           category.name !== 'Sakthi Peetas (51)' && category.name !== 'Jyotirlingas (12)'
//         )
//         .map((category: any) => ({
//           label: category.name,
//           value: category._id,
//         }));
//     },
//     (err) => {
//       console.log(err);
//     }
//   );
// }


fetchallCategorys(): void {
  const excludedCategories = [
    'Jyotirlingas (12)',
    'Chardham (4)',
    'Chota Chardham (4)',
    'Asta Vinayaka (8)',
    'Divya Desam (108)',
    'Pancharama (5)',
    'Pancha Bhutha (5)',
    'Pancha Kedar (5)',
    'Pancha Prayag (5)',
    'Pancha Narasimha kshetras (5)',
    'Arupadai Veedu - subramaya (6)',
    'Maha Sakthi peetas (18)',
    'Sakthi Peetas (51)',
  ];

  this.templecategoryservice.GetallCategories().subscribe(
    (res) => {
      this.templeCategoryOptions = res
        .filter((category: any) => !excludedCategories.includes(category.name))
        .map((category: any) => ({
          label: category.name,
          value: category._id,
        }));
    },
    (err) => {
      console.log(err);
    }
  );
}




  // fetchallCategorys(): void {
  //   this.templecategoryservice.GetallCategories().subscribe(
  //     (res) => {
  //       res.forEach((category: any) => {
  //         this.templeCategoryOptions.push({
  //           label: category.name,
  //           value: category._id,
  //         });
  //       });
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  fetchAllPriority(): void {
    this.templepriorityservice.getpriority().subscribe((res) => {
      res.forEach((priority: any) => {
        this.templePriorityOptions.push({
          label: priority.name,
          value: priority._id,
        });
      });
    });
  }

 

  get deityList(): FormArray {
    return this.templeForm.get('deityList') as FormArray;
  }

  addField(): void {
    const newControl = this.fb.control('');
    this.deityList.push(newControl);
    console.log('add field ', this.templeForm.value);
  }

  removeField(index: number): void {
    if (this.deityList.length > 1) {
      this.deityList.removeAt(index);
    }
  }
handlePreview = (file: NzUploadFile) => {
  if (file.url) {
    window.open(file.url, '_blank'); // Opens in new tab
  } else if (file.originFileObj) {
    const url = URL.createObjectURL(file.originFileObj);
    window.open(url, '_blank');
  }
};

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

handleBannerFileRemove(file: any): boolean {
  // Remove the file from the list
  this.bannerFileList = this.bannerFileList.filter(f => f.uid !== file.uid);
  return true;
}

handleBannerFileChange(info:NzUploadChangeParam):void {
  this.handleUpload(info, 'bannerImage');
 }

 handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.templeForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.templeForm.value);
      }
       file.url = URL.createObjectURL(file.originFileObj!);
    });
  });

  if (formControlName === 'bannerImage') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}

generatePreviewBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);   // This keeps full prefix
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
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

currentUrl = window.location.href;

sharepage() {
  if (navigator.share) {
    navigator.share({
      title: 'Check this out!',
      text: 'Here is an interesting page',
      url: this.currentUrl,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing:', error));
  } else {
    alert('Share not supported on this browser. Copy the link manually.');
  }
}


isIndianSelected = false;
isDropdownVisible = false;
onCountryChange(value: string): void {
  this.isIndianSelected = value === 'a6e3b35d-d0b0-11ee-ade9-0242ac110002';
}

toggleDropdown(event: Event): void {
  this.isDropdownVisible = (event.target as HTMLInputElement).checked;
}

onStateChange(value: string): void {
  const selected = this.templeStateOptions.find(opt => opt.value === value);
  this.templeForm.get('state_name')?.setValue(selected?.label || '');
}

onDistrictChange(value: string): void {
  const selected = this.templeDistrictOptions.find(opt => opt.value === value);
  this.templeForm.get('district_name')?.setValue(selected?.label || '');
}

onMandalChange(value: string): void {
  const selected = this.templeMandalOptions.find(opt => opt.value === value);
  this.templeForm.get('block_name')?.setValue(selected?.label || '');
}

onVillageChange(value: string): void {
  const selected = this.templeVillageOptions.find(opt => opt.value === value);
  this.templeForm.get('village_name')?.setValue(selected?.label || '');
}




addmoreVideoList: NzUploadFile[] = [];

handleaddmoreVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.templeForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'temple_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.templeForm.patchValue({ [controlName]: '' });

  if (controlName === 'temple_video') {
    this.addmoreVideoList = [];
  }
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
