
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { SignupComponent } from '../signup/signup.component';
import { ConnectyourorginComponent } from '../connectyourorgin/connectyourorgin.component';
import { ModalService } from '../../services/modalservice/modal.service';

import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CommonService } from '../../services/commonservice/common.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { ConnectyourtempleComponent } from '../connectyourtemple/connectyourtemple/connectyourtemple.component';
import { UserService } from '../../services/userservice/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../services/sharedservice/shared.service';
import { Subscription } from 'rxjs';
import { LogoutComponent } from '../logout/logout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { debounceTime, distinctUntilChanged, switchMap,map } from 'rxjs/operators';
import { Subject ,EMPTY} from 'rxjs';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NzModalModule,
    NzLayoutModule,
    NzMenuModule,
    SignupComponent,
    ConnectyourorginComponent,
    NzAvatarModule,
    NzDropDownModule,
    TranslateModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    FormsModule,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private dialogRef: MatDialogRef<SignupComponent> | null = null;
  private subscription: Subscription = new Subscription();

  isSmallScreen = window.innerWidth < 992;
  profile_pic: any;
  username: any;
  userid: any;
  userdata: any;
  user: any;
  userId: string = '';

    searchText: string = '';
  results: any[] = [];
  searchSubject = new Subject<string>();


  constructor(
    private dialog: MatDialog,
    protected authenticationService: AuthenticationService,
    private router: Router,
    private userservice: UserService,
    private renderer: Renderer2,
    private sharedService: SharedService,
  ) {

      //   this.searchSubject
      // .pipe(debounceTime(400), distinctUntilChanged())
      // .subscribe(value => {
      //   if (value.length >= 2) {
      //     this.search(value);
      //   } else {
      //     this.results = [];
      //   }
      // });
      this.searchSubject
  .pipe(
    debounceTime(300),
    map(value => value.trim()),
    distinctUntilChanged(),
    switchMap(value => {
      if (value.length < 2) {
        this.results = [];
        this.noDataFound = false;
        return EMPTY;
      }
      return this.userservice.globalsearch(value);
    })
  )
  .subscribe({
    next: (res: any) => {
      this.results = res?.data || [];
      this.noDataFound = this.results.length === 0;
    },
    error: () => {
      this.results = [];
      this.noDataFound = true;
    }
  });

  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id') || '';
    this.subscription.add(
      this.sharedService.triggerFetchprofileData$.subscribe(() => {
        // this.profiledata();
        this.getUserProfile();

      })
    );

    // this.profiledata();
    this.getUserProfile();
    this.loadGoogleTranslate();

  }


  profiledata() {

    this.profile_pic = localStorage.getItem('profile_pic')
    this.username = localStorage.getItem('full_name')
  }




  getUserProfile(): void {
    const userId = localStorage.getItem('user');
    this.userservice.profiledata(userId).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 992;
  }

  getButtonClasses(): string[] {
    if (this.isSmallScreen) {
      return ['nav-link'];
    } else {
      return ['btn', 'btn-primary', 'rounded-pill'];
    }
  }



  loadGoogleTranslate() {
    const excludedComponents = ['add-temple', 'add-goshala', 'add-event'];
    const currentRoute = this.router.url.split('/')[1];

    if (excludedComponents.includes(currentRoute)) {
      return;
    }

    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,te,hi,kn,ta,ml,or,bn,as,gu' },
          'google_translate_element'
        );

        // Apply styles after the widget loads
        setTimeout(() => {
          const combo = document.querySelector('.goog-te-combo') as HTMLElement;
          if (combo) {
            combo.style.background = '#333';  // Set dark background
            combo.style.border = 'none';
            combo.style.color = 'white';  // Set text color to white
            combo.style.fontWeight = 'bold';  // Set font weight to bold
          }

          const iframe = document.querySelector('iframe') as HTMLIFrameElement;
          if (iframe) {
            iframe.style.border = 'none';
          }
        }, 1000); // Adjust timeout as needed
      };
    }

    if (!window.google || !window.google.translate) {
      const script = this.renderer.createElement('script');
      script.src =
        '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      this.renderer.appendChild(document.body, script);
    } else {
      (window as any).googleTranslateElementInit();
    }
  }


  handleProfileImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profile1.webp';
  }





  openSignupDialog(): void {
    // Check if dialog is already open
    if (this.dialogRef) {
      return; // Prevent opening multiple dialogs
    }

    this.dialogRef = this.dialog.open(SignupComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });

    // Reset dialogRef when dialog is closed
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  openContectYourOrginDialog(): void {
    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
    const dialogRef = this.dialog.open(ConnectyourorginComponent, {
      data: { displayName: 'connectorgin' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }

  openTempleDialog(): void {
    // this.spinner.show();

    let userId = this.authenticationService.getCurrentUser();
    if (userId == undefined || userId == null) {
      this.authenticationService.showLoginModal()
      return;
    }
    const dialogRef = this.dialog.open(ConnectyourtempleComponent, {
      data: { displayName: 'connectorgin' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
    // this.spinner.hide();

    dialogRef.afterClosed().subscribe(() => {

    });
  }

  doLogout() {
    this.authenticationService.logout();
  }


  navigateToTempleFilters(): void {
    this.router.navigate(["temple", 'e9e8933f-81ee-42bd-9b6d-e923d30d2e5b'])
  }

  navigateToGoshalaFilters(): void {
    this.router.navigate(["goshala", 'AllGoshalas'])
  }

  navigateToEventFilters(): void {
    this.router.navigate(["events", 'AllEvents'])
  }

  navigateTotourismplaces(): void {
    this.router.navigate(["tourism"])
  }


  navigatevillage(): void {
    this.router.navigate(["village"])
  }

  navigatewelfare(): void {

    this.router.navigate(["Welfare-Homes", "WelfareHomes"])

      .then(() => {
        console.log("Navigation successful");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(error => console.error("Navigation failed:", error));
  }

  openPdf() {
    window.open("../../../assets/Gramadevata Foundation note.pdf");
  }


  navigateTo(): void {
    const ismember = localStorage.getItem('is_member') === 'true'; // Compare as string

    if (ismember) {
      this.userid = localStorage.getItem('user')
      this.router.navigate(['userprofile', this.userid]);
    } else {
      this.userservice.showMemberModal();
    }
  }



  // openSitemap() {
  //   window.open('../../../assets/gramadevata_sitemap.pdf', '_blank');


  // }



  openSitemap() {
    window.open('../../../assets/sitemap-viewer.html', '_blank');
  }

  // navigate(_id:any){
  //   this.router.navigate(['chatgroups',_id])
  // }
  navigate() {
    if (this.userId) {
      console.error("User ID is missing:", this.userId);
      return;
    }
    console.log("Navigating to chat group:", this.userId);
    this.router.navigate(['chatgroups', this.userId]);
  }


  navigateToChat() {
    if (this.userId) {
      console.error("User ID is missing:", this.userId);
      return;
    }
    console.log("Navigating to chat group:", this.userId);
    this.router.navigate(['chat']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to the top
    }).catch(error => console.error("Navigation failed:", error));;
  }





  dropdownVisible = false;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }


  @ViewChild('mainNavRef') mainNavRef!: ElementRef;


  ngAfterViewInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeNavbar();
      }
    });
  }

  closeNavbar(): void {
    const navEl = this.mainNavRef?.nativeElement;
    if (navEl?.classList.contains('show')) {
      navEl.classList.remove('show');
    }
  }



  confirmLogout(): void {
    const dialogRef = this.dialog.open(LogoutComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authenticationService.logout(); // Call your logout logic here
      }
    });
  }

// onSearchChange(value: string) {
//   if (!value || value.length < 2) {
//     this.results = [];
//     this.noDataFound = false;
//     return;
//   }
//   this.searchSubject.next(value);
// }

onSearchChange(value: string) {
  this.searchText = value;
  this.searchSubject.next(value);
}


formatSearchText(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}


search(value: string) {
  this.userservice.globalsearch(value).subscribe({
    next: (res) => {
      this.results = res?.data || [];

      // show no data message if empty array
      this.noDataFound = this.results.length === 0;
    },
    error: (err) => {
      if (err.status === 404) {
        this.results = [];
        this.noDataFound = true;
      } else {
        console.error('Search error', err);
        this.noDataFound = false;
      }
    }
  });
}

noDataFound: boolean = false;
isSearchFocused = false;

onSearchFocus() {
  this.isSearchFocused = true;

  if (this.searchText.trim().length >= 2 && this.results.length === 0) {
    this.searchSubject.next(this.searchText);
  }
}


onSearchBlur() {
  setTimeout(() => {
    this.isSearchFocused = false;
  }, 200);
}





// onResultClick(item: any) {
//   this.results = [];
//   this.searchText = item.name;

//   switch (item.type) {

//     case 'state':
//       this.router.navigate(['/statewisetemples', item._id]);
//       break;

//     case 'district':
//       this.router.navigate(['/district-details', item._id]);
//       break;

//     case 'block':       // mandal
//       this.router.navigate(['/mandal-details', item._id]);
//       break;

//     case 'village':
//       this.router.navigate(['/villages', item._id]);
//       break;

//     case 'temple':
//       this.router.navigate(['/templedetailsview', item._id]);
//       break;

//     default:
//       console.warn('Unknown type:', item.type);
//       break;
//   }
// }

onResultClick(item: any) {
  this.results = [];
  this.searchText = item.name;
  this.isSearchFocused = false;

  const routes: any = {
    state: '/statewisetemples',
    district: '/district-details',
    block: '/mandal-details',
    village: '/villages',
    temple: '/templedetailsview',
    welfare_home:'/DetailviewofWelfareHome',
    goshala:'/getbygoshala',
    event:'/detailviewevent',
    
  };

  if (routes[item.type]) {
    this.router.navigate([routes[item.type], item._id]);
  } else {
    console.warn('Unknown type:', item.type);
  }
}


}





