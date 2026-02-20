import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { CommonService } from '../../services/commonservice/common.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { UserService } from '../../services/userservice/user.service';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddmemberComponent } from '../member/addmember/addmember.component';
import { MemberService } from '../../services/memberservice/member.service';
import { PujariComponent } from '../pujari/pujari.component';
import { SharedService } from '../../services/sharedservice/shared.service';
import { Subscription } from 'rxjs';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { DomSanitizer, Meta,SafeResourceUrl  } from '@angular/platform-browser';
import { ShareTempleComponent } from '../share-option/share-temple/share-temple.component';
import { Title } from '@angular/platform-browser';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MatIconModule } from '@angular/material/icon';
import { GetmemberComponent } from '../member/getmember/getmember.component';






@Component({
  selector: 'app-getbytemples',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    AddSpaceComponent,
    AddSpace1Component,
    NzUploadModule,
    MatIconModule
  ],
  templateUrl: './getbytemples.component.html',
  styleUrl: './getbytemples.component.css'
})
export class GetbytemplesComponent {
  dialogRef!: MatDialogRef<any>;
  private subscription: Subscription = new Subscription();
  commentform!:FormGroup;
  detailsForm!:FormGroup;
  tourismForm!:FormGroup;
  hotelmForm!:FormGroup;
  templefavorite!:FormGroup;
  hospitalform!:FormGroup;
  touroperatorForm!:FormGroup;
  tourguideForm!:FormGroup;
  restaurantForm!:FormGroup;
  templeId:any;
  templedata:any;
  commentdata1:any;
  commentText: string = '';
  blockId: any;
  nearbytemples: any;
  ConnectForm!:FormGroup;
  ConnectionData: any;
  isConnected= false;
  isMemberIn = false
  isPujariIn = false
  connectedId: any;
  selectedImage: any;
  temple: any;
  shareUrl: any;
  templeName: any;
  templeDescription1: any;
  imageUrl: any;
  imageUrl1: any;
  shareUrl1: any;
  templeDescription: any;
  templeImage: any;
  eventsData: any;
  mediaDetails: any[] = [];
  nearby_hotelsdetails: any[] = [];
  tourismplacedetails: any[] = [];
  touroperatordetails: any[] = [];
  transportdetails : any[] = [];
  Templefestivals : any[] = [];
  templegoshals: any[] = [];
  tourguides: any[] = [];
  templefacilities: any[] = [];
  prayersandbenfits: any[] = [];
  socialactivity: any[] = [];
  nearesthospitals: any[] = [];
  showSocialActivities = false;
  showFacilities = false;
  showFestivals = false;
  showPrayers = false;
showTransportFacility = false;
  sanitizedVideoMap = new Map<string, SafeResourceUrl[]>();


  constructor(private route:ActivatedRoute,
     private router:Router ,
     private templeservice:TempleserviceService ,
     private fb:FormBuilder,
     private commonservice:CommonService,
     private authenticationService: AuthenticationService,
     protected userservice:UserService,
     private dialog: MatDialog,
     private memberservice:MemberService,
     private sharedService: SharedService,
     private meta:Meta,
    //  private sharetemple :ShareTempleComponent,
    private title:Title,
    private sanitizer: DomSanitizer

   
     
    ){ 
      this.initForm();
      this.Addmoredetails();
      this.tourismplaces();
      this.addnearbyhotels();
      this.addtouroperatorsform();
      this.addtourguideform();
      this.connectionsvoluantryForm();
      this.addnearbyhospitalss();
      this.addrestaurantsform();

    }

  ngOnInit(): void {
    this.subscription.add(
      this.sharedService.triggerFetchByTempleData$.subscribe(() => {
        this.templeId = this.route.snapshot.paramMap.get('id');
        this.fecthtempledata();
        this.isPujariUser();
        this.loadFavoriteTemples();
        // this.loadFavorites();
      })
    );

    this.title.setTitle('temple page');

    // Set meta tags
    this.meta.updateTag({ name: 'description', content: 'Page description for SEO' });
    this.meta.updateTag({ property: 'og:title', content: 'temple sharing' });
    this.meta.updateTag({ property: 'og:description', content: 'Page description for social media' });
    this.meta.updateTag({ property: 'og:image', content: 'https://gramadevata.com/assets/icon.jpg' });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.fecthtempledata();

    this.route.paramMap.subscribe(params => {
      this.templeId = params.get("id");
      console.log("templeId1",this.templeId)
      if (this.templeId) {
        this.fecthtempledata();
      }
    });
    console.log("templeId",this.templeId)
  //  this.fecthtempledata();
   this.connectionsForm();
   this.isMemberUser();
   this.isPujariUser();


    this.commentform = this.fb.group({
      body:['',Validators.required],
      temple:this.route.snapshot.paramMap.get("id"),
      // temple:null,
      user:localStorage.getItem('user')

    })
    // this.templeId = this.route.snapshot.paramMap.get('_id') || '';

    // if (this.templeId) {
    //   this.fetchTempleMedia(this.templeId);
    // }
    const userId = localStorage.getItem('user_id');
    this.templeservice.getUserFavorites(userId).subscribe((favorites) => {
      this.favoriteTemples = favorites;
    });
    
  }


  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
    console.log(isMemberIn,"isMemberIn")
  if (isMemberIn) {
    this.isMemberIn = true
  } else {
    this.isMemberIn = false
  } 
}

isPujariUser() {
  const isPujariIn = localStorage.getItem("type") === "PUJARI";
  console.log(isPujariIn,"isPujariIn")
if (isPujariIn) {
  this.isPujariIn = true
} else {
  this.isPujariIn = false
} 
}




  connectionsForm(): void {
    this.ConnectForm = this.fb.group(
      {
      // connected_as:"PUJARI",
      temple: this.route.snapshot.paramMap.get("_id"),
      user : localStorage.getItem('user')
      }
    );
  }

  loadtempledata() {
    
    this.templedata = []; 
    this.fecthtempledata();
    this.nearbytemples=[];
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }


  onImageClick(image: string): void {
    this.selectedImage = image; // Update the main image
  }



  templeDetails = {
    title: 'SRI NALLAMMA SWAMY TEMPLE',
    description: 'The Sri Nallamma Swamy Temple, located in Chalavemula, Putlur, Ananthapuramu district...',
    link: 'https://gramadevata.com/getbytemples/0002d4fa-f923-44fd-8a1c-f1b2fbd66ff1',
    image: "https://sathayushstorage.blob.core.windows.net/sathayush/temple/00139a84-fda2-44c8-92d5-958ea566649c/Subramanya Temple.jpg"
  };



  // shareTemple(temple: any) {
  //   const message = `${this.templeDetails.title}\n\n${this.templeDetails.description}`;
  //   const imageLink = this.templeDetails.image; // Image URL from Azure Blob Storage
  //   const link = this.templeDetails.link;
  //   const encodedMessage = encodeURIComponent(`${message}\n\nImage: ${imageLink}\n\n${link}`);
  //   const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  //   window.open(whatsappUrl, '_blank');
  //   this.updateMetaTags(temple);
  // }

//   shareTemple(temple: any) {
//   const message = `${this.templeDetails.title}\n\n${this.templeDetails.description}`;
//   const link = this.templeDetails.link;
//   const encodedMessage = encodeURIComponent(`${message}\n\nDownload Image: ${this.templeDetails.image}\n\n${link}`);
//   const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
//   window.open(whatsappUrl, '_blank');
//   this.updateMetaTags(temple);
// }
  


shareTemple(temple: any) {
  const shareUrl = temple && temple._id 
    ? `${window.location.origin}/getbytemples/${temple._id}`
    : `${window.location.origin}/getbytemples/`; 

  console.log('Share URL:', shareUrl);
  this.updateMetaTags(temple)

  if (navigator.share) {
    navigator.share({
      title: temple ? temple.name : 'Temple',
      text: temple && temple.desc ? temple.desc : 'Check out this temple!',
      url: shareUrl
    }).then(() => {
      console.log('Sharing successful');
    }).catch((error) => {
      console.error('Error sharing:', error);
    });
  } else {
    alert(`Share URL: ${shareUrl}`);
  }
}


navigateTo(route: string): void {
  const ismemberin = localStorage.getItem('is_member') === 'true';
  if (ismemberin === false) {
    this.openmemberDialog();
  } else {

    // this.router.navigate([route, this.village_id]);
    this.router.navigate([route]);
  }

}

    

  
  
  
updateMetaTags(temple: any): void {
  this.templeName = temple.name || 'Temple';
  this.templeDescription = temple.desc || 'Check out this amazing temple!';
  this.shareUrl = `${window.location.origin}/getbytemples/${temple._id}`;
  this.templeImage = 'https://gramadevata.com/assets/icon.jpg'

  // Debug logs
  console.log('Meta Tags Updated - Name:', this.templeName);
  console.log('Meta Tags Updated - Description:', this.templeDescription);
  console.log('Meta Tags Updated - URL:', this.shareUrl);
  console.log('Meta Tags Updated - Image:', this.templeImage);

  // Update Open Graph meta tags
  this.meta.updateTag({ property: 'og:title', content: this.templeName });
  this.meta.updateTag({ property: 'og:description', content: this.templeDescription });
  this.meta.updateTag({ property: 'og:url', content: this.shareUrl });
  this.meta.updateTag({ property: 'og:image', content: this.templeImage });

  // Update Twitter meta tags
  this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  this.meta.updateTag({ name: 'twitter:title', content: this.templeName });
  this.meta.updateTag({ name: 'twitter:description', content: this.templeDescription });
  this.meta.updateTag({ name: 'twitter:image', content: this.templeImage });
}






  
CommentData:any;
resturant:any;

  fecthtempledata(): void {
    this.isConnected = false;
    let userId = this.authenticationService.getCurrentUser();
    
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal();
      return;
    }
  
    if (!this.templeId) {
      console.error("Temple ID is not defined.");
      return;
    }
  
    this.templeservice.getbytemple(this.templeId).subscribe(
      (data: any) => {
        console.log("API Response Data:", data); // Log the data received from the API
  
        if (!data || data.length === 0) {
          console.error("templedata is not defined or empty");
          return;
        }
        this.templedata = data.map((temple: any) => ({
          ...temple,
          favorite: false
        }));

        this.templedata = data;
        this.blockId = this.templedata[0]?.object_id?.block?.block_id;
        this.ConnectionData = this.templedata[0]?.Connections;
        this.eventsData = this.templedata[0]?.events;
        this.CommentData=this.templedata[0]?.comments;
        this.mediaDetails=this.templedata[0]?.media;
        this.transportdetails=this.templedata[0]?.transport;
        this.touroperatordetails=this.templedata[0]?.touroperator;
        this.tourismplacedetails=this.templedata[0]?.tourismplace;
        this.nearby_hotelsdetails=this.templedata[0]?.nearby_hotels;

        this.Templefestivals=this.templedata[0]?.festivals;
        this.templegoshals=this.templedata[0]?.goshalas;
        this.tourguides=this.templedata[0]?.tour_guide;

        // this.tourguides=this.templedata[0]?.near_by_hospitals;
        this.socialactivity=this.templedata[0]?.social_activity;
        this.prayersandbenfits=this.templedata[0]?.prayers_and_benefits;
        this.templefacilities=this.templedata[0]?.temple_facilities;
        this.nearesthospitals=this.templedata[0]?.near_by_hospitals;
        this.resturant=this.templedata[0]?.resturents


        

       
 

  
        console.log("Connection Data:", this.ConnectionData);
        console.log("Block ID:", this.blockId);
  
        // Check for blockId before making filtertemples call
        if (!this.blockId) {
          console.error("Block ID is not defined.");
          return;
        }

        console.log(this.templedata[0].image_location[0],'this.templedata.image_location')

        if (this.templedata[0].image_location[0] && this.templedata[0].image_location[0].length > 0) {
          this.selectedImage = this.templedata[0].image_location[0]; // Default to the first image
        } else {
          this.selectedImage = 'assets/ohm.jpg'; 
        }
  
        this.templeservice.filtertemples('', this.blockId).subscribe(
          (filterData: any) => {
            const filteredResults = filterData.results.filter(
              (temple: any) => temple._id !== this.templeId
            );
            this.nearbytemples = filteredResults;
            console.log("Nearby Temples:", this.nearbytemples);
          },
          (filterError: any) => {
            console.error("Error fetching nearby temples", filterError);
          }
        );
  
        if (Array.isArray(this.ConnectionData)) {
          const connection = this.ConnectionData.find(
            (conn: any) => conn.user && conn.user._id === userId
          );
          if (connection) {
            this.isConnected = true;
            console.log("User is connected.",connection._id);
            this.connectedId = connection._id
          }
        } else {
          console.error("Connections is not defined or is not an array");
        }
      },
      (apiError: any) => {
        console.error("Error fetching temple data", apiError);
      }
    );
  }

  
  isExpanded = false;
  
  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }




  onSubmit() {
    const ismemberin = localStorage.getItem("is_member") === "true";
    const commentdata  = this.commentform.value;
 if(ismemberin){
  
 

    
  const comment = {
    body: commentdata.body,
    temple: this.route.snapshot.paramMap.get("id"),
    user:localStorage.getItem('user')
};

  

    this.commonservice.addcomment(comment).subscribe(
      response => {
        
        this.fecthtempledata();
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


  openmemberDialog(): void {
    console.log('sssssssssss');
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Handle after dialog close actions here
    });
  }


  OpenAddmemberDilog(templeid:any): void {
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    this.templeId = this.route.snapshot.paramMap.get("_id")
    console.log(this.templeId,"55454")
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'addmember', templeId: templeid },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }

  OpenPujariDilog(templeid:any): void {
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    this.templeId = templeid
    console.log(this.templeId,"55454")
    const dialogRef = this.dialog.open(PujariComponent, {
      data: { displayName: 'addpujari', templeId: this.templeId },
      autoFocus: false,
      backdropClass: 'dialog-backdrop'
    });
  }


  // OpenAddvoluanterDilog(templeid:any): void {
  //   let userId = this.authenticationService.getCurrentUser();
  //     if (userId == undefined || userId == null) {
  //       this.authenticationService.showLoginModal()
  //       return;
  //     }
  //     this.templeId = this.route.snapshot.paramMap.get("_id")
  //   // temple: this.route.snapshot.paramMap.get("_id")
  //   // console.log(this.templeId,"55454")
  //   const dialogRef = this.dialog.open(OnlymemberComponent, {
  //     data: { displayName: 'addmember', templeId: templeid ,type: 'VOLUNTARY',
  //            },
  //     autoFocus: false,
  //     backdropClass: 'dialog-backdrop'
  //   });
  // }



  OpenAddvoluanterDilog(templeid:any): void {
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    this.templeId = this.route.snapshot.paramMap.get("_id")
    console.log(this.templeId,"55454")
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'addmember', templeId: templeid,type: 'VOLUNTARY' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }

  // OpenAddvoluanterDilog(templeid:any): void {
  //   let userId = this.authenticationService.getCurrentUser();
  //   if (userId == undefined || userId == null) {
  //     this.authenticationService.showLoginModal();
  //     return;
  //   }
  
  //   this.templeId = templeid
  //   console.log(this.villageid, "55454");
  
  //   const dialogRef = this.dialog.open(AddmemberComponent, {
  //     data: { 
  //       displayName: 'addmember', 
  //       templeId: this.templeId ,        type: 'VOLUNTARY',
  //       heading: 'Sanatana Volunteer Registration' // Pass the heading dynamically
  //     },
  //     autoFocus: false,
  //     backdropClass: 'dialog-backdrop'
  //   });
  // }

  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
  }


  isMemberconnect(templeid:any): void {
    const connectdata = this.ConnectForm.value;
    const contactedmember = {
      temple: templeid,
      user: localStorage.getItem('user'),
      connected_as: 'MEMBER'
    };
  
    this.memberservice.connect(contactedmember).subscribe(
      response => {
        console.log(response);
        this.ConnectForm.reset()
        this.fecthtempledata()
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }
  

  isPujariconnect(templeid:any):void{
    const connectdata = this.ConnectForm.value;
    const contactedPujari = {
      temple : templeid,
      user : localStorage.getItem('user'),
      connected_as:'PUJARI'

    }
    this.memberservice.connect(contactedPujari).subscribe(
      response => {
        console.log(response);
        this.ConnectForm.reset()
        this.fecthtempledata()
      })
  }



  // isvoluantryconnect(templeid:any):void{
  //   console.log("Connect button clicked");
  
  //   const connectdata = this.ConnectvoluantryForm.value;
  //   const ConnectvoluantryForm = {
  //     temple : templeid,
  //     // temple: this.route.snapshot.paramMap.get("_id"),
  //     user : localStorage.getItem('user'),
  //     connected_as:'VOLUNTARY'
  
  //   }
  //   this.memberservice.connect(ConnectvoluantryForm).subscribe(
  //     response => {
  //       console.log(response);
  //       this.ConnectForm.reset()
  //       this.fecthtempledata()
  //     })
  // }




  isvoluantryconnect(templeid:any): void {
    const connectdata = this.ConnectForm.value;
    const contactedmember = {
      temple: templeid,
      user: localStorage.getItem('user'),
      connected_as: 'VOLUNTARY'
    };
  
    this.memberservice.connect(contactedmember).subscribe(
      response => {
        console.log(response);
        this.ConnectForm.reset()
        this.fecthtempledata()
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  disconnect(){
    this.memberservice.DisconnectMember(this.connectedId).subscribe(
      data =>{
        console.log('deleted succesfully')
        this.fecthtempledata()
      }
    )
  }


 
  

  navigatetemple(templeId:any):void{
    
    this.router.navigate(['getbytemples', templeId]);
  }

  NavigateToChatRoom(templeId:any):void{
    let userId = this.authenticationService.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal()
        return;
      }
    
    this.router.navigate(['templechat',templeId])
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
  
  mediaForm!: FormGroup;
  // videoFileList: File[] = [];

  initForm(): void {
    this.mediaForm = this.fb.group({
      title: [''],
      desc: [''],
      // user_id: ['5771a16c-0a14-11f0-9877-2f7f697fefd9', Validators.required], 
      user_id: localStorage.getItem('user'),

      village_id: this.villageid,
      temple_id :this.route.snapshot.paramMap.get("id"),
      user : localStorage.getItem('user'),
      video: [null, Validators.required]
    });
  }
  templeid:any;
  villageid:any;

  bannerFileList: NzUploadFile[] = [];
  videoFileList: NzUploadFile[] = [];   // For video upload

  handleVideoFileChange(info: NzUploadChangeParam): void {
    this.handleUpload(info, 'video');
  }


  handleBannerFileRemove(): void {
    if (this.bannerFileList.length === 0) {
      this.bannerFileList = [];
    }
  }
  
  handleBannerFileChange(info:NzUploadChangeParam):void {
    this.handleUpload(info, 'bannerImage');
   }
  
  // handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  //   const fileList = [...info.fileList];
  
  //   fileList.forEach((file: NzUploadFile) => {
  //     if (formControlName === 'image') {
  //       // If uploading an image, convert to base64
  //       this.getBase64(file.originFileObj!, (base64String: string) => {
  //         file['base64'] = base64String;
  //         this.mediaForm.patchValue({ image: base64String });
  //       });
  //     } else if (formControlName === 'video') {
  //       // Convert the video to base64
  //       this.getBase64(file.originFileObj!, (base64String: string) => {
  //         file['base64'] = base64String;
  //         this.mediaForm.patchValue({ video: base64String });  // Save base64 string for the video
  //       });
  //     }
  //   });
  
  //   // Update file list for the respective form control
  //   this.mediaForm.get(formControlName)?.setValue(fileList);
  
  //   // Set fileList variables based on the type of upload
  //   if (formControlName === 'image') {
  //     this.bannerFileList = fileList;
  //   } else if (formControlName === 'video') {
  //     this.videoFileList = fileList;
  //   }
  //   console.log(`${formControlName} submit`, this.mediaForm.value);
  // }



  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];
  
    fileList.forEach((file: NzUploadFile) => {
 if (formControlName === 'video') {
        file.thumbUrl = 'assets/video-placeholder.png';  
        this.getBase64(file.originFileObj!, (base64String: string) => {
          file['base64'] = base64String;
          this.mediaForm.patchValue({ video: base64String });
        });
      }
    });
  

    this.mediaForm.get(formControlName)?.setValue(fileList);
  
 if (formControlName === 'video') {
      this.videoFileList = fileList;
    }
    console.log(`${formControlName} submit`, this.mediaForm.value);
  }
  
  
  
  
  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1]; 
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }
  
  handleVideoFileRemove(): void {
    this.videoFileList = [];
    this.mediaForm.patchValue({ video: null }); 
  }
  
  resetForm() {
    this.mediaForm.reset();

    this.videoFileList =[];

    this.mediaForm.patchValue({

  video:''
    });
  }



  submitMedia(): void {
    if (this.mediaForm.valid) {
      this.templeservice.addTempleMedia(this.mediaForm.value).subscribe({
        next: (res) => {
          console.log('Media uploaded successfully:', res);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error uploading media:', err);
        }
      });
    } else {
      console.warn('Form is invalid.');
      this.mediaForm.markAllAsTouched();
    }
  }

@ViewChild('memberListDialog') memberListDialog!: TemplateRef<any>;
openAddMoreDetailsDialog(): void {
  this.dialogRef = this.dialog.open(this.memberListDialog, {
    disableClose: false,
    width: '600px'
  });
}







Addmoredetails(): void {
  this.detailsForm = this.fb.group({
    temple_website: ['', [Validators.pattern('https?://.+')]],
    temple_timings: [''],
    image_location:[''],
    desc:[''],
    map_location:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    other_diety:[''],
    construction_year:['']
  });
}






Addmore() {
  if (this.detailsForm.valid) {
      this.templeservice.templeaddmoredetails(this.detailsForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);
        if (this.dialogRef) {
          this.dialogRef.close();
        }
              
          },
          error => {
              console.error('Error adding temple:', error);
          }
      );
  } else {
      this.detailsForm.markAllAsTouched();
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






handleimageRemove(): void {
  if (this.bannerFileList.length === 0) {
    this.bannerFileList = [];
  }
}

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


Uploadhotelimage(info:NzUploadChangeParam):void {
  this.adddhotelimage(info, 'image_location');
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




toggleTransportFacility() {
  this.showTransportFacility = !this.showTransportFacility;
}

togglePrayers() {
  this.showPrayers = !this.showPrayers;
}


toggleFestivals() {
  this.showFestivals = !this.showFestivals;
}

toggleSocialActivities() {
  this.showSocialActivities = !this.showSocialActivities;
}

toggleFacilities() {
  this.showFacilities = !this.showFacilities;
}




getTransportIcon(type: string): string {
  if (type.toLowerCase().includes('train')) return '🚆';
  if (type.toLowerCase().includes('air')) return '✈️';
  if (type.toLowerCase().includes('road') || type.toLowerCase().includes('bus')) return '🚌';
  return '🚗';
}






@ViewChild('tourplacesDialog') tourplacesDialog!: TemplateRef<any>;
opentourismplaces(): void {
  this.dialogRef = this.dialog.open(this.tourplacesDialog, {
    disableClose: false,
    width: '600px'
  });
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


addnearbyhotels(): void {
  this.hotelmForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    hotel_rating:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}




tourismplaces(): void {
  this.tourismForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],


  });
}


addtouroperatorsform(): void {
  this.touroperatorForm = this.fb.group({
    rating:['0'],
    tour_operator_name:[''],
    mobile_number:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    email:[''],
    website:[''],
    contact_address:['']

  });
}



addtourguideform(): void {
  this.tourguideForm = this.fb.group({
    tourist_spot_covered:[''],
    language:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    mobile:[''],


  });
}




addnearbyhospitalss(): void {
  this.hospitalform = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],

    temple_id :this.route.snapshot.paramMap.get("id"),
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


Addtourismplaces() {
  if (this.tourismForm.valid) {
      this.templeservice.addTempletourismplaces(this.tourismForm.value).subscribe(
          response => {
              console.log('Temple added successfully:', response);

              this.tourismForm.reset();

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
      this.detailsForm.markAllAsTouched();
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
      this.detailsForm.markAllAsTouched();
  }
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
      this.detailsForm.markAllAsTouched();
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
      this.detailsForm.markAllAsTouched();
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



handlehotelImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/hotel.jpg';
}





ConnectvoluantryForm!: FormGroup;

isvolunary =false

connectionsvoluantryForm(): void {
  this.ConnectvoluantryForm = this.fb.group(
    {
    connected_as:"VOLUNTARY",
    temple: this.route.snapshot.paramMap.get("id"),
    user : localStorage.getItem('user')
    }
  );
}



  OpenMemberDialog(member: any): void {
    console.log(member,"member")

    const dialogRef = this.dialog.open(GetmemberComponent, {

        data: { displayName: 'getmember', member },
        autoFocus: false,
        backdropClass: 'dialog-backdrop'
    });

    dialogRef.afterClosed().subscribe(() => {
        // Optional: Add logic to handle actions after dialog is closed
    });
}






favoriteTemples: any[] = [];


isFavorited(): boolean {
  const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
  return this.favoriteTemples.some(fav => String(fav.temple_id) === templeIdFromRoute);
}


loadFavoriteTemples() {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    this.templeservice.getUserFavorites(userId).subscribe(
      (favorites) => {
        this.favoriteTemples = favorites;
      },
      (error) => {
        console.error('Error loading favorites:', error);
      }
    );
  }
}


toggleFavorite(temple: any) {
  const isFav = this.isFavorited();
  const favId = this.getFavoriteId();

  if (isFav && favId) {
    this.removeFromFavorites(favId);
  } else {
    this.addToFavorites(temple);
  }
}

addToFavorites(temple: any) {
  const userId = localStorage.getItem('user_id');
  const data = {
    user_id: userId,
    temple_id: this.route.snapshot.paramMap.get('id')
  };

  this.templeservice.addtemplefavorite(data).subscribe((newFav) => {
    this.favoriteTemples.push(newFav);
  });
}

removeFromFavorites(favId: any) {
  const favEntry = this.favoriteTemples.find(fav => fav.id === favId);

  if (favEntry) {
    this.templeservice.removeTempleFavorite(favEntry._id).subscribe(
      () => {
        this.favoriteTemples = this.favoriteTemples.filter(fav => fav.id !== favId);
      },
      error => {
        console.error('Error removing favorite:', error);
      }
    );
  }
}

getFavoriteId(): any {
  const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
  const fav = this.favoriteTemples.find(f => String(f.temple_id) === templeIdFromRoute);
  return fav ? fav.id : null;
}



handlehospitalImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/image.png';
}

getVillageName(address: string): string {
  return address.split(',')[0].trim();
}

getRemainingAddress(address: string): string {
  const parts = address.split(',');
  return parts.length > 1 ? ', ' + parts.slice(1).join(',').trim() : '';
}

navigateToVillage(villageId: string): void {
  this.router.navigate(['/villages', villageId]);
}



// favoriteTemples: any[] = [];

// isFavorited(): boolean {
//   const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
//   return this.favoriteTemples.some(fav => String(fav.temple_id) === templeIdFromRoute);
// }

// toggleFavorite(temple: any) {
//   const isFav = this.isFavorited();
//   const favId = this.getFavoriteId();

//   if (isFav && favId) {
//     this.removeFromFavorites(favId);
//   } else {
//     this.addToFavorites(temple);
//   }
// }

// addToFavorites(temple: any) {
//   const userId = localStorage.getItem('user_id');
//   const data = {
//     user_id: userId,
//     temple_id: this.route.snapshot.paramMap.get('id')
//   };

//   this.templeservice.addtemplefavorite(data).subscribe((newFav) => {
//     this.favoriteTemples.push(newFav);
//   });
// }

// removeFromFavorites(favId: any) {
//   const favEntry = this.favoriteTemples.find(fav => fav.id === favId);

//   if (favEntry) {
//     this.templeservice.removeTempleFavorite(favEntry._id).subscribe(
//       () => {
//         this.favoriteTemples = this.favoriteTemples.filter(fav => fav.id !== favId);
//       },
//       error => {
//         console.error('Error removing favorite:', error);
//       }
//     );
//   }
// }

// getFavoriteId(): any {
//   const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
//   const fav = this.favoriteTemples.find(f => String(f.temple_id) === templeIdFromRoute);
//   return fav ? fav.id : null;
// }


@ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
openrestaurantform(): void {
  this.dialogRef = this.dialog.open(this.restaurantDialog, {
    disableClose: false,
    width: '600px'
  });
}



addrestaurantsform(): void {
  this.restaurantForm = this.fb.group({
    map_location: ['', [Validators.required, Validators.pattern('https?://.+')]],
    address:[''],
    name:[''],
    email_id:[''],
    contact_number:[''],
    website:[''],
    temple_id :this.route.snapshot.paramMap.get("id"),
    user_id : localStorage.getItem('user'),
    status:['INACTIVE'],
    image_location:[''],

  });
}

Uploadrestaurantimage(info:NzUploadChangeParam):void {
  this.adddrestaurantimage(info, 'image_location');
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
      this.detailsForm.markAllAsTouched();
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

}