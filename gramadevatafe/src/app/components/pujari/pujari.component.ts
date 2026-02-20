import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/memberservice/member.service';

import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/userservice/user.service';
import { SharedService } from '../../services/sharedservice/shared.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-pujari',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzUploadModule,NgxSpinnerModule],
  templateUrl: './pujari.component.html',
  styleUrl: './pujari.component.css'
})
export class PujariComponent {

  memberform!: FormGroup;
  ConnectForm!: FormGroup;
  villageroleoptions: any;
  villageid: any;
  apicall: any;
  templeId: any;
  certificatePlaceholder: string = 'Enter the Id Proof number';
  certificatePattern: string = '';
  isMemberIn = false
  isPujariIn = false
  userId: any;

 

  constructor(
    private memberservice: MemberService,
    private fb: FormBuilder,
    protected userservice:UserService,
    private sharedservice:SharedService,
         private spinner: NgxSpinnerService,
    
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PujariComponent>
  ) {
    this.villageid = data.villageid; 
    console.log(this.villageid,"ffffsfd")
    this.templeId = data.templeId
  }



  ngOnInit(): void {
    this.getProfileData();
    this.initializeForm();
    this.connectionsForm();
    this.isMemberUser();
  this.fetchAllCategories();
  }



  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
  if (isMemberIn) {
    this.isMemberIn = true
  } else {
    this.isMemberIn = false
  } 
}

  connectionsForm(): void {

    this.ConnectForm = this.fb.group(
      {
      connected_as:"PUJARI",
      village: this.villageid,
      temple:this.templeId,
      user : localStorage.getItem('user'),
      // profile_pic:this.profileImage,
      
      
      }
    );
  }


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

  // onCertificateTypeChange(event: Event) {
  //   const selectedType = (event.target as HTMLSelectElement).value;

  //   switch (selectedType) {
  //     case 'aadhaar':
  //       this.certificatePlaceholder = 'Enter Aadhaar Number (xxxx-xxxx-xxxx)';
  //       this.certificatePattern = '\\d{4}-\\d{4}-\\d{4}'; // Format for Aadhaar
  //       break;
  //     case 'pan':
  //       this.certificatePlaceholder = 'Enter PAN Number (AAAAA9999A)';
  //       this.certificatePattern = '[A-Z]{5}[0-9]{4}[A-Z]{1}'; // Format for PAN
  //       break;
  //     case 'voter':
  //       this.certificatePlaceholder = 'Enter Voter ID Number (ABC1234567)';
  //       this.certificatePattern = '[A-Z]{3}[0-9]{7}'; // Format for Voter ID
  //       break;
  //     default:
  //       this.certificatePlaceholder = 'Enter the certificate number';
  //       this.certificatePattern = '';
  //   }
  // }

  profile_pic: any;

  // initializeForm(): void {
  //   this.memberform = this.fb.group({
  //     full_name: ["", Validators.required],
  //     father_name: ['', Validators.required],
  //     type:"PUJARI",
  //     is_member:"true",
  //     // contact_number: ['',Validators.required],
  //     contact_number: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
  //     // dob: ['',Validators.required],
  //     gender: ['',Validators.required],
  //     pujari_certificate: ["", Validators.required],
  //     working_temple:[""],
  //     connected_as:"PUJARI",
  //     village: this.villageid,
  //     temple:this.templeId,
  //     user : localStorage.getItem('user'),
  //     family_images:[''],
  //     account_type:['PRIVATE',Validators.required],
  //     email:[''],
  //     pujari_designation:[''],
  //     surname:['',Validators.required],
  //     voluntary_level:[''],
  //     profile_pic: ['',Validators.required],
  //     certificate_type: ['', Validators.required],
     
      
  //   });
  //   // this.villageroleoptions = enumToMap(your_role_in_our_village);
  //   // this.memberform.controls['your_role_in_our_village'].setValue('Villager');
  // }

  initializeForm(): void {
    this.memberform = this.fb.group({
      full_name: ['', Validators.required],
      father_name: ['', Validators.required],
      type: 'PUJARI',
      is_member: 'true',
      contact_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: [null, Validators.required],
      pujari_certificate: ['', Validators.required],
      working_temple: [''],
      connected_as: 'PUJARI',
      village: this.villageid,
      temple: this.templeId,
      user: localStorage.getItem('user'),
      family_images: [''],
      account_type: [null, Validators.required],
      email: [''],
      pujari_designation: [''],
      surname: ['', Validators.required],
      voluntary_level: [''],
      profile_pic: ['', Validators.required],
      // certificate_type: ['', Validators.required],
      pujari_id_type:[''],
      // pujari_certificate_type:['', Validators.required],

      pujari_certificate_type: ['',Validators.required],
      // pujari_id_type: [''],
      pujari_expertise: [''],
      pujari_id_image:[''],
      pujari_type:[''],
      issued_by:['',Validators.required],
      pujari_video:[''],
      pujari_category:[''],
      pujari_sub_category:['']
      // pujari_sub_category: this.fb.array([]) 
    });

    this.ConnectForm = this.fb.group({
      connected_as: ['PUJARI'],
      village: [this.villageid],
      temple: [this.templeId],
      user: [localStorage.getItem('user')]
    });
  }

  get contactNumber() {
    return this.memberform.get('contact_number');
  }


  // getProfileData() {
  //   this.userId = localStorage.getItem('user');
  //   this.userservice.profiledata(this.userId).subscribe((response: any) => {
  //     const pic = response.profile_pic;
  
  //           // Set the form and image preview
  //     this.profileImage=pic 
  //     console.log("+++++++++++++++++++++++++++++++++++++++++",this.profileImage)
  //     this.memberform.patchValue({
  //       full_name: response.full_name,
  //       father_name: response.father_name,
  //       gender: response.gender,
  //       // dob: response.dob,
  //       contact_number: response.contact_number,
  //       email: response.email,
  //       marital_status:response.marital_status,
  //       gotram:response.gotram,
  //       siblings:response.siblings,
  //       children:response.children,
  //       wife:response.wife,
  //       husband:response.husband,
  //       account_type:response.account_type,
  //       profile_pic:response.profile_pic
       


  //     });

      
  //   });
  // }


  getProfileData() {
    this.userId = localStorage.getItem('user');
    this.userservice.profiledata(this.userId).subscribe((response: any) => {
      this.memberform.patchValue({
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
      if (this.profile_pic) {
        this.convertToBase64(this.profile_pic)
          .then(base64 => {
            this.profileImage = base64;
            this.memberform.patchValue({
              profile_pic: base64
            });
          })
          .catch(error => {
            console.error("Error converting to base64:", error);
          });
      }
    });
  }


  useraddedtemples:any;


//   onSubmit(): void {
//     if (this.memberform.invalid) {
//       this.memberform.markAllAsTouched();
//       return;
//     }
//     const userId = localStorage.getItem('user');
//     const {connected_as, village, user, ...memberData} = this.memberform.value;
//     console.log(memberData,"memberData")
//     const { full_name, father_name, contact_number, dob, type, ...connectdata } = this.memberform.value;
//     console.log(connectdata,"connectdata")
//    if (localStorage.getItem('is_member') === 'false') {
//     if (userId && memberData) {
//       this.memberservice.AddMember(memberData, userId).subscribe(
//         response => {
//           if (this.apicall === "Connection Temples") {
//             this.sharedservice.fetchTempleData();
//             this.sharedservice.fetchVillagedata()
//           } else {
//             this.sharedservice.fetchByTempleData();
//             this.sharedservice.fetchVillagedata()
//           }
          
//           localStorage.setItem('type', 'PUJARI');
//           localStorage.setItem('is_member', 'true');
//           console.log('Member added successfully:', response);
//           this.memberform.reset();
//           this.dialogRef.close();
       
//           this.memberservice.connect(connectdata).subscribe(
//             response => {
//               console.log(response);
//               localStorage.setItem('type', 'PUJARI');
//               localStorage.setItem('is_member', 'true');
//               console.log("connected succesfully1")
//               if (this.apicall === "Connection Temples") {
//                 this.sharedservice.fetchTempleData();
//                 this.sharedservice.fetchVillagedata()
//               } else {
//                 this.sharedservice.fetchByTempleData();
//                 this.sharedservice.fetchVillagedata()
//               }
              
//             },
//             error => {
//               console.error('Error connecting:', error);
//               // Handle connection error here
//             }
//           );
        
//         },
//         error => {
//           console.error('Error adding member:', error);
//           this.memberform.markAllAsTouched()
//           // Handle error here, for example, display an error message to the user
//         }
//       );
//     } else {
//       console.error('User ID or member data is missing.');
      
//       // Handle the missing user ID or member data here
//     }
//   } else {
//     const connectdata = this.ConnectForm.value;
//     console.log(connectdata,"connectdata")
//     this.memberservice.connect(connectdata).subscribe(
//       response => {
//         localStorage.setItem('type', 'PUJARI');
//         if (this.apicall === "Connection Temples") {
//           this.sharedservice.fetchTempleData();
//           this.sharedservice.fetchVillagedata()
//         } else {
//           this.sharedservice.fetchByTempleData();
//           this.sharedservice.fetchVillagedata()
//         }
//         console.log(response);
//         this.ConnectForm.reset();
//         this.dialogRef.close();
//         // this.memberservice.refreshvillagedata();
//         console.log("connected succesfully")
//       },
//       error => {
//         console.error('Error connecting:', error);
//         // Handle connection error here
//       }
//     );
//   }
// }
  

  // onSubmit(): void {
  //   console.log("///////////////////////////////////////////////////")
  //   if (this.memberform.invalid) {
  //     this.memberform.markAllAsTouched();
  //     return;
  //   }
  //   console.log("=====================================================")
  //   const userId = localStorage.getItem('user');
  //   const isMember = localStorage.getItem('is_member') === 'true';
  //   const userType = localStorage.getItem('type');

  //   const { connected_as, village, user, ...memberData } = this.memberform.value;
  //   const { full_name, father_name, contact_number, dob, type, ...connectdata } = this.memberform.value;

  //   if (!userId) {
  //     console.error('User ID is missing.');
  //     return;
  //   }

  //   if (!isMember) {
  //     this.memberservice.AddMember(memberData, userId).subscribe(
  //       response => {
  //         localStorage.setItem('type', 'PUJARI');
  //         localStorage.setItem('is_member', 'true');
  //         this.dialogRef.close();
  //         this.sharedservice.fetchTempleData();
  //         this.sharedservice.fetchVillagedata();
  //         this.memberservice.connect(connectdata).subscribe();
  //       },
  //       error => {
  //         console.error('Error adding member:', error);
  //         this.memberform.markAllAsTouched();
  //       }
  //     );
  //   } else if (userType !== 'PUJARI') {
  //     console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}")
  //     this.memberservice.AddMember(memberData, userId).subscribe(
  //       response => {
  //         localStorage.setItem('type', 'PUJARI');
  //         window.location.reload();
  //       },
  //       error => {
  //         console.error('Error updating member:', error);
  //         this.memberform.markAllAsTouched();
  //       }
  //     );
  //     this.memberservice.connect(connectdata).subscribe();
  //   } else {
  //     const connectdata = this.ConnectForm.value;
  //     this.memberservice.connect(connectdata).subscribe(
  //       response => {
  //         this.ConnectForm.reset();
  //         this.dialogRef.close();
  //       },
  //       error => {
  //         console.error('Error connecting:', error);
  //       }
  //     );
  //   }
  // }


  // working

  
//   onSubmit(): void {
//     if (this.memberform.invalid) {
//       this.memberform.markAllAsTouched();
//       return;
//     }
//     const userId = localStorage.getItem('user');
//     const isMember = localStorage.getItem('is_member') === 'true';
//     const userType = localStorage.getItem('type');
  
//     const { connected_as, village, user, ...memberData } = this.memberform.value;
//     const { full_name, father_name, contact_number, dob, type, ...connectdata } = this.memberform.value;
  
//     if (!userId) {
//       console.error('User ID is missing.');
//       return;
//     }
  
//     // Case 1: User is not a member yet
//     if (!isMember) {
//       console.log("1111111111111111111111111111111111")
//       console.log('Adding member...', memberData);
//       this.memberservice.AddMember(memberData, userId).subscribe(
//         response => {
//           this.useraddedtemples = response;
//           console.log("Member added:", this.useraddedtemples);
  
//           localStorage.setItem('type', 'PUJARI');
//           this.dialogRef.close(); 
//           localStorage.setItem('is_member', 'true');
//           this.memberform.reset();
//           // this.dialogRef.close();
  
//           // Refresh data
//           if (this.apicall === "Connection Temples") {
//             this.sharedservice.fetchTempleData();
//             this.sharedservice.fetchVillagedata();
//           } else {
//             this.sharedservice.fetchByTempleData();
//             this.sharedservice.fetchVillagedata();
//           }
  
//           // Connect the user
//           this.memberservice.connect(connectdata).subscribe(
//             connectResponse => {
//               console.log("Connected successfully:", connectResponse);
//               localStorage.setItem('type', 'PUJARI');
//             },
//             connectError => {
//               console.error('Error connecting:', connectError);
//             }
//           );
  
//           window.location.reload();
//         },
//         error => {
//           console.error('Error adding member:', error);
//           this.memberform.markAllAsTouched();
//         }
//       );
//     }
  
//     // Case 2: User is a member but not a PUJARI
//     else if (userType !== 'PUJARI') {

//       console.log("----------------")
//       console.log('User is a member but not a PUJARI, adding member data...');
//       this.memberservice.AddMember(memberData, userId).subscribe(
//         response => {
//           this.useraddedtemples = response;
//           console.log("Member updated:", this.useraddedtemples);
//           localStorage.setItem('type', 'PUJARI');
//           window.location.reload();
//         },
//         error => {
//           console.error('Error updating member:', error);
//           this.memberform.markAllAsTouched();
//         }
//       );

//       this.memberservice.connect(connectdata).subscribe(
//         connectResponse => {
//           console.log("Connected successfully:", connectResponse);
//           localStorage.setItem('type', 'PUJARI');
//           this.dialogRef.close();
          
//         },
//         connectError => {
//           console.error('Error connecting:', connectError);
//         }
//       );
//     }
//   // Case 3: User is already a PUJARI - update member profile and connect again
// else if (userType === 'PUJARI') {
//   console.log("User is already PUJARI - updating member and connecting...");
  
//   this.memberservice.AddMember(memberData, userId).subscribe(
//     response => {
//       this.useraddedtemples = response;
//       console.log("Member profile updated for PUJARI:", this.useraddedtemples);

//       // Then connect
//       const connectdata = this.ConnectForm.value;
//       console.log('Connecting:', connectdata);

//       this.memberservice.connect(connectdata).subscribe(
//         connectResponse => {
//           console.log("Connected successfully:", connectResponse);
//           localStorage.setItem('type', 'PUJARI');

//           if (this.apicall === "Connection Temples") {
//             this.sharedservice.fetchTempleData();
//             this.sharedservice.fetchVillagedata();
//           } else {
//             this.sharedservice.fetchByTempleData();
//             this.sharedservice.fetchVillagedata();
//           }

//           this.ConnectForm.reset();
//           this.dialogRef.close();
//         },
//         connectError => {
//           console.error('Error connecting:', connectError);
//         }
//       );
//     },
//     error => {
//       console.error('Error updating PUJARI member:', error);
//       this.memberform.markAllAsTouched();
//     }
//   );
// }

  
//   }
  



onSubmit(): void {

  this.spinner.show();
  if (this.memberform.invalid) {
    this.memberform.markAllAsTouched();
        this.spinner.hide();

    return;
  }

  const selectedSubcategoryIds = this.selectedSubcategories?.map(s => s.id) || [];
  this.memberform.get('pujari_sub_category')?.setValue(selectedSubcategoryIds);

  // const selectedSubcategoryIds = this.selectedSubcategories?.map(s => s.id) || [];
  if (selectedSubcategoryIds.length === 0) {
    alert('Please select at least one subcategory.');
        this.spinner.hide();

    return;
  }
  this.memberform.get('pujari_sub_category')?.setValue(selectedSubcategoryIds);

  const userId = localStorage.getItem('user');
  const isMember = localStorage.getItem('is_member') === 'true';
  const userType = localStorage.getItem('type');

  const { connected_as, village, user, ...memberData } = this.memberform.value;
  const { full_name, father_name, contact_number, dob, type, ...connectdata } = this.memberform.value;

  if (!userId) {
    console.error('User ID is missing.');
        this.spinner.hide();

    return;
  }

  if (!isMember) {
    // Case 1: Not a member
    this.memberservice.AddMember(memberData, userId).subscribe(
      response => {
        this.useraddedtemples = response;
        localStorage.setItem('type', 'PUJARI');
        localStorage.setItem('is_member', 'true');
        this.dialogRef.close();
        this.memberform.reset();

        if (this.apicall === "Connection Temples") {
          this.sharedservice.fetchTempleData();
          this.sharedservice.fetchVillagedata();
        } else {
          this.sharedservice.fetchByTempleData();
          this.sharedservice.fetchVillagedata();
        }

        this.memberservice.connect(connectdata).subscribe(
          connectResponse => {
            localStorage.setItem('type', 'PUJARI');
                this.spinner.hide();

            window.location.reload();
          },
          // connectError => console.error('Error connecting:', connectError)
             connectError => {
            console.error('Error connecting:', connectError);
            this.spinner.hide();
          }
          
        );
      },
      error => {
        console.error('Error adding member:', error);
        this.memberform.markAllAsTouched();
            this.spinner.hide();

      }
    );
  } else if (userType !== 'PUJARI') {
    // Case 2: Is member but not PUJARI
    this.memberservice.AddMember(memberData, userId).subscribe(
      response => {
        this.useraddedtemples = response;
        localStorage.setItem('type', 'PUJARI');
            this.spinner.hide();

        window.location.reload();
      },
      error => {
        console.error('Error updating member:', error);
        this.memberform.markAllAsTouched();
            this.spinner.hide();

      }
    );

    this.memberservice.connect(connectdata).subscribe(
      connectResponse => {
        localStorage.setItem('type', 'PUJARI');
        this.dialogRef.close();
            this.spinner.hide();

      },
      // connectError => console.error('Error connecting:', connectError)
       connectError => {
        console.error('Error connecting:', connectError);
        this.spinner.hide();
      }
    );
  } else if (userType === 'PUJARI') {
    // Case 3: Already PUJARI
    this.memberservice.AddMember(memberData, userId).subscribe(
      response => {
        this.useraddedtemples = response;
        const connectdata = this.ConnectForm.value;

        this.memberservice.connect(connectdata).subscribe(
          connectResponse => {
            localStorage.setItem('type', 'PUJARI');

            if (this.apicall === "Connection Temples") {
              this.sharedservice.fetchTempleData();
              this.sharedservice.fetchVillagedata();
            } else {
              this.sharedservice.fetchByTempleData();
              this.sharedservice.fetchVillagedata();
            }

            this.ConnectForm.reset();
            this.dialogRef.close();
                this.spinner.hide();

          },
 connectError => {
            console.error('Error connecting:', connectError);
            this.spinner.hide();
          }        );
      },
      error => {
        console.error('Error updating PUJARI member:', error);
        this.memberform.markAllAsTouched();
                this.spinner.hide();

      }
    );
  }
}

isDropdownVisible = false;

toggleDropdown(event: Event) {
  const checkbox = event.target as HTMLInputElement;
  this.isDropdownVisible = checkbox.checked;
}


handleProfileImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/profile1.webp';
}



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
profileImage: string | ArrayBuffer | null = null;

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64StringWithPrefix = reader.result?.toString() || '';
      const base64String = base64StringWithPrefix.split(',')[1];
      this.profileImage = base64String;
      this.memberform.patchValue({
        profile_pic: base64String
      });
    };
    reader.readAsDataURL(file);
  }
}


triggerFileInput() {
  const fileInput = document.getElementById('profile_pic') as HTMLElement;
  fileInput.click();
}

onImageError(event: any) {
  event.target.src = 'assets/profile1.webp'; // Set path to your default image
}

bannerFileList: NzUploadFile[] = [];

handleBannerFileRemove(file: any): boolean {
  // Remove the file from the list
  this.bannerFileList = this.bannerFileList.filter(f => f.uid !== file.uid);
  return true;
}

handleBannerFileChange(info:NzUploadChangeParam):void {
  this.handleUpload(info, 'pujari_certificate');
 }

//  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   // Initialize an empty array to store base64 strings
//   const base64Images: string[] = [];

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       file['base64'] = base64String;
//       base64Images.push(base64String);

//       // Update the form control once all images are processed
//       if (base64Images.length === fileList.length) {
//         this.memberform.patchValue({ pujari_certificate: base64Images });
//         console.log('Updated images form:', this.memberform.value);
//       }
//     });
//   });

//   if (formControlName === 'pujari_certificate') {
//     this.bannerFileList = fileList;
//   }

//   console.log('File upload:', info.fileList);
// }





handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length === 0) return;

  const file = fileList[0]; // Only the first file
  const originFile = file.originFileObj;

  if (originFile) {
    this.getBase64(originFile, (base64String: string) => {
      file['base64'] = base64String;

      // ✅ Set form control as a single base64 string
      this.memberform.patchValue({
        [formControlName]: base64String
      });

      console.log('✅ Updated form field with base64 string:', this.memberform.value[formControlName]);
    });
  }

  if (formControlName === 'pujari_certificate') {
    this.bannerFileList = fileList;
  }

  console.log('File upload complete:', fileList);
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


pujariFileList: NzUploadFile[] = [];


handlepujaricertificate(info:NzUploadChangeParam):void {
  this.handleUploadpujaricertificate(info, 'pujari_id_image');
 }

handleUploadpujaricertificate(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length === 0) return;

  const file = fileList[0]; // Only the first file
  const originFile = file.originFileObj;

  if (originFile) {
    this.getBase64(originFile, (base64String: string) => {
      file['base64'] = base64String;

      // ✅ Set form control as a single base64 string
      this.memberform.patchValue({
        [formControlName]: base64String
      });

      console.log('✅ Updated form field with base64 string:', this.memberform.value[formControlName]);
    });
  }

  if (formControlName === 'pujari_id_image') {
    this.pujariFileList = fileList;
  }

  console.log('File upload complete:', fileList);
}


handleBannerFileRemovepujari(file: any): boolean {
  // Remove the file from the list
  this.pujariFileList = this.pujariFileList.filter(f => f.uid !== file.uid);
  return true;
}


performanceVideoList: NzUploadFile[] = [];

handlePerformanceVideo(info: NzUploadChangeParam): void {
  this.handleUploadVideo(info, 'pujari_video');
}

handleUploadVideo(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length === 0) return;

  const file = fileList[0]; // Only allow one video
  const originFile = file.originFileObj;

  if (originFile) {
    this.getBase64(originFile, (base64String: string) => {
      file['base64'] = base64String;

      this.memberform.patchValue({
        [formControlName]: base64String
      });

      console.log('✅ Video base64 set:', this.memberform.value[formControlName]);
    });
  }

  if (formControlName === 'pujari_video') {
    this.performanceVideoList = fileList;
  }

  console.log('Video file list:', fileList);
}

handlePerformanceVideoRemove(file: any): boolean {
  this.performanceVideoList = this.performanceVideoList.filter(f => f.uid !== file.uid);
  this.memberform.patchValue({ pujari_video: null });
  return true;
}

// categories = [
//   {
//     id: 1,
//     name: 'Vedic Rituals',
//     subcategories: [
//       { id: 101, name: 'Yajna' },
//       { id: 102, name: 'Havan' },
//       { id: 103, name: 'Puja' }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Astrology',
//     subcategories: [
//       { id: 201, name: 'Horoscope Reading' },
//       { id: 202, name: 'Palmistry' },
//       { id: 203, name: 'Numerology' }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Spiritual Guidance',
//     subcategories: [
//       { id: 301, name: 'Meditation' },
//       { id: 302, name: 'Chanting' }
//     ]
//   }
// ];

// selectedCategories: number[] = [];
// selectedSubcategories: { [key: number]: number[] } = {};

// onCategoryChange(category: any, event: any): void {
//   const checked = event.target.checked;

//   if (checked) {
//     this.selectedCategories.push(category.id);
//     this.selectedSubcategories[category.id] = [];
//   } else {
//     this.selectedCategories = this.selectedCategories.filter(id => id !== category.id);
//     delete this.selectedSubcategories[category.id];
//   }
// }

// onSubCategoryChange(categoryId: number, subcategoryId: number, event: any): void {
//   const checked = event.target.checked;
//   if (checked) {
//     this.selectedSubcategories[categoryId].push(subcategoryId);
//   } else {
//     this.selectedSubcategories[categoryId] = this.selectedSubcategories[categoryId]
//       .filter(id => id !== subcategoryId);
//   }
// }


// categories = [
//   {
//     id: 1,
//     name: 'Vedic Rituals',
//     subcategories: [
//       { id: 101, name: 'Yajna' },
//       { id: 102, name: 'Havan' },
//       { id: 103, name: 'Puja' }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Astrology',
//     subcategories: [
//       { id: 201, name: 'Horoscope Reading' },
//       { id: 202, name: 'Palmistry' },
//       { id: 203, name: 'Numerology' }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Spiritual Guidance',
//     subcategories: [
//       { id: 301, name: 'Meditation' },
//       { id: 302, name: 'Chanting' }
//     ]
//   }
// ];

// selectedCategories: number[] = [];
// selectedSubcategories: { [key: number]: number[] } = {};

// onCategoryChange(category: any, event: any): void {
//   const checked = event.target.checked;

//   if (checked) {
//     this.selectedCategories.push(category.id);
//     this.selectedSubcategories[category.id] = [];
//   } else {
//     this.selectedCategories = this.selectedCategories.filter(id => id !== category.id);
//     delete this.selectedSubcategories[category.id];
//   }
// }

// onSubCategoryChange(categoryId: number, subcategoryId: number, event: any): void {
//   const checked = event.target.checked;
//   const selected = this.selectedSubcategories[categoryId] || [];

//   if (checked) {
//     this.selectedSubcategories[categoryId] = [...selected, subcategoryId];
//   } else {
//     this.selectedSubcategories[categoryId] = selected.filter(id => id !== subcategoryId);
//   }
// }
// expandedCategories: number[] = [];

// selectedSubcategories: { id: number; name: string; categoryId: number }[] = [];

// toggleSubcategories(categoryId: number): void {
//   const index = this.expandedCategories.indexOf(categoryId);
//   if (index > -1) {
//     this.expandedCategories.splice(index, 1);
//   } else {
//     this.expandedCategories.push(categoryId);
//   }
// }

// onSubCategoryChange(categoryId: number, sub: any, event: any): void {
//   if (event.target.checked) {
//     this.selectedSubcategories.push({
//       id: sub.id,
//       name: sub.name,
//       categoryId: categoryId
//     });
//   } else {
//     this.removeSelectedSubcategory(categoryId, sub.id);
//   }
// }

// removeSelectedSubcategory(categoryId: number, subcategoryId: number): void {
//   this.selectedSubcategories = this.selectedSubcategories.filter(
//     sub => sub.id !== subcategoryId
//   );
// }

// isSubcategorySelected(subcategoryId: number): boolean {
//   return this.selectedSubcategories.some(sub => sub.id === subcategoryId);
// }




selectedCategories: number[] = [];
// selectedSubcategories: { [key: number]: number[] } = {};

// onCategoryChange(category: any, event: any): void {
//   const checked = event.target.checked;

//   if (checked) {
//     this.selectedCategories.push(category.id);
//     // this.selectedSubcategories[category.id] = [];
//   } else {
//     this.selectedCategories = this.selectedCategories.filter(id => id !== category.id);
//     delete this.selectedSubcategories[category.id];
//   }
// }

// onSubCategoryChange(categoryId: number, subcategoryId: number, event: any): void {
//   const checked = event.target.checked;
//   const selected = this.selectedSubcategories[categoryId] || [];

//   if (checked) {
//     this.selectedSubcategories[categoryId] = [...selected, subcategoryId];
//   } else {
//     this.selectedSubcategories[categoryId] = selected.filter(id => id !== subcategoryId);
//   }
// }


// categories:any[]=[];
// subcategories:any[]=[];

// fetchallaCategories():void{
//   this.userservice.PujariCategories().subscribe(
//     (res) => {
//       res.forEach((category:any) =>{
//         this.categories.push({
//           label:category.name,
//           value:category._id
//         })
//       })
//     },
//     (err) => {
//       console.log(err)
//     }
//   )
// }



// fetchsubcategeorybyid(_id:string):void{
//   this.userservice.pujarisubcategeories(_id).subscribe(
//     (res) => {
//       res.forEach((category:any) =>{
//         this.subcategories.push({
//           label:category.name,
//           value:category._id
//         })
//       })
//     },
//     (err) => {
//       console.log(err)
//     }
//   )
// }


// onCategoryChange(categoryId: string): void {
//   if (categoryId) {
//     this.fetchsubcategeorybyid(categoryId);
//   } else {
//     this.subcategories = [];
//   }
// }









categories: any[] = [];
// subcategoriesByCategoryId: { [key: string]: any[] } = {};
// expandedCategories: string[] = [];
// selectedSubcategories: any[] = [];

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

// fetchSubcategoriesById(categoryId: string): void {
//   if (this.subcategoriesByCategoryId[categoryId]) return; // Avoid re-fetching

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

// toggleSubcategories(categoryId: string): void {
//   const index = this.expandedCategories.indexOf(categoryId);
//   if (index === -1) {
//     this.expandedCategories.push(categoryId);
//     this.fetchSubcategoriesById(categoryId);
//   } else {
//     this.expandedCategories.splice(index, 1);
//   }
// }

// onSubCategoryChange(categoryId: string, sub: any, event: any): void {
//   if (event.target.checked) {
//     this.selectedSubcategories.push({
//       name: sub.label,
//       id: sub.id,
//       categoryId: categoryId
//     });
//   } else {
//     this.selectedSubcategories = this.selectedSubcategories.filter(
//       (s) => s.id !== sub.id
//     );
//   }
// }

// isSubcategorySelected(subId: string): boolean {
//   return this.selectedSubcategories.some(s => s.id === subId);
// }

// removeSelectedSubcategory(categoryId: string, subId: string): void {
//   this.selectedSubcategories = this.selectedSubcategories.filter(
//     (s) => s.id !== subId
//   );
// }

subcategoriesByCategoryId: { [key: string]: any[] } = {};
expandedCategories: string[] = [];
selectedSubcategories: any[] = [];

fetchSubcategoriesById(categoryId: string): void {
  if (this.subcategoriesByCategoryId[categoryId]) return;

  this.userservice.pujarisubcategeories(categoryId).subscribe(
    (res) => {
      this.subcategoriesByCategoryId[categoryId] = res.map((sub: any) => ({
        label: sub.name,
        id: sub._id,
        categoryId,
      }));
    },
    (err) => console.error(err)
  );
}

// toggleSubcategories(categoryId: string): void {
//   const index = this.expandedCategories.indexOf(categoryId);
//   if (index === -1) {
//     this.expandedCategories.push(categoryId);
//     this.fetchSubcategoriesById(categoryId);
//   } else {
//     this.expandedCategories.splice(index, 1);
//   }
// }



// toggleSubcategories(categoryId: string): void {
//   const index = this.expandedCategories.indexOf(categoryId);
//   if (index === -1) {
//     this.expandedCategories.push(categoryId);
//     this.fetchSubcategoriesById(categoryId);
//     // Set the selected category to form control
//     this.memberform.get('pujari_category')?.setValue(categoryId);
//   } else {
//     this.expandedCategories.splice(index, 1);
//   }
// }


toggleSubcategories(categoryId: string): void {
  const index = this.expandedCategories.indexOf(categoryId);
  if (index === -1) {
    this.expandedCategories.push(categoryId);
    this.fetchSubcategoriesById(categoryId);

   
    this.memberform.get('pujari_category')?.setValue([categoryId]);
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
  this.memberform.get('pujari_sub_category')?.setValue(this.selectedSubcategories.map(s => s.id));
}

isSubcategorySelected(subId: string): boolean {
  return this.selectedSubcategories.some(s => s.id === subId);
}

removeSelectedSubcategory(categoryId: string, subId: string): void {
  this.selectedSubcategories = this.selectedSubcategories.filter(
    (s) => s.id !== subId
  );
  this.memberform.get('pujari_sub_category')?.setValue(this.selectedSubcategories.map(s => s.id));
}


}