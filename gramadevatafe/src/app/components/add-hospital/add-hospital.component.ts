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
  selector: 'app-add-hospital',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzFormModule,NzUploadModule ,NzButtonModule,NgxSpinnerModule,
    RouterModule,NzModalModule],
  templateUrl: './add-hospital.component.html',
  styleUrl: './add-hospital.component.css'
})
export class AddHospitalComponent {
  hospitalform!:FormGroup;
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
    private renderer: Renderer2,private spinner: NgxSpinnerService, public dialogRef: MatDialogRef<AddHospitalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
        this.addnearbyhospitalss();

  }

ngOnInit(): void {
  this.HospitalLocations();

  //     if (this.data?.mode === 'edit') {
  //   this.isEditMode = true;
  //   this.tourismId = this.data.tourismId;
  //   console.log('EDIT MODE ENABLED', this.tourismId);
  //   this.loadTourismForEdit();
  //   this.disableLocationFields();
  // }

    if (this.data?.mode === 'edit' && this.data?.hospitalId) {
    this.isEditMode = true;
    this.tourismId = this.data.hospitalId; // ✅ FIXED
    console.log('EDIT MODE ENABLED, ID:', this.tourismId);

    this.loadhospitalEdit();
    this.disableLocationFields();
  }


}

loadhospitalEdit(): void {
  this.spinner.show();

  this.templeservice.gethospitalbyid(this.tourismId).subscribe(
    (res) => {
      this.existingVillageId = res.village_id;
      this.hospitalform.patchValue({
        name: res.name,
        address: res.address,
        map_location: res.map_location,
        status: res.status,
        image_location: res.image_location,


        license_copy:res.license_copy,
        contact_number:res.contact_number,
        owner_name:res.owner_name,
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

// License copy
this.licenseFileList = res.license_copy
  ? [{
      uid: 'license-1',
      name: 'license-copy',
      status: 'done',
      url: res.license_copy
    }]
  : [];



      //       this.bannerFileList = res.license_copy?.map((img: string, index: number) => ({
      //   uid: index.toString(),
      //   name: `image-${index}`,
      //   status: 'done',
      //   url: img
      // }));

      

      this.spinner.hide();
    },
    () => this.spinner.hide()
  );
}


disableLocationFields(): void {
  const fields = ['country', 'state', 'district', 'mandal', 'village_id'];

  fields.forEach(field => {
    this.hospitalform.get(field)?.disable();
  });
}


  addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    address:['',Validators.required],
    name:['',Validators.required],
    
          contact_number:['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      owner_name:['',Validators.required],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:['',Validators.required],
    country: ['', Validators.required ],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true },],
      mandal: [{ value: '', disabled: true }, ],
      village_id: [{ value: this.village_id, disabled: true }, ],
          license_copy:[''],

  });
}


// Addhospital() {
//   this.spinner.show();
//   if (this.hospitalform.valid) {
//       this.templeservice.addnearbyhospital(this.hospitalform.value).subscribe(
//           response => {
//                console.log('Hospital added successfully:', response);

        

//               this.hospitalform.reset();
//               // window.location.reload();
//               // ✅ Clear the uploaded images
//               this.bannerFileList = [];
//         if (this.dialogRef) {
//           this.dialogRef.close();
//         }
//              this.spinner.hide();  
//           },
//           error => {
//               console.error('Error adding Hospital:', error);
// this.spinner.hide(); 
       
//           }
//       );
//   } else {
//       this.hospitalform.markAllAsTouched();
//       this.spinner.hide(); 
//   }
// }



Addhospital(): void {
  console.log('SUBMIT CLICKED');

  if (!this.hospitalform) {
    console.error('FORM NOT INITIALIZED');
    return;
  }

  console.log('EDIT MODE:', this.isEditMode);
  console.log('ID:', this.tourismId);

  if (this.hospitalform.invalid) {
    console.log('FORM INVALID', this.hospitalform.getRawValue());
    this.hospitalform.markAllAsTouched();
    return;
  }

  const payload = this.hospitalform.getRawValue();
      if (this.isEditMode) {
    payload.village_id = this.existingVillageId;
  }
this.spinner.show();

  if (this.isEditMode && this.tourismId) {
    console.log('CALLING UPDATE API');

    this.templeservice.updatehospital(this.tourismId, payload)
      .subscribe({
        next: () => {
          console.log('UPDATE SUCCESS');
                              this.spinner.hide(); // ✅ HIDE SPINNER

          this.notificationHelper.showSuccessNotification('Hospital updated successfully');
          this.dialogRef.close('updated');
        },
        error: (err) => 
          {
            console.error('UPDATE FAILED', err)
            this.spinner.hide();
          }
      });

  } else {
    console.log('CALLING ADD API');

    this.templeservice.addnearbyhospital(payload)
      .subscribe({
        next: () => {
          console.log('ADD SUCCESS');
          this.spinner.hide(); // ✅ HIDE SPINNER

          this.notificationHelper.showSuccessNotification('Hospital added successfully');
          this.dialogRef.close('added');
        },
        error: (err) => 
          {
            console.error('ADD FAILED', err)
            this.spinner.hide();
          }
      });
  }
}


onlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.hospitalform.get('contact_number')?.setValue(input.value);
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


    getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      callback(base64String);
    };
    reader.readAsDataURL(file);
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