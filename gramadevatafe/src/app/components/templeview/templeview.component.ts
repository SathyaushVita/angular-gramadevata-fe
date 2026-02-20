import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
import { DomSanitizer, Meta, SafeResourceUrl } from '@angular/platform-browser';
import { ShareTempleComponent } from '../share-option/share-temple/share-temple.component';
import { Title } from '@angular/platform-browser';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MatIconModule } from '@angular/material/icon';
import { GetmemberComponent } from '../member/getmember/getmember.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { NotificationHelper } from '../commons/notification';





@Component({
  selector: 'app-templeview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    AddSpaceComponent,
    AddSpace1Component,
    NzUploadModule,
    MatIconModule,
    NgxSpinnerModule,
    RouterModule
  ],
  templateUrl: './templeview.component.html',
  styleUrl: './templeview.component.css'
})
export class TempleviewComponent {
  dialogRef!: MatDialogRef<any>;
  private subscription: Subscription = new Subscription();
  commentform!: FormGroup;
  detailsForm!: FormGroup;
  tourismForm!: FormGroup;
  hotelmForm!: FormGroup;
  templefavorite!: FormGroup;
  hospitalform!: FormGroup;
  touroperatorForm!: FormGroup;
  tourguideForm!: FormGroup;
  restaurantForm!: FormGroup;
  poojastoreForm!: FormGroup;
  templeId: any;
  templedata: any;
  commentdata1: any;
  commentText: string = '';
  blockId: any;
  nearbytemples: any;
  ConnectForm!: FormGroup;
  ConnectionData: any;
  isConnected = false;
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
  transportdetails: any[] = [];
  Templefestivals: any[] = [];
  templegoshals: any[] = [];
  tourguides: any[] = [];
  templefacilities: any[] = [];
  prayersandbenfits: any[] = [];
  socialactivity: any[] = [];
  nearesthospitals: any[] = [];
  poojastores: any[] = [];
  showSocialActivities = false;
  showFacilities = false;
  showFestivals = false;
  showPrayers = false;
  showTransportFacility = false;
  sanitizedVideoMap = new Map<string, SafeResourceUrl[]>();


  constructor(private route: ActivatedRoute,
    private router: Router,
    private templeservice: TempleserviceService,
    private fb: FormBuilder,
    private commonservice: CommonService,
    private authenticationService: AuthenticationService,
    protected userservice: UserService,
    private dialog: MatDialog,
    private memberservice: MemberService,
    private sharedService: SharedService,
    private meta: Meta,
    //  private sharetemple :ShareTempleComponent,
    private title: Title,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService, private notificationHelper: NotificationHelper,



  ) {
    this.initForm();
    this.Addmoredetails();
    this.tourismplaces();
    this.addnearbyhotels();
    this.addtouroperatorsform();
    this.addtourguideform();
    this.connectionsvoluantryForm();
    this.addnearbyhospitalss();
    this.addrestaurantsform();
    this.addpoojastoreform();

  }

  // ngOnInit(): void {
  //   this.subscription.add(
  //     this.sharedService.triggerFetchByTempleData$.subscribe(() => {
  //       this.templeId = this.route.snapshot.paramMap.get('id');
  //       this.fecthtempledata();
  //       this.isPujariUser();
  //       this.loadFavoriteTemples();
  //       // this.loadFavorites();
  //     })
  //   );

  //   this.title.setTitle('temple page');

  //   // Set meta tags
  //   this.meta.updateTag({ name: 'description', content: 'Page description for SEO' });
  //   this.meta.updateTag({ property: 'og:title', content: 'temple sharing' });
  //   this.meta.updateTag({ property: 'og:description', content: 'Page description for social media' });
  //   this.meta.updateTag({ property: 'og:image', content: 'https://gramadevata.com/assets/icon.jpg' });
  //   this.meta.updateTag({ property: 'og:url', content: window.location.href });
  //   this.fecthtempledata();

  //   this.route.paramMap.subscribe(params => {
  //     this.templeId = params.get("id");
  //     console.log("templeId1", this.templeId)
  //     if (this.templeId) {
  //       this.fecthtempledata();
  //     }
  //   });
  //   console.log("templeId", this.templeId)
  //   //  this.fecthtempledata();
  //   this.connectionsForm();
  //   this.isMemberUser();
  //   this.isPujariUser();


  //   this.commentform = this.fb.group({
  //     body: ['', Validators.required],
  //     temple: this.route.snapshot.paramMap.get("id"),
  //     // temple:null,
  //     user: localStorage.getItem('user')

  //   })
  //   // this.templeId = this.route.snapshot.paramMap.get('_id') || '';

  //   // if (this.templeId) {
  //   //   this.fetchTempleMedia(this.templeId);
  //   // }
  //   const userId = localStorage.getItem('user_id');
  //   this.templeservice.getUserFavorites(userId).subscribe((favorites) => {
  //     this.favoriteTemples = favorites;
  //   });

  // }
  currentUserId: string | null = null;   // ✅ ADD THIS LINE

  ngOnInit(): void {

  this.currentUserId = localStorage.getItem('user');

  this.title.setTitle('temple page');

  this.meta.updateTag({ name: 'description', content: 'Page description for SEO' });
  this.meta.updateTag({ property: 'og:title', content: 'temple sharing' });
  this.meta.updateTag({ property: 'og:description', content: 'Page description for social media' });
  this.meta.updateTag({ property: 'og:image', content: 'https://gramadevata.com/assets/icon.jpg' });

  // ✅ Route param subscription (ONLY PLACE templeId is set)
  this.route.paramMap.subscribe(params => {
    this.templeId = params.get("id");

    if (this.templeId) {
      this.fecthtempledata();
      this.isMemberUser();
      this.isPujariUser();
      this.loadFavoriteTemples();
    }
  });

  // ✅ Shared trigger
  this.subscription.add(
    this.sharedService.triggerFetchByTempleData$.subscribe(() => {
      if (this.templeId) {
        this.fecthtempledata();
      }
    })
  );

  this.connectionsForm();

  this.commentform = this.fb.group({
    body: ['', Validators.required],
    temple: this.templeId,
    user: this.currentUserId
  });

}



  @ViewChild('leftContent', { static: false }) leftContentRef!: ElementRef;
  leftContentHeight = 0;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.leftContentRef) {
        this.leftContentHeight = this.leftContentRef.nativeElement.offsetHeight;
      }
    }, 0);
  }




  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
    console.log(isMemberIn, "isMemberIn")
    if (isMemberIn) {
      this.isMemberIn = true
    } else {
      this.isMemberIn = false
    }
  }

  isPujariUser() {
    const isPujariIn = localStorage.getItem("type") === "PUJARI";
    console.log(isPujariIn, "isPujariIn")
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
        user: localStorage.getItem('user')
      }
    );
  }

  loadtempledata() {

    this.templedata = [];
    this.fecthtempledata();
    this.nearbytemples = [];
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }


  onImageClick(image: string): void {
    this.selectedImage = image; // Update the main image
  }



  // templeDetails = {
  //   title: 'SRI NALLAMMA SWAMY TEMPLE',
  //   description: 'The Sri Nallamma Swamy Temple, located in Chalavemula, Putlur, Ananthapuramu district...',
  //   link: 'https://gramadevata.com/getbytemples/0002d4fa-f923-44fd-8a1c-f1b2fbd66ff1',
  //   image: "https://sathayushstorage.blob.core.windows.net/sathayush/temple/00139a84-fda2-44c8-92d5-958ea566649c/Subramanya Temple.jpg"
  // };





  async shareTemple() {
    if (!this.templedata?.length) {
      console.error("No temple data available to share.");
      return;
    }

    const temple = this.templedata[0];

    const maxLength = 250;
    let shortDesc = temple.desc || "";
    if (shortDesc.length > maxLength) {
      shortDesc = shortDesc.substring(0, maxLength).trim() + "...";
    }

    // ✅ If share_url not provided, construct one
    const templeLink = temple.share_url
      ? temple.share_url
      : `https://gramadevata.com/templedetailsview/${temple._id}`;

    const shareText =
      `${temple.name}\n\n` +
      `${shortDesc}\n\n` +
      `URL: ${templeLink}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: temple.name,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Temple details copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      alert("Unable to share. Please try again.");
    }
  }





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







  CommentData: any;
  resturant: any;


  fecthtempledata(): void {
    this.spinner.show();
    // Use user_id for reliable comparison
    let userId = localStorage.getItem('user_id') || this.authenticationService.getCurrentUser();

    if (!this.templeId) {
      console.error("Temple ID is not defined.");
      this.spinner.hide();
      return;
    }

    this.templeservice.getbytemple(this.templeId).subscribe(
      (data: any) => {
        console.log("API Response Data:", data);

        if (!data || data.length === 0) {
          console.error("templedata is not defined or empty");
          this.spinner.hide();
          return;
        }

        // Map data to include connection status per temple
        this.templedata = data.map((temple: any) => {
          let isConnected = false;
          let connectedId = null;

          if (Array.isArray(temple.Connections)) {
            const connection = temple.Connections.find(
              (conn: any) => {
                if (!conn.user) return false;
                // Robust check
                const cId = conn.user._id || conn.user;
                return cId === userId;
              }
            );

            if (connection) {
              isConnected = true;
              connectedId = connection._id;
            }
          }

          return {
            ...temple,
            favorite: false,
            isConnected: isConnected,
            connectedId: connectedId
          };
        });

        // Loop variables handled in HTML, but initializing first element props for safety/compatibility
        if (this.templedata[0]) {
          this.blockId = this.templedata[0].object_id?.block?.block_id;
          this.eventsData = this.templedata[0].events;
          this.CommentData = this.templedata[0].comments;
          this.mediaDetails = this.templedata[0].media;
          this.transportdetails = this.templedata[0].transport;
          this.touroperatordetails = this.templedata[0].touroperator;
          this.tourismplacedetails = this.templedata[0].tourismplace;
          this.nearby_hotelsdetails = this.templedata[0].nearby_hotels;
          this.Templefestivals = this.templedata[0].festivals;
          this.templegoshals = this.templedata[0].goshalas;
          this.tourguides = this.templedata[0].tour_guide;
          this.socialactivity = this.templedata[0].social_activity;
          this.prayersandbenfits = this.templedata[0].prayers_and_benefits;
          this.templefacilities = this.templedata[0].temple_facilities;
          this.nearesthospitals = this.templedata[0].near_by_hospitals;
          this.resturant = this.templedata[0].resturents;
          this.poojastores = this.templedata[0].pooja_stores;

          if (this.templedata[0].image_location && this.templedata[0].image_location[0]) {
            this.selectedImage = this.templedata[0].image_location[0];
          } else {
            this.selectedImage = 'assets/ohm.jpg';
          }
        }

        if (this.blockId) {
          this.fetchNearbyTemples(this.blockId);
        } else {
          this.spinner.hide();
        }
        if (data[0]?.visit_temples) {
          this.favoriteTemples = data[0].visit_temples;
        }


      },
      (apiError: any) => {
        console.error("Error fetching temple data", apiError);
        this.spinner.hide();
      }
    );
  }

  fetchNearbyTemples(blockId: string) {
    this.templeservice.filtertemples('', blockId).subscribe(
      (filterData: any) => {
        const filteredResults = filterData.results.filter(
          (temple: any) => temple._id !== this.templeId
        );
        this.nearbytemples = filteredResults;
        this.spinner.hide();
      },
      (filterError: any) => {
        console.error("Error fetching nearby temples", filterError);
        this.spinner.hide();
      }
    );
  }

  // Helper for consistent connection logic
  private handleConnectionSuccess(templeId: string, response: any, type: string) {
    console.log(`${type} connected successfully:`, response);

    // 1. Optimistic UI Update
    const temple = this.templedata.find((t: any) => t._id === templeId);
    if (temple) {
      temple.isConnected = true;
      if (response && response._id) {
        temple.connectedId = response._id;

        // Construct a display-ready connection object
        const currentUser = {
          _id: localStorage.getItem('user_id'),
          name: localStorage.getItem('user_name') || 'You',
          profile_pic: localStorage.getItem('profile_pic')
        };

        const newConnection = {
          ...response,
          user: currentUser,
          connected_as: type
        };

        if (!temple.Connections) temple.Connections = [];
        temple.Connections.push(newConnection);
      }
    }

    // 2. Background Sync
    setTimeout(() => {
      this.fecthtempledata();
    }, 1000);
  }


  isExpanded = false;

  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }




  onSubmit() {
    const ismemberin = localStorage.getItem("is_member") === "true";
    const commentdata = this.commentform.value;
    if (ismemberin) {




      const comment = {
        body: commentdata.body,
        temple: this.route.snapshot.paramMap.get("id"),
        user: localStorage.getItem('user')
      };



      this.commonservice.addcomment(comment).subscribe(
        response => {

          this.fecthtempledata();
          this.commentform.reset();
          console.log(response, "11111111111111")

          // Clear the comment text box or any other UI updates
          // this.commentText = '';
        },
        error => {
          console.error('Error posting comment:', error);
          // Handle error as needed
        }
      );
    } else {
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

  openmemberDialog() {
    return this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'member' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }



  OpenAddmemberDilog(templeid: any): void {
    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
    this.templeId = this.route.snapshot.paramMap.get("_id")
    console.log(this.templeId, "55454")
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'addmember', templeId: templeid },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }

  OpenPujariDilog(templeid: any): void {
    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
    this.templeId = templeid
    console.log(this.templeId, "55454")
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



  OpenAddvoluanterDilog(templeid: any): void {
    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
    this.templeId = this.route.snapshot.paramMap.get("_id")
    console.log(this.templeId, "55454")
    const dialogRef = this.dialog.open(OnlymemberComponent, {
      data: { displayName: 'addmember', templeId: templeid, type: 'VOLUNTARY' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
       disableClose: true,
    });
  }



  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
  }


  // isMemberconnect(templeid: any): void {
  //   const connectdata = this.ConnectForm.value;
  //   const contactedmember = {
  //     temple: templeid,
  //     user: localStorage.getItem('user'),
  //     connected_as: 'MEMBER'
  //   };

  //   this.memberservice.connect(contactedmember).subscribe(
  //     (response: any) => {
  //       console.log('Member connected successfully:', response);
  //       this.ConnectForm.reset();

  //       // Optimistic UI Update
  //       const temple = this.templedata.find((t: any) => t._id === templeid);
  //       if (temple) {
  //         temple.isConnected = true;
  //         if (response && response._id) {
  //           temple.connectedId = response._id;

  //           // Construct a "fake" connection object for the UI list
  //           const currentUser = {
  //             _id: localStorage.getItem('user_id'),
  //             name: localStorage.getItem('user_name') || 'You', // Fallback name
  //             profile_pic: localStorage.getItem('profile_pic')
  //           };

  //           const newConnection = {
  //             ...response,
  //             user: currentUser
  //           };

  //           if (!temple.Connections) temple.Connections = [];
  //           temple.Connections.push(newConnection);
  //         }
  //       }

  //       // Still fetch to sync perfectly, but UI is already updated
  //       setTimeout(() => {
  //         this.fecthtempledata();
  //       }, 500);
  //     },
  //     error => {
  //       console.error('There was an error!', error);
  //     }
  //   );
  // }
isMemberconnect(templeid: any): void {

  const contactedmember = {
    temple: templeid,
    user: this.currentUserId,   // ✅ use consistent user id
    connected_as: 'MEMBER'
  };

  this.memberservice.connect(contactedmember).subscribe(
    (response: any) => {
      this.ConnectForm.reset();

      // ✅ just refresh data properly
      this.fecthtempledata();
    },
    error => console.error(error)
  );
}


  // isPujariconnect(templeid: any): void {
  //   const contactedPujari = {
  //     temple: templeid,
  //     user: localStorage.getItem('user'),
  //     connected_as: 'PUJARI'
  //   };
  //   this.memberservice.connect(contactedPujari).subscribe(
  //     (response: any) => {
  //       this.ConnectForm.reset();
  //       this.handleConnectionSuccess(templeid, response, 'PUJARI');
  //     },
  //     error => console.error('Error connecting pujari:', error)
  //   );
  // }
  isPujariconnect(templeid: any): void {

  const contactedPujari = {
    temple: templeid,
    user: this.currentUserId,
    connected_as: 'PUJARI'
  };

  this.memberservice.connect(contactedPujari).subscribe(
    () => {
      this.ConnectForm.reset();
      this.fecthtempledata();
    },
    error => console.error(error)
  );
}

  /*
    // const connectdata = this.ConnectForm.value;
    const contactedPujari = {
      temple: templeid,
      user: localStorage.getItem('user'),
      connected_as: 'PUJARI'
    };
    this.memberservice.connect(contactedPujari).subscribe(
      (response: any) => {
        console.log('Pujari connected successfully:', response);
        this.ConnectForm.reset();
  
        // Optimistic UI update
        const temple = this.templedata.find((t: any) => t._id === templeid);
        if (temple) {
          temple.isConnected = true;
          if (response && response._id) {
            temple.connectedId = response._id;
  
            // Construct fake user object for UI
            const currentUser = {
              _id: localStorage.getItem('user_id'),
              name: localStorage.getItem('user_name') || 'You',
              profile_pic: localStorage.getItem('profile_pic')
            };
  
            const newConnection = {
              ...response,
              user: currentUser
            };
  
            if (!temple.Connections) temple.Connections = [];
            temple.Connections.push(newConnection);
          }
        }
  
        // Removed fetch for now
      },
      error => {
        console.error('Error connecting pujari:', error);
      }
    );
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
  
  
  
  
  */
  isvoluantryconnect(templeid: any): void {
    const contactedmember = {
      temple: templeid,
      user: localStorage.getItem('user'),
      connected_as: 'VOLUNTARY'
    };

    this.memberservice.connect(contactedmember).subscribe(
      (response: any) => {
        console.log(response);
        this.ConnectForm.reset();

        // Optimistic Update
        const temple = this.templedata.find((t: any) => t._id === templeid);
        if (temple) {
          temple.isConnected = true;
          if (response && response._id) {
            temple.connectedId = response._id;

            // Fake user object for UI
            const currentUser = {
              _id: localStorage.getItem('user_id'),
              name: localStorage.getItem('user_name') || 'You',
              profile_pic: localStorage.getItem('profile_pic')
            };

            const newConnection = {
              ...response,
              user: currentUser
            };

            if (!temple.Connections) temple.Connections = [];
            temple.Connections.push(newConnection);
          }
        }

        this.fecthtempledata()
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

disconnect(connectionId: any) {
  if (!connectionId) return;

  this.memberservice.DisconnectMember(connectionId).subscribe(
    () => {
      this.fecthtempledata();
    },
    error => console.error(error)
  );
}






  navigatetemple(templeId: any): void {

    this.router.navigate(['templedetailsview', templeId]);
  }

  NavigateToChatRoom(templeId: any): void {
    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }

    this.router.navigate(['templechat', templeId])
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
      temple_id: this.route.snapshot.paramMap.get("id"),
      user: localStorage.getItem('user'),
      video: [null, Validators.required]
    });
  }
  templeid: any;
  villageid: any;

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

  handleBannerFileChange(info: NzUploadChangeParam): void {
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

    this.videoFileList = [];

    this.mediaForm.patchValue({

      video: ''
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
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });


  }







  Addmoredetails(): void {
    this.detailsForm = this.fb.group({
      temple_website: ['', [Validators.pattern('https?://.+')]],
      temple_timings: [''],
      image_location: [''],
      desc: [''],
      map_location: [''],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      other_diety: [''],
      construction_year: [''],
      video: [''],
    });
  }






  Addmore() {
    this.spinner.show();
    if (this.detailsForm.valid) {
      this.templeservice.templeaddmoredetails(this.detailsForm.value).subscribe(
        response => {
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Details added Successfully', '');
          this.detailsForm.reset();
          this.bannerFileList = [];
          window.location.reload();

          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();

        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add details');

          this.spinner.hide();
        }
      );
    } else {
      this.detailsForm.markAllAsTouched();
      this.spinner.hide();
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

  handleimageChange(info: NzUploadChangeParam): void {
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


  // Uploadhotelimage(info:NzUploadChangeParam):void {
  //   this.adddhotelimage(info, 'image_location');
  //  }

  //  adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
  //   const fileList = [...info.fileList];

  //   // Initialize an empty array to store base64 strings
  //   const base64Images: string[] = [];

  //   fileList.forEach((file: NzUploadFile) => {
  //     this.getBase64(file.originFileObj!, (base64String: string) => {
  //       file['base64'] = base64String;
  //       base64Images.push(base64String);

  //       // Update the form control once all images are processed
  //       if (base64Images.length === fileList.length) {
  //         this.hotelmForm.patchValue({ image_location: base64Images });
  //         console.log('Updated images form:', this.hotelmForm.value);
  //       }
  //     });
  //   });

  //   if (formControlName === 'image_location') {
  //     this.bannerFileList = fileList;
  //   }

  //   console.log('File upload:', info.fileList);
  // }

  Uploadhotelimage(info: NzUploadChangeParam): void {
    this.adddhotelimage(info, 'image_location');
  }

  UploadLicenseCopy(info: NzUploadChangeParam): void {
    this.adddhotelimage(info, 'license_copy');
  }

  adddhotelimage(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];
    const base64Images: string[] = [];

    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        base64Images.push(base64String);

        if (base64Images.length === fileList.length) {
          this.hotelmForm.patchValue({ [formControlName]: base64Images });
          console.log(`Updated ${formControlName}:`, this.hotelmForm.value);
        }
      });
    });

    if (formControlName === 'image_location') {
      this.bannerFileList = fileList;
    } else if (formControlName === 'license_copy') {
      this.licenseFileList = fileList;
    }

    console.log('File upload:', fileList);
  }





  Uploadrestaurantimage(info: NzUploadChangeParam): void {
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










  Uploadtouismimage(info: NzUploadChangeParam): void {
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

  // bannerFileList: NzUploadFile[] = [];
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




  toggleTransportFacility() {
    this.showTransportFacility = !this.showTransportFacility;
  }

  togglePrayers() {
    this.showSocialActivities = false;
    this.showFacilities = false;
    this.showPrayers = !this.showPrayers;
  }


  toggleFestivals() {

    this.showFestivals = !this.showFestivals;
  }

  toggleSocialActivities() {
    this.showPrayers = false;
    this.showFacilities = false;
    this.showSocialActivities = !this.showSocialActivities;
  }

  toggleFacilities() {
    this.showPrayers = false;
    this.showSocialActivities = false;
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
      disableClose: true,
      width: '600px'
    });
  this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }


  @ViewChild('nearbyhospitalsDialog') nearbyhospitalsDialog!: TemplateRef<any>;
  openaddnearbyhospitals(): void {
    this.dialogRef = this.dialog.open(this.nearbyhospitalsDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }

  @ViewChild('hotelsDialog') hotelsDialog!: TemplateRef<any>;
  opennearbyhotels(): void {
    this.dialogRef = this.dialog.open(this.hotelsDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }


  @ViewChild('touroperatorDialog') touroperatorDialog!: TemplateRef<any>;
  openaddtoutoperator(): void {
    this.dialogRef = this.dialog.open(this.touroperatorDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }


  @ViewChild('tourguideDialog') tourguideDialog!: TemplateRef<any>;
  openaddtoutguide(): void {
    this.dialogRef = this.dialog.open(this.tourguideDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }


  @ViewChild('restaurantDialog') restaurantDialog!: TemplateRef<any>;
  openrestaurantform(): void {
    this.dialogRef = this.dialog.open(this.restaurantDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }


  @ViewChild('poojastoresDialog') poojastoresDialog!: TemplateRef<any>;
  openpoojastoresform(): void {
    this.dialogRef = this.dialog.open(this.poojastoresDialog, {
      disableClose: true,
      width: '600px'
    });
      this.dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog closed', result);
  });

  }

  addpoojastoreform(): void {
    this.poojastoreForm = this.fb.group({
      map_location: [ '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address: ['', Validators.required],
      name: ['', Validators.required],
      owener_name: ['', Validators.required],

      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      image_location: ['',Validators.required],

    });
  }


  addrestaurantsform(): void {
    this.restaurantForm = this.fb.group({
      map_location: [ '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address: ['', Validators.required],
      owner_name: ['', Validators.required],
      name: ['', Validators.required],
      email_id: ['', Validators.required],
      contact_number: ['', Validators.required],
      website: ['',Validators.pattern(/^https?:\/\/.+/)],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      image_location: ['',Validators.required],

    });
  }


  addnearbyhotels(): void {
    this.hotelmForm = this.fb.group({
      map_location: [ '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address: ['',Validators.required],
      name: ['',Validators.required],
      contact_number: ['',Validators.required],
      owner_name: ['',Validators.required],
      restaurent: [''],
      license_copy: [''],

      // hotel_rating:[''],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      image_location: ['',Validators.required],

    });
  }




  tourismplaces(): void {
    this.tourismForm = this.fb.group({
      map_location: [ '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address: ['', Validators.required],
      name: ['', Validators.required],
      desc: ['', Validators.required],
      timings: ['', Validators.required],
      type: ['', Validators.required],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      image_location: [''],


    });
  }


  addtouroperatorsform(): void {
    this.touroperatorForm = this.fb.group({
      // rating:['0'],
      tour_operator_name: ['',Validators.required],
      mobile_number: ['',Validators.required],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      email: ['',Validators.required],
      website: ['',Validators.required,Validators.pattern(/^https?:\/\/.+/)],
      contact_address: ['',Validators.required]

    });
  }



  addtourguideform(): void {
    this.tourguideForm = this.fb.group({
      tourist_spot_covered: ['',Validators.required],
      language: ['',Validators.required],
      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      mobile: ['',Validators.required],


    });
  }




  addnearbyhospitalss(): void {
    this.hospitalform = this.fb.group({
      map_location: [  '',
  [
    Validators.required,
    Validators.pattern(/^https?:\/\/.+/)
  ]],
      address: ['',[Validators.required]],
      name: ['',[Validators.required]],
      contact_number: ['',[Validators.required]],
      owner_name: ['',[Validators.required]],

      temple_id: this.route.snapshot.paramMap.get("id"),
      user_id: localStorage.getItem('user'),
      status: ['INACTIVE'],
      image_location: ['',[Validators.required]],
      license_copy: [''],

    });
  }




  Addhospital() {
    this.spinner.show();
    if (this.hospitalform.valid) {
      this.templeservice.addnearbyhospital(this.hospitalform.value).subscribe(
        response => {
          console.log('Hospital added successfully:', response);
          this.notificationHelper.showSuccessNotification('Hospital added Successfully', '');

          this.hospitalform.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();

        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add hospital');
          this.spinner.hide();
        }
      );
    } else {
      this.hospitalform.markAllAsTouched();
      this.spinner.hide();
    }
  }


  Addtourismplaces() {
    this.spinner.show();
    if (this.tourismForm.valid) {
      this.templeservice.addTempletourismplaces(this.tourismForm.value).subscribe(
        response => {
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Tourism place added Successfully', '');


          this.tourismForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add tourism place');

          this.spinner.hide();
        }
      );
    } else {
      this.tourismForm.markAllAsTouched();
      this.spinner.hide();
    }
  }


  Addhotels() {
    this.spinner.show();
    if (this.hotelmForm.valid) {
      this.templeservice.addnearbyhotels(this.hotelmForm.value).subscribe(
        response => {
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Hotel added Successfully', '');

          this.hotelmForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add hotel');
          this.spinner.hide();
        }
      );
    } else {
      this.hotelmForm.markAllAsTouched();
      this.spinner.hide();
    }
  }

  Addtouroperator() {
    this.spinner.show();
    if (this.touroperatorForm.valid) {
      this.templeservice.addtouroperatordetails(this.touroperatorForm.value).subscribe(
        response => {
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Tour Operator added Successfully', '');

          this.touroperatorForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add tour operator');
          this.spinner.hide();
        }
      );
    } else {
      this.touroperatorForm.markAllAsTouched();
      this.spinner.hide();
    }
  }



  Addtyourtourguide() {
    this.spinner.show();
    if (this.tourguideForm.valid) {
      this.templeservice.addttourguide(this.tourguideForm.value).subscribe(
        response => {
          console.log('Temple added successfully:', response);
          this.notificationHelper.showSuccessNotification('Tour Guide added Successfully', '');

          this.tourguideForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add tour guide');
          this.spinner.hide();
        }
      );
    } else {
      this.tourguideForm.markAllAsTouched();
      this.spinner.hide();
    }
  }




  Addrestaurant() {
    this.spinner.show();
    if (this.restaurantForm.valid) {
      this.templeservice.addrestaurants(this.restaurantForm.value).subscribe(
        response => {
          console.log('restaurants added successfully:', response);
          this.notificationHelper.showSuccessNotification('Restaurant added Successfully', '');

          this.restaurantForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add restaurant');
          this.spinner.hide();
        }
      );
    } else {
      this.restaurantForm.markAllAsTouched();
      this.spinner.hide();
    }
  }



  Addpoojastore() {
    this.spinner.show();
    if (this.poojastoreForm.valid) {
      this.templeservice.addpoojastore(this.poojastoreForm.value).subscribe(
        response => {
          console.log('poojastore added successfully:', response);
          this.notificationHelper.showSuccessNotification('Pooja Store added Successfully', '');

          this.poojastoreForm.reset();
          window.location.reload();

          // ✅ Clear the uploaded images
          this.bannerFileList = [];
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error adding temple:', error);
          this.notificationHelper.showErrorNotification('Failed to add pooja store');
          this.spinner.hide();
        }
      );
    } else {
      this.poojastoreForm.markAllAsTouched();
      this.spinner.hide();
    }
  }

  getpoojastoreLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.poojastoreForm.patchValue({
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


  Uploadpoojastoreimage(info: NzUploadChangeParam): void {
    this.addpoojaimage(info, 'image_location');
  }

  addpoojaimage(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];

    // Initialize an empty array to store base64 strings
    const base64Images: string[] = [];

    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;
        base64Images.push(base64String);

        // Update the form control once all images are processed
        if (base64Images.length === fileList.length) {
          this.poojastoreForm.patchValue({ image_location: base64Images });
          console.log('Updated images form:', this.poojastoreForm.value);
        }
      });
    });

    if (formControlName === 'image_location') {
      this.bannerFileList = fileList;
    }

    console.log('File upload:', info.fileList);
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

  isvolunary = false

  connectionsvoluantryForm(): void {
    this.ConnectvoluantryForm = this.fb.group(
      {
        connected_as: "VOLUNTARY",
        temple: this.route.snapshot.paramMap.get("id"),
        user: localStorage.getItem('user')
      }
    );
  }



  OpenMemberDialog(member: any): void {
    console.log(member, "member")

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


  // isFavorited(): boolean {
  //   const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
  //   return this.favoriteTemples.some(fav => String(fav.temple_id) === templeIdFromRoute);
  // }

  isFavorited(): boolean {
  const templeId = String(this.route.snapshot.paramMap.get('id'));
  return this.favoriteTemples.some(
    fav => String(fav.temple_id) === templeId
  );
}

getFavoriteId(): string | null {
  const templeId = String(this.route.snapshot.paramMap.get('id'));

  const fav = this.favoriteTemples.find(
    f => String(f.temple_id) === templeId
  );

  return fav ? fav._id : null;
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

  if (this.isFavorited()) {
    const favId = this.getFavoriteId();
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

  this.templeservice.addvisitedtemples(data).subscribe((newFav: any) => {

    // Push correctly
    this.favoriteTemples.push(newFav);

  }, error => {
    console.error('Error adding favorite:', error);
  });
}


removeFromFavorites(favId: string | null) {

  if (!favId) return;

  this.templeservice.removeTempleFavorite(favId).subscribe(
    () => {
      this.favoriteTemples = this.favoriteTemples.filter(
        fav => fav._id !== favId
      );
    },
    error => {
      console.error('Error removing favorite:', error);
    }
  );
}


  // getFavoriteId(): any {
  //   const templeIdFromRoute = String(this.route.snapshot.paramMap.get('id'));
  //   const fav = this.favoriteTemples.find(f => String(f.temple_id) === templeIdFromRoute);
  //   return fav ? fav.id : null;
  // }



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


  getVideoId(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:shorts\/|watch\?v=))([\w-]{11})/);
    return match ? match[1] : '';
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // navigatorourismplaces():void{
  //   this.router.navigate(['/tourism-places'])
  // }


  stateImageMap: { [stateId: string]: string } = {
    'd1b01400-d0b0-11ee-ade9-0242ac110002': 'assets/bihar.jpeg',   ///andharapreadws
    'd1a8e4df-d0b0-11ee-ade9-0242ac110002': 'assets/bihar.jpg',   ///ID_ARUNACHAL
    'd1aca5aa-d0b0-11ee-ade9-0242ac110002': 'assets/bihar.jpg',  ///ID_ASSAM
    'd1a7fc4d-d0b0-11ee-ade9-0242ac110002': 'assets/bihar.jpg', ///ID_BIHAR
    'd1ae967e-d0b0-11ee-ade9-0242ac110002': 'assets/chhattisgarh.jpg',///ID_CHHATTISGARH
    'd1b35e75-d0b0-11ee-ade9-0242ac110002': 'assets/Chandigarh.jpg',
    'd1b456b3-d0b0-11ee-ade9-0242ac110002': 'assets/Delhi.jpg',
    'd1b10926-d0b0-11ee-ade9-0242ac110002': 'assets/goa.jpg',///ID_GOA
    'd1af4220-d0b0-11ee-ade9-0242ac110002': 'assets/Dr. bihar Sahoo.jpg',////gujarat
    'd1b40579-d0b0-11ee-ade9-0242ac110002': 'assets/haryana.jpg', ///ID_HARYANA
    'd1adc50b-d0b0-11ee-ade9-0242ac110002': 'assets/himachal-pradesh.jpg', ///ID_HIMACHAL
    'd1ae0423-d0b0-11ee-ade9-0242ac110002': 'assets/jharkhand.jpg', ///ID_JHARKHAND
    'd1b05548-d0b0-11ee-ade9-0242ac110002': 'assets/karnataka.jpg',///ID_KARNATAKA
    'd1b177a0-d0b0-11ee-ade9-0242ac110002': 'assets/kerala.jpg',
    'd1aeed6e-d0b0-11ee-ade9-0242ac110002': 'assets/madhya-pradesh.jpg',
    'd1afb964-d0b0-11ee-ade9-0242ac110002': 'assets/maharashtra.jpg',
    'd1ab6820-d0b0-11ee-ade9-0242ac110002': 'assets/manipur.jpg',
    'd1ac52d3-d0b0-11ee-ade9-0242ac110002': 'assets/meghalaya.jpg',
    'd1abcd6b-d0b0-11ee-ade9-0242ac110002': 'assets/mizoram.jpg',
    'd1ab1d63-d0b0-11ee-ade9-0242ac110002': 'assets/nagaland.jpg',
    'd1ae4aec-d0b0-11ee-ade9-0242ac110002': 'assets/odisha.jpg',
    'd1b0ca82-d0b0-11ee-ade9-0242ac110002': 'assets/punjab.jpg',
    'd1b4aa1b-d0b0-11ee-ade9-0242ac110002': 'assets/rajasthan.jpg',
    'd1a88b78-d0b0-11ee-ade9-0242ac110002': 'assets/sikkim.jpg',
    'd1b1c859-d0b0-11ee-ade9-0242ac110002': 'assets/tamil-nadu.jpg',
    'd1b28c99-d0b0-11ee-ade9-0242ac110002': 'assets/telangana.jpg',
    'd1ac1588-d0b0-11ee-ade9-0242ac110002': 'assets/tripura.jpg',
    'd1b39dca-d0b0-11ee-ade9-0242ac110002': 'assets/uttar-pradesh.jpg',
    'd1b50ff0-d0b0-11ee-ade9-0242ac110002': 'assets/uttarakhand.jpg',
    'd1ad2cb4-d0b0-11ee-ade9-0242ac110002': 'assets/west-bengal.jpg',

    'd1b25921-d0b0-11ee-ade9-0242ac110002': 'assets/Andaman And Nicobar Islands.jpg',
    'd1a66fe7-d0b0-11ee-ade9-0242ac110002': 'assets/Jammu And Kashmir.jpg',
    'd1b2e8d1-d0b0-11ee-ade9-0242ac110002': 'assets/Ladakh.jpg',
    'd1b141a3-d0b0-11ee-ade9-0242ac110002': 'assets/Lakshadweep.jpg',
    'd1b21c0d-d0b0-11ee-ade9-0242ac110002': 'assets/Puducherry.jpg',
    'd1b31fe4-d0b0-11ee-ade9-0242ac110002': 'assets/The Dadra And Nagar Haveli And Daman And Diu.jpg',


  };


  getDefaultStateImage(temple: any): string {
    const sid = temple?.object_id?.block?.district?.state?.state_id;
    return this.stateImageMap[sid] || 'assets/ohm.jpg';
  }
  // selectedImage: string | null = null;

  @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;
  // openImage(image: string) {
  //   this.selectedImage = image;

  //   this.dialog.open(this.imageDialog, {
  //     width: '75%',
  //     maxWidth: '700px',
  //     panelClass: 'image-preview-dialog'
  //   });
  // }
  currentIndex = 0;
  imageList: string[] = [];

  openImage(image: string, images: string[]) {
    this.imageList = images;
    this.currentIndex = images.indexOf(image);
    this.selectedImage = image;

    this.dialog.open(this.imageDialog, {
      width: '75%',
      maxWidth: '700px',
      panelClass: 'image-preview-dialog'
    });
  }

  nextImage() {
    if (this.currentIndex < this.imageList.length - 1) {
      this.currentIndex++;
      this.selectedImage = this.imageList[this.currentIndex];
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.selectedImage = this.imageList[this.currentIndex];
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
  openGalleryFromButton(images: string[]) {
    if (!images || images.length === 0) {
      return;
    }

    this.imageList = images;
    this.currentIndex = 0;
    this.selectedImage = images[0];

    this.dialog.open(this.imageDialog, {
      width: '75%',
      maxWidth: '700px',
      panelClass: 'image-preview-dialog'
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

  if (controlName === 'video') {
    this.addmoreVideoList = fileList.slice(0, 1);
  }
}

handleaddmoreVideoRemove(controlName: string): void {
  this.detailsForm.patchValue({ [controlName]: '' });

  if (controlName === 'video') {
    this.addmoreVideoList = [];
  }
}
}