import { Component, Inject } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-add-welfare-home',
  standalone: true,
  imports:  [
          CommonModule,
          NgxSpinnerModule,
          NzFormModule,
          NzInputModule,
          NzSelectModule,
          ReactiveFormsModule,
          NzUploadModule,NzModalModule],
  templateUrl: './add-welfare-home.component.html',
  styleUrl: './add-welfare-home.component.css'
})
export class AddWelfareHomeComponent {

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
  isEditMode = false;
existingVillageId: string | null = null;


  constructor(private goshalaservice:GoshalaService,
      private fb :FormBuilder,
       
       private locationservice:LocationService,
       private router:Router,
       private spinner: NgxSpinnerService,private sanitizer: DomSanitizer,
       private notificationHelper: NotificationHelper, @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<any>
      ){ }


      createForm() {
  this.goshalaForm = this.fb.group({
    name: ['', Validators.required],
    desc: [''],
    address: [''],
    contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email]],
    website: [''],
    is_government: ['NO'],
    established_year: [ '',[Validators.pattern('^[0-9]{0,4}$') ]],
    medical_care: [false],
    food_and_shelter: [false],
    counseling_services: [false],
    rehabilitation_programs: [false],
    skill_training: [false],
    mental_health_support: [false],
    legal_aid: [false],
    is_24_7_support: [false],
    security: [false],
    education: [false],
    physiotherapy: [false],
    play_area: [false],
    recreational_activities: [false],
    adoption_services: [false],
    family_counseling: [false],
    emergency_response: [false],
    special_needs_support: [false],
    category: ['', Validators.required],
    map_location: [  '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    country: [''],
    state: [''],
    district: [''],
    mandal: [''],
    village_id: [''],
    object_id: [''],
    image_location: [[]],
    status: ['INACTIVE'],
    user: [localStorage.getItem('user')]
  });
}



  ngOnInit(){
    this.fetchallaCategories();
    this.InVillageId();
     this.createForm();

  //   if (this.data?.mode === 'edit') {
  //   this.isEditMode = true;
  //   this.welfareId = this.data.welfareId;
  //   console.log('EDIT MODE ENABLED', this.welfareId);
  //   this.loadWelfareForEdit();
  //   this.disableLocationFields();
  // }

    if (this.data?.mode === 'edit') {
    this.isEditMode = true;
    this.welfareId = this.data.welfareId;
    this.loadWelfareForEdit();
    this.disableLocationFields();
  }

    this.village_id = history.state.village_id || null;
    console.log(this.village_id, "this.village_id");
    
    // this.goshalaForm=this.fb.group({
    //   name: ['', Validators.required],
    //   desc: [''],
    //   address: [''],
    //   contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    //   email: ['', [Validators.email]],
    //   website: [''],
    //   is_government: ['NO'],
    //   established_year: [''],
    //   medical_care: [false],
    //   food_and_shelter: [false],
    //   counseling_services: [false],
    //   rehabilitation_programs: [false],
    //   skill_training: [false],
    //   mental_health_support: [false],
    //   legal_aid: [false],
    //   is_24_7_support: [false],
    //   security: [false],
    //   education: [false],
    //   physiotherapy: [false],
    //   play_area: [false],
    //   recreational_activities: [false],
    //   adoption_services: [false],
    //   family_counseling: [false],
    //   emergency_response: [false],
    //   special_needs_support: [false],
    //   category:['',Validators.required],

    //   map_location: ['', Validators.required],

    //   country: ['', [Validators.required]],
    //   state: [{ value: '', disabled: true }, ],
    //   district: [{ value: '', disabled: true },],
    //   mandal: [{ value: '', disabled: true }, ],
    //   village_id: [{ value: '', disabled: true }, ],
    //   image_location:[' '],
    //   user:localStorage.getItem('user'),
    //   status: ['INACTIVE'],
    //   object_id: ['']
      
    
    // })

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
        this.goshalaForm.get('village_id')?.enable();
        this.goshalaForm.get('village_id')?.reset(); 
      }
      else {
        this.goshalaForm.get('village_id')?.disable();
        this.goshalaForm.get('village_id')?.reset(); 
      }
    }));




    
  }


welfareId!: string;


loadWelfareForEdit(): void {
  this.spinner.show();
  this.goshalaservice.getwelfarehomebyId(this.welfareId).subscribe({
    next: (res: any) => {
      try {
        // Enable all location fields temporarily for patching
        ['country', 'state', 'district', 'mandal', 'village_id'].forEach(f => {
          this.goshalaForm.get(f)?.enable({ emitEvent: false });
        });
        this.existingVillageId = res.village_id;

        this.goshalaForm.patchValue({
          name: res.name || '',
          desc: res.desc || '',
          address: res.address || '',
          contact_number: res.contact_number || '',
          email: res.email || '',
          website: res.website || '',
          is_government: res.is_government || 'NO',
          established_year: res.established_year || '',
          medical_care: res.medical_care === 'YES',
          food_and_shelter: res.food_and_shelter === 'YES',
          counseling_services: res.counseling_services === 'YES',
          rehabilitation_programs: res.rehabilitation_programs === 'YES',
          skill_training: res.skill_training === 'YES',
          mental_health_support: res.mental_health_support === 'YES',
          legal_aid: res.legal_aid === 'YES',
          is_24_7_support: res.is_24_7_support === 'YES',
          security: res.security === 'YES',
          education: res.education === 'YES',
          physiotherapy: res.physiotherapy === 'YES',
          play_area: res.play_area === 'YES',
          recreational_activities: res.recreational_activities === 'YES',
          adoption_services: res.adoption_services === 'YES',
          family_counseling: res.family_counseling === 'YES',
          emergency_response: res.emergency_response === 'YES',
          special_needs_support: res.special_needs_support === 'YES',
          category: res.category || '',
          map_location: res.map_location || '',
          country: res.country || '',
          state: res.state || '',
          district: res.district || '',
          mandal: res.mandal || '',
          village_id: res.village_id || '',
          image_location: res.image_location || [],
          status: res.status || 'INACTIVE',
          user: res.user || '',
        });


        this.bannerFileList = res.image_location?.map((img: string, index: number) => ({
        uid: index.toString(),
        name: `image-${index}`,
        status: 'done',
        url: img
      }));
        // After patching, disable location fields again if needed
        this.disableLocationFields();

      } catch (error) {
        console.error('Error patching form:', error);
      } finally {
        this.spinner.hide();
      }
    },
    error: (err) => {
      console.error('API error:', err);
      this.spinner.hide();
    }
  });
}


disableLocationFields(): void {
  const fields = ['country', 'state', 'district', 'mandal', 'village_id'];

  fields.forEach(field => {
    this.goshalaForm.get(field)?.disable();
  });
}



  get contactNumber() {
    return this.goshalaForm.get('contact_number');
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
    this.goshalaservice.getwelfarehomeCategory().subscribe(
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




// onSubmit() {
//   this.spinner.show();
//   console.log(this.goshalaForm, "Form Data at Submission");

//   if (this.goshalaForm.valid) {
//     const { country, state, district, mandal, ...GoshalaData } = this.goshalaForm.value;

//     console.log(GoshalaData, "Valid Form Data");

//     // ✅ Step 1: Convert boolean fields to 'YES'/'NO'
//     const serviceFields = [
//       'medical_care',
//       'food_and_shelter',
//       'counseling_services',
//       'rehabilitation_programs',
//       'skill_training',
//       'mental_health_support',
//       'legal_aid',
//       'is_24_7_support',
//       'security',
//       'education',
//       'physiotherapy',
//       'play_area',
//       'recreational_activities',
//       'adoption_services',
//       'family_counseling',
//       'emergency_response',
//       'special_needs_support',
//     ];

//     serviceFields.forEach((field) => {
//       if (field in GoshalaData) {
//         GoshalaData[field] = GoshalaData[field] ? 'YES' : 'NO';
//       }
//     });

//     // ✅ Step 2: Handle village_id assignment
//     this.village = this.goshalaForm.get('object_id')?.value || null;
//     console.log(this.village, "Selected Village");

//     if (this.village === null) {
//       this.goshalaForm.get('object_id')?.setValue(this.village_id);
//       console.log(this.village_id, "Set object_id to village_id");
//     }

//     GoshalaData.object_id = this.goshalaForm.get('object_id')?.value || null;

//     // ✅ Step 3: Send the data to the backend
//     this.goshalaservice.adWelfarehome(GoshalaData).subscribe(
//       (response) => {
//         this.notificationHelper.showSuccessNotification('Welfare added successfully', '');
//         console.log('Welfare added successfully:', response);

//         this.villageid = GoshalaData.object_id;
//         console.log(this.villageid, "Updated villageid");

//         this.router.navigate(["/home"]);
        
//         this.spinner.hide();
//       },
//       (error) => {
//         console.error('Error adding Welfare:', error);
//         this.notificationHelper.showErrorNotification('Welfare add failed');
//         this.spinner.hide();
//       }
//     );
//   } else {
//     this.goshalaForm.markAllAsTouched();
//     this.notificationHelper.showErrorNotification('Welfare add failed');
//     this.spinner.hide();
//   }
// }

imagesChanged = false;


onSubmit() {
  this.spinner.show();

  if (!this.goshalaForm.valid) {
    this.goshalaForm.markAllAsTouched();
    this.notificationHelper.showErrorNotification('Form is invalid');
    this.spinner.hide();
    return;
  }

  const formData = this.goshalaForm.getRawValue();
      if (this.isEditMode) {
    formData.village_id = this.existingVillageId;
  }

  // Convert boolean fields to YES/NO
  const serviceFields = [
    'medical_care', 'food_and_shelter', 'counseling_services', 
    'rehabilitation_programs', 'skill_training', 'mental_health_support',
    'legal_aid', 'is_24_7_support', 'security', 'education', 'physiotherapy',
    'play_area', 'recreational_activities', 'adoption_services', 
    'family_counseling', 'emergency_response', 'special_needs_support'
  ];

  serviceFields.forEach(field => {
    formData[field] = formData[field] ? 'YES' : 'NO';
  });
    if (this.isEditMode && !this.imagesChanged) {
    delete formData.image_location; // 🚨 DO NOT SEND URL
  }

  if (this.isEditMode && this.welfareId) {
    this.goshalaservice.updateWelfarehome(this.welfareId, formData).subscribe({
      next: () => {
        this.notificationHelper.showSuccessNotification('Welfare updated successfully');
        // this.router.navigate(['/home']);this.notificationHelper.showSuccessNotification('Tourism updated successfully');
          this.dialogRef.close('updated');
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.notificationHelper.showErrorNotification('Update failed');
        this.spinner.hide();
      }
    });
  } else {
    this.goshalaservice.adWelfarehome(formData).subscribe({
      next: () => {
        this.notificationHelper.showSuccessNotification('Welfare added successfully');
        this.dialogRef.close('added');
        this.spinner.hide();
      },
      error: (err) => {
        console.error(err);
        this.notificationHelper.showErrorNotification('Add failed');
        this.spinner.hide();
      }
    });
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
onlyNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.goshalaForm.get('contact_number')?.setValue(input.value);
}
onlyYearNumbers(event: any) {
  const input = event.target;
  input.value = input.value.replace(/[^0-9]/g, '');
  this.goshalaForm.get('established_year')?.setValue(input.value);
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

  preventLeadingSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;

  if (event.key === ' ' && input.selectionStart === 0) {
    event.preventDefault(); // 🚫 prevent first space
  }
}
validateNameInput(event: KeyboardEvent) {
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
