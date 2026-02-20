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
import { AddWelfareHomeComponent } from '../add-welfare-home/add-welfare-home.component';
@Component({
  selector: 'app-detail-view-welfare-homes',
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
  templateUrl: './detail-view-welfare-homes.component.html',
  styleUrl: './detail-view-welfare-homes.component.css'
})
export class DetailViewWelfareHomesComponent {


templedata: any  // ✅ Correct

  transportdetails : any[] = [];
  nearby_hotelsdetails: any[] = [];
resturant:any;
  nearesthospitals: any[] = [];
policestation: any[] = [];
nearaccommodation: any[] = [];

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
    private spinner: NgxSpinnerService,

   
     
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

    this.templeservice.getwelfarehomebyId(id).subscribe(
      (res) => {
        this.templedata = [res]; 
          this.canEdit = res.user === this.currentUserId;

      },
      (err) => {
        console.error('Failed to fetch tourism data:', err);
      }
    );
  }





  editWelfareHome(tourismData: any): void {
    if (!this.canEdit) {
      return;
    }
  
    const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
      width: '80%',
      maxHeight: '90vh',
      data: {
        mode: 'edit',
        welfareId: tourismData._id
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.fetchTourismByLocation(tourismData._id); // refresh view
      }
    });
  }
  


selectedDescription: string = '';

openModal(desc: string): void {
  this.selectedDescription = desc;
}

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/welfare-home.jpg';
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

  


  openMap(mapLocation: string) {
    if (mapLocation) {
      window.open(mapLocation, '_blank');
    } else {
      console.error('Map location URL is invalid');
    }
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
    : `https://gramadevata.com/DetailviewofWelfareHome/${temple._id}`;

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


}
