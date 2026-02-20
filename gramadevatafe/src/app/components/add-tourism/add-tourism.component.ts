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
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-tourism',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzFormModule,NzSelectModule,FormsModule,NzFormModule,NzUploadModule ,NzButtonModule,NgxSpinnerModule,
    RouterModule,NzModalModule],
  templateUrl: './add-tourism.component.html',
  styleUrl: './add-tourism.component.css'
})
export class AddTourismComponent {

  tourismForm!:FormGroup;
    bannerFileList: NzUploadFile[] = [];
      village_id:any;

        templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions:any[]=[];
  InVillage = false;

existingVillageId: string | null = null;



  constructor(private templeservice:TempleserviceService, private route:ActivatedRoute,
    private fb:FormBuilder, private router:Router,
    private dialog:MatDialog,       private notificationHelper:NotificationHelper,private sanitizer: DomSanitizer,
    private renderer: Renderer2,private spinner: NgxSpinnerService, public dialogRef: MatDialogRef<AddTourismComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any


  ) {
       this.dialogRef.disableClose = true;  // ✅ THIS is correct
        this.tourismplaces();

  }


  isEditMode = false;
tourismId!: string;


ngOnInit(): void {
  this.TourismLocations();


    if (this.data?.mode === 'edit') {
    this.isEditMode = true;
    this.tourismId = this.data.tourismId;
    console.log('EDIT MODE ENABLED', this.tourismId);
    this.loadTourismForEdit();
    this.disableLocationFields();
  }

}


loadTourismForEdit(): void {
  this.spinner.show();

  this.templeservice.gettourismbylocation(this.tourismId).subscribe(
    (res) => {
      this.existingVillageId = res.village_id;
      this.tourismForm.patchValue({
        name: res.name,
        address: res.address,
        map_location: res.map_location,
        status: res.status,
        image_location: res.image_location,
        desc: res.desc,
        type: res.type,
        timings: res.timings,
        country: res.country,
        state: res.state,
        district: res.district,
        mandal: res.mandal,
        village_id: res.village_id,
        temple_id: res.temple_id,
        user_id: res.user_id,

      });

      // show existing images
      this.bannerFileList = res.image_location?.map((img: string, index: number) => ({
        uid: index.toString(),
        name: `image-${index}`,
        status: 'done',
        url: img
      }));

      

      this.spinner.hide();
    },
    () => this.spinner.hide()
  );
}


disableLocationFields(): void {
  const fields = ['country', 'state', 'district', 'mandal', 'village_id'];

  fields.forEach(field => {
    this.tourismForm.get(field)?.disable();
  });
}




// submitTourism(): void {
//   console.log('SUBMIT CLICKED');

//   if (!this.tourismForm) {
//     console.error('FORM NOT INITIALIZED');
//     return;
//   }

//   console.log('EDIT MODE:', this.isEditMode);
//   console.log('ID:', this.tourismId);

//   if (this.tourismForm.invalid) {
//     console.log('FORM INVALID', this.tourismForm.getRawValue());
//     this.tourismForm.markAllAsTouched();
//     return;
//   }

//   const payload = this.tourismForm.getRawValue();
//       if (this.isEditMode) {
//     payload.village_id = this.existingVillageId;
//   }

//   if (this.isEditMode && this.tourismId) {
//     console.log('CALLING UPDATE API');

//     this.templeservice.updateTempletourismplaces(this.tourismId, payload)
//       .subscribe({
//         next: () => {
//           console.log('UPDATE SUCCESS');
//           this.notificationHelper.showSuccessNotification('Tourism updated successfully');
//           this.dialogRef.close('updated');
//         },
//         error: (err) => console.error('UPDATE FAILED', err)
//       });

//   } else {
//     console.log('CALLING ADD API');

//     this.templeservice.addTempletourismplaces(payload)
//       .subscribe({
//         next: () => {
//           console.log('ADD SUCCESS');
//           this.notificationHelper.showSuccessNotification('Tourism added successfully');
//           this.dialogRef.close('added');
//         },
//         error: (err) => console.error('ADD FAILED', err)
//       });
//   }
// }
//  openmemberDialog(): void {
//     this.dialog.open(OnlymemberComponent, {
//       data: { displayName: 'signup' },
//       autoFocus: false,
//       backdropClass: 'dialog-backdrop',
//       disableClose: true,
//     });
//   }
  


// openmemberDialog(): void {
//       console.log('sssssssssss');
//       const dialogRef = this.dialog.open(OnlymemberComponent, {
//         data: { displayName: 'signup' },
//         autoFocus: false,
//         backdropClass: 'dialog-backdrop',
//         disableClose: true,
//       });
  
//       dialogRef.afterClosed().subscribe(() => {
//         // Handle after dialog close actions here
//       });
//     }

submitTourism(): void {
  console.log('SUBMIT CLICKED');

  if (!this.tourismForm) {
    console.error('FORM NOT INITIALIZED');
    return;
  }

  if (this.tourismForm.invalid) {
    console.log('FORM INVALID', this.tourismForm.getRawValue());
    this.tourismForm.markAllAsTouched();
    return;
  }

  const payload = this.tourismForm.getRawValue();

  if (this.isEditMode) {
    payload.village_id = this.existingVillageId;
  }

  // ✅ SHOW SPINNER BEFORE API CALL
  this.spinner.show();

  const request$ = (this.isEditMode && this.tourismId)
    ? this.templeservice.updateTempletourismplaces(this.tourismId, payload)
    : this.templeservice.addTempletourismplaces(payload);

  request$.subscribe({
    next: () => {

      this.spinner.hide();   // ✅ HIDE SPINNER

      const message = this.isEditMode
        ? 'Tourism updated successfully'
        : 'Tourism added successfully';

      this.notificationHelper.showSuccessNotification(message);
      this.dialogRef.close(this.isEditMode ? 'updated' : 'added');
    },
    error: (err) => {

      this.spinner.hide();   // ✅ HIDE SPINNER EVEN ON ERROR

      console.error('API FAILED', err);
      this.notificationHelper.showErrorNotification(
        'Something went wrong. Please try again.'
      );
    }
  });
}




  tourismplaces(): void {
    this.tourismForm = this.fb.group({
      map_location: [  '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address:['',Validators.required],
      name:['',Validators.required],
      desc:['',Validators.required],
      timings:['',Validators.required],
      type:['',Validators.required],
      city_id :this.route.snapshot.paramMap.get("id"),
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



    getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }


//   getBase64(file: File, callback: (base64String: string) => void): void {
//   const reader = new FileReader();
//   reader.onload = () => {
//       let base64String = reader.result as string;
//       // Extract base64 string without the data URI scheme
//       base64String = base64String.split(',')[1];
//       console.log('Base64 string:', base64String); // Print base64 string
//       callback(base64String);
//   };
//   reader.readAsDataURL(file);
// }

    handleimageRemove(): void {
    if (this.bannerFileList.length === 0) {
      this.bannerFileList = [];
    }
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
