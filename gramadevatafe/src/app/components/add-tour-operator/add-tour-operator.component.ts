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
  selector: 'app-add-tour-operator',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzFormModule,NzUploadModule ,NzButtonModule,NgxSpinnerModule,
    RouterModule,NzModalModule],
  templateUrl: './add-tour-operator.component.html',
  styleUrl: './add-tour-operator.component.css'
})
export class AddTourOperatorComponent {


  touroperatorForm!:FormGroup;

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
    private renderer: Renderer2,private spinner: NgxSpinnerService, public dialogRef: MatDialogRef<AddTourOperatorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
        this.addtouroperatorsform();

  }

  ngOnInit(): void {
  this.TourOperatorLocations();
      if (this.data?.mode === 'edit' && this.data?.hotelId) {
    this.isEditMode = true;
    this.tourismId = this.data.hotelId; // ✅ FIXED
    console.log('EDIT MODE ENABLED, ID:', this.tourismId);

    this.disableLocationFields();
  }

}
onlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.touroperatorForm.get('mobile_number')?.setValue(input.value);
}

addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    // rating:[''],
    tour_operator_name:['',Validators.required],
    mobile_number:['',[Validators.required, Validators.pattern('^[0-9]{10}$')]],
    // village_id :this.route.snapshot.paramMap.get("_id"),
    user_id : localStorage.getItem('user'),
    image_location:['',Validators.required],
    status:['INACTIVE'],
    // email:['',Validators.required],
     email: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/)
    ]
  ],
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


// Addtouroperator() {
//   this.spinner.show();
//   if (this.touroperatorForm.valid) {
//         this.touroperatorForm.markAllAsTouched();
//     this.spinner.hide();

//     this.notificationHelper.showErrorNotification(
//       'Please fill all required fields'
//     );
//       this.templeservice.addtouroperatordetails(this.touroperatorForm.value).subscribe(
//           response => {
//               console.log('Temple added successfully:', response);
//                         this.notificationHelper.showSuccessNotification('Tour Operator added successfully');

//               this.bannerFileList = [];
//               this.touroperatorForm.reset();
//               //  window.location.reload();

//         if (this.dialogRef) {
//           this.dialogRef.close();
//         }
//             this.spinner.hide();   
//           },
//           error => {
//               console.error('Error adding temple:', error);
//               this.spinner.hide(); 
//               this.notificationHelper.showErrorNotification('Tour Operator added failed');
//           }
//       );
//   } else {
//       this.touroperatorForm.markAllAsTouched();
//       this.spinner.hide(); 
//   }
// }

Addtouroperator() {
  this.spinner.show();

  if (this.touroperatorForm.invalid) {

    this.touroperatorForm.markAllAsTouched();
    this.spinner.hide();

    this.notificationHelper.showErrorNotification(
      'Please fill all required fields'
    );

    return;
  }

  // If form is valid
  this.templeservice.addtouroperatordetails(this.touroperatorForm.value)
    .subscribe(
      response => {
        console.log('Tour Operator added successfully:', response);

        this.notificationHelper.showSuccessNotification(
          'Tour Operator added successfully'
        );

        this.bannerFileList = [];
        this.touroperatorForm.reset();

        if (this.dialogRef) {
          this.dialogRef.close();
        }

        this.spinner.hide();
      },
      error => {
        console.error('Error adding tour operator:', error);
        this.spinner.hide();

        this.notificationHelper.showErrorNotification(
          'Tour Operator added failed'
        );
      }
    );
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
disableLocationFields(): void {
  const fields = ['country', 'state', 'district', 'mandal', 'village_id'];

  fields.forEach(field => {
    this.touroperatorForm.get(field)?.disable();
  });
}

   Uploadtouroperatorimage(info:NzUploadChangeParam):void {
  this.addhospitalimage(info, 'image_location');
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
