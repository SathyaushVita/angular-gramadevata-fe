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
import { DomSanitizer, Meta,SafeResourceUrl  } from '@angular/platform-browser';
import { ShareTempleComponent } from '../share-option/share-temple/share-temple.component';
import { Title } from '@angular/platform-browser';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MatIconModule } from '@angular/material/icon';
import { GetmemberComponent } from '../member/getmember/getmember.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NotificationHelper } from '../commons/notification';
import { AddTourismComponent } from '../add-tourism/add-tourism.component';



@Component({
  selector: 'app-tourism-places',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    AddSpaceComponent,
    AddSpace1Component,
    NzUploadModule,
    MatIconModule,
    NgxSpinnerModule],
  templateUrl: './tourism-places.component.html',
  styleUrl: './tourism-places.component.css'
})
export class TourismPlacesComponent {


templedata: any  // ✅ Correct

  transportdetails : any[] = [];
  nearby_hotelsdetails: any[] = [];
resturant:any;
  nearesthospitals: any[] = [];
policestation: any[] = [];
nearaccommodation: any[] = [];
goshalas: any[] = [];
village_id:any;
eventsData: any;
allTemples:any;
    goshalaId: any;
  goshalaStatus: any;
    templeId: any;
  templeStatus: any;

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
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,private notificationHelper:NotificationHelper,

   
     
    ){ 


    }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchTourismByLocation(id);
    }
  }


  canEdit = false;
currentUserId!: string | null;


  fetchTourismByLocation(id: string): void {
      this.currentUserId = this.authenticationService.getCurrentUser();
    this.templeservice.gettourismbylocation(id).subscribe(
      (res) => {
        this.templedata = [res]; 
        this.transportdetails = res.transport; 
        this. nearby_hotelsdetails= res.nearby_hotels; 
        this. resturant= res.resturents; 
        this. nearesthospitals= res.near_by_hospitals;
        this.policestation = res.police_station;
        this.nearaccommodation = res.accommodation;
        this.goshalas = res.goshala;
        this.allTemples = res.temple;
        this.eventsData = res.event;


  this.canEdit = res.user_id === this.currentUserId;


      },
      (err) => {
        console.error('Failed to fetch tourism data:', err);
      }
    );
  }

editTourism(tourismData: any): void {
  if (!this.canEdit) {
    return;
  }

  const dialogRef = this.dialog.open(AddTourismComponent, {
    width: '420px',
    maxHeight: '90vh',
    data: {
      mode: 'edit',
      tourismId: tourismData._id
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'updated') {
      this.fetchTourismByLocation(tourismData._id); // refresh view
    }
  });
}



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

navigategoshaladata(goshala: any): void {
  this.goshalaId = goshala._id;
  this.goshalaStatus = goshala.status;
  

  // Check if the goshala is inactive
  if (this.goshalaStatus === 'INACTIVE') {
    this.notificationHelper.showSuccessNotification('This Goshala is under review', '');
    return;
  }

  // Check if the user is logged in
  const userId = this.authenticationService.getCurrentUser();
  if (!userId) {
    this.authenticationService.showLoginModal();
    return;
  }

  // Navigate to the detail view with the goshala ID
  this.router.navigate(['getbygoshala',this.goshalaId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }).catch(error => console.error("Navigation failed:", error));
}


  navigateEventdata(event: string): void {
    this.router.navigate(['detailviewevent', event])
      .then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }
  
  // navigateTo(route: string): void {
  //   const ismemberin = localStorage.getItem('is_member') === 'true';
  //   if (ismemberin === false) {
  //     this.openmemberDialog();
  //   } else {

  //     // this.router.navigate([route, this.village_id]);
  //     this.router.navigate([route], { state: { village_id: this.village_id } });
  //   }

  // }

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


selectedDescription: string = '';
selectedTourismName: string = '';

// openModal(desc: string): void {
//   this.selectedDescription = desc;
// }
openModal(desc: string, name: string) {
  this.selectedDescription = desc;
  this.selectedTourismName = name;
}


  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/ohm.jpg';
  }
    handlepoliceImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/police-station.webp';
  }
  navigateToVillage(villageId: string): void {
    this.router.navigate(['/village', villageId]);
  }

  getVillageName(address: string): string {
    return address?.split(',')[0] || 'Unknown';
  }

  getRemainingAddress(address: string): string {
    const parts = address?.split(',') || [];
    parts.shift();
    return parts.join(',');
  }

  
handlehotelImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/hotel.jpg';
}

  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
  }

handlehospitalImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/image.png';
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
getTransportIcon(type: string): string {
  if (type.toLowerCase().includes('train')) return '🚆';
  if (type.toLowerCase().includes('air')) return '✈️';
  if (type.toLowerCase().includes('road') || type.toLowerCase().includes('bus')) return '🚌';
  return '🚗';
}



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
    : `https://gramadevata.com/tourism-places/${temple._id}`;

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

@ViewChild('scrollContainer', { static: false })
scrollContainer!: ElementRef;

scrollLeft() {
  this.scrollContainer.nativeElement.scrollBy({
    left: -200,
    behavior: 'smooth'
  });
}

scrollRight() {
  this.scrollContainer.nativeElement.scrollBy({
    left: 200,
    behavior: 'smooth'
  });
}
}