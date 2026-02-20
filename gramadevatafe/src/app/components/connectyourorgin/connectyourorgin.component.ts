import { Component, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { LocationService } from '../../services/location/location.service';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerModule,NgxSpinnerService } from "ngx-spinner";
import { INDIA } from '../../constants';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { UserService } from '../../services/userservice/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; 





@Component({
  selector: 'app-connectyourorgin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzButtonModule,NzSelectModule,NzFormModule,NgxSpinnerModule,MatDialogModule,MatButtonModule],
  templateUrl: './connectyourorgin.component.html',
  styleUrl: './connectyourorgin.component.css'
})
export class ConnectyourorginComponent {
  @ViewChild('districtDetailsTemplate') districtDetailsTemplate!: TemplateRef<any>;
  @ViewChild('mandalDetailsTemplate') mandalDetailsTemplate!: TemplateRef<any>;
    @ViewChild('stateDetailsTemplate') stateDetailsTemplate!: TemplateRef<any>;



  validatorForm!: FormGroup;
  StateOptions:any[]=[];
  DistrictOptions:any[]=[];
  MandalOptions:any[]=[];
  VillageOptions:any[]=[];
  country: any;
  // StateId:any

  constructor(private locationservice:LocationService,
     private fb:FormBuilder,
     private router : Router,
     public dialogRef: MatDialogRef<ConnectyourorginComponent>,
     private spinner: NgxSpinnerService,
     private userservice:UserService,private route: ActivatedRoute,
     private authenticationService:AuthenticationService,private dialog: MatDialog,private renderer: Renderer2
    ) { }


    isMandalDialogOpen = false;

    
    scrollToTop(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }


  // ngOnInit() {

  //   this.validatorForm = this.fb.group({
  //     country: [''],
  //     state: ['', [Validators.required]],
  //     district: ['', Validators.required],
  //     mandal: ['', Validators.required],
  //     village: ['', Validators.required]
  //   });
  
  //   this.locationservice.getNameByCountry('INDIA').subscribe(
  //     data => {
  //       if (data && data.length > 0) {
  //         this.country = data[0]._id;
  //         console.log(this.country, "this.country");
  
  //         this.validatorForm.patchValue({
  //           country: this.country
  //         });
  
  //         this.locationservice.getbyStates(this.country).subscribe(
  //           res => {
  //             this.StateOptions = res.map((state: any) => ({
  //               label: state.name,
  //               value: state._id,
  //             }));
  //             this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
  //           },
  //           err => {
  //             console.error('Error fetching states:', err);
  //           }
  //         );
  //       } else {
  //         console.error('No country found for the provided name.');
  //       }
  //     },
  //     err => {
  //       console.error('Error fetching country ID:', err);
  //     }
  //   );
  
  //   this.validatorForm.get('state')?.valueChanges.subscribe(stateId => {
  //     // Close any open dialogs
  //     if (this.mandalDialogRef) {
  //       this.mandalDialogRef.close();
  //       this.mandalDialogRef = null;
  //     }
  //     if (this.districtDialogRef) {
  //       this.districtDialogRef.close();
  //       this.districtDialogRef = null;
  //     }

  //         if (this.statetDialogRef) {
  //     this.statetDialogRef.close();
  //     this.statetDialogRef = null;
  //   }
  
  //     // Reset form controls if state is changed
  //     this.validatorForm.get('district')?.reset();
  //     this.validatorForm.get('district')?.disable();
  //     this.validatorForm.get('mandal')?.reset();
  //     this.validatorForm.get('mandal')?.disable();
  //     this.validatorForm.get('village')?.reset();
  //     this.validatorForm.get('village')?.disable();
  
  //     if (stateId) {
  //       this.locationservice.getdistricts(stateId).subscribe(
  //         (res) => {
  //           this.DistrictOptions = res.map((district: any) => ({
  //             label: district.name,
  //             value: district._id,
  //           }));
  //           this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
  //           this.validatorForm.get('district')?.enable();
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //               this.locationservice.getstateDetails(stateId).subscribe(
  //         (statedata) => {
  //           if (statedata?.name?.includes('')) {
  //           this.statetDialogRef = this.dialog.open(this.stateDetailsTemplate, {
  //             width: '400px',
  //             data: statedata,
  //             position: { top: '5%', right: '2%' }
  //           });
  //         }
  //         },
  //         (err) => {
  //           console.error('Error fetching district details:', err);
  //         }
  //       );
  //     }
  //   });
  
  //   this.validatorForm.get('district')?.valueChanges.subscribe(DistrictId => {
  //     // Close any open mandal dialogs
  //     if (this.mandalDialogRef) {
  //       this.mandalDialogRef.close();
  //       this.mandalDialogRef = null;
  //     }
        
  
  //     // Reset mandal and village when district changes
  //     this.validatorForm.get('mandal')?.reset();
  //     this.validatorForm.get('mandal')?.disable();
  //     this.validatorForm.get('village')?.reset();
  //     this.validatorForm.get('village')?.disable();
  
  //     if (DistrictId) {
  //       this.locationservice.getblocks(DistrictId).subscribe(
  //         (res) => {
  //           this.MandalOptions = res.map((mandal: any) => ({
  //             label: mandal.name,
  //             value: mandal._id,
  //           }));
  //           this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
  //           this.validatorForm.get('mandal')?.enable();
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  
  //       this.locationservice.getDistrictDetails(DistrictId).subscribe(
  //         (districtData) => {
  //           if (districtData?.name?.includes('')) {
  //           this.districtDialogRef = this.dialog.open(this.districtDetailsTemplate, {
  //             width: '400px',
  //             data: districtData,
  //             position: { top: '5%', right: '2%' }
  //           });
  //         }
  //         },
  //         (err) => {
  //           console.error('Error fetching district details:', err);
  //         }
  //       );
  //     }
  //   });
  
  //   this.validatorForm.get('mandal')?.valueChanges.subscribe(MandalId => {
  //     // Close the mandal dialog if it's already open
  //     if (this.mandalDialogRef) {
  //       this.mandalDialogRef.close();
  //       this.mandalDialogRef = null;
  //     }
         
  //     // Reset village form control
  //     this.validatorForm.get('village')?.reset();
  //     this.validatorForm.get('village')?.disable();
  
  //     if (MandalId) {
  //       this.locationservice.getvillages(MandalId).subscribe(
  //         (res) => {
  //           this.VillageOptions = res.map((village: any) => ({
  //             label: village.name,
  //             value: village._id,
  //           }));
  //           this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
  //           this.validatorForm.get('village')?.enable();
  //         },
  //         (err) => {
  //           console.error('Error fetching villages:', err);
  //         }
  //       );
  
  //       this.locationservice.getMandalDetails(MandalId).subscribe(
  //         (mandalData) => {
  //           if (mandalData?.name?.includes('')) {
  //           this.mandalDialogRef = this.dialog.open(this.mandalDetailsTemplate, {
  //             width: '400px',
  //             data: mandalData,
  //             position: { top: '5%', left: '2%' }
  //           });
  //         }
  //         },
  //         (err) => {
  //           console.error('Error fetching Mandal details:', err);
  //         }
  //       );
  //     }
  //   });
  // }
  ngOnInit(): void {

  this.validatorForm = this.fb.group({
    country: [''],
    state: ['', Validators.required],
    district: ['', Validators.required],
    mandal: ['', Validators.required],
    village: ['', Validators.required]
  });

  // 1️⃣ Fetch country list
  this.locationservice.getNameByCountry('INDIA').subscribe({
    next: (countries: any[]) => {

      // 2️⃣ Exact INDIA match (important)
      const india = countries.find(
        c => c.name?.toUpperCase() === 'INDIA'
      );

      if (!india) {
        console.error('INDIA country not found');
        return;
      }

      this.country = india._id;
      console.log('INDIA Country ID:', this.country);

      // 3️⃣ Patch country
      this.validatorForm.patchValue({
        country: this.country
      });

      // 4️⃣ Load states for INDIA only
      this.loadStatesByCountry(this.country);
    },
    error: err => {
      console.error('Error fetching country:', err);
    }
  });

  this.handleStateChange();
  this.handleDistrictChange();
  this.handleMandalChange();
}
loadStatesByCountry(countryId: string): void {
  this.locationservice.getbyStates(countryId).subscribe({
    next: (res: any[]) => {
      this.StateOptions = res
        .map(state => ({
          label: state.name,
          value: state._id
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    },
    error: err => console.error('Error fetching states:', err)
  });
}
handleStateChange(): void {
  this.validatorForm.get('state')?.valueChanges.subscribe(stateId => {

    this.closeAllDialogs();

    this.validatorForm.patchValue({
      district: null,
      mandal: null,
      village: null
    });

    this.validatorForm.get('district')?.disable();
    this.validatorForm.get('mandal')?.disable();
    this.validatorForm.get('village')?.disable();

    if (!stateId) return;

    this.locationservice.getdistricts(stateId).subscribe(res => {
      this.DistrictOptions = res
        .map((d: any) => ({ label: d.name, value: d._id }))
.sort(
  (a: { label: string }, b: { label: string }) =>
    a.label.localeCompare(b.label)
)


      this.validatorForm.get('district')?.enable();
    });

    this.locationservice.getstateDetails(stateId).subscribe(statedata => {
      this.statetDialogRef = this.dialog.open(this.stateDetailsTemplate, {
        width: '400px',
        data: statedata,
        position: { top: '5%', right: '2%' }
      });
    });
  });
}
closeAllDialogs(): void {
  this.mandalDialogRef?.close();
  this.districtDialogRef?.close();
  this.statetDialogRef?.close();

  this.mandalDialogRef = null;
  this.districtDialogRef = null;
  this.statetDialogRef = null;
}
handleDistrictChange(): void {
  this.validatorForm.get('district')?.valueChanges.subscribe((districtId: string) => {

    // close mandal dialog if open
    if (this.mandalDialogRef) {
      this.mandalDialogRef.close();
      this.mandalDialogRef = null;
    }

    // reset mandal & village
    this.validatorForm.patchValue({
      mandal: null,
      village: null
    });

    this.validatorForm.get('mandal')?.disable();
    this.validatorForm.get('village')?.disable();

    if (!districtId) return;

    this.locationservice.getblocks(districtId).subscribe((res: any[]) => {
      this.MandalOptions = res
        .map((m: any) => ({
          label: m.name,
          value: m._id
        }))
        .sort((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label)
        );

      this.validatorForm.get('mandal')?.enable();
    });

    this.locationservice.getDistrictDetails(districtId).subscribe((districtData: any) => {
      this.districtDialogRef = this.dialog.open(this.districtDetailsTemplate, {
        width: '400px',
        data: districtData,
        position: { top: '5%', right: '2%' }
      });
    });
  });
}
handleMandalChange(): void {
  this.validatorForm.get('mandal')?.valueChanges.subscribe((mandalId: string) => {

    if (this.mandalDialogRef) {
      this.mandalDialogRef.close();
      this.mandalDialogRef = null;
    }

    this.validatorForm.patchValue({ village: null });
    this.validatorForm.get('village')?.disable();

    if (!mandalId) return;

    this.locationservice.getvillages(mandalId).subscribe((res: any[]) => {
      this.VillageOptions = res
        .map((v: any) => ({
          label: v.name,
          value: v._id
        }))
        .sort((a: { label: string }, b: { label: string }) =>
          a.label.localeCompare(b.label)
        );

      this.validatorForm.get('village')?.enable();
    });

    this.locationservice.getMandalDetails(mandalId).subscribe((mandalData: any) => {
      this.mandalDialogRef = this.dialog.open(this.mandalDetailsTemplate, {
        width: '400px',
        data: mandalData,
        position: { top: '5%', left: '2%' }
      });
    });
  });
}


  districtDialogRef: MatDialogRef<any> | null = null;
mandalDialogRef: MatDialogRef<any> | null = null;
  statetDialogRef: MatDialogRef<any> | null = null;



  OnSubmit():void{
    
    
    const VillageId = this.validatorForm.value.village
    this.router.navigate(["villages",VillageId])
    this.dialogRef.close();

  }

  navigate(): void {
    const isMemberIn = localStorage.getItem("is_member") === "true"; 
    let userId = this.authenticationService.getCurrentUser();

    if (userId == undefined || userId == null) {
        this.authenticationService.showLoginModal();
        return;
    }

    if (isMemberIn) {
        this.router.navigate(["addvillage"]).then(() => {
            this.dialogRef.close(); 
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100); 
        }).catch(error => console.error("Navigation failed:", error));
    } else {
        this.userservice.showMemberModal();
    }
}




handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'assets/ohm.jpg';
}

// viewdistrict(districtId: string) {
//   this.dialogRef.close();
//   this.router.navigate(['/district-details', districtId]);
// }


viewdistrict(districtId: string, dialogRef: MatDialogRef<any>): void {
  this.dialog.closeAll(); 
  this.router.navigate(['/district-details', districtId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}


viewMandal(districtId: string,dialogRef: MatDialogRef<any>) {
  this.dialog.closeAll(); 
  this.router.navigate(['/mandal-details', districtId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}


viewstate(stateId: string, dialogRef: MatDialogRef<any>): void {
  this.dialog.closeAll(); 
  this.router.navigate(['/statewisetemples', stateId]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
  }).catch(error => {
    console.error("Failed to navigate to district details:", error);
  });
}


  @ViewChild('stateSelect') stateSelect!: NzSelectComponent;
  @ViewChild('districtSelect') districtSelect!: NzSelectComponent;
  @ViewChild('mandalSelect') mandalSelect!: NzSelectComponent;
  @ViewChild('villageSelect') villageSelect!: NzSelectComponent;





  getDynamicLabel(type: string): string {
  // Get selected district value
  const districtValue = this.validatorForm.get('district')?.value;

  // Look up the label for that district
  const districtLabel = this.DistrictOptions.find(opt => opt.value === districtValue)?.label;

  // Check if the label ends with '_City'
  const isCity = districtLabel?.endsWith('_City');

  switch (type) {
    case 'district':
      return 'District / City';
    case 'mandal':
      return isCity ? 'Division ' : 'Town / Mandal';
    case 'village':
      return isCity ? 'Area / Colony' : 'Village / Area';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}



getplaceholder(type: string): string {
  const districtValue = this.validatorForm.get('district')?.value;
  const districtLabel = this.DistrictOptions.find(opt => opt.value === districtValue)?.label;
  const isCity = districtLabel?.endsWith('_City');

  switch (type) {
    case 'district':
      return 'Please Select District / City';
    case 'mandal':
      return isCity ? 'Please Select Division' : 'Please Select Town / Mandal';
    case 'village':
      return isCity ? 'Please Select Area / Colony' : 'Please Select Village / Area';
    default:
      return `Please Select ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  }
}


}
