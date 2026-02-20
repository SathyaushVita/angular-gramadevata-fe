

import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/userservice/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../services/sharedservice/shared.service';
import { NotificationHelper } from '../commons/notification';


@Component({
  selector: 'app-updateprofile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.css'
})
export class UpdateprofileComponent {
  profileForm!: FormGroup;
  userId: any;
  profileImage: string | ArrayBuffer | null = null;
  profile_pic: any;
  full_name: any;

  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<UpdateprofileComponent>,
    private sharedservice: SharedService,
    private notificationHelper: NotificationHelper,
  
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.getProfileData();
    this.profileForm.get('marital_status')?.valueChanges.subscribe(() => {

    this.profileForm.patchValue({
      wife: '',
      husband: '',
      children: ''
    });

    ['wife', 'husband', 'children'].forEach(field => {
      const control = this.profileForm.get(field);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });
  });
}

  initializeForm() {
    this.profileForm = this.fb.group({
      full_name: ['', Validators.required],
      surname: ['', Validators.required],
      father_name: ['',Validators.required],
      gender: [null,Validators.required],
      // dob: [''],
      contact_number: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      profile_pic: [''],
      email: ['', [Validators.required, Validators.email]],
      // email: [''],
      marital_status:[null],
      gotram: [''],
      siblings: [''],
      husband: [''],
      wife: [''],
      children: [''],
      account_type:[null,Validators.required],
      mother_name:['']
    });
  }

  get contactNumber() {
    return this.profileForm.get('contact_number');
  }

  getProfileData() {
    this.userId = localStorage.getItem('user');
    this.userservice.profiledata(this.userId).subscribe((response: any) => {
      this.profileForm.patchValue({
        full_name: response.full_name,
        father_name: response.father_name,
        gender: response.gender,
        // dob: response.dob,
        contact_number: response.contact_number,
        email: response.email,
        marital_status:response.marital_status,
        gotram:response.gotram,
        siblings:response.siblings,
        children:response.children,
        wife:response.wife,
        husband:response.husband,
        account_type:response.account_type,
        surname:response.surname,
        mother_name:response.mother_name


      });

      this.profile_pic = response.profile_pic;
      // if (this.profile_pic) {
      //   this.convertToBase64(this.profile_pic)
      //     .then(base64 => {
      //       this.profileImage = base64;
      //       this.profileForm.patchValue({
      //         profile_pic: base64
      //       });
      //     })
      //     .catch(error => {
      //       console.error("Error converting to base64:", error);
      //     });
      // }

      this.convertToBase64(this.profile_pic)
  .then(base64 => {
    const base64WithoutPrefix = base64.split(',')[1]; // Store clean string in form
    this.profileImage = base64WithoutPrefix;

    this.profileForm.patchValue({
      profile_pic: base64WithoutPrefix
    });
  })

    });
  }

  // convertToBase64(url: string): Promise<string | ArrayBuffer | null> {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = () => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         const base64String = reader.result as string;
  //         const cleanBase64 = base64String.replace(/^data:(application\/octet-stream|image\/[a-z]+);base64,/, '');
  //         resolve(cleanBase64);
  //       };
  //       reader.onerror = reject;
  //       reader.readAsDataURL(xhr.response);
  //     };
  //     xhr.onerror = reject;
  //     xhr.open('GET', url);
  //     xhr.responseType = 'blob';
  //     xhr.send();
  //   });
  // }


  convertToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String); // Keep prefix included
      };
      reader.onerror = reject;
      reader.readAsDataURL(xhr.response); // Adds base64 prefix
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

 
  updateProfile() {
    if (this.profileForm.valid) {
      this.userservice.updateprofile(this.profileForm.value, this.userId).subscribe(
        (response: any) => {
          // Handle successful update
          this.sharedservice.fetchByProfiledata(); // Update the profile data
          this.router.navigate(['/userprofile', this.userId]); // Navigate to the updated profile
          this.full_name = this.profileForm.get('full_name')?.value || ''; 
          localStorage.setItem('full_name', this.full_name);
          // window.location.reload();
          
                   this.notificationHelper.showSuccessNotification('profile update Successfully', '');

          if (this.dialogRef) {
            this.dialogRef.close(); // Close the dialog if open

          }
        },
        (error: any) => {
          console.error('Failed to update profile!', error); // Log the actual error
          this.notificationHelper.showErrorNotification('Failed to update profile');

          this.profileForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
        }
      );
    } else {
      this.profileForm.markAllAsTouched(); // If form is invalid, mark all fields as touched
    }
  }
  
  refreshPage() {
    window.location.reload();
  }
  

  // onFileChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input && input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64StringWithPrefix = reader.result?.toString() || '';
  //       const base64String = base64StringWithPrefix.split(',')[1];
  //       this.profileImage = base64String;
  //       this.profileForm.patchValue({
  //         profile_pic: base64String
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


  onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64WithPrefix = reader.result as string; // Includes "data:image/...;base64,"
      const base64WithoutPrefix = base64WithPrefix.split(',')[1]; // This is clean base64 string

      this.profileImage = base64WithoutPrefix;

      this.profileForm.patchValue({
        profile_pic: base64WithoutPrefix
      });

      this.profileForm.get('profile_pic')?.updateValueAndValidity(); // Trigger validation
    };
    reader.readAsDataURL(file);
  }
}


  // triggerFileInput() {
  //   const fileInput = document.getElementById('profile_pic') as HTMLElement;
  //   fileInput.click();
  // }

  @ViewChild('fileInput') fileInput!: ElementRef;

triggerFileInput() {
  this.fileInput.nativeElement.click();
}


  onImageError(event: any) {
    event.target.src = 'assets/profile1.webp'; // Set path to your default image
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

}

