import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/eventservice/event.service';
import { LocationService } from '../../services/location/location.service';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService,NgxSpinnerModule } from 'ngx-spinner';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NotificationHelper } from '../commons/notification';
import { Location } from '@angular/common';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-addevent',
  standalone: true,
  imports: [CommonModule,
    NzUploadModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzModalModule
  ],
  templateUrl: './addevent.component.html',
  styleUrl: './addevent.component.css'
})
export class AddeventComponent {

  eventform!:FormGroup;
  CountryOptions: any[] = [];
  StateOptions: any[] = [];
  DistrictOptions: any[] = [];
  MandalOptions: any[] = [];
  VillageOptions: any[] = [];
  goshalaCategoryoptions:any[]=[];
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  minDate: string ="";
  village_id: any;
  InVillage = false;
  village: any;
  villageid: any;



  constructor(private eventService:EventService,
    private fb:FormBuilder,
    private router:Router,
    private locationservice:LocationService,
    private spinner: NgxSpinnerService,
    private notificationHelper: NotificationHelper,private location: Location
    
  ){}


  onCancel() {
    this.location.back();
      setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);
  }


timeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('start_time')?.value;
    const end = control.get('end_time')?.value;

    if (start && end && start === end) {
      return { sameTime: true };
    }

    return null;
  };
}
  
  ngOnInit():void{


    this.fetchallaCategories();
    this.InVillageId();

    this.village_id = history.state.village_id || null;
    console.log(this.village_id, "this.village_id");

    const today = new Date();
    // this.minDate = today.toISOString().split('T')[0];


    this.eventform = this.fb.group({

      name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date:['', Validators.required],
      start_time: ['',Validators.required],
      end_time:['',Validators.required],
      // tag: [''],
      // tag_id: [null],
      // tag_type_id: [null],
      // // geo_site: [''],
      // content_type_id: [null],
      // map_location: [''],
      contact_name: ['',Validators.required],
      contact_phone: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      contact_email: ['',[Validators.email]],
      desc: [''],
      // status: [''],
      address: [''],
      image_location: ['',Validators.required],
      category: ['', Validators.required],
      country: ['', [Validators.required]],
      state: [{ value: '', disabled: true }, ],
      district: [{ value: '', disabled: true }, ],
      mandal: [{ value: '', disabled: true }, ],
      object_id: [{ value: '', disabled: true }, ],
      user:localStorage.getItem('user'),
      status: ['INACTIVE'],
      // map_location:['', Validators.required],
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
      event_video:['']
    }, {
    validators: this.timeValidator()
  });


    if (this.village_id != null) {
      // Enable object_id before setting its value
      this.eventform.get('object_id')?.enable();

      // Strictly set the value using setValue
      try {
        this.eventform.get('object_id')?.setValue(this.village_id);
        console.log(this.eventform.get('object_id')?.value, "Updated object_id value");
      } catch (error) {
        console.error("Error setting object_id:", error);
      }

      // Clear validators for location fields
      this.eventform.get('country')?.clearValidators();
      this.eventform.get('state')?.clearValidators();
      this.eventform.get('district')?.clearValidators();
      this.eventform.get('mandal')?.clearValidators();
    } else {
      // When village_id is null, disable object_id and require location fields
      this.eventform.get('object_id')?.disable();
      this.eventform.get('country')?.setValidators(Validators.required);
      this.eventform.get('state')?.setValidators(null);
      this.eventform.get('district')?.setValidators(null);
      this.eventform.get('mandal')?.setValidators(null);
    }

    // Update validation status after changing validators
    this.eventform.get('country')?.updateValueAndValidity();
    this.eventform.get('state')?.updateValueAndValidity();
    this.eventform.get('district')?.updateValueAndValidity();
    this.eventform.get('mandal')?.updateValueAndValidity();
    this.eventform.get('object_id')?.updateValueAndValidity();



    this.locationservice.GetAllCountries().subscribe(
      (res)=> {
        this.CountryOptions = res.map((country:any) => ({
          label:country.name,
          value:country._id
        }));
        this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));
        const defaultCountry = this.CountryOptions.find(option => option.label === 'India');
        if (defaultCountry) {
          this.eventform.controls['country'].setValue(defaultCountry.value);
        }
        
      },
      (err) => {
        console.log(err);
      }
    );



    


    this.eventform.get('country')?.valueChanges.subscribe(countryID =>{
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
        this.eventform.get('state')?.reset();
        this.eventform.get('state')?.enable();
        this.eventform.get('district')?.reset();
        this.eventform.get('mandal')?.reset();
        this.eventform.get('village')?.reset();
        this.eventform.get('district')?.disable();
        this.eventform.get('mandal')?.disable();
        this.eventform.get('village')?.disable();
      } else {
        // If no country selected, disable and clear state, district, mandal, and village select
        this.eventform.get('state')?.reset();
        this.eventform.get('state')?.disable();
        this.eventform.get('district')?.reset();
        this.eventform.get('district')?.disable();
        this.eventform.get('mandal')?.reset();
        this.eventform.get('mandal')?.disable();
        this.eventform.get('village')?.reset();
        this.eventform.get('village')?.disable();
      }
    });


    this.eventform.get('state')?.valueChanges.subscribe(stateID => {
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
        this.eventform.get('district')?.enable();
        this.eventform.get('district')?.reset();
        this.eventform.get('mandal')?.reset();
        this.eventform.get('village')?.reset();
        this.eventform.get('mandal')?.disable();
        this.eventform.get('village')?.disable();
      }
      else {
        this.eventform.get('district')?.enable();
        this.eventform.get('mandal')?.reset();
        this.eventform.get('village')?.reset();
        this.eventform.get('mandal')?.disable();
        this.eventform.get('village')?.disable();
      }
    });

    this.eventform.get('district')?.valueChanges.subscribe((districrID => {
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
      this.eventform.get('mandal')?.enable();
      this.eventform.get('mandal')?.reset();
      this.eventform.get('village')?.disable();
      this.eventform.get('village')?.reset();     
      }
      else{
      this.eventform.get('mandal')?.enable();
      this.eventform.get('mandal')?.reset();
      this.eventform.get('village')?.disable();
      this.eventform.get('village')?.reset();    
      }
    }));


    this.eventform.get('mandal')?.valueChanges.subscribe((mandalId => {
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
        this.eventform.get('object_id')?.enable();
        this.eventform.get('object_id')?.reset(); 
      }
      else {
        this.eventform.get('object_id')?.disable();
        this.eventform.get('object_id')?.reset(); 
      }
    }));


  }



  get contactNumber() {
    return this.eventform.get('contact_phone');
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

  // timeValidator(control: any) {
  //   const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;
  //   return timeRegex.test(control.value) ? null : { invalidTime: true };
  // }

  convertTo24Hour(time: string) {
    const [hours, minutes] = time.split(/[:\s]/);
    const meridian = time.slice(-2).toUpperCase();
    let hour = parseInt(hours);
    if (meridian === 'PM' && hour < 12) {
      hour += 12;
    }
    if (meridian === 'AM' && hour === 12) {
      hour -= 12;
    }
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  }


  fetchallaCategories():void{
    this.eventService.getEventCategory().subscribe(
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
    
  //   if (this.eventform.valid) {
  //     const { country, state, district, mandal, ...EventData } = this.eventform.value;
  
  //     // Check if the village is null and set object_id to village_id if so
  //     if (this.village === null) {
  //       this.eventform.get('object_id')?.setValue(this.village_id);
  //       console.log(this.village_id, "Set object_id to village_id");
  //     }
  
  //     // Call the service to add the event
  //     this.eventService.addevent(EventData).subscribe(
  //       (response) => {
  //         this.spinner.hide();
  //         this.notificationHelper.showSuccessNotification('Event added successfully', '');
  //         console.log("Event added successfully", response);
          
  //         // Redirect to the village page
  //         this.router.navigate(["villages", EventData.object_id]);
  //       },
  //       (err) => {
  //         this.spinner.hide();
  //         console.error("Error adding event:", err);
  //         this.notificationHelper.showErrorNotification('Event addition failed');
  //       }
  //     );
  //   } else {
  //     console.log("Form is not valid");
  //     this.notificationHelper.showErrorNotification('Event addition failed');
  //     this.eventform.markAllAsTouched();
  //     this.spinner.hide();
  //   }
  // }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.eventform.patchValue({
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


  updateMinDate() {
    const startDate = this.eventform.get('start_date')?.value;
    this.minDate = startDate ? startDate : ''; // Set the min date for end_date
  }


  onSubmit() {
    this.spinner.show();
    console.log(this.eventform, "Form Data at Submission");
  
    if (this.eventform.valid) {
        const { country, ...GoshalaData } = this.eventform.value;
        
        console.log(GoshalaData, "Valid Form Data");
        
        // Get the village object_id
        this.village = this.eventform.get('object_id')?.value||null;
        console.log(this.village, "Selected Village");
  
        // If village is not selected, set it to the village_id
        if (this.village === null) {
            this.eventform.get('object_id')?.setValue(this.village_id);
            console.log(this.village_id, "Set object_id to village_id");
        }
  
        // Update the templeData object with the correct object_id
        GoshalaData.object_id = this.eventform.get('object_id')?.value||null;
  
        // Add the temple using the service
        this.eventService.addevent(GoshalaData).subscribe(
            response => {
              this.notificationHelper.showSuccessNotification('Event added successfully', '');
                console.log('Event added successfully:', response);
                
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
                this.spinner.hide();
            },
            error => {
                console.error('Error adding event:', error);
                this.notificationHelper.showErrorNotification('Event added Failed');
                // Hide spinner on error
                this.spinner.hide();
            }
        );
    } else {
        // Mark all fields as touched to trigger validation messages
        this.eventform.markAllAsTouched();
        this.notificationHelper.showErrorNotification('Event added Failed');
        this.spinner.hide();
    }
  }
  

  // handleBannerFileRemove(): void {
  //   // Clear the file list and reset the form control value
  //   this.bannerFileList = [];
  //   this.eventform.get('image_location')?.reset();
  //   this.eventform.get('image_location')?.markAsTouched(); // To show validation error immediately
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
        this.eventform.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.eventform.value);
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
  this.eventform.get('state_name')?.setValue(selected?.label || '');
}

onDistrictChange(value: string): void {
  const selected = this.DistrictOptions.find(opt => opt.value === value);
  this.eventform.get('district_name')?.setValue(selected?.label || '');
}

onMandalChange(value: string): void {
  const selected = this.MandalOptions.find(opt => opt.value === value);
  this.eventform.get('block_name')?.setValue(selected?.label || '');
}

onVillageChange(value: string): void {
  const selected = this.VillageOptions.find(opt => opt.value === value);
  this.eventform.get('village_name')?.setValue(selected?.label || '');
}


addmoreVideoList: NzUploadFile[] = [];

handleaddmoreVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.eventform.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'event_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.eventform.patchValue({ [controlName]: '' });

  if (controlName === 'event_video') {
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
