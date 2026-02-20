
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
  selector: 'app-pujari-update-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pujari-update-profile.component.html',
  styleUrl: './pujari-update-profile.component.css'
})
export class PujariUpdateProfileComponent {



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
      public dialogRef: MatDialogRef<PujariUpdateProfileComponent>,
      private sharedservice: SharedService,
      private notificationHelper: NotificationHelper,
    
    ) {}
  
    ngOnInit() {
      this.initializeForm();
      this.getProfileData();
        this.fetchAllCategories();

    }
  
    initializeForm() {
      this.profileForm = this.fb.group({


      type: 'PUJARI',
      is_member: 'true',
      pujari_certificate: ['', Validators.required],
      working_temple: [''],
      connected_as: 'PUJARI',

      user: localStorage.getItem('user'),
      account_type: ['PRIVATE', Validators.required],
      pujari_designation: [''],
      pujari_id_type:[''],

      pujari_certificate_type: ['',Validators.required],
      pujari_expertise: [''],
      pujari_id_image:[''],
      pujari_type:[''],
      issued_by:[''],
      pujari_video:[''],
      pujari_category:[''],
      pujari_sub_category:['']
      });
    }
  

  
    getProfileData() {
      this.userId = localStorage.getItem('user');
      this.userservice.profiledata(this.userId).subscribe((response: any) => {
        this.profileForm.patchValue({
          full_name: response.full_name,
          father_name: response.father_name,
          gender: response.gender,
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
          mother_name:response.mother_name,


          pujari_designation:response.pujari_designation,
          pujari_expertise:response.pujari_expertise,
          pujari_type:response.pujari_type,
          pujari_category:response.pujari_category,
          pujari_sub_category:response.pujari_sub_category,
          working_temple:response.working_temple,
          pujari_id_type:response.pujari_id_type,
          pujari_certificate_type:response.pujari_certificate_type,
          issued_by:response.issued_by,
  
  
        });
  
    // const categoryIds: string[] = response.pujari_category || [];
    // const selectedSubIds: string[] = response.pujari_sub_category || [];

    // this.selectedSubcategories = []; // reset before repopulating

    // categoryIds.forEach((categoryId: string) => {
    //   this.expandedCategories.push(categoryId); // auto-expand
    //   this.fetchSubcategoriesById(categoryId, selectedSubIds); // modified version below
    // });

        const selectedSubIds: string[] = response.pujari_sub_category || [];

    this.selectedSubcategories = []; // Reset to avoid duplicates

    // Loop through all selected subcategory IDs
    this.categories.forEach((category: any) => {
      const categoryId = category.id;
      // Fetch and map subs that match selected IDs
      this.fetchSubcategoriesById(categoryId, selectedSubIds);
    });

         this.pujari_certificate = response.pujari_certificate;
 
      this.convertToBase64(this.pujari_certificate)
  .then(base64 => {
    this.profileForm.patchValue({
      pujari_certificate: base64
    });
    this.pujari_certificate = base64; 
  })
  .catch(error => {
    console.error("Error converting to base64:", error);
  });


        this.pujari_id_image = response.pujari_id_image;
   
    this.convertToBase64(this.pujari_id_image)
  .then(base64 => {
    if (typeof base64 === 'string') {
      this.profileForm.patchValue({
        pujari_id_image: base64
      });
      this.pujari_id_image = base64;
    } else {
      console.error("Base64 result is not a string:", base64);
    }
  })
  .catch(error => {
    console.error("Error converting to base64:", error);
  });


  this.pujari_video = response.pujari_video;
this.convertToBase64(this.pujari_video)
  .then(base64 => {
    this.profileForm.patchValue({
      pujari_video: base64
    });
    this.pujari_video = base64;
  })
  .catch(error => {
    console.error("Error converting video to base64:", error);
  });




      });
    }



          pujari_certificate: any;
  pujari_id_image: any;
  
    convertToBase64(url: string): Promise<string | ArrayBuffer | null> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            const cleanBase64 = base64String.replace(/^data:(application\/octet-stream|image\/[a-z]+);base64,/, '');
            resolve(cleanBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      });
    }
   
    updateProfile() {
      if (this.profileForm.valid) {

                const formDataWithImages = {
      ...this.profileForm.value,
      ...this.imagePayload
    };
        this.userservice.updateprofile(formDataWithImages, this.userId).subscribe(
          (response: any) => {
                      this.profileForm.patchValue({
      pujari_certificate: this.profileForm.value.pujari_certificate,
      pujari_id_image: this.profileForm.value.pujari_id_image,
          });
            // Handle successful update
            this.sharedservice.fetchByProfiledata(); // Update the profile data
            this.router.navigate(['/profile', this.userId]); // Navigate to the updated profile
            this.full_name = this.profileForm.get('full_name')?.value || ''; 
            localStorage.setItem('full_name', this.full_name);
            window.location.reload();
            
           
            if (this.dialogRef) {
              this.dialogRef.close(); // Close the dialog if open
  
            }
            this.notificationHelper.showSuccessNotification('   profile update Successfully', '');
          },
          (error: any) => {
            this.notificationHelper.showErrorNotification('Failed to update profile');
            console.error('Failed to update profile!', error); // Log the actual error
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


    toggleSubcategories(categoryId: string): void {
  const index = this.expandedCategories.indexOf(categoryId);
  if (index === -1) {
    this.expandedCategories.push(categoryId);
    this.fetchSubcategoriesById(categoryId);

   
    this.profileForm.get('pujari_category')?.setValue([categoryId]);
  } else {
    this.expandedCategories.splice(index, 1);
  }
}


onSubCategoryChange(categoryId: string, sub: any, event: any): void {
  if (event.target.checked) {
    this.selectedSubcategories.push({
      name: sub.label,
      id: sub.id,
      categoryId: categoryId
    });
  } else {
    this.selectedSubcategories = this.selectedSubcategories.filter(
      (s) => s.id !== sub.id
    );
  }

  // Update form control with selected subcategory IDs
  this.profileForm.get('pujari_sub_category')?.setValue(this.selectedSubcategories.map(s => s.id));
}

isSubcategorySelected(subId: string): boolean {
  return this.selectedSubcategories.some(s => s.id === subId);
}

removeSelectedSubcategory(categoryId: string, subId: string): void {
  this.selectedSubcategories = this.selectedSubcategories.filter(
    (s) => s.id !== subId
  );
  this.profileForm.get('pujari_sub_category')?.setValue(this.selectedSubcategories.map(s => s.id));
}



subcategoriesByCategoryId: { [key: string]: any[] } = {};
expandedCategories: string[] = [];
selectedSubcategories: any[] = [];
categories: any[] = [];


// fetchSubcategoriesById(categoryId: string): void {
//   if (this.subcategoriesByCategoryId[categoryId]) return;

//   this.userservice.pujarisubcategeories(categoryId).subscribe(
//     (res) => {
//       this.subcategoriesByCategoryId[categoryId] = res.map((sub: any) => ({
//         label: sub.name,
//         id: sub._id,
//         categoryId,
//       }));
//     },
//     (err) => console.error(err)
//   );
// }


// fetchSubcategoriesById(categoryId: string, selectedSubIds: string[] = []): void {
//   if (this.subcategoriesByCategoryId[categoryId]) {
//     // Still check if we need to map selected subcategories
//     const subs = this.subcategoriesByCategoryId[categoryId];
//     const matchedSubs = subs.filter((sub: any) => selectedSubIds.includes(sub.id));
//     this.selectedSubcategories.push(...matchedSubs.map((sub: any) => ({
//       name: sub.label,
//       id: sub.id,
//       categoryId: categoryId
//     })));
//     return;
//   }

//   this.userservice.pujarisubcategeories(categoryId).subscribe(
//     (res) => {
//       const subs = res.map((sub: any) => ({
//         label: sub.name,
//         id: sub._id,
//         categoryId,
//       }));

//       this.subcategoriesByCategoryId[categoryId] = subs;

//       const matchedSubs = subs.filter((sub: any) => selectedSubIds.includes(sub.id));
//       this.selectedSubcategories.push(...matchedSubs.map((sub: any) => ({
//         name: sub.label,
//         id: sub.id,
//         categoryId: categoryId
//       })));
//     },
//     (err) => console.error(err)
//   );
// }
fetchSubcategoriesById(categoryId: string, selectedSubIds: string[] = []): void {
  this.userservice.pujarisubcategeories(categoryId).subscribe(
    (res) => {
      const subs = res.map((sub: any) => ({
        label: sub.name,
        id: sub._id,
        categoryId,
      }));

      this.subcategoriesByCategoryId[categoryId] = subs;

      // Add only matching subcategories
      const matchedSubs = subs.filter((sub: any) => selectedSubIds.includes(sub.id));
      matchedSubs.forEach((sub: any) => {
        const alreadyExists = this.selectedSubcategories.some(s => s.id === sub.id);
        if (!alreadyExists) {
          this.selectedSubcategories.push({
            name: sub.label,
            id: sub.id,
            categoryId: sub.categoryId
          });
        }
      });
    },
    (err) => console.error(err)
  );
}



fetchAllCategories(): void {
  this.userservice.PujariCategories().subscribe(
    (res) => {
      this.categories = res.map((category: any) => ({
        label: category.name,
        id: category._id,
      }));
    },
    (err) => console.error(err)
  );
}
    


  certificatePlaceholder: string = 'Enter the Id Proof number';
  certificatePattern: string = '';

  onCertificateTypeChange(event: Event) {
    const selectedType = (event.target as HTMLSelectElement).value;

    switch (selectedType) {
      case 'aadhaar':
        this.certificatePlaceholder = 'Enter Aadhaar Number (xxxx-xxxx-xxxx)';
        this.certificatePattern = '\\d{4}-\\d{4}-\\d{4}'; // Format for Aadhaar
        break;
      case 'pan':
        this.certificatePlaceholder = 'Enter PAN Number (AAAAA9999A)';
        this.certificatePattern = '[A-Z]{5}[0-9]{4}[A-Z]{1}'; // Format for PAN
        break;
      case 'voter':
        this.certificatePlaceholder = 'Enter Voter ID Number (ABC1234567)';
        this.certificatePattern = '[A-Z]{3}[0-9]{7}'; // Format for Voter ID
        break;
      case 'Endownment sangam Private':
        this.certificatePlaceholder = 'Enter Endownment ID Number';
        this.certificatePattern = '[A-Za-z0-9]{1,}'; // Pattern for Endowment ID, adjust as needed
        break;
      default:
        this.certificatePlaceholder = 'Enter the certificate number';
        this.certificatePattern = '';
    }
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

    imagePayload: { [key: string]: string } = {
  pujari_certificate: '',
  pujari_id_image: '',
  pujari_video: '',

};
pujari_video: any;


    onFileChange(event: any, field: string) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64 = base64WithPrefix.split(',')[1]; // Remove prefix

      this.imagePayload[field] = base64;

      // ✅ Dynamically assign to the correct display variable
      if (field === 'pujari_certificate') {
        this.pujari_certificate = base64;
      } else if (field === 'pujari_id_image') {
        this.pujari_id_image = base64;
      }
      else if (field === 'pujari_video') {
        this.pujari_video = base64;
      }

      
      

      console.log('Image payload updated:', this.imagePayload);
    };
    reader.readAsDataURL(file);
  }
}
  
  
    triggerFileInput() {
      const fileInput = document.getElementById('pujari_certificate') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }    }

triggerFileInput1() {
  const fileInput = document.getElementById('pujari_id_image') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}


triggerVideoInput() {
  const fileInput = document.getElementById('pujari_video') as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
}

  
    onImageError(event: any) {
      event.target.src = 'assets/profile1.webp'; // Set path to your default image
    }
  }
  
  


