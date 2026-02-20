import { Component, ElementRef, HostListener, Inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzFormModule,NzUploadModule ,NzButtonModule,NgxSpinnerModule,
    RouterModule,NzModalModule],
  templateUrl: './add-restaurant.component.html',
  styleUrl: './add-restaurant.component.css'
})
export class AddRestaurantComponent {


  restaurantForm!:FormGroup;
    bannerFileList: NzUploadFile[] = [];
      village_id:any;

        templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions:any[]=[];
  InVillage = false;
  isEditMode = false;
tourismId!: string;
existingVillageId: string | null = null;

    constructor(private templeservice:TempleserviceService, private route:ActivatedRoute,
    private fb:FormBuilder, private router:Router,
    private dialog:MatDialog,       private notificationHelper:NotificationHelper,
    private renderer: Renderer2,private spinner: NgxSpinnerService, public dialogRef: MatDialogRef<AddRestaurantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
        this.addrestaurantsform();

  }

ngOnInit(): void {
  this.RestuarantssLocations();
      if (this.data?.mode === 'edit' && this.data?.hotelId) {
    this.isEditMode = true;
    this.tourismId = this.data.hotelId; // ✅ FIXED
    console.log('EDIT MODE ENABLED, ID:', this.tourismId);

    this.loadrestaurantEdit();
    this.disableLocationFields();
  }
}


loadrestaurantEdit(): void {
  this.spinner.show();

  this.templeservice.getrestaurantsbyid(this.tourismId).subscribe(
    (res) => {
      this.existingVillageId = res.village_id;
      this.restaurantForm.patchValue({
        name: res.name,
        address: res.address,
        map_location: res.map_location,
        status: res.status,
        image_location: res.image_location,
       
        owner_name:res.owner_name,
          email_id:res.email_id,
          website:res.website,
        contact_number:res.contact_number,
        country: res.country,
        state: res.state,
        district: res.district,
        mandal: res.mandal,
        village_id: res.village_id,
        temple_id: res.temple_id,
        user_id: res.user_id,

      });

      // show existing images
// Banner images
this.bannerFileList = res.image_location?.map((img: string, index: number) => ({
  uid: `banner-${index}`,
  name: `banner-${index}`,
  status: 'done',
  url: img
})) || [];






      

      this.spinner.hide();
    },
    () => this.spinner.hide()
  );
}


disableLocationFields(): void {
  const fields = ['country', 'state', 'district', 'mandal', 'village_id'];

  fields.forEach(field => {
    this.restaurantForm.get(field)?.disable();
  });
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

//   Addrestaurant() {
//     this.spinner.show();
//   if (this.restaurantForm.valid) {
//       this.templeservice.addrestaurants(this.restaurantForm.value).subscribe(
//           response => {
//               console.log('restaurants added successfully:', response);

//               this.restaurantForm.reset();
// //  window.location.reload();

//               // ✅ Clear the uploaded images
//               this.bannerFileList = [];
//         if (this.dialogRef) {
//           this.dialogRef.close();
//         }
//             this.spinner.hide();   
//           },
//           error => {
//               console.error('Error adding temple:', error);
//               this.spinner.hide(); 
//           }
//       );
//   } else {
//       // this.restaurantForm.markAllAsTouched();
//       this.spinner.hide(); 
//   }
// }

Addrestaurant(): void {
  console.log('SUBMIT CLICKED');

  if (!this.restaurantForm) {
    console.error('FORM NOT INITIALIZED');
    return;
  }

  console.log('EDIT MODE:', this.isEditMode);
  console.log('ID:', this.tourismId);

  if (this.restaurantForm.invalid) {
    console.log('FORM INVALID', this.restaurantForm.getRawValue());
    this.restaurantForm.markAllAsTouched();
    return;
  }

  const payload = this.restaurantForm.getRawValue();
      if (this.isEditMode) {
    payload.village_id = this.existingVillageId;
  }
this.spinner.show();
  if (this.isEditMode && this.tourismId) {
    console.log('CALLING UPDATE API');

    this.templeservice.updaterestaurants(this.tourismId, payload)
      .subscribe({
        next: () => {
          console.log('UPDATE SUCCESS');
                    this.spinner.hide();

          this.notificationHelper.showSuccessNotification('Restaurant updated successfully');
          this.dialogRef.close('updated');
        },
        error: (err) => 
          {
            console.error('UPDATE FAILED', err)
            this.spinner.hide();
            this.notificationHelper.showErrorNotification('Restaurant updated failed');
          }
      });

  } else {
    console.log('CALLING ADD API');

    this.templeservice.addrestaurants(payload)
      .subscribe({
        next: () => {
          console.log('ADD SUCCESS');
                    this.spinner.hide();

          this.notificationHelper.showSuccessNotification('Restaurant added successfully');
          this.dialogRef.close('added');
        },
        error: (err) => 
          {
            console.error('UPDATE FAILED', err)
            this.spinner.hide();
            this.notificationHelper.showErrorNotification('Restaurant added failed');
          }
      });
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



addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    address:['',[Validators.required]],
    name:['',[Validators.required]],
    email_id:[ '',
    [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/)
    ]
  ],
    contact_number:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    // website:['',Validators.pattern(/^https?:\/\/.+/)],
    website: [
  '',
  Validators.pattern(/^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/)
],

    city_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    owner_name:['',[Validators.required]],
    image_location:['',[Validators.required]],
      country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],

    
  });
}

onlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.restaurantForm.get('contact_number')?.setValue(input.value);
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
