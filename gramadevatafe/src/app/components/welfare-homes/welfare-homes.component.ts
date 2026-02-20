import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoshalaService } from '../../services/goshalaservice/goshala.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Subscription, interval, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location/location.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { UserService } from '../../services/userservice/user.service';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for ngModel
import { AddWelfareHomeComponent } from '../add-welfare-home/add-welfare-home.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';



@Component({
  selector: 'app-welfare-homes',
  standalone: true,
  imports: [CommonModule,
    TreeViewComponent,
    ReactiveFormsModule,
    NzSelectModule,
    NzTreeModule,
    NzFormModule,
    AddSpaceComponent, NgxSpinnerModule, AddSpace1Component, RouterModule, FormsModule],
  templateUrl: './welfare-homes.component.html',
  styleUrl: './welfare-homes.component.css'
})
export class WelfareHomesComponent {
  categoryId: any;
  goshaladata: any;
  goshalaCategorydata: any;
  selected = false;
  locationId = '';
  location: any;
  selectedCategoryId: any;
  selectedLocationId: any;
  currentPage: number = 1;
  templesdata: any;
  subscription: Subscription = new Subscription();
  templeCategorydata: any;
  destroy$: Subject<void> = new Subject<void>();
  validatorForm!: FormGroup;
  StateOptions: any[] = [];
  DistrictOptions: any[] = [];
  MandalOptions: any[] = [];
  VillageOptions: any[] = [];
  CountryOptions: any;
  filtersVisible: boolean = true;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private goshalaservice: GoshalaService,
    private locationservice: LocationService,
    private fb: FormBuilder, private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private userservice: UserService,private dialog: MatDialog,
  ) { }

  // ngOnInit(): void {

  //   this.selectedCategoryId = this.route.snapshot.paramMap.get('id');
  //   if (this.selectedCategoryId === 'WelfareHomes') {
  //     console.log(this.selectedCategoryId, "poiuy")
  //     this.selectedCategoryId = '';
  //   }
  //   this.fetchMainCategory();

  //   this.loadlocations();


  // }



    ngOnInit(): void {
    // this.selectedMainCategoryId = this.route.snapshot.paramMap.get('id');
    // console.log(this.selectedCategoryId, "poiuy")


    this.selectedCategoryId = this.route.snapshot.paramMap.get('id');
    if (this.selectedCategoryId === 'WelfareHomes') {
      console.log(this.selectedCategoryId, "poiuy")
      this.selectedCategoryId = '';
    }
    this.fetchMainCategory();

    this.loadlocations();

    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      const categoryData = JSON.parse(storedCategory);
      this.selectedCategoryId = categoryData.id;
      // this.searchText = categoryData.name;
    }

    ['country', 'state', 'district', 'mandal', 'village'].forEach(loc => {
      const val = this.validatorForm.get(loc)?.value;
      if (val) {
        switch (loc) {
          case 'country': this.selectedCountry = val; break;
          case 'state': this.selectedState = val; break;
          case 'district': this.selectedDistrict = val; break;
          case 'mandal': this.selectedBlock = val; break;
          case 'village': this.selectedVillage = val; break;
        }
      }
    });

    // Subscribe to valueChanges for each location control
    ['country', 'state', 'district', 'mandal', 'village'].forEach(loc => {
      this.validatorForm.get(loc)?.valueChanges.subscribe(value => {
        if (value !== null && value !== undefined) {
          this.onLocationChange(loc, value);
        }
      });
    });


  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/welfare-home.jpg';
  }

  navigateTotempleDetail(_id: string): void {
    console.log("Clicked", _id);
    console.log("Navigating to temples with ID:", _id);
    this.router.navigate(['getbygoshala', _id])
      .then(() => console.log("Navigation successful"))
      .catch(error => console.error("Navigation failed:", error));
  }




  // clearState(): void {
  //   console.log("State cleared");
  //   this.validatorForm.get('state')?.setValue(null); // Clear state
  //   this.selectedLocationId = this.validatorForm.get('country')?.value || null;
  //   if (this.selectedLocationId) {
  //     this.applyFilters();
  //   }
  // }
  cleardistrict(): void {
    console.log("District cleared");
    this.validatorForm.get('district')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('state')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
  clearmandal(): void {
    console.log("Mandal cleared");
    this.validatorForm.get('mandal')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('district')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
  clearvillage(): void {
    console.log("Village cleared");
    this.validatorForm.get('village')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('mandal')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }


  onCategoryClick(category: any): void {
    this.selectedCategoryId = category._id || ''; // Or adjust based on your category model
    this.selectedCategory = category; // important to keep dropdown updated

    console.log(this.selectedCategoryId, "1111111111111");

    if (category.name === 'WelfareHomes') {
      console.log(this.selectedCategoryId, "poiuy");
      this.selectedCategoryId = '';
    }

    this.router.navigate(["Welfare-Homes", this.selectedCategoryId]);
    this.applyFilters();
  }




  onLocationClick(event: NzFormatEmitEvent) {
    this.selectedLocationId = event.node?.origin?.key;
    this.applyFilters();
  }


  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = null;
    this.applyFilters();
  }



  applyFilters() {
    this.currentPage = 1;
    this.goshaladata = []; // Clear previous data
    this.loadFilteredTemples();
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  differentcategory: any[] = [];

  fetchMainCategory() {
    this.goshalaservice.getwelfarehomeCategory().subscribe({
      next: (response) => {
        this.differentcategory = response;
        console.log("Fetched main categories:", this.differentcategory);
      },
      error: (error) => {
        console.error("Error fetching main categories:", error);
      }
    });
  }



  loadFilteredTemples() {
    this.spinner.show()
    if (this.selectedCategoryId && this.selectedLocationId) {
      console.log(this.selectedCategoryId, this.selectedLocationId, "sdfg")
      this.goshalaservice.filterWelfarehome(this.selectedCategoryId, this.selectedLocationId, this.currentPage).subscribe(
        (response) => {
          this.goshaladata = response.results;
          console.log(this.goshaladata, "Filtered Goshala with Category and Location");
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching Filtered Goshala with Category and Location:', error);
          this.spinner.hide();
        }
      );
    } else if (this.selectedCategoryId) {
      console.log("sdfg123")
      this.goshalaservice.filterWelfarehome(this.selectedCategoryId, '').subscribe(
        (response) => {
        this.goshaladata = response.results;
          console.log(this.goshaladata, "Filtered Temples with Category");
          this.spinner.hide();

        },
        (error) => {
          console.error('Error fetching Filtered Temples with Category:', error);
          this.spinner.hide();
        }
      );
    } else if (this.selectedLocationId) {
      this.goshalaservice.filterWelfarehome("", this.selectedLocationId, this.currentPage).subscribe(
        (response) => {
          this.goshaladata = response.results;
          console.log(this.goshaladata, "Filtered Temples with Location");
          this.goshalaCategorydata = null;
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching Filtered Temples with Location:', error);
          this.spinner.hide();
        }
      );
    }



    else {
      this.goshalaservice.getallWlfarehomes().subscribe(
        (response) => {
          this.goshaladata = response
          console.log(this.goshaladata, "Filtered Temples without Category or Location");
          this.goshalaCategorydata = null;
          this.spinner.hide();
        },
        (error) => {
          console.error('Error fetching filtered temples:', error);
          this.spinner.hide();
        }
      );
    }

    this.goshalaservice.getwelfarehomeCategorybyId(this.selectedCategoryId).subscribe(data => {
      this.goshalaCategorydata = data;
      console.log(this.goshalaCategorydata, "Temple Category Data");
      // this.spinner.hide()
    });
  }

  loadMore() {
    this.currentPage++;
    this.loadFilteredTemples();
  }


  loadlocations(): void {
    this.validatorForm = this.fb.group({
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      village: ['', Validators.required]
    });


    this.locationservice.countrywelfare('welfare').subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.CountryOptions = res.map((country: any) => ({
            label: country.name,
            value: country._id
          }));

          // Explicitly define the type of a and b
          this.CountryOptions.sort((a: { label: string; value: any }, b: { label: string; value: any }) =>
            a.label.localeCompare(b.label)
          );

          // Find the country object with the label "India"
          const defaultCountry = this.CountryOptions.find((option: { label: string; value: any }) => option.label === 'India');

          // Set the default country if found
          if (defaultCountry) {
            this.validatorForm.controls['country'].setValue(defaultCountry.value);
          }

        } else {
          console.error("Response is not an array type", res);
          // this.CountryFormControls();
        }
      },
      (err) => {
        console.log(err);
      }
    );
//     this.locationservice.GetAllCountries().subscribe(
//   (res) => {
//     if (Array.isArray(res)) {

//       // ✅ Keep ONLY India
//       const indiaOnly = res.filter(
//         (country: any) => country.name === 'India'
//       );

//       this.CountryOptions = indiaOnly.map((country: any) => ({
//         label: country.name,
//         value: country._id
//       }));

//       // Optional (only one item anyway)
//       this.CountryOptions.sort(
//         (a: { label: string; value: any }, b: { label: string; value: any }) =>
//           a.label.localeCompare(b.label)
//       );


//       // ✅ Auto select India
//       if (this.CountryOptions.length) {
//         this.validatorForm.controls['country']
//           .setValue(this.CountryOptions[0].value);
//       }

//     } else {
//       console.error('Response is not an array type', res);
//     }
//   },
//   (err) => console.log(err)
// );




    this.validatorForm.get('country')?.valueChanges.subscribe(CountryID => {
      if (CountryID) {
        this.selectedLocationId = CountryID; // Store state ID
        this.applyFilters()
        this.resetFormControls();
        // this.StateOptions = [];
        // this.DistrictOptions = [];
        // this.MandalOptions = [];
        // this.VillageOptions = [];
        console.log('State ID selected:', this.selectedLocationId);
        console.log("qsdfbg")
        this.locationservice.getbyStates(CountryID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.StateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id
              }));
              this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));
              // this.resetFormControls();
            } else {
              console.error("Response is not an array type", res);
              // this.resetFormControls();
            }
          },
          (err) => {
            console.log(err);
            this.resetFormControls();
          }
        );
        this.resetFormControls();

      }
      else {
        this.resetFormControls();
      }

    })



    // Initialize form control states
    this.resetFormControls();

    // Initialize form control states
    this.resetFormControls();

    // Handle state changes
    this.validatorForm.get('state')?.valueChanges.subscribe(stateID => {
      if (stateID) {
        this.selectedLocationId = stateID; // Store state ID
        console.log('State ID selected:', this.selectedLocationId);
        this.applyFilters()

        this.locationservice.getdistricts(stateID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.DistrictOptions = res.map((district: any) => ({
                label: district.name,
                value: district._id
              }));
              this.DistrictOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.resetDistrictMandalVillage();
        this.validatorForm.get('district')?.enable();
      } else {
        // If state is cleared, revert to Country
        if (this.validatorForm.get('country')?.value) {
          this.selectedLocationId = this.validatorForm.get('country')?.value;
          this.applyFilters();
        }
        this.resetDistrictMandalVillage();
      }
    });

    // Handle district changes
    this.validatorForm.get('district')?.valueChanges.subscribe(districtID => {
      if (districtID) {
        this.selectedLocationId = districtID; // Replace state ID with district ID
        console.log('District ID selected:', this.selectedLocationId);
        this.applyFilters()
        this.locationservice.getblocks(districtID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.MandalOptions = res.map((mandal: any) => ({
                label: mandal.name,
                value: mandal._id
              }));
              this.MandalOptions.sort((a, b) => a.label.localeCompare(b.label));
            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.resetMandalVillage();
        this.validatorForm.get('mandal')?.enable();
      } else {
        // If district is cleared, revert to State
        if (this.validatorForm.get('state')?.value) {
          this.selectedLocationId = this.validatorForm.get('state')?.value;
          this.applyFilters();
        }
        this.resetMandalVillage();
      }
    });

    // Handle mandal changes
    this.validatorForm.get('mandal')?.valueChanges.subscribe(mandalID => {
      if (mandalID) {
        this.selectedLocationId = mandalID; // Replace district ID with mandal ID
        console.log('Mandal ID selected:', this.selectedLocationId);
        this.applyFilters()
        this.locationservice.getvillages(mandalID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.VillageOptions = res.map((village: any) => ({
                label: village.name,
                value: village._id
              }));
              this.VillageOptions.sort((a, b) => a.label.localeCompare(b.label));
              this.resetVillage();
            } else {
              console.error("Response is not an array type", res);
              this.resetVillage();
            }
          },
          (err) => {
            console.log(err);
          }
        );
        this.validatorForm.get('village')?.enable();
      } else {
        // If mandal is cleared, revert to District
        if (this.validatorForm.get('district')?.value) {
          this.selectedLocationId = this.validatorForm.get('district')?.value;
          this.applyFilters();
        }
        this.resetVillage();
      }
    });

    this.validatorForm.get('village')?.valueChanges.subscribe(villageID => {
      if (villageID) {
        this.selectedLocationId = villageID; // Replace mandal ID with village ID
        this.applyFilters()
        console.log('Village ID selected:', this.selectedLocationId);
      } else {
        // If village is cleared, revert to Mandal
        if (this.validatorForm.get('mandal')?.value) {
          this.selectedLocationId = this.validatorForm.get('mandal')?.value;
          this.applyFilters();
        } else {
          this.resetVillage();
        }
      }
    });
  }


  CountryFormControls(): void {
    this.validatorForm.get('country')?.reset();
    this.validatorForm.get('state')?.reset();
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // this.validatorForm.get('district')?.disable();
    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
  }

  // Helper methods for resetting and disabling form controls
  resetFormControls(): void {
    this.validatorForm.get('state')?.reset();
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // this.validatorForm.get('district')?.disable();
    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
    this.StateOptions = [];
    this.DistrictOptions = [];
    this.MandalOptions = [];
    this.VillageOptions = [];
  }

  resetDistrictMandalVillage(): void {
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // this.validatorForm.get('mandal')?.disable();
    // this.validatorForm.get('village')?.disable();
  }

  resetMandalVillage(): void {
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // this.validatorForm.get('village')?.disable();
  }

  resetVillage(): void {
    this.validatorForm.get('village')?.reset();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
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



    // OpenAddtourismDilog(): void {
    //   const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
    //     width: '80%',
    //     maxHeight: '90vh', // optional
    //     data: { message: 'optional data' }, // optional
    //     autoFocus: false,
    //     backdropClass: 'dialog-backdrop' // optional custom class
    //   });
  
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('Dialog closed', result);
    //   });
    // }


//     OpenwelfareDilog(): void {

//   const userId = this.authenticationService.getCurrentUser();

//   // ❌ Not logged in → show login modal
//   if (!userId) {
//     this.authenticationService.showLoginModal();
//     return;
//   }

//   // ✅ Logged in → open dialog
//   const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
//     width: '80%',
//     maxHeight: '90vh',
//     autoFocus: false,
//     backdropClass: 'dialog-backdrop'
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('Dialog closed', result);
//   });
// }

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

OpenwelfareDilog(): void {

  // 1️⃣ Check login first
  const user = this.authenticationService.getCurrentUser();
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ Check membership
  const isMember = localStorage.getItem('is_member') === 'true';
  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  // 3️⃣ Logged in + member → open Add Tourism dialog
  const dialogRef = this.dialog.open(AddWelfareHomeComponent, {
    width: '900px',        // ✅ FIXED
    maxWidth: '95vw',       // ✅ responsive
    autoFocus: false,
    backdropClass: 'dialog-backdrop',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Dialog closed', result);
  });
}


  shareGoshala() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: 'Check out this page!',
        url: window.location.href
      }).then(() => {
        console.log('Page shared successfully!');
      }).catch(err => {
        console.error('Error sharing the page:', err);
      });
    } else {
      // Fallback for browsers that do not support the Web Share API
      alert('Web Share API is not supported in this browser.');
    }
  }




  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }
  getCountryLabel(value: string): string | null {
    const selected = this.CountryOptions.find((opt: any) => opt.value === value);
    return selected ? selected.label : '';
  }

  getStateLabel(value: string): string | null {
    const selected = this.StateOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }

  getDistrictLabel(value: string): string | null {
    const selected = this.DistrictOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }


  // getMandalLabel(value: string): string | null {
  //   const selected = this.MandalOptions.find(opt => opt.value === value);
  //   return selected ? selected.label : null;
  // }



  // getVillageLabel(value: string): string | null {
  //   const selected = this.VillageOptions.find(opt => opt.value === value);
  //   return selected ? selected.label : null;
  // }


  getMandalLabel(value: string): string {
    const selected = this.MandalOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';  // return empty string instead of null
  }

  getVillageLabel(value: string): string {
    const selected = this.VillageOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }


  getLocationLabel(type: string, value: any): string {
    switch (type) {
      case 'country': return this.getCountryLabel(value) ?? '';
      case 'state': return this.getStateLabel(value) ?? '';
      case 'district': return this.getDistrictLabel(value) ?? '';
      case 'mandal': return this.getMandalLabel(value) ?? '';
      case 'village': return this.getVillageLabel(value) ?? '';



      default: return '';
    }
  }

  getOptions(type: string): any[] {
    switch (type) {
      case 'country': return this.CountryOptions;
      case 'state': return this.StateOptions;
      case 'district': return this.DistrictOptions;
      case 'mandal': return this.MandalOptions;
      case 'village': return this.VillageOptions;
      default: return [];
    }
  }

  clearLocation(type: string): void {
    switch (type) {

      case 'state':
        this.clearState();
        break;
      case 'district':
        this.cleardistrict();
        break;
      case 'mandal':
        this.clearmandal();
        break;
      case 'village':
        this.clearvillage();
        break;
    }
  }


  hasAnyLocationSelected(): boolean {
    const { country, state, district, mandal, village } = this.validatorForm.value;
    return !!(country || state || district || mandal || village);
  }

  getDynamicLabel(type: string): string {
    const districtValue = this.validatorForm.get('district')?.value;

    const districtLabel = this.DistrictOptions.find(opt => opt.value === districtValue)?.label;

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

  selectedCategory: string = '';
  selectedCountry: string | null = null;
  selectedState: string | null = null;
  selectedVillage: string | null = null;
  selectedDistrict: string | null = null;
  selectedBlock: string | null = null;

  onStateSelect(selectedValue: string) {
    this.selectedState = selectedValue ? selectedValue : null;
  }


  onDistrictSelect(selectedValue: string) {
    this.selectedDistrict = selectedValue ? selectedValue : null;
  }

  onBlockSelect(selectedValue: string) {
    this.selectedBlock = selectedValue ? selectedValue : null;
  }

  onVillageSelect(selectedValue: string) {
    this.selectedVillage = selectedValue ? selectedValue : null;
  }



    clearState(): void {
    console.log("State cleared");
    this.validatorForm.get('state')?.setValue(null); // Clear state
    this.selectedLocationId = this.validatorForm.get('country')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
  clearDistrict(): void {
    console.log("District cleared");
    this.validatorForm.get('district')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('state')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
  clearMandal(): void {
    console.log("Mandal cleared");
    this.validatorForm.get('mandal')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('district')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
  clearVillage(): void {
    console.log("Village cleared");
    this.validatorForm.get('village')?.setValue(null);
    this.selectedLocationId = this.validatorForm.get('mandal')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }

    onLocationChange(type: string, value: string): void {
    switch (type) {
      case 'country':
        this.selectedCountry = value;
        this.clearState();
        break;
      case 'state':
        this.selectedState = value;
        this.clearDistrict();
        break;
      case 'district':
        this.selectedDistrict = value;
        this.clearMandal();
        break;
      case 'mandal':
        this.selectedBlock = value;
        this.clearVillage();
        break;
      case 'village':
        this.selectedVillage = value;
        break;
    }
  }



}
