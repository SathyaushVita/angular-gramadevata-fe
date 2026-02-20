import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/userservice/user.service';
import { FormsModule } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/memberservice/member.service';
import { UpdateprofileComponent } from '../updateprofile/updateprofile.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../services/sharedservice/shared.service';
import { Subscription } from 'rxjs';
import { UpdaterootsComponent } from '../updateroots/updateroots.component';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NotificationHelper } from '../commons/notification';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import {  MatDialogRef } from '@angular/material/dialog';
import { TemplateRef, ViewChild } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 Import this
import { PujariUpdateProfileComponent } from '../pujari-update-profile/pujari-update-profile.component';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule,FormsModule,NzUploadModule,NzIconModule,NzModalModule,NgxSpinnerModule, MatDialogModule,ReactiveFormsModule,
    MatButtonModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent {

 @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  private subscription: Subscription = new Subscription();
  imagesform!:FormGroup;
  userdata: any;
  userid: any;
  connectdata: any;
  connectedTemples: any;
  connectedTemplescount: any;
  connectdvillges: any;
  connectdvillgescount: any;
  useraddedtemples: any;
  images: string[] = [];
  selectedImage: string | null = null;
  fileList: NzUploadFile[] = [];
  bannerFileList: NzUploadFile[] = [];
  villageconnections: any;
  templeconnections: any;
  addedtemples: any;
  imagesdata: any;
  familyimages: any;
  goshaladata: any;
  eventdata: any;
  profile:any;
  user: any;
  Isuser: any;
  templeId: any;
  templeStatus: any;
  goshalaId: any;
  goshalaStatus: any;
  eventId: any;
  eventStatus: any;
  isFileSelected: boolean = false;



  
  constructor(
     private UserService:UserService,
     
     private router:Router,
     private fb:FormBuilder,
     private memberservice:MemberService,
     private dialog:MatDialog,
     private sharedService:SharedService,
     private route:ActivatedRoute,
     private modal:NzModalService,
     private notificationHelper:NotificationHelper,
     private spinner: NgxSpinnerService,
     private sharedservice: SharedService,
    ){}
    ngOnInit(): void {
      
      // Subscribe to triggerFetchVillageData$ observable and call fetchprofiledata when triggered
      this.subscription.add(
        this.sharedService.triggerFetchprofileData$.subscribe(() => {
          this.fetchprofiledata();
        })
      );
    
      // this.userid = this.route.snapshot.paramMap.get('id');
      this.route.paramMap.subscribe(params => {
        this.userid = params.get('id');
        if (this.userid) {
          this.fetchprofiledata();
        }
      });
     
      this.fetchprofiledata();
    
      
      this.imagesform = this.fb.group({
        family_images: [[], Validators.required] 
      });

      this.RootsUpdateForm();
        this.getProfileData();

    }
    
    

    faviouritetemples:any;
fetchprofiledata(): void {
  this.spinner.show()
    this.user = localStorage.getItem('user');
    this.UserService.profiledata(this.userid).subscribe(
      data => {
        this.userdata = data;
        this.familyimages = data.family_images
        this.goshaladata = data.goshalas
        this.eventdata = data.events
        this.addedtemples = data.temples
        this.faviouritetemples=data.favorite
        console.log("favourite temples",this.faviouritetemples)
        // console.log(this.addedtemples.image_location[0],"this.addedtemples")
        this.spinner.hide()
       
        this.villageconnections = [];
          this.templeconnections = [];

          this.profile = data.profile_pic;
          console.log(this.addedtemples,"this.profile")
          

          localStorage.setItem('profile_pic', this.profile);
          

          
        this.villageconnections.push(...data.Connections.filter((conn: any) => conn.temple === null));
        this.templeconnections.push(...data.Connections.filter((conn: any) => conn.village === null));
        this.connectedTemplescount = this.templeconnections.length
        this.connectdvillgescount = this.villageconnections.length

        this.Isuser = (this.user === this.userid)

          console.log(this.Isuser,"this.Isuser")
          // window.location.reload();
  
        if ((data)) {
          this.useraddedtemples = data;  
          
          this.useraddedtemples.forEach((user: any) => {
            console.log("swdefrgth")
            if (user.Connections && Array.isArray(user.Connections)) {
              this.villageconnections.push(...user.Connections.filter((conn: any) => conn.temple === null));
              this.templeconnections.push(...user.Connections.filter((conn: any) => conn.village === null));
              this.connectedTemplescount = this.templeconnections.length
              this.connectdvillgescount = this.villageconnections.length
              // this.familyimages =user.
              

            }
          });

          // this.addedtemples = this.addedtemples || [];

          this.useraddedtemples.forEach((user: any) => {
            if (user.temples && Array.isArray(user.temples)) {
              this.addedtemples.push(...user.temples);
              
            }
          });

          console.log(this.connectedTemplescount, "connectedTemplescount");
          console.log(this.connectdvillgescount, "connectdvillgescount");
          console.log(this.familyimages, "familyimages");
  
          console.log(this.addedtemples, "addedtemples");
          console.log(this.villageconnections, "villageconnections");
          console.log(this.templeconnections, "templeconnections");

          this.user = localStorage.getItem('user');
         
          
          
  
        } else {
          this.useraddedtemples = data;
          this.spinner.hide()
  
          if (data.Connections && Array.isArray(data.Connections)) {
            this.villageconnections = data.Connections.filter((conn: any) => conn.temple === null);
            this.templeconnections = data.Connections.filter((conn: any) => conn.village === null);
            console.log(this.villageconnections, "villageconnections");
            console.log(this.templeconnections, "templeconnections");
          }
  
          this.addedtemples = data.temples || [];
          console.log(this.addedtemples, "addedtemples");
        }
  
        console.log(this.useraddedtemples, "useraddedtemples1");
      },
      error => {
        console.error("Error fetching profile data", error);
      }
    );
  }
  
  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  handleProfileImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profile1.webp';
  }




  onViewImage(index: number): void {
    const imageUrl = this.familyimages[index] ? this.familyimages[index] : 'assets/ohm.jpg';
    this.modal.create({
      nzTitle: 'View Image',
      nzContent: `<img src="${imageUrl}" class="img-fluid" style="width: 100%;" alt="Image"/>`,
      nzFooter: null,
      // nzWidth: '100%'
    });
  }



onDeleteImage(index: number): void {
  this.dialogRef = this.dialog.open(this.deleteDialog, {
    data: { index }
  });

  this.dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.familyimages.splice(index, 1);

      const imagedata = {
        action: "delete_family_image",
        index: index
      };

      this.UserService.DeleeFamilyImage(imagedata, this.userid).subscribe(
        (response: any) => {
          console.log('Image deletion successful:', response);
        },
        (error: any) => {
          console.error('Error deleting image:', error);
        }
      );
    } else {
      console.log('User canceled deletion');
    }
  });
}





// pujaridelete(): void {
//   const confirmDelete = confirm("Are you sure you want to delete this pujari?");
  
//   if (confirmDelete) {
//     this.UserService.Deleepujari(this.userid).subscribe(
//       (response: any) => {
//         console.log('Pujari deletion successful:', response);
//          this.notificationHelper.showErrorNotification('Pujari delete successful');

//       },
//       (error: any) => {
//         console.error('Error deleting pujari:', error);
//       }
//     );
//   } else {
//     console.log('User canceled deletion');
//   }
// }


 openDeletePujariDialog(): void {
    this.confirmDialogRef = this.dialog.open(this.deletePujariDialog);

    this.confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.pujaridelete(); // Proceed with delete
      } else {
        console.log('User canceled deletion');
      }
    });
  }

  pujaridelete(): void {
    this.UserService.Deleepujari(this.userid).subscribe(
      (response: any) => {
        console.log('Pujari deletion successful:', response);
        this.notificationHelper.showSuccessNotification('✅ Pujari deleted successfully!');
                  this.router.navigate(['/userprofile', this.userId]);
                          window.location.reload();


      },
      (error: any) => {
        console.error('Error deleting pujari:', error);
        this.notificationHelper.showErrorNotification('❌ Error deleting Pujari. Please try again or check dependencies.');
      }
    );
  }


// deletemeber(): void {
//   const confirmDelete = confirm("Are you sure you want to delete this Member?");
  
//   if (confirmDelete) {
//     this.UserService.Deleemember(this.userid).subscribe(
//       (response: any) => {
//         console.log('Member deletion successful:', response);
//                this.notificationHelper.showErrorNotification('Member delete successful');
//       },
//       (error: any) => {
//         console.error('Error deleting pujari:', error);
        
//        this.notificationHelper.showErrorNotification('Please delete your Pujari details before deleting Member details.');

//       }
//     );
//   } else {
//     console.log('User canceled deletion');
//   }
// }
  @ViewChild('deletePujariDialog') deletePujariDialog!: TemplateRef<any>;

  @ViewChild('deleteMemberDialog') deleteMemberDialog!: TemplateRef<any>;
  confirmDialogRef!: MatDialogRef<any>;


openDeleteDialog(): void {
    this.confirmDialogRef = this.dialog.open(this.deleteMemberDialog);

    this.confirmDialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deletemeber(); // proceed with delete
      } else {
        console.log('User canceled deletion');
      }
    });
  }

  deletemeber(): void {
    this.UserService.Deleemember(this.userid).subscribe(
      (response: any) => {
        console.log('Member deletion successful:', response);
        this.notificationHelper.showSuccessNotification('Member deleted successfully');


                          // this.router.navigate(['/home']);
                                this.router.navigate(['/home']).then(() => {
        window.location.reload();   // 👈 reload after navigation
      });

      },
      (error: any) => {
        console.error('Error deleting member:', error);
        this.notificationHelper.showErrorNotification(
          'Please delete your Pujari details before deleting Member details.'
        );
      }
    );
  }

  


  onFileSelected(event: any) {
    if (event.target.files) {
      const selectedFiles = event.target.files;
      const fileArray = Array.from(selectedFiles);
  
      if (fileArray.length + this.bannerFileList.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
      }
  
      fileArray.forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.bannerFileList.push({
            uid: Math.random().toString(36).substring(7),
            name: file.name,
            status: 'done',
            url: e.target.result,
          });
  
          this.getBase64(file, (base64String) => {
            const currentImages = this.imagesform.get('family_images')?.value || [];
            this.imagesform.patchValue({ family_images: [...currentImages, base64String] });
          });
        };
        reader.readAsDataURL(file);
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
    // const fileList = [...info.fileList];
      let fileList = [...info.fileList];

    if (fileList.length > 10) {
    fileList = fileList.slice(0, 10); // keep only first 10
    this.notificationHelper.showErrorNotification('You can upload only 10 images.');
  }

    // Initialize an empty array to store base64 strings
    const base64Images: string[] = [];
  
    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        base64Images.push(base64String);
  
        // Update the form control once all images are processed
        if (base64Images.length === fileList.length) {
          this.imagesform.patchValue({ family_images: base64Images });
          console.log('Updated images form:', this.imagesform.value);
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

imagePaths: string[] = [
  '../../../assets/village1.jpg',
  '../../../assets/village2.jpg',
  '../../../assets/village3.jpg',
  '../../../assets/village4.jpg'
];

navigateFavouriteTempleDetail(_id: string): void {
  if (_id) {
    console.log('Navigating to:', _id);
    this.router.navigate(["getbytemples", _id]);
  } else {
    console.warn("Invalid temple ID");
  }
}

navigateTempleDetail(data: any): void {
  this.templeId = data._id;
  this.templeStatus = data.status;

  
  if (this.templeStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This temple is under review', '');
    return;
  }


  this.router.navigate(['templedetailsview', this.templeId]);
}



navigatevisitedTempleDetail(id: any): void {
  if (id) {
    this.router.navigate(['templedetailsview', id]);
  } else {
    console.warn('Invalid temple ID:', id);
  }
}


navigateTogoshaladetail(goshaladata: any): void {
  
  this.goshalaId = goshaladata._id;
  this.goshalaStatus = goshaladata.status;
  console.log("deddec",this.goshalaStatus)

  
  if (this.goshalaStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This goshala is under review', '');
    return;
  }


  this.router.navigate(['getbygoshala', this.goshalaId])
    .then(() => console.log("Navigation successful"))
    .catch(error => console.error("Navigation failed:", error));
}

navigateEventdata(event:any):void{
  this.eventId = event._id;
  this.eventStatus = event.status;
  console.log("deddec",this.goshalaStatus)

  
  if (this.eventStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This event is under review', '');
    return;
  }
  this.router.navigate(['detailviewevent',this.eventId])
}

navigateToVillageDetail(_id:any):void{
  this .router.navigate(['villages',_id])
}

onsubmit(): void {
  const userId = localStorage.getItem('user');
  if (!userId) {
    console.error('User ID not found in localStorage');
    return;
  }

  const imagesData = this.imagesform.value;
  console.log('Images data:', imagesData);

  this.memberservice.AddFamilyImages(imagesData, userId).subscribe({
    next: (data) => {
      console.log('Images added:', data);
      this.fetchprofiledata();
      this.bannerFileList = [];
      this.imagesform.reset()
    },
    error: (err) => {
      console.error('Error adding images:', err);
    }
  });
}


openmemberDialog(): void {
  console.log('sssssssssss');
  const dialogRef = this.dialog.open(UpdateprofileComponent, {
    data: { displayName: 'updateprofile' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(() => {
   
  });
}



openpujariDialog(): void {
  console.log('sssssssssss');
  const dialogRef = this.dialog.open(PujariUpdateProfileComponent, {
    data: { displayName: 'updateprofile' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
  });

  dialogRef.afterClosed().subscribe(() => {
   
  });
}


updateroots(): void {
  console.log('sssssssssss');
  const dialogRef = this.dialog.open(UpdaterootsComponent, {
    data: { displayName: 'updateprofile' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
  });

  dialogRef.afterClosed().subscribe(() => {
  });
}







navigateTemplefaviouriteDetail(templeId: string) {
  if (!templeId) {
    console.error('Invalid temple ID:', templeId);
    return;
  }

  this.router.navigate(['getbytemples', templeId]);
}


  updateProfileForm!: FormGroup;
    userId:any;


//     imagePayload: { [key: string]: string } = {
//   mf_image: '',
//   f_mf_image: '',
//   m_mf_image: '',
//   ff_mf_image: '',
//   fm_mf_image: '',
//   mf_mf_image: '',
//   mm_mf_image: ''
// };



imagePayload: { [key: string]: string[] } = {
  mf_image: [],
  f_mf_image: [],
  m_mf_image: [],
  ff_mf_image: [],
  fm_mf_image: [],
  mf_mf_image: [],
  mm_mf_image: []
};



  updateProfile() {
    if (this.updateProfileForm.valid) {

        const formDataWithImages = {
      ...this.updateProfileForm.value,
      ...this.imagePayload
    };

      console.log('Form is images valid', formDataWithImages);
      this.UserService.updateprofile(formDataWithImages, this.userId).subscribe(
        (response: any) => {
          this.updateProfileForm.patchValue({
      mf_image: this.updateProfileForm.value.mf_image,
      f_mf_image: this.updateProfileForm.value.f_mf_image,
      
    });
          this.sharedservice.fetchByProfiledata();
                  this.notificationHelper.showSuccessNotification('Family Heritage details updated successfully');
        this.isEditMode = false; // ✅ Exit edit mode after success

          this.router.navigate(['/userprofile', this.userId]);
          this.dialogRef.close(); 

        },
        (error: any) => {
          console.error('Failed to update profile!', error);
                  this.notificationHelper.showErrorNotification('Failed to update Family Heritage details. Please try again.');

          this.updateProfileForm.markAllAsTouched();
        }
      );
    } else {
      console.log('Form is invalid', this.updateProfileForm.errors);
          this.notificationHelper.showErrorNotification('Form is invalid. Please fill all required fields.');

      this.updateProfileForm.markAllAsTouched();
    }
  }


    RootsUpdateForm(){

    this.updateProfileForm = this.fb.group({

      father_name: [''],

      mother_name: [''],
      paternal_grandmother_name: [''],
      paternal_grandfather_name: [''],
      paternal_great_grandfather_name: [''],
      paternal_great_grandmother_name: [''],
      paternal_grandmother_father_name: [''],
      paternal_grandmother_mother_name: [''],
      maternal_grandfather_name: [''],
      maternal_grandmother_name: [''],
      maternal_great_grandfather_name: [''],
      maternal_great_grandmother_name: [''],
      maternal_grandmother_father_name: [''],
      maternal_grandmother_mother_name: [''],
      mf_image:[''],
      f_mf_image:[''],
      m_mf_image:[''],
      ff_mf_image:[''],
      fm_mf_image:[''],
      mf_mf_image:[''],
      mm_mf_image:[''],
      desc:['']
    });
  }

 

 imageFields: string[] = [
  'mf_image',
  'f_mf_image',
  'm_mf_image',
  'ff_mf_image',
  'fm_mf_image',
  'mf_mf_image',
  'mm_mf_image'
];

imagePreviews: { [key: string]: string[] } = {}; 
base64Images: { [key: string]: string[] } = {}; 



  mfimage: string | ArrayBuffer | null = null;
  mf_image: string[] = [];




    onImageError(event: any) {
    event.target.src = 'assets/profile1.webp'; 
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


  @ViewChild('fileInput') fileInput!: ElementRef;
  [key: string]: any;




// working
  

// onFileChange(event: any, field: string) {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const base64WithPrefix = reader.result as string;
//       const base64 = base64WithPrefix.split(',')[1]; // Remove prefix

//       this.imagePayload[field] = base64;

//       // ✅ Dynamically assign to the correct display variable
//       if (field === 'mf_image') {
//         this.mf_image = base64;
//       } else if (field === 'f_mf_image') {
//         this.f_mf_image = base64;
//       } else if (field === 'm_mf_image') {
//         this.m_mf_image = base64;
//       }
//       else if (field === 'ff_mf_image') {
//         this.ff_mf_image = base64;
//       }
//       else if (field === 'fm_mf_image') {
//         this.fm_mf_image = base64;
//       }
//        else if (field === 'mf_mf_image') {
//         this.mf_mf_image = base64;
//       }
//           else if (field === 'mm_mf_image') {
//         this.mm_mf_image = base64;
//       }
      
      

//       console.log('Image payload updated:', this.imagePayload);
//     };
//     reader.readAsDataURL(file);
//   }
// }


// onFileChange(event: any, field: string) {
//   const files: File[] = Array.from(event.target.files);
//   this.imagePayload[field] = []; // Ensure it starts empty

//   if (files.length > 0) {
//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const base64WithPrefix = reader.result as string;
//         const base64 = base64WithPrefix.split(',')[1]; // Remove prefix
//         (this.imagePayload[field] as string[]).push(base64);

//         // Optional: You can assign to preview variables if needed
//         if (field === 'mf_image') {
//           this.mf_image = [...this.imagePayload[field]];
//         } else if (field === 'f_mf_image') {
//           this.f_mf_image = [...this.imagePayload[field]];
//         } else if (field === 'm_mf_image') {
//           this.m_mf_image = [...this.imagePayload[field]];
//         } else if (field === 'ff_mf_image') {
//           this.ff_mf_image = [...this.imagePayload[field]];
//         } else if (field === 'fm_mf_image') {
//           this.fm_mf_image = [...this.imagePayload[field]];
//         } else if (field === 'mf_mf_image') {
//           this.mf_mf_image = [...this.imagePayload[field]];
//         } else if (field === 'mm_mf_image') {
//           this.mm_mf_image = [...this.imagePayload[field]];
//         }

//         console.log(`Updated imagePayload[${field}]`, this.imagePayload[field]);
//       };
//       reader.readAsDataURL(file);
//     });
//   }
// }

onFileChange(event: any, field: string, index?: number) {
  const files: File[] = Array.from(event.target.files);
  if (!this.imagePayload[field]) {
    this.imagePayload[field] = [];
  }

  if (files.length > 0) {
    const file = files[0]; // For slot-specific, only take 1 image
    const reader = new FileReader();
    reader.onload = () => {
      const base64WithPrefix = reader.result as string;
      const base64 = base64WithPrefix.split(',')[1]; // Remove prefix

      if (index !== undefined) {
        // Replace at specific index
        this.imagePayload[field][index] = base64;
      } else {
        // If index not provided, push to array
        (this.imagePayload[field] as string[]).push(base64);
      }

      // Reflect in the preview variable
      switch (field) {
        case 'mf_image':
          this.mf_image = [...this.imagePayload[field]];
          break;
        case 'f_mf_image':
          this.f_mf_image = [...this.imagePayload[field]];
          break;
        case 'm_mf_image':
          this.m_mf_image = [...this.imagePayload[field]];
          break;
        case 'ff_mf_image':
          this.ff_mf_image = [...this.imagePayload[field]];
          break;
        case 'fm_mf_image':
          this.fm_mf_image = [...this.imagePayload[field]];
          break;
        case 'mf_mf_image':
          this.mf_mf_image = [...this.imagePayload[field]];
          break;
        case 'mm_mf_image':
          this.mm_mf_image = [...this.imagePayload[field]];
          break;
      }

      console.log(`Updated imagePayload[${field}][${index}]`, this.imagePayload[field]);
    };
    reader.readAsDataURL(file);
  }
}



  // triggerFileInput() {
  //   const fileInput = document.getElementById('profile_pic') as HTMLElement;
  //   fileInput.click();
  // }

//   triggerFileInput(fileInput: HTMLInputElement): void {
//   fileInput.click();
// }
@ViewChild('fileInput_mf') fileInput_mf!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_mm') fileInput_mm!: ElementRef<HTMLInputElement>;

triggerFileInput(index: number, group: string): void {
  if (group === 'mf') {
    if (index === 0) {
      this.fileInput_mf.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_mm.nativeElement.click();
    }
  }
  // Add similar blocks for other groups like 'mm', 'ff', etc.
}



triggerFileInput1(index: number): void {
  if (index === 0) {
    this.fileInput0.nativeElement.click();
  } else if (index === 1) {
    this.fileInput1.nativeElement.click();
  }
}

@ViewChild('fileInput0') fileInput0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;

  // triggerFileInput1() {
  //   const fileInput = document.getElementById('profile_pic1') as HTMLElement;
  //   fileInput.click();
  // }
//  triggerFileInput2() {
//     const fileInput = document.getElementById('profile_pic2') as HTMLElement;
//     fileInput.click();
//   }


  triggerFileInput2(index: number, group: string): void {
  if (group === 'm') {
    if (index === 0) {
      this.fileInput_m_0.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_m_1.nativeElement.click();
    }
  }
}

@ViewChild('fileInput_m_0') fileInput_m_0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_m_1') fileInput_m_1!: ElementRef<HTMLInputElement>;


  //  triggerFileInput3() {
  //   const fileInput = document.getElementById('profile_pic3') as HTMLElement;
  //   fileInput.click();
  // }

  triggerFileInput3(index: number, group: string): void {
  if (group === 'ff') {
    if (index === 0) {
      this.fileInput_ff_0.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_ff_1.nativeElement.click();
    }
  }
  // Optionally handle other groups (f, m, etc.) here as well
}

@ViewChild('fileInput_ff_0') fileInput_ff_0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_ff_1') fileInput_ff_1!: ElementRef<HTMLInputElement>;

//  triggerFileInput4() {
//     const fileInput = document.getElementById('profile_pic4') as HTMLElement;
//     fileInput.click();
//   }

triggerFileInput4(index: number, group: string): void {
  if (group === 'fm') {
    if (index === 0) {
      this.fileInput_fm_0.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_fm_1.nativeElement.click();
    }
  }
  // Add logic for other groups like 'ff', 'm', 'f' as needed
}
@ViewChild('fileInput_fm_0') fileInput_fm_0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_fm_1') fileInput_fm_1!: ElementRef<HTMLInputElement>;



  // triggerFileInput5() {
  //   const fileInput = document.getElementById('profile_pic5') as HTMLElement;
  //   fileInput.click();
  // }

  triggerFileInput5(index: number, group: string): void {
  if (group === 'mf') {
    if (index === 0) {
      this.fileInput_mf_0.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_mf_1.nativeElement.click();
    }
  }
  // You can continue adding other groups like 'ff', 'fm', etc. as before
}
@ViewChild('fileInput_mf_0') fileInput_mf_0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_mf_1') fileInput_mf_1!: ElementRef<HTMLInputElement>;



  //  triggerFileInput6() {
  //   const fileInput = document.getElementById('profile_pic6') as HTMLElement;
  //   fileInput.click();
  // }

  triggerFileInput6(index: number, group: string): void {
  if (group === 'mm') {
    if (index === 0) {
      this.fileInput_mm_0.nativeElement.click();
    } else if (index === 1) {
      this.fileInput_mm_1.nativeElement.click();
    }
  }
  // Add other groups like 'ff', 'fm', 'mf' similarly...
}

@ViewChild('fileInput_mm_0') fileInput_mm_0!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput_mm_1') fileInput_mm_1!: ElementRef<HTMLInputElement>;

  //     f_mf_image: string = '';
  // m_mf_image: string = '';
  // ff_mf_image: string = '';
  // fm_mf_image: string = '';
  // mf_mf_image: string = '';
  // mm_mf_image:string='';


f_mf_image: string[] = [];
m_mf_image: string[] = [];
ff_mf_image: string[] = [];
fm_mf_image: string[] = [];
mf_mf_image: string[] = [];
mm_mf_image: string[] = [];


 getProfileData() {
    this.userId = localStorage.getItem('user');
    this.UserService.profiledata(this.userId).subscribe((response: any) => {
      this.updateProfileForm.patchValue({
        father_name: response.father_name,
        mother_name: response.mother_name,
        paternal_grandmother_name: response.paternal_grandmother_name,
        paternal_grandfather_name: response.paternal_grandfather_name,
        paternal_great_grandfather_name: response.paternal_great_grandfather_name,
        paternal_great_grandmother_name:response.paternal_great_grandmother_name,
        paternal_grandmother_father_name:response.paternal_grandmother_father_name,
        paternal_grandmother_mother_name:response.paternal_grandmother_mother_name,
        maternal_grandfather_name:response.maternal_grandfather_name,
        maternal_grandmother_name:response.maternal_grandmother_name,
        maternal_great_grandfather_name:response.maternal_great_grandfather_name,
        maternal_great_grandmother_name:response.maternal_great_grandmother_name,
        maternal_grandmother_father_name:response.maternal_grandmother_father_name,
        maternal_grandmother_mother_name:response.maternal_grandmother_mother_name,
        mf_image:response.mf_image,
        m_mf_image:response.m_mf_image,
        f_mf_image:response.f_mf_image,
        ff_mf_image:response.ff_mf_image,
        mf_mf_image:response.mf_mf_image,
        mm_mf_image:response.mm_mf_image,

        email: response.email,
        desc:response.desc
      });
  //           this.mf_image = response.mf_image;
 
  //     this.convertToBase64(this.mf_image)
  // .then(base64 => {
  //   this.updateProfileForm.patchValue({
  //     mf_image: base64
  //   });
  //   this.mf_image = base64; 
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });

  this.mf_image = response.mf_image || [];
this.convertUrlsToBase64(this.mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ mf_image: base64Images });
    this.mf_image = base64Images;
  });



  //       this.f_mf_image = response.f_mf_image;
   
  //   this.convertToBase64(this.f_mf_image)
  // .then(base64 => {
  //   if (typeof base64 === 'string') {
  //     this.updateProfileForm.patchValue({
  //       f_mf_image: base64
  //     });
  //     this.f_mf_image = base64;
  //   } else {
  //     console.error("Base64 result is not a string:", base64);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });

  this.f_mf_image = response.f_mf_image || [];
this.convertUrlsToBase64(this.f_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ f_mf_image: base64Images });
    this.f_mf_image = base64Images;
  });

// ... same for m_mf_image, ff_mf_image, etc.





//               this.m_mf_image = response.m_mf_image;
     
// this.convertToBase64(this.m_mf_image)
//   .then(base64 => {
//     if (typeof base64 === 'string') {
//       this.updateProfileForm.patchValue({
//         m_mf_image: base64
//       });
//       this.m_mf_image = base64; // ✅ Now safe
//     } else {
//       console.error("Base64 is not a string:", base64);
//     }
//   })
//   .catch(error => {
//     console.error("Error converting to base64:", error);
//   });
this.m_mf_image = response.m_mf_image || [];

this.convertUrlsToBase64(this.m_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ m_mf_image: base64Images });
    this.m_mf_image = base64Images;
  })
  .catch(error => {
    console.error('Error converting m_mf_image:', error);
  });




  //   this.ff_mf_image = response.ff_mf_image;
  //      this.convertToBase64(this.ff_mf_image)
  // .then(base64 => {
  //   if (typeof base64 === 'string') {
  //     this.updateProfileForm.patchValue({
  //       ff_mf_image: base64
  //     });
  //     this.ff_mf_image = base64; // ✅ Now safe
  //   } else {
  //     console.error("Base64 is not a string:", base64);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });
             
    

  //  this.fm_mf_image = response.fm_mf_image;
  //      this.convertToBase64(this.fm_mf_image)
  // .then(base64 => {
  //   if (typeof base64 === 'string') {
  //     this.updateProfileForm.patchValue({
  //       fm_mf_image: base64
  //     });
  //     this.fm_mf_image = base64; // ✅ Now safe
  //   } else {
  //     console.error("Base64 is not a string:", base64);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });
             

  //  this.mf_mf_image = response.mf_mf_image;
  //      this.convertToBase64(this.mf_mf_image)
  // .then(base64 => {
  //   if (typeof base64 === 'string') {
  //     this.updateProfileForm.patchValue({
  //       mf_mf_image: base64
  //     });
  //     this.mf_mf_image = base64; // ✅ Now safe
  //   } else {
  //     console.error("Base64 is not a string:", base64);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });
  
         
  //     this.mm_mf_image = response.mm_mf_image;
  //      this.convertToBase64(this.mm_mf_image)
  // .then(base64 => {
  //   if (typeof base64 === 'string') {
  //     this.updateProfileForm.patchValue({
  //       mm_mf_image: base64
  //     });
  //     this.mm_mf_image = base64; // ✅ Now safe
  //   } else {
  //     console.error("Base64 is not a string:", base64);
  //   }
  // })
  // .catch(error => {
  //   console.error("Error converting to base64:", error);
  // });

  this.ff_mf_image = response.ff_mf_image || [];
this.convertUrlsToBase64(this.ff_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ ff_mf_image: base64Images });
    this.ff_mf_image = base64Images;
  })
  .catch(error => {
    console.error('Error converting ff_mf_image:', error);
  });

this.fm_mf_image = response.fm_mf_image || [];
this.convertUrlsToBase64(this.fm_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ fm_mf_image: base64Images });
    this.fm_mf_image = base64Images;
  })
  .catch(error => {
    console.error('Error converting fm_mf_image:', error);
  });

this.mf_mf_image = response.mf_mf_image || [];
this.convertUrlsToBase64(this.mf_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ mf_mf_image: base64Images });
    this.mf_mf_image = base64Images;
  })
  .catch(error => {
    console.error('Error converting mf_mf_image:', error);
  });

this.mm_mf_image = response.mm_mf_image || [];
this.convertUrlsToBase64(this.mm_mf_image)
  .then(base64Images => {
    this.updateProfileForm.patchValue({ mm_mf_image: base64Images });
    this.mm_mf_image = base64Images;
  })
  .catch(error => {
    console.error('Error converting mm_mf_image:', error);
  });


      
    });
  }
isEditMode: boolean = false;

convertUrlsToBase64(urls: string[]): Promise<string[]> {
  const promises = urls.map((url) =>
    new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).replace(/^data:(application\/octet-stream|image\/[a-z]+);base64,/, '');
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    })
  );

  return Promise.all(promises);
}




public siteWindow = window;

shareUrl(url: string) {
  if (!url) {
    alert("URL not found!");
    return;
  }

  if (navigator.share) {
    navigator.share({
      title: "Share Link",
      url: url   // <-- This makes it a clickable link
    }).catch(err => console.error("Share failed:", err));
  } else {
    alert(url);
  }
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