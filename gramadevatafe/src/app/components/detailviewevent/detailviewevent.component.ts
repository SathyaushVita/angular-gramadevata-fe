import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/commonservice/common.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/eventservice/event.service';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NotificationHelper } from '../commons/notification';
@Component({
  selector: 'app-detailviewevent',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,AddSpace1Component,AddSpaceComponent,NzUploadModule ,NgxSpinnerModule],
  templateUrl: './detailviewevent.component.html',
  styleUrl: './detailviewevent.component.css'
})
export class DetailvieweventComponent {

  commentform!:FormGroup;
  hotelmForm!:FormGroup;
  touroperatorForm!:FormGroup;
  tourguideForm!:FormGroup;
  nearby_hotelsdetails: any[] = [];
  restaurantForm!:FormGroup;
  touroperatordetails: any[] = [];
  commentText: string = '';
  EventId:any;
  tourguides: any[] = [];
  eventdata:any;
  selectedCategory: string | null = null;
  bannerFileList: NzUploadFile[] = [];
  hospitalform!:FormGroup;
  dialogRef!: MatDialogRef<any>;
  nearesthospitals: any[] = [];
  transportdetails : any[] = [];
  resturant: any;
  isConnected= false;
  selectedImage: any;
  // nearbytemples: any;
  ConnectionData: any;
  blockId: any;

  constructor(private commonservice:CommonService,
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private eventservice:EventService,
    private dialog: MatDialog,
     private router:Router,
    private templeservice:TempleserviceService ,
        private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,private notificationHelper:NotificationHelper
  ){
          this.addrestaurantsform();
          this.addtourguideform();
          this.addnearbyhospitalss();
          this.addnearbyhotels();
          this.addtouroperatorsform();
          this.Addmoredetails();
  }

  

  ngOnInit(): void {

    // this.geteventdata();  
    
        this.route.paramMap.subscribe(params => {
      this.templeId = params.get("id");
      console.log("templeId1",this.templeId)
      if (this.templeId) {
        this.geteventdata();
      }
    });





     this.commentform= this.fb.group({
     
      body:['',Validators.required],
      event:[this.EventId],
      // temple:null,
      user:localStorage.getItem('user')

  })
    
  }


    allTemples:any;
nearbytemples: any = {};
  templeStatus: any;
  templeId:any;
  eventdatas:any


  geteventdata(): void {
    this.spinner.show();
    this.EventId = this.route.snapshot.paramMap.get("id");
    this.eventservice.getbyevent(this.EventId).subscribe(
      data => {
        this.eventdata = data;

      this.transportdetails = this.eventdata[0]?.transport;
      this.touroperatordetails = this.eventdata[0]?.touroperator;
            this.templegoshals = this.eventdata[0]?.nearby_goshalas;

      // this.tourismplacedetails = this.eventdata[0]?.tourismplace;
      this.nearby_hotelsdetails = this.eventdata[0]?.nearby_hotels;
      // this.Templefestivals = this.eventdata[0]?.festivals;
      // this.templegoshals = this.eventdata[0]?.goshalas;
      this.tourguides = this.eventdata[0]?.tour_guide;
      // this.socialactivity = this.eventdata[0]?.social_activity;
      // this.prayersandbenfits = this.eventdata[0]?.prayers_and_benefits;
      // this.templefacilities = this.eventdata[0]?.temple_facilities;
      this.nearesthospitals = this.eventdata[0]?.near_by_hospitals;
      this.resturant = this.eventdata[0]?.resturents;
      this.eventdatas = this.eventdata[0]?.nearby_events;

      // this.poojastores = this.eventdata[0]?.pooja_stores;

       this.nearbytemples = this.eventdata[0]?.nearby_temples || {};


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
                  this.spinner.hide(); // Hide spinner after success

      },
      error => {
      console.error("Error fetching event data:", error);
      this.spinner.hide(); // Hide spinner on error
    }
    );
  }
  
  navigateTotempleDetail(data: any): void {
    this.templeId = data._id;
    this.templeStatus = data.status;
  
    
    if (this.templeStatus === 'INACTIVE') {
      // this.notificationHelper.showSuccessNotification('This temple is under review', '');
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


  getVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([\w-]{11})/);
  return match ? match[1] : '';
}


  onSubmit() {
    const ismemberin = localStorage.getItem("is_member") === "true";
    const commentdata  = this.commentform.value;
 if(ismemberin){
  
 

    
  const comment = {
    body: commentdata.body,
    event: this.route.snapshot.paramMap.get("id"),
    user:localStorage.getItem('user')
};

  

    this.commonservice.addcomment(comment).subscribe(
      response => {
        
        this.geteventdata();
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
    imgElement.src = 'assets/event.png';
  }

  openMap(url: string): void {
    window.open(url, '_blank');
  }

  // sharegetbytemple(temple: any) {
  //   if (!temple || !temple._id) {
  //     console.error('Invalid temple data provided.');
  //     return;
  //   }
  
  //   const shareUrl = `${window.location.origin}/detailviewevent/${temple._id}`; 
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
    : `https://gramadevata.com/detailviewevent/${temple._id}`;

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





onImageClick(image: string): void {
    this.selectedImage = image; // Update the main image
  }




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

handleimageRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
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

Uploadhospitalimage(info:NzUploadChangeParam):void {
  this.adddhospitalimage(info, 'image_location');
 }
 adddhospitalimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.hospitalform.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.hospitalform.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}

addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],

    // temple_id :this.route.snapshot.paramMap.get("id"),
        event_id: this.route.snapshot.paramMap.get("id"),

    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}
Addhospital() {
  if (this.hospitalform.valid) {
      this.templeservice.addnearbyhospital(this.hospitalform.value).subscribe(
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


handlehospitalImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/image.png';
}


@ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
openaddnearbyhospitals(): void {
  this.dialogRef = this.dialog.open(this.nearbyhospitalsDialog, {
    disableClose: false,
    width: '600px'
  });
}


@ViewChild('hotelsDialog') hotelsDialog!: TemplateRef<any>;
opennearbyhotels(): void {
  this.dialogRef = this.dialog.open(this.hotelsDialog, {
    disableClose: false,
    width: '600px'
  });
}

@ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
openrestaurantform(): void {
  this.dialogRef = this.dialog.open(this.restaurantDialog, {
    disableClose: false,
    width: '600px'
  });
}


@ViewChild('touroperatorDialog') touroperatorDialog!: TemplateRef<any>;
openaddtoutoperator(): void {
  this.dialogRef = this.dialog.open(this.touroperatorDialog, {
    disableClose: false,
    width: '600px'
  });
}


@ViewChild('tourguideDialog') tourguideDialog!: TemplateRef<any>;
openaddtoutguide(): void {
  this.dialogRef = this.dialog.open(this.tourguideDialog, {
    disableClose: false,
    width: '600px'
  });
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

getTransportIcon(type: string): string {
  if (type.toLowerCase().includes('train')) return '🚆';
  if (type.toLowerCase().includes('air')) return '✈️';
  if (type.toLowerCase().includes('road') || type.toLowerCase().includes('bus')) return '🚌';
  return '🚗';
}


adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.hotelmForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.hotelmForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}


Uploadhotelimage(info:NzUploadChangeParam):void {
  this.adddhotelimage(info, 'image_location');
 }
addnearbyhotels(): void {
  this.hotelmForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    hotel_rating:[''],
    // temple_id :this.route.snapshot.paramMap.get("id"),
        event_id: this.route.snapshot.paramMap.get("id"),

    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}


getnearbyhotels() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.hotelmForm.patchValue({
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
Addhotels() {
  if (this.hotelmForm.valid) {
      this.templeservice.addnearbyhotels(this.hotelmForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);

              this.hotelmForm.reset();

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
      this.hotelmForm.markAllAsTouched();
  }
}

handlehotelImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/hotel.jpg';
}


addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    email_id:[''],
    contact_number:[''],
    website:[''],
    // temple_id :this.route.snapshot.paramMap.get("id"),
        event_id: this.route.snapshot.paramMap.get("id"),

    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}

Addrestaurant() {
  if (this.restaurantForm.valid) {
      this.templeservice.addrestaurants(this.restaurantForm.value).subscribe(
          response => {
              console.log('restaurants added successfully:', response);

              this.restaurantForm.reset();

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
      this.restaurantForm.markAllAsTouched();
  }
}

getrestruntantLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.restaurantForm.patchValue({
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

adddrestaurantimage(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  // Initialize an empty array to store base64 strings
  const base64Images: string[] = [];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      base64Images.push(base64String);

      // Update the form control once all images are processed
      if (base64Images.length === fileList.length) {
        this.restaurantForm.patchValue({ image_location: base64Images });
        console.log('Updated images form:', this.restaurantForm.value);
      }
    });
  });

  if (formControlName === 'image_location') {
    this.bannerFileList = fileList;
  }

  console.log('File upload:', info.fileList);
}

Uploadrestaurantimage(info:NzUploadChangeParam):void {
  this.adddrestaurantimage(info, 'image_location');
 }


 addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    rating:['0'],
    tour_operator_name:[''],
    mobile_number:[''],
    // temple_id :this.route.snapshot.paramMap.get("id"),
    event_id: this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    email:[''],
    website:[''],
    contact_address:['']

  });
}

Addtouroperator() {
  if (this.touroperatorForm.valid) {
      this.templeservice.addtouroperatordetails(this.touroperatorForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);

              this.touroperatorForm.reset();

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
      this.touroperatorForm.markAllAsTouched();
  }
}


Addtyourtourguide() {
  if (this.tourguideForm.valid) {
      this.templeservice.addttourguide(this.tourguideForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);

              this.tourguideForm.reset();

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
      this.tourguideForm.markAllAsTouched();
  }
}

addtourguideform(): void {
  this.tourguideForm = this.fb.group({
    tourist_spot_covered:[''],
    language:[''],
    // temple_id :this.route.snapshot.paramMap.get("id"),
    event_id: this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    mobile:[''],


  });
}









eventsData:any;
templegoshals:any;

// navigateTo(route: string): void {
//   const ismemberin = localStorage.getItem('is_member') === 'true';
//   if (ismemberin === false) {
//     this.openmemberDialog();
//   } else {

//     // this.router.navigate([route, this.village_id]);
//     this.router.navigate([route]);
//   }

  
// }


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
  openmemberDialog() {
  return this.dialog.open(OnlymemberComponent, {
    data: { displayName: 'member' },
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
     disableClose: true,
  });
}



  navigateEventdata(event: string): void {
    this.router.navigate(['detailviewevent', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }

  navigategoshaladata(event: string): void {
    this.router.navigate(['getbygoshala', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
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
    map_location:[''],
    event_video:[''],
     event_id: this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status: ['INACTIVE']

  });
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

  if (controlName === 'event_video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.detailsForm.patchValue({ [controlName]: '' });

  if (controlName === 'event_video') {
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
      this.templeservice.eventaddmoredetails(this.detailsForm.value).subscribe(
          response => {
              console.log('village added successfully:', response);
                            this.notificationHelper.showSuccessNotification('Village Details Added Successfully', '');
                             window.location.reload();


        if (this.dialogRef) {
          this.dialogRef.close();
        }
            this.spinner.hide();  
          },
          error => {
              console.error('Error adding village:', error);
 this.notificationHelper.showErrorNotification('Failed to Add Village', '');
              this.spinner.hide();
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
  }
}





}
