import { Component, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoshalaService } from '../../services/goshalaservice/goshala.service';
import { Route } from '@angular/router';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup ,FormBuilder,Validators } from '@angular/forms';
import { CommonService } from '../../services/commonservice/common.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule,NgxSpinnerService } from 'ngx-spinner';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificationHelper } from '../commons/notification';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';


@Component({
  selector: 'app-getbygoshala',
  standalone: true,
  imports: [CommonModule,NzModalModule,NzFormModule,ReactiveFormsModule,NgxSpinnerModule,AddSpaceComponent,AddSpace1Component,NzUploadModule],
  templateUrl: './getbygoshala.component.html',
  styleUrl: './getbygoshala.component.css'
})
export class GetbygoshalaComponent {


  goshaladata:any;
  templeId:any;
  commentText: string = '';
  commentform!:FormGroup;
    eventsData: any[] = [];


  constructor(private route:ActivatedRoute,
    private router:Router
    ,private goshalaservice:GoshalaService,
     private commanservice:CommonService, 
     private fb:FormBuilder,
     private spinner: NgxSpinnerService,
       private notificationHelper:NotificationHelper,private authenticationService:AuthenticationService,
     private dialog: MatDialog,private renderer: Renderer2

    ){
      this.addnearbyhospitalss();
      this.Addmoredetails();
    }

  // ngOnInit():void{
  //   this.fetchgoshala()

  //   this.commentform= this.fb.group({
     
  //       body:['',Validators.required],
  //       goshala:[this.templeId],
  //       // temple:null,
  //       user:localStorage.getItem('user')

  //   })

    
  // }

  ngOnInit(): void {
  // Get the templeId from the route first
  // this.templeId = this.route.snapshot.paramMap.get("id");
    this.route.paramMap.subscribe(params => {
      this.templeId = params.get("id");
      console.log("templeId1",this.templeId)
      if (this.templeId) {
        this.fetchgoshala();
      }
    });
  // Fetch goshala data using the templeId

  // Initialize the comment form after templeId is set
  this.commentform = this.fb.group({
    body: ['', Validators.required],
    goshala: [this.templeId], // Now this will have the correct ID
    user: [localStorage.getItem('user')]
  });
}


vetarnaryhospital:any;
nearbygoshalas:any;

  othertemples:any;
  allTemples:any;
  GramadevataTemples:any;
  famoustemples:any;
  iconictemples:any;
  mediaDetails:any;
eventdatagallery:any;
nearbytemples: any = {}; // define as object

  
getVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([\w-]{11})/);
  return match ? match[1] : '';
}




// navigategoshaladata(goshala: any): void {
//   const id = goshala?._id || goshala?.id;
//   if (id) {
//     this.router.navigate(['getbygoshala', id])
//       .then(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       })
//       .catch(error => console.error("Navigation failed:", error));
//   } else {
//     console.error("Invalid goshala object - missing ID", goshala);
//   }
// }

  goshalaId: any;
  goshalaStatus: any;

navigategoshaladata(goshaladata: any): void {
  
  this.goshalaId = goshaladata._id;
  this.goshalaStatus = goshaladata.status;
  console.log("deddec",this.goshalaStatus)

  
  if (this.goshalaStatus === 'INACTIVE') {
    this.notificationHelper.showErrorNotification('This goshala is under review', '');
    return;
  }


  this.router.navigate(['getbygoshala', this.goshalaId])
    .then(() => console.log("Navigation successful"))
    .catch(error => console.error("Navigation failed:", error));
}


  fetchgoshala(): void {
    this.spinner.show();
    this.templeId = this.route.snapshot.paramMap.get("id");
  
    this.goshalaservice.getbyGoshala(this.templeId).subscribe(
      (data: any) => {
      console.log("API Response Data:", data);

      // if (!data || data.length === 0) {
      //   console.error("templedata is not defined or empty");
      //   this.spinner.hide();
      //   return;
      // }

      this.goshaladata = data.map((temple: any) => ({
        ...temple,
        favorite: false
      }));

      this.goshaladata = data;
     
      this.vetarnaryhospital = this.goshaladata[0]?.vetarnary_hospital;
      this.nearbygoshalas = this.goshaladata[0]?.nearby_goshalas;
            this.eventsData = this.goshaladata[0]?.nearby_events;

            this.nearbytemples = this.goshaladata[0]?.nearby_temples || {};


            const iconictemples = this.nearbytemples.iconic_temples || [];
            const famoustemples = this.nearbytemples.famous_temples || [];
            const gramadevataTemples = this.nearbytemples.gramadevata_temples || [];
            const othertemples = this.nearbytemples.other_temples || [];

            // Combine all into a single array
            this.allTemples = [
              ...iconictemples,
              ...famoustemples,
              ...gramadevataTemples,
              ...othertemples
            ];

      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",this.nearbygoshalas)
     
      this.spinner.hide(); // ✅ Hide spinner after successful data processing

     


    },
      error => {
        console.error('Error fetching goshala data:', error);
        this.spinner.hide(); // Ensure the spinner hides even if there's an error
      }
    );
  }
  
 navigateEventdata(event: string): void {
    this.router.navigate(['detailviewevent', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }

  handlevetarnaryhospitalImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/image.png';
}

  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
  }




    onSubmit() {
    const ismemberin = localStorage.getItem("is_member") === "true";
    const commentdata  = this.commentform.value;
 if(ismemberin){
  
 

    
  const comment = {
    body: commentdata.body,
    goshala: this.route.snapshot.paramMap.get("id"),
    user:localStorage.getItem('user')
};

  

    this.commanservice.addcomment(comment).subscribe(
      response => {
        
        this.fetchgoshala();
        this.commentform.reset();
        console.log(response,"11111111111111")
        
        // Clear the comment text box or any other UI updates
        // this.commentText = '';
      },
      error => {
        console.error('Error posting comment:', error);
        // Handle error as needed
      }
    );
  }else {
    this.openmemberDialog();
  }
  }



  // openmemberDialog(): void {
  //   console.log('sssssssssss');
  //   const dialogRef = this.dialog.open(OnlymemberComponent, {
  //     data: { displayName: 'signup' },
  //     autoFocus: false,
  //     backdropClass: 'dialog-backdrop',
  //   });

  //   dialogRef.afterClosed().subscribe(() => {
  //     // Handle after dialog close actions here
  //   });
  // }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/goshala-default.jpg';
  }


  
  
  // sharegetbytemple(temple: any) {
  //   if (!temple || !temple._id) {
  //     console.error('Invalid temple data provided.');
  //     return;
  //   }
  
  //   const shareUrl = `${window.location.origin}/getbygoshala/${temple._id}`; 
  //   console.log('Share URL:', shareUrl);
  
  //   if (navigator.share) {
  //     navigator.share({
  //       title: temple.name,
  //       text: temple.desc || 'Check out this temple!',
  //       url: shareUrl
  //     }).then(() => {
  //       console.log('Sharing successful');
  //     }).catch((error) => {
  //       console.error('Error sharing:', error);
  //     });
  //   } else {
  //     alert(`Share URL: ${shareUrl}`);
  //   }
  // }

async sharegetbytemple(temple: any) {
  if (!temple || !temple._id) {
    console.error('Invalid temple data provided.');
    return;
  }

  // ✅ Construct Share URL
  // const shareUrl = temple.share_url 
  //   ? temple.share_url 
  //   : `${window.location.origin}/villages/${temple._id}`;

      const templeLink = temple.share_url 
    ? temple.share_url 
    : `https://gramadevata.com/getbygoshala/${temple._id}`;

  // ✅ Shorten description
  const maxLength = 250;
  let shortDesc = temple.desc || "Check out this temple!";
  if (shortDesc.length > maxLength) {
    shortDesc = shortDesc.substring(0, maxLength).trim() + "...";
  }

  // ✅ Prepare share text
  const shareText =
    `${temple.name}\n\n` +
    `${shortDesc}\n\n` +
    `URL: ${templeLink}`;

  // ✅ First image (optional)
  const imageUrl = temple.image_location?.[0]
    ? temple.image_location[0].replace(/ /g, "%20")
    : null;

  try {
    let shared = false;

    // ✅ Share with image (if supported)
    if (imageUrl && navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (blob.type.startsWith("image/")) {
          const file = new File([blob], 'temple.jpg', { type: blob.type });

          await navigator.share({
            title: temple.name,
            text: shareText,
            files: [file]
          });
          shared = true;
        }
      } catch (err) {
        console.warn("Image fetch/share failed:", err);
      }
    }

    // ✅ Fallback to text-only share (with image link if available)
    if (!shared) {
      let fallbackText = shareText;
      if (imageUrl) {
        fallbackText += `\n\nImage: ${imageUrl}`;
      }

      if (navigator.share) {
        await navigator.share({
          title: temple.name,
          text: fallbackText
        });
      } else {
        alert(`Temple details:\n\n${fallbackText}`);
      }
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
}


  getRemainingAddress(address: string): string {
  const parts = address.split(',');
  return parts.length > 1 ? ', ' + parts.slice(1).join(',').trim() : '';
}


getVillageName(address: string): string {
  return address.split(',')[0].trim();
}

navigateToVillage(villageId: string): void {
  this.router.navigate(['/villages', villageId]);
}



selectedDescription: string = '';

openModal(desc: string): void {
  this.selectedDescription = desc;
}


selectedCategory: string | null = null;


selectCategory(categoryId: string): void {
  this.selectedCategory = categoryId;

  this.scrollToSection(categoryId);
}

scrollToSection(sectionId: string): void {
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}


village_id:any;
//  navigateTo(route: string): void {
//     const ismemberin = localStorage.getItem('is_member') === 'true';
//     if (ismemberin === false) {
//       this.openmemberDialog();
//     } else {

//       this.router.navigate([route], { state: { village_id: this.village_id } });
//     }

//   }

  navigateTo(route: string): void {

  const isLoggedIn = this.authenticationService.isLoggedInUser();

  if (!isLoggedIn) {

    this.authenticationService.showLoginModal().afterClosed().subscribe(() => {

      const loggedInNow = this.authenticationService.isLoggedInUser();
      if (!loggedInNow) return;

      const isMember = localStorage.getItem('is_member') === 'true';

      if (!isMember) {
        this.openmemberDialog().afterClosed().subscribe(() => {
          if (localStorage.getItem('is_member') === 'true') {
            this.router.navigate([route]);
          }
        });
      } else {
        this.router.navigate([route]);
      }

    });

    return;
  }


  const isMember = localStorage.getItem('is_member') === 'true';

  if (!isMember) {
    this.openmemberDialog().afterClosed().subscribe(() => {
      if (localStorage.getItem('is_member') === 'true') {
        this.router.navigate([route]);
      }
    });
  } else {
    this.router.navigate([route]);
  }
}


  openmemberDialog() {
  return this.dialog.open(OnlymemberComponent, {
    data: { displayName: 'member' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
     disableClose: true,
  });
}








  // templeId: any;
  templeStatus: any;
  
  navigateTotempleDetail(data: any): void {
    this.templeId = data._id;
    this.templeStatus = data.status;
  
    
    if (this.templeStatus === 'INACTIVE') {
      this.notificationHelper.showSuccessNotification('This temple is under review', '');
      return;
    }
  
    
    let userId = this.authenticationService.getCurrentUser();
  
    
    if (!userId) {
      this.authenticationService.showLoginModal();
      return;
    }
  
    
    this.router.navigate(['templedetailsview', this.templeId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }).catch(error => console.error("Navigation failed:", error));
  }



  dialogRef!: MatDialogRef<any>;
    hospitalform!:FormGroup;


@ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
openaddvectinarynearbyhospitals(): void {
  this.dialogRef = this.dialog.open(this.nearbyhospitalsDialog, {
    disableClose: false,
    width: '600px'
  });
}



addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    goshala_id: this.route.snapshot.paramMap.get("id"),
    desc:[''],
    doctor_name:[''],
    contact_number:[''],
    license_copy:[''],


    // temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}




Addhospital() {
  if (this.hospitalform.valid) {
      this.goshalaservice.addvectinaryhospital(this.hospitalform.value).subscribe(
          response => {
              console.log('Hospital added successfully:', response);

              this.hospitalform.reset();

              // ✅ Clear the uploaded images
              this.bannerFileList = [];
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              
          },
          error => {
              console.error('Error adding temple:', error);
          }
      );
  } else {
      this.hospitalform.markAllAsTouched();
  }
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


// Uploadhospitalimage(info:NzUploadChangeParam):void {
//   this.adddhospitalimage(info, 'image_location');
//  }

//  adddhospitalimage(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   // Initialize an empty array to store base64 strings
//   const base64Images: string[] = [];

//   fileList.forEach((file: NzUploadFile) => {
//     this.getBase64(file.originFileObj!, (base64String: string) => {
//       file['base64'] = base64String;
//       base64Images.push(base64String);

//       // Update the form control once all images are processed
//       if (base64Images.length === fileList.length) {
//         this.hospitalform.patchValue({ image_location: base64Images });
//         console.log('Updated images form:', this.hospitalform.value);
//       }
//     });
//   });

//   if (formControlName === 'image_location') {
//     this.bannerFileList = fileList;
//   }

//   console.log('File upload:', info.fileList);
// }

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
  
  bannerFileList: NzUploadFile[] = [];


  
handleimageRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}



@ViewChild('AddmoreListDialog') AddmoreListDialog!: TemplateRef<any>;
openAddMoreDetailsDialog(): void {
  this.dialogRef = this.dialog.open(this.AddmoreListDialog, {
    disableClose: false,
    width: '600px',
  });
}



Addmoredetails(): void {
  this.detailsForm = this.fb.group({

    image_location:[''],
    desc:[''],
    map_location:[  '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
    goshala_video:[''],
     goshala_id: this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status: ['INACTIVE']

  });
}
    preventLeadingSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;

  if (event.key === ' ' && input.selectionStart === 0) {
    event.preventDefault(); 
  }
}

addmoreVideoList: NzUploadFile[] = [];

handleaddmoreVideoUpload(info: NzUploadChangeParam, controlName: string): void {
  const fileList = [...info.fileList];

  if (fileList.length > 0) {
    const file = fileList[0]; // Only one video allowed
    this.getBase64(file.originFileObj!, (base64: string) => {
      file['base64'] = base64;
      this.detailsForm.patchValue({ [controlName]: base64 });
    });
  }

  if (controlName === 'goshala_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.detailsForm.patchValue({ [controlName]: '' });

  if (controlName === 'goshala_video') {
    this.addmoreVideoList = [];
  }
}








getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.detailsForm.patchValue({
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




bannerFileList1: NzUploadFile[] = [];





handleimageChange(info:NzUploadChangeParam):void {
  this.handleUploadimage(info, 'image_location');
 }

 handleUploadimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.detailsForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.detailsForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}





  detailsForm!: FormGroup;






Addmore() {
  this.spinner.show();
  if (this.detailsForm.valid) {
      this.goshalaservice.Goshalaaddmoredetails(this.detailsForm.value).subscribe(
          response => {
              console.log('village added successfully:', response);
                            this.notificationHelper.showSuccessNotification('Goshala Details Added Successfully', '');
                            //  window.location.reload();
                                    this.detailsForm.reset();
        this.bannerFileList=[];
        this.addmoreVideoList=[];


        if (this.dialogRef) {
          this.dialogRef.close();
        }
            this.spinner.hide();  
          },
          error => {
              console.error('Error adding village:', error);
 this.notificationHelper.showErrorNotification('Failed to Add Goshala', '');
              this.spinner.hide();
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
  }
}





}