import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoshalaService } from '../../services/goshalaservice/goshala.service';
import { LocationService } from '../../services/location/location.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';

import { NgxSpinnerService,NgxSpinnerModule } from 'ngx-spinner';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { NotificationHelper } from '../commons/notification';
import { Location } from '@angular/common';


@Component({
  selector: 'app-addgoshala',
  standalone: true,
  imports: [
        CommonModule,
        NgxSpinnerModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        ReactiveFormsModule,
        NzUploadModule
      ],
  templateUrl: './addgoshala.component.html',
  styleUrl: './addgoshala.component.css'
})
export class AddgoshalaComponent {
  goshalaForm!: FormGroup;
  containsLocationDetails = false;
  countries: any;
  CountryOptions: any[] = [];
  StateOptions: any[] = [];
  DistrictOptions: any[] = [];
  MandalOptions: any[] = [];
  VillageOptions: any[] = [];
  countryID:any[]=[];
  stateID:any[]=[];
  districrID: any[]=[];
  mandalId:any[]=[];
  goshalaCategoryoptions:any[]=[];
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  village_id: any;
  InVillage = false;
  village: any;
  villageid: any;



  constructor(private goshalaservice:GoshalaService,
      private fb :FormBuilder,
       
       private locationservice:LocationService,
       private router:Router,
       private spinner: NgxSpinnerService,
       private notificationHelper: NotificationHelper,private location: Location
      ){ }

        onCancel() {
    this.location.back();
      setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
  }




  ngOnInit(){
    this.fetchallaCategories();
    this.InVillageId();

    this.village_id = history.state.village_id || null;
    console.log(this.village_id, "this.village_id");
    
    this.goshalaForm=this.fb.group({
      name:['',Validators.required],
      reg_num:[''],
      category: ['', [Validators.required]],
      contact_name:['', [Validators.required]],
      contact_phone: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      desc:[''],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      object_id: [{ value: '', disabled: true }, ],
      temple: null,
      image_location:[' '],
      address:[''],
      user:localStorage.getItem('user'),
      status: ['INACTIVE'],
      // map_location: ['', Validators.required],
            map_location: [
            '',
            [
              Validators.required,
              Validators.pattern(/^https?:\/\/.+/)
            ]
          ],
       state_name: [''],
      district_name: [''],
      block_name: [''],
      village_name: [''],
      other_name: [''],
      goshala_video:[''],
    
    })

    if (this.village_id != null) {
      // Enable object_id before setting its value
      this.goshalaForm.get('object_id')?.enable();

      // Strictly set the value using setValue
      try {
        this.goshalaForm.get('object_id')?.setValue(this.village_id);
        console.log(this.goshalaForm.get('object_id')?.value, "Updated object_id value");
      } catch (error) {
        console.error("Error setting object_id:", error);
      }

      // Clear validators for location fields
      this.goshalaForm.get('country')?.clearValidators();
      this.goshalaForm.get('state')?.clearValidators();
      this.goshalaForm.get('district')?.clearValidators();
      this.goshalaForm.get('mandal')?.clearValidators();
    } else {
      // When village_id is null, disable object_id and require location fields
      this.goshalaForm.get('object_id')?.disable();
      this.goshalaForm.get('country')?.setValidators(Validators.required);
      this.goshalaForm.get('state')?.setValidators(null);
      this.goshalaForm.get('district')?.setValidators(null);
      this.goshalaForm.get('mandal')?.setValidators(null);
    }

    // Update validation status after changing validators
    this.goshalaForm.get('country')?.updateValueAndValidity();
    this.goshalaForm.get('state')?.updateValueAndValidity();
    this.goshalaForm.get('district')?.updateValueAndValidity();
    this.goshalaForm.get('mandal')?.updateValueAndValidity();
    this.goshalaForm.get('object_id')?.updateValueAndValidity();


   

    this.locationservice.GetAllCountries().subscribe(
      (res)=> {
        this.CountryOptions = res.map((country:any) => ({
          label:country.name,
          value:country._id
        }));
        this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
        const defaultCountry = this.CountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.goshalaForm.controls['country'].setValue(defaultCountry.value);
        }
      },
      (err) => {
        console.log(err);
      }
    );



    


    this.goshalaForm.get('country')?.valueChanges.subscribe(countryID =>{
      if (countryID){
        this.locationservice.getbyStates(countryID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.StateOptions = res.map((state:any) => ({
                label:state.name,
                value:state._id
              }));
              this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
            }
            else {
              console.error("response is not an array type",res)
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.goshalaForm.get('state')?.reset();
        this.goshalaForm.get('state')?.enable();
        this.goshalaForm.get('district')?.reset();
        this.goshalaForm.get('mandal')?.reset();
        this.goshalaForm.get('village')?.reset();
        this.goshalaForm.get('district')?.disable();
        this.goshalaForm.get('mandal')?.disable();
        this.goshalaForm.get('village')?.disable();
      } else {
        // If no country selected, disable and clear state, district, mandal, and village select
        this.goshalaForm.get('state')?.reset();
        this.goshalaForm.get('state')?.disable();
        this.goshalaForm.get('district')?.reset();
        this.goshalaForm.get('district')?.disable();
        this.goshalaForm.get('mandal')?.reset();
        this.goshalaForm.get('mandal')?.disable();
        this.goshalaForm.get('village')?.reset();
        this.goshalaForm.get('village')?.disable();
      }
    });


    this.goshalaForm.get('state')?.valueChanges.subscribe(stateID => {
      if(stateID){
        this.locationservice.getdistricts(stateID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.DistrictOptions = res.map((district:any) => ({
                label:district.name,
                value:district._id
              }));
              this.DistrictOptions.sort((a,b) =>a.label.localeCompare(b.label));
            }
            else {
              console.error("response is not an array type",res)
            }
          },
          (err) =>{
            console.log(err);
          }

        );
        this.goshalaForm.get('district')?.enable();
        this.goshalaForm.get('district')?.reset();
        this.goshalaForm.get('mandal')?.reset();
        this.goshalaForm.get('village')?.reset();
        this.goshalaForm.get('mandal')?.disable();
        this.goshalaForm.get('village')?.disable();
      }
      else {
        this.goshalaForm.get('district')?.enable();
        this.goshalaForm.get('mandal')?.reset();
        this.goshalaForm.get('village')?.reset();
        this.goshalaForm.get('mandal')?.disable();
        this.goshalaForm.get('village')?.disable();
      }
    });

    this.goshalaForm.get('district')?.valueChanges.subscribe((districrID => {
      if (districrID){
        this.locationservice.getblocks(districrID).subscribe(res=>{
          if (Array.isArray(res)) {
            this.MandalOptions = res.map((mandal:any) =>({
              label:mandal.name,
              value:mandal._id
            }));
            this.MandalOptions.sort((a,b) =>a.label.localeCompare(b.label));
          }
          else {
            console.error("response is not an array type",res)
          }
          
        },
        (err) =>{
          console.log(err);
        }
      );
      this.goshalaForm.get('mandal')?.enable();
      this.goshalaForm.get('mandal')?.reset();
      this.goshalaForm.get('village')?.disable();
      this.goshalaForm.get('village')?.reset();     
      }
      else{
      this.goshalaForm.get('mandal')?.enable();
      this.goshalaForm.get('mandal')?.reset();
      this.goshalaForm.get('village')?.disable();
      this.goshalaForm.get('village')?.reset();    
      }
    }));


    this.goshalaForm.get('mandal')?.valueChanges.subscribe((mandalId => {
      if (mandalId){
        this.locationservice.getvillages(mandalId).subscribe( res => {
          if (Array.isArray(res)){
          this.VillageOptions = res.map((object_id:any) => ({
            label:object_id.name,
            value:object_id._id
          }));
          this.VillageOptions.sort((a,b)=>a.label.localeCompare(b.label)); 
        }
        else {
          console.error("response is not an array type",res)
        }

      },
      (err) =>{
        console.log(err)
      }
        );
        // this.goshalaForm.get('object_id')?.disable();
        this.goshalaForm.get('object_id')?.enable();
        this.goshalaForm.get('object_id')?.reset(); 
      }
      else {
        this.goshalaForm.get('object_id')?.disable();
        this.goshalaForm.get('object_id')?.reset(); 
      }
    }));



    
  }

  get contactNumber() {
    return this.goshalaForm.get('contact_phone');
  }

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
          this.goshalaForm.patchValue({
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


  fetchallaCategories():void{
    this.goshalaservice.getGoshalaCatgeories().subscribe(
      (res) => {
        res.forEach((category:any) =>{
          this.goshalaCategoryoptions.push({
            label:category.name,
            value:category._id
          })
        })
      },
      (err) => {
        console.log(err)
      }
    )
  }

//  onSubmit() {
//   this.spinner.show();
//   if(this.goshalaForm.valid){
  
//     const { country, state, district, mandal, ...GoshalaData } = this.goshalaForm.value;
//     this.goshalaservice.addgoshala(GoshalaData)
//     // this.router.navigate(["villages",GoshalaData.object_id])
    
//     .subscribe(response =>{
//       this.spinner.hide();
//       this.notificationHelper.showSuccessNotification('goshala added succesfully', '');
//       console.log("goshala added succesw fully",response)
//       this.router.navigate(["villages",GoshalaData.object_id])
//       },
//       (err)=> {
//         console.log(err)
//         this.spinner.hide();
//       }
     
//     )
//   }
//   else{
//     this.notificationHelper.showErrorNotification('goshala added Failed');
//     console.log("form is not valid")
//     this.goshalaForm.markAllAsTouched();
//     this.spinner.hide();
//   }
  
//  }

onSubmit() {
  this.spinner.show();
  console.log(this.goshalaForm, "Form Data at Submission");

  if (this.goshalaForm.valid) {
      const { country, state, district, mandal, ...GoshalaData } = this.goshalaForm.value;
      
      console.log(GoshalaData, "Valid Form Data");
      
      // Get the village object_id
      this.village = this.goshalaForm.get('object_id')?.value||null;
      console.log(this.village, "Selected Village");

      // If village is not selected, set it to the village_id
      if (this.village === null) {
          this.goshalaForm.get('object_id')?.setValue(this.village_id);
          console.log(this.village_id, "Set object_id to village_id");
      }

      // Update the templeData object with the correct object_id
      GoshalaData.object_id = this.goshalaForm.get('object_id')?.value||null;

      // Add the temple using the service
      this.goshalaservice.addgoshala(GoshalaData).subscribe(
          response => {
            this.notificationHelper.showSuccessNotification('Goshala added successfully', '');
              console.log('Goshala added successfully:', response);
              
              // Update villageid and navigate to the village page
              this.villageid = GoshalaData.object_id;
              console.log(this.villageid, "Updated villageid");
              // this.router.navigate(["villages", this.villageid]);
                // this.router.navigate(["/home"]);
                    this.location.back();
      setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
        

              this.spinner.hide();
          },
          error => {
              console.error('Error adding Goshala:', error);
              this.notificationHelper.showErrorNotification('Goshala added Failed');
              // Hide spinner on error
              this.spinner.hide();
          }
      );
  } else {
      // Mark all fields as touched to trigger validation messages
      this.goshalaForm.markAllAsTouched();
      this.notificationHelper.showErrorNotification('Goshala added Failed');
      this.spinner.hide();
  }
}

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
        this.goshalaForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.goshalaForm.value);
      }
    });
  });

  if (formControlName === 'bannerImage') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
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
  const selected = this.StateOptions.find(opt => opt.value === value);
  this.goshalaForm.get('state_name')?.setValue(selected?.label || '');
}

onDistrictChange(value: string): void {
  const selected = this.DistrictOptions.find(opt => opt.value === value);
  this.goshalaForm.get('district_name')?.setValue(selected?.label || '');
}

onMandalChange(value: string): void {
  const selected = this.MandalOptions.find(opt => opt.value === value);
  this.goshalaForm.get('block_name')?.setValue(selected?.label || '');
}

onVillageChange(value: string): void {
  const selected = this.VillageOptions.find(opt => opt.value === value);
  this.goshalaForm.get('village_name')?.setValue(selected?.label || '');
}


addmoreVideoList: NzUploadFile[] = [];

handleaddmoreVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.goshalaForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'goshala_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.goshalaForm.patchValue({ [controlName]: '' });

  if (controlName === 'goshala_video') {
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


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { GoshalaService } from '../../services/goshalaservice/goshala.service';
// import { LocationService } from '../../services/location/location.service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TempleserviceService } from '../../services/templeservice/templeservice.service';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { Subscription } from 'rxjs';
// import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NzFormModule } from 'ng-zorro-antd/form';
// import { NzInputModule } from 'ng-zorro-antd/input';
// import { NzSelectModule } from 'ng-zorro-antd/select';
// import { NzUploadModule } from 'ng-zorro-antd/upload';

// @Component({
//   selector: 'app-addgoshala',
//   standalone: true,
//   imports: [
//     CommonModule,
//     NgxSpinnerModule,
//     NzFormModule,
//     NzInputModule,
//     NzSelectModule,
//     ReactiveFormsModule,
//     NzUploadModule
//   ],
//   templateUrl: './addgoshala.component.html',
//   styleUrls: ['./addgoshala.component.css']
// })
// export class AddgoshalaComponent {
//   goshalaForm!: FormGroup;
//   containsLocationDetails = false;
//   CountryOptions: any[] = [];
//   StateOptions: any[] = [];
//   DistrictOptions: any[] = [];
//   MandalOptions: any[] = [];
//   VillageOptions: any[] = [];
//   goshalaCategoryoptions: any[] = [];
//   bannerFileList: NzUploadFile[] = [];
//   imageLocation: string = '';
//   fileList: NzUploadFile[] = [];

//   constructor(
//     private goshalaservice: GoshalaService,
//     private fb: FormBuilder,
//     private templeservice: TempleserviceService,
//     private locationservice: LocationService
//   ) {}

//   ngOnInit() {
//     this.fetchallaCategories();
//     this.goshalaForm = this.fb.group({
//       name: ['', Validators.required],
//       reg_num: ['', Validators.required],
//       category: ['', Validators.required],
//       country: ['', Validators.required],
//       state: [{ value: '', disabled: true }, Validators.required],
//       district: [{ value: '', disabled: true }, Validators.required],
//       mandal: [{ value: '', disabled: true }, Validators.required],
//       object_id: [{ value: '', disabled: true }, Validators.required],
//       user: null,
//       temple: null,
//       image_location: [''],
//       address: ['', Validators.required]
//     });

//     // Fetch countries
//     this.locationservice.GetAllCountries().subscribe(
//       (res) => {
//         this.CountryOptions = res.map((country: any) => ({
//           label: country.name,
//           value: country._id
//         }));
//         this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
//       },
//       (err) => {
//         console.log(err);
//       }
//     );

//     // Handle country value changes
//     this.goshalaForm.get('country')?.valueChanges.subscribe((countryID) => {
//       if (countryID) {
//         this.locationservice.getbyStates(countryID).subscribe(
//           (res) => {
//             if (Array.isArray(res)) {
//               this.StateOptions = res.map((state: any) => ({
//                 label: state.name,
//                 value: state._id
//               }));
//               this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
//             } else {
//               console.error("response is not an array type", res);
//             }
//           },
//           (err) => {
//             console.log(err);
//           }
//         );

//         // Reset and enable controls
//         this.resetAndEnableControls(['state', 'district', 'mandal', 'village']);
//       } else {
//         // Reset and disable controls
//         this.resetAndDisableControls(['state', 'district', 'mandal', 'village']);
//       }
//     });

//     // Handle state value changes
//     this.goshalaForm.get('state')?.valueChanges.subscribe((stateID) => {
//       if (stateID) {
//         this.locationservice.getdistricts(stateID).subscribe(
//           (res) => {
//             if (Array.isArray(res)) {
//               this.DistrictOptions = res.map((district: any) => ({
//                 label: district.name,
//                 value: district._id
//               }));
//               this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
//             } else {
//               console.error("response is not an array type", res);
//             }
//           },
//           (err) => {
//             console.log(err);
//           }
//         );

//         // Reset and enable controls
//         this.resetAndEnableControls(['district', 'mandal', 'village']);
//       } else {
//         // Reset and disable controls
//         this.resetAndDisableControls(['district', 'mandal', 'village']);
//       }
//     });

//     // Handle district value changes
//     this.goshalaForm.get('district')?.valueChanges.subscribe((districtID) => {
//       if (districtID) {
//         this.locationservice.getblocks(districtID).subscribe(
//           (res) => {
//             if (Array.isArray(res)) {
//               this.MandalOptions = res.map((mandal: any) => ({
//                 label: mandal.name,
//                 value: mandal._id
//               }));
//               this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
//             } else {
//               console.error("response is not an array type", res);
//             }
//           },
//           (err) => {
//             console.log(err);
//           }
//         );

//         // Reset and enable controls
//         this.resetAndEnableControls(['mandal', 'village']);
//       } else {
//         // Reset and disable controls
//         this.resetAndDisableControls(['mandal', 'village']);
//       }
//     });

//     // Handle mandal value changes
//     this.goshalaForm.get('mandal')?.valueChanges.subscribe((mandalId) => {
//       if (mandalId) {
//         this.locationservice.getvillages(mandalId).subscribe(
//           (res) => {
//             if (Array.isArray(res)) {
//               this.VillageOptions = res.map((village: any) => ({
//                 label: village.name,
//                 value: village._id
//               }));
//               this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
//             } else {
//               console.error("response is not an array type", res);
//             }
//           },
//           (err) => {
//             console.log(err);
//           }
//         );

//         // Enable object_id control
//         this.goshalaForm.get('object_id')?.enable();
//       } else {
//         // Reset and disable object_id control
//         this.goshalaForm.get('object_id')?.reset();
//         this.goshalaForm.get('object_id')?.disable();
//       }
//     });
//   }

//   fetchallaCategories(): void {
//     this.goshalaservice.getGoshalaCatgeories().subscribe(
//       (res) => {
//         res.forEach((category: any) => {
//           this.goshalaCategoryoptions.push({
//             label: category.name,
//             value: category._id
//           });
//         });
//       },
//       (err) => {
//         console.log(err);
//       }
//     );
//   }

//   onSubmit() {
//     if (this.goshalaForm.valid) {
//       const { country, state, district, mandal, ...GoshalaData } = this.goshalaForm.value;
//       this.goshalaservice.addgoshala(GoshalaData).subscribe(
//         (response) => {
//           console.log("goshala added successfully", response);
//         },
//         (err) => {
//           console.log(err);
//         }
//       );
//     } else {
//       console.log("form is not valid");
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
//         this.goshalaForm.patchValue({ image_location: base64String });
//       });
//     });

//     this.goshalaForm.get(formControlName)?.setValue(fileList);

//     if (formControlName === 'images') {
//       this.fileList = fileList;
//     } else if (formControlName === 'bannerImage') {
//       this.bannerFileList = fileList;
//     }

//     console.log('image submit', this.goshalaForm.value);
//   }

//   getBase64(file: File, callback: (base64String: string) => void): void {
//     const reader = new FileReader();
//     reader.onload = () => {
//       let base64String = reader.result as string;
//       // Extract base64 string without the data URI scheme
//       base64String = base64String.split(',')[1];
//       console.log('Base64 string:', base64String); // Print base64 string
//       callback(base64String);
//     };
//     reader.readAsDataURL(file);
//   }

//   private resetAndEnableControls(controlNames: string[]): void {
//     controlNames.forEach((controlName) => {
//       this.goshalaForm.get(controlName)?.reset();
//       this.goshalaForm.get(controlName)?.enable();
//     });
//   }

//   private resetAndDisableControls(controlNames: string[]): void {
//     controlNames.forEach((controlName) => {
//       this.goshalaForm.get(controlName)?.reset();
//       this.goshalaForm.get(controlName)?.disable();
//     });
//   }
// }

