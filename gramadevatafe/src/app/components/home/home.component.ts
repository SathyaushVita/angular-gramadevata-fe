
import { HomeserviceService } from '../../services/homeservice/homeservice.service';
import { Component, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { state } from '@angular/animations';
import { CommonService } from '../../services/commonservice/common.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ConnectyourorginComponent } from '../connectyourorgin/connectyourorgin.component';
import { MatDialog } from '@angular/material/dialog';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { UserService } from '../../services/userservice/user.service';
import { ConnectionsService } from '../../services/connectionservice/connections.service';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { AddspacerightComponent } from '../addspaceright/addspaceright.component';
declare var bootstrap: any; 
import { RouterModule } from '@angular/router';
import { AddWelfareHomeComponent } from '../add-welfare-home/add-welfare-home.component';
import { AddTourismComponent } from '../add-tourism/add-tourism.component';
interface Ad {
  videoUrl: SafeResourceUrl;
  isVideo?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[
    CommonModule,
    NzModalModule,
    NgxSpinnerModule,AddSpaceComponent,AddSpace1Component,AddspacerightComponent,RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})



export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  homeData: any;
  templeCategories:any;
  goshalaCategories:any;
  eventCategories:any;
  TourismPlaces:any
  villages:any;
  Welfarehome:any;
  orgdata:any;
  categorydata:any;
  userId: any;
  userdata: any;
  membertype: any;
  connectiondata: any;
  adspace: Ad[] = [];
  aadspace: Ad[] = [];
  adVideo:any;
  // renderer: any;

  ads:Ad[]=[];
  currentIndex:number=0;
  isPlaying = false;
  safeYoutubeUrl: SafeResourceUrl;

  constructor(private router: Router, 
    private homeservice: HomeserviceService,
     private dialog:MatDialog,
      private templeservice:TempleserviceService,
      private spinner: NgxSpinnerService,
      private authenticationService:AuthenticationService,
      private userservice:UserService,
      private connectionservice:ConnectionsService,
      private sanitizer: DomSanitizer, 
      private renderer : Renderer2,
      


    ) { 
      this.ads = [
        { videoUrl: this.sanitizeUrl('../../../assets/gramadevata_final_video.mp4'), isVideo: true },
      ];
      this.adspace = [
        { videoUrl: this.sanitizeUrl('../../../assets/swarana_giri_temple.mp4'), isVideo: true },  
        // { videoUrl: this.sanitizeUrl('../../../assets/swaranagiri.mp4'), isVideo: true },  

      ];
      this.aadspace = [
        { videoUrl: this.sanitizeUrl('../../../assets/save plastic video.mp4'), isVideo: true },  
      ];

       this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/d6xvszRQcTA'
    );
    }
    onVideoLoaded(): void {
      if (this.adVideo) {
        this.renderer.setProperty(this.adVideo.nativeElement, 'muted', this.isMuted);
      }
    }
    isMuted = true;

    // isMuted = true;

unmuteVideo(video: HTMLVideoElement): void {
  video.muted = false;
}

muteVideo(video: HTMLVideoElement): void {
  video.muted = true;
}

    sanitizeUrl(url: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    getTrustedUrl(videoUrl: string): SafeResourceUrl {
      const videoId = this.extractVideoId(videoUrl);
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://youtu.be/A7_JQnc55EQ${videoId}`);
    }

    togglePlay(video: HTMLVideoElement) {
      if (video.paused) {
          // video.play();
          window.open("https://www.youtube.com/watch?v=d6xvszRQcTA", "_blank");
      } else {
          video.pause();
          // window.open("https://www.youtube.com", "_blank");
      }
  }
  

  private extractVideoId(videoUrl: string): string {
    const url = new URL(videoUrl);
    return url.searchParams.get('v') || '';
  }


  ngOnInit(): void {
   
    const hasReloaded = sessionStorage.getItem('carouselReloaded');

    if (!hasReloaded) {
      sessionStorage.setItem('carouselReloaded', 'true');
    }
    

    this.FetchHomeData();
  }

  ngAfterViewInit(): void {
    // Select multiple elements using a valid CSS selector
    const carouselElements = document.querySelectorAll(
      '#templeCarousel, #changallama, #changallamaCarouselUnique, #changallamaCarousel, #templeCarouselunique, #templeCarouselsmall'
    );
  
    carouselElements.forEach((carouselElement) => {
      if (carouselElement) {
        const hasReloaded = sessionStorage.getItem('carouselReloaded');
  
        if (hasReloaded) {
          this.renderer.setAttribute(carouselElement, 'data-bs-ride', 'carousel');
          this.renderer.setAttribute(carouselElement, 'data-bs-interval', '3000');
          this.renderer.setAttribute(carouselElement, 'data-bs-pause', 'false');
  
          // Manually restart the Bootstrap carousel
          const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 3000,
            pause: 'false',
            ride: 'carousel'
          });
        }
      }
    });
  }
  
  
  ngOnDestroy(): void { 
    sessionStorage.setItem('carouselReloaded', 'true'); 
  }


FetchHomeData(): void {
  this.spinner.show();
  this.homeservice.getHomeData().subscribe({
    next: (data) => {
      // this.villages = data.villages;
      this.templeCategories = data.templeCategories;
      this.goshalaCategories = data.goshalaCategories;
      this.eventCategories = data.eventCategories;
      this.TourismPlaces =data.tourismPlaces  ;
      this.villages = data.villages;
       this.Welfarehome = data.welfareHomes;

      this.spinner.hide(); 
    },
    error: (error) => {
      console.error("Error fetching home data", error);
      this.spinner.hide();
    }
  });
}


handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/ohm.jpg';
}


// navigateToCategoryDetail(templeCategory: any): void {
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }
  
//   this.router.navigate(["temple", templeCategory._id], { state: { templeCategory } })
//     // .then(() => console.log("Navigation successful"))
//     // .catch(error => console.error("Navigation failed:", error));
//     .then(() => {
//       console.log("Navigation successful");
//       window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
//     })
//     .catch(error => console.error("Navigation failed:", error));
    
// }

navigateToCategoryDetail(event: MouseEvent, templeCategory: any): void {
  // Allow browser right-click behavior
  if (event.button !== 0 || event.ctrlKey || event.metaKey) {
    return; // Let it proceed as normal link (open in new tab, etc.)
  }

  event.preventDefault(); // Prevent default link if left-clicking

  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  this.router.navigate(["temple", templeCategory._id], { state: { templeCategory } })
    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error("Navigation failed:", error));
}



navigateTo(route: string): void {
  
  const isMemberIn = localStorage.getItem("is_member") === "true"; // Convert the string to a boolean
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  
  if (isMemberIn) {
    this.router.navigate([route]);
  } else {
    
    this.userservice.showMemberModal();
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

// navigateToTempleFilters():void{
//   this.templeservice.gettemplecategorybyname("Ayyappa Swamy").subscribe(
//     data=>{
//       this.categorydata =data._Id
//       this.router.navigate(["globaltemples",'AllTemples'])

//     }
//   )
// }


navigateToTempleFilters(): void {
  this.templeservice.gettemplecategorybyname("Ayyappa Swamy").subscribe(
    data => {
      this.categorydata = data._Id;
      this.router.navigate(["temple", "e9e8933f-81ee-42bd-9b6d-e923d30d2e5b"]).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
      });
    },
    error => {
      console.error("Failed to fetch category:", error);
    }
  );
}


// navigateToGoshalaFilterCategoryDetail(goshalaCategory: any): void {
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }
  
//   this.router.navigate(["goshala", goshalaCategory],)
//     // .then(() => console.log("Navigation successful"))
//     // .catch(error => console.error("Navigation failed:", error));

//     .then(() => {
//       console.log("Navigation successful");
//       window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
//     })
//     .catch(error => console.error("Navigation failed:", error));
// }

navigateToGoshalaFilterCategoryDetail(event: MouseEvent, goshalaCategory: any): void {
  // Allow browser default for Ctrl+click, Cmd+click, middle-click, or right-click
  if (event.button !== 0 || event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault(); // Block default anchor navigation on left-click

  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  this.router.navigate(["goshala", goshalaCategory._id])
    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error("Navigation failed:", error));
}



navigateToGoshalaCategoryDetail():void{
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["goshala",'AllGoshalas'])
  // .then(() => console.log("Navigation successful"))
  //   .catch(error => console.error("Navigation failed:", error));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}



navigateTonearesttourplaces():void{
  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["tourism"])
  // .then(() => console.log("Navigation successful"))
  //   .catch(error => console.error("Navigation failed:", error));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}


// navigateToEventFilterCategoryDetail(event:any):void{
//   let userId = this.authenticationService.getCurrentUser();
//     if (userId == undefined || userId == null) {
//       this.authenticationService.showLoginModal()
//       return;
//     }
//   this.router.navigate(["events",event])
//   // .then(() => console.log("Navigation successful"))
//   //   .catch(error => console.error("Navigation failed:", error));
//   .then(() => {
//     console.log("Navigation successful");
//     window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
//   })
//   .catch(error => console.error("Navigation failed:", error));
// }

navigateToEventFilterCategoryDetail(event: MouseEvent, eventcategorydata: any): void {
  // Allow right-click, Ctrl+click, Cmd+click, middle click
  if (event.button !== 0 || event.ctrlKey || event.metaKey) {
    return;
  }

  event.preventDefault(); // Prevent default anchor behavior

  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  this.router.navigate(["events", eventcategorydata._id])
    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error("Navigation failed:", error));
}



navigateToEventsCategoryDetail():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["events","AllEvents"])
  // .then(()=> console.log("navigation succesfull"))
  // .catch(eroror =>console.error("navigation failed"));
  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  })
  .catch(error => console.error("Navigation failed:", error));
}

// navigateToVillageDetail(_id:any):void{
//   this .router.navigate(['villages',_id])
// }


navigateToVillageDetail(_id: any): void {
  this.router.navigate(['villages', _id]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top
  }).catch(error => console.error("Navigation failed:", error));
}


scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// openVillageDialog(): void {
//   this.spinner.show();
//   const dialogRef = this.dialog.open(ConnectyourorginComponent, {
//     data: { displayName: 'connectorgin' }, 
//     autoFocus: false, 
//     backdropClass: 'dialog-backdrop',
//   });
//   this.spinner.hide();
  
//   dialogRef.afterClosed().subscribe(() => {
    
//   });
// }

openVillageDialog(): void {
  this.spinner.show();

  const dialogRef = this.dialog.open(ConnectyourorginComponent, {
    data: { displayName: 'connectorgin' }, 
    autoFocus: false, 
    backdropClass: 'dialog-backdrop',
  });

  this.spinner.hide();

  dialogRef.afterClosed().subscribe(() => {
    // Scroll to top after dialog is closed
    Promise.resolve().then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(error => console.error("Navigation failed:", error));
  });
}


navigateTempleDetail(_id:string):void{
  this.router.navigate(["getbytemples",_id])
}






shareNews() {
  const shareUrl = "http://gramadevata.com/home";
  console.log('Share URL:', shareUrl);
  if (navigator.share) {
    navigator.share({
      url: shareUrl
    }).catch((error) => console.log('Error sharing:', error));
  } else {
    console.log('Share API not supported');
  }
}


navigatevillage():void{
  this.router.navigate(["village"])  .then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top
  }).catch(error => console.error("Navigation failed:", error));
}







navigateTowelfarehomesfilters():void{

  let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
  this.router.navigate(["Welfare-Homes","WelfareHomes"])

  .then(() => {
    console.log("Navigation successful");
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  })
  .catch(error => console.error("Navigation failed:", error));
}


navigateToWelfarehomesCategoryDetail(event: MouseEvent, templeCategory: any): void {
  // Allow browser right-click behavior
  if (event.button !== 0 || event.ctrlKey || event.metaKey) {
    return; // Let it proceed as normal link (open in new tab, etc.)
  }

  event.preventDefault(); // Prevent default link if left-clicking

  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  this.router.navigate(["Welfare-Homes", templeCategory._id], { state: { templeCategory } })
    .then(() => {
      console.log("Navigation successful");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => console.error("Navigation failed:", error));
}

    OpenAddwelfarehomeDilog(): void {
      const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
        width: '80%',
        maxHeight: '90vh', // optional
        data: { message: 'optional data' }, // optional
        autoFocus: false,
        backdropClass: 'dialog-backdrop' // optional custom class
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed', result);
      });
    }
  OpenAddtourismDilog(): void {
    const dialogRef = this.dialog.open(AddTourismComponent, {
      width: '600px', // optional
      data: { message: 'optional data' }, // optional
      autoFocus: false,
      backdropClass: 'dialog-backdrop' // optional custom class
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }



}

