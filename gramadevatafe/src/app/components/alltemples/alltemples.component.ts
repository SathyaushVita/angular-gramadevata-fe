import { Component, OnInit, OnDestroy, HostListener, Input, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { TempleserviceService } from '../../services/templeservice/templeservice.service';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, interval, takeUntil, switchMap, Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { UserService } from '../../services/userservice/user.service';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { TemplecategoryserviceService } from '../../services/templecategoryservice/templecategoryservice.service';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { OnlymemberComponent } from '../member/onlymember/onlymember.component';
import { RouterModule } from '@angular/router';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-alltemples',
  standalone: true,
  imports: [FormsModule, CommonModule, TreeViewComponent, NzTreeModule, ReactiveFormsModule, NzSelectModule, NzFormModule, NgxSpinnerModule, AddSpace1Component, AddSpaceComponent,
    MatDialogModule, MatButtonModule, RouterModule],
  templateUrl: './alltemples.component.html',
  styleUrl: './alltemples.component.css'
})
export class AlltemplesComponent {
  globaltemples: any[] = [];
  searchSubject = new Subject<string>();

  isLoading: boolean = true;
  isLoadingNextPage = false;
  countries: any;
  selectedCategoryId: any;
  selectedMainCategoryId: any;
  selectedLocationId: any;
  currentPage: number = 1;
  subscription: Subscription = new Subscription();
  destroy$: Subject<void> = new Subject<void>();
  country: any;
  templesCount: any;
  validatorForm!: FormGroup;
  StateOptions: any[] = [];
  DistrictOptions: any[] = [];
  MandalOptions: any[] = [];
  VillageOptions: any[] = [];
  CountryOptions: any[] = [];
  CategoryOptions: any[] = [];
  templesdata: any;
  templeCategorydata: any;
  filtersVisible: boolean = true;
  categoryList: any[] = [];
  treeClicked: boolean = false;
  nodes: NzTreeNodeOptions[] = [];
  filteredNodes: any[] = [];
  SubcategoryList: any;
  @Input() treeType: string = '';
  selectedCategory: string = '';
  isDropdownOpen: boolean = false;
  searchText: string = '';
  selectedCountry: string | null = null;
  selectedState: string | null = null;
  selectedVillage: string | null = null;
  selectedDistrict: string | null = null;
  selectedBlock: string | null = null;

  constructor(
    private router: Router,
    private templeserviceservice: TempleserviceService,
    private locationservice: LocationService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private userservice: UserService,
    private authenticationService: AuthenticationService,
    private templeCategoryService: TemplecategoryserviceService,
    private eRef: ElementRef, private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.selectedMainCategoryId = this.route.snapshot.paramMap.get('id');
    console.log(this.selectedCategoryId, "poiuy")


    this.fetchMainCategory();
    this.getMainByCategories(this.selectedMainCategoryId);


    this.loadlocations();

    const storedCategory = localStorage.getItem('selectedCategory');
    if (storedCategory) {
      const categoryData = JSON.parse(storedCategory);
      this.selectedCategoryId = categoryData.id;
      this.searchText = categoryData.name;
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


    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        const locationId = this.getSelectedLocationId();
        const categoryId = this.selectedCategoryId || '';

        if (!locationId) return of({ results: [] });

        // Convert page & pageSize to string
        return this.templeserviceservice.filtertemples(
          categoryId,
          locationId,
          term,

        );
      })
    ).subscribe(
      (response: any) => {
        this.globaltemples = response.results;
        this.suggestions = response.results;
      },
      (error: any) => {
        console.error('Search error:', error);
      }
    );

  }

  getSelectedLocationId(): string | null {
    const formValue = this.validatorForm.value;

    // Priority from deepest to shallowest
    if (formValue.village) return formValue.village;
    if (formValue.mandal) return formValue.mandal;
    if (formValue.district) return formValue.district;
    if (formValue.state) return formValue.state;
    if (formValue.country) return formValue.country;

    return null; // No location selected
  }




  suggestions: any[] = [];



  getMainByCategories(selectedMainCategoryId: any): void {
    this.templeCategoryService.GetMainByCategories(selectedMainCategoryId).subscribe(
      (data: any) => {
        this.CategoryOptions = data.map((country: any) => ({
          label: country.name,
          value: country._id
        }));

        if (selectedMainCategoryId === "e9e8933f-81ee-42bd-9b6d-e923d30d2e5b") {
          this.CategoryOptions.push({ label: 'All Temples', value: '' });
        }

        const priorityCategories = [
          "All Temples","Gramadevata", "Jyotirlingas (12)", "Maha Sakthi peetas (18)", "Sakthi Peetas (54)",
          "Chardham (4)", "Chota Chardham (4)", "Divya Desam (108)", "Asta Vinayaka (8)",
          "Pancha Bhutha (5)", "Pancha Prayag (5)", "Pancharama (5)", "Pancha Kedar (5)",
        ];

        this.CategoryOptions.sort((a, b) => {
          const priorityA = priorityCategories.indexOf(a.label);
          const priorityB = priorityCategories.indexOf(b.label);

          if (priorityA !== -1 && priorityB !== -1) return priorityA - priorityB;
          if (priorityA !== -1) return -1;
          if (priorityB !== -1) return 1;

          return a.label.localeCompare(b.label);
        });

        // ✅ Set the first option as default selected
        if (this.CategoryOptions.length > 0) {
          console.log("789456")
          this.selectedCategory = this.CategoryOptions[0].value;
          this.onDefaulktSelectCategory(this.selectedCategory)


        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }





  onSelectMainCategory(selectedValue: any): void {
    this.selectedMainCategoryId = selectedValue;
    console.log('Selected Category:', this.selectedMainCategoryId);


    this.getMainByCategories(this.selectedMainCategoryId);
    
  }

  onSelectCategory(selectedValue: any): void {
    this.selectedCategoryId = selectedValue;
    console.log('Selected Category:', this.selectedCategoryId);


    this.applyFilters();
  }


  onDefaulktSelectCategory(selectedValue: any): void {
    this.selectedCategoryId = selectedValue;
    console.log('Selected Category:', this.selectedCategoryId);  // Check if category is selected


    this.applyFilters();

  }




  onCategoryClick(category: any) {
    if (category._id === this.selectedCategoryId) {
      this.selectedCategoryId = '';
      this.searchText = '';
      localStorage.removeItem('selectedCategory');
      console.log("Reset to All Temples");
    } else {
      this.selectedCategoryId = category._id;
      this.searchText = category.name;

      localStorage.setItem('selectedCategory', JSON.stringify({ id: category._id, name: category.name }));
    }

    this.isDropdownOpen = false;



    this.applyFilters();
  }



  onSubCategoryClick(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    console.log('Category clicked:', categoryId);
    // this.router.navigate(["globaltemples", categoryId])
    this.applyFilters();
  }





  countrydata(): void {


    this.locationservice.getIdByCountry(this.selectedLocationId).subscribe(
      (data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          this.country = data[0]
          console.log(this.country, "1111111111111");

        } else {
          console.error('No category data found');
        }
      },
      error => {
        console.error('Error fetching category data', error);
      }
    );

  }






  cleardata() {
    this.selectedCategoryId = []
  }

  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = null;
    // this.selectedCategoryId = null;
    this.applyFilters();
  }

  applyFilters() {
    this.currentPage = 1;
    this.globaltemples = []; // Clear previous data
    this.loadFilteredTemples();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }

  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }



  searchTerm: string = '';


  onSearchChange(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  loadFilteredTemples() {
    this.spinner.show()
    if (this.selectedCategoryId && this.selectedLocationId) {
      console.log(this.selectedCategoryId, this.selectedLocationId, "sdfg")
      this.templeserviceservice.filtertemples(this.selectedCategoryId, this.selectedLocationId, this.searchTerm, this.currentPage).subscribe(
        (response) => {
          if (this.currentPage === 1) {
            this.globaltemples = response.results;
          } else {
            this.globaltemples = [...this.globaltemples, ...response.results];
          }
          console.log(this.globaltemples, "Filtered Temples with Category and Location");
          this.isLoading = false;
          this.isLoadingNextPage = false;
          this.spinner.hide()
        },
        (error) => {
          this.isLoading = false;
          this.isLoadingNextPage = false;
          console.error('Error fetching Filtered Temples with Category and Location:', error);
        }
      );
    } else if (this.selectedCategoryId) {
      this.spinner.show()
      console.log("sdfg123")
      this.templeserviceservice.filtertemples(this.selectedCategoryId, '').subscribe(
        (response) => {

          if (this.currentPage === 1) {
            this.globaltemples = response.results;
          } else {
            this.globaltemples = [...this.globaltemples, ...response.results];
          }

          console.log(this.globaltemples, "Filtered Temples with Category");
          this.isLoading = false;
          this.isLoadingNextPage = false;
          this.spinner.hide()
        },
        (error) => {
          this.isLoading = false;
          this.isLoadingNextPage = false;
          console.error('Error fetching Filtered Temples with Category:', error);
        }
      );
    } else if (this.selectedLocationId) {
      this.spinner.show()
      this.templeserviceservice.filtertemples("", this.selectedLocationId, this.searchTerm, this.currentPage).subscribe(
        (response) => {
          if (this.currentPage === 1) {
            this.globaltemples = response.results;
          } else {
            this.globaltemples = [...this.globaltemples, ...response.results];
          }
          console.log(this.globaltemples, "Filtered Temples with Location");
          this.isLoading = false;
          this.isLoadingNextPage = false;
          this.spinner.hide()
        },
        (error) => {
          this.isLoading = false;
          this.isLoadingNextPage = false;
          console.error('Error fetching Filtered Temples with Location:', error);
        }
      );
    }



    else {

      this.templeserviceservice.getalltemples().subscribe(
        (response) => {
          if (this.currentPage === 1) {
            this.globaltemples = response.results;
          } else {
            this.globaltemples = [...this.globaltemples, ...response.results];
          }
          console.log(this.globaltemples, "Filtered Temples without Category or Location");
          this.isLoading = false;
          this.isLoadingNextPage = false;
          this.spinner.hide()
        },
        (error) => {
          this.isLoading = false;
          this.isLoadingNextPage = false;
          console.error('Error fetching filtered temples:', error);
        }
      );
    }

    this.templeserviceservice.getTempleCategorybyId(this.selectedCategoryId).subscribe(data => {
      this.templeCategorydata = data;
      console.log(this.templeCategorydata, "Temple Category Data");
      this.spinner.hide()
    });
  }


  loadMore() {
    this.currentPage++;
    this.isLoadingNextPage = true;
    this.loadFilteredTemples();
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






  districtDialogRef: MatDialogRef<any> | null = null;
  mandalDialogRef: MatDialogRef<any> | null = null;




  loadlocations(): void {
    this.validatorForm = this.fb.group({
      country: [''],
      state: [''],
      district: [''],
      mandal: [''],
      village: ['']
    });






    this.locationservice.countrytemples('temple').subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.CountryOptions = res.map((country: any) => ({
            label: country.name,
            value: country._id
          }));
          this.CountryOptions.sort((a, b) => a.label.localeCompare(b.label));

          const defaultCountry = this.CountryOptions.find(option => option.label === 'India');

          if (defaultCountry) {
            this.validatorForm.controls['country'].setValue(defaultCountry.value);
          }
        } else {
          console.error("Response is not an array type", res);
        }
      },
      (err) => {
        console.log(err);
      }
    );

    // Handle country changes
    this.validatorForm.get('country')?.valueChanges.subscribe(CountryID => {
      if (CountryID) {
        this.selectedLocationId = CountryID;
        this.applyFilters();

        this.resetFormControls();
        this.StateOptions = [];
        this.DistrictOptions = [];
        this.MandalOptions = [];
        this.VillageOptions = [];



        this.locationservice.getbyStates(CountryID).subscribe(
          (res) => {
            if (Array.isArray(res)) {
              this.StateOptions = res.map((state: any) => ({
                label: state.name,
                value: state._id
              }));
              this.StateOptions.sort((a, b) => a.label.localeCompare(b.label));

              this.validatorForm.controls['state'].enable();
            } else {
              console.error("Response is not an array type", res);
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
    });




    // Handle state changes
    this.validatorForm.get('state')?.valueChanges.subscribe(stateID => {
      if (stateID) {
        this.selectedLocationId = stateID;
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

        // this.locationservice.getstateDetails(stateID).subscribe(
        //   (statedata) => {
        //     if (statedata?.name?.includes('')) {
        //       this.districtDialogRef = this.dialog.open(this.stateDetailsTemplate, {
        //         width: '400px',
        //         data: statedata,
        //         position: { top: '5%', right: '2%' }
        //       });
        //     }
        //   },
        //   (err) => {
        //     console.error('Error fetching district details:', err);
        //   }
        // );
        this.locationservice.getstateDetails(stateID).subscribe(
  (statedata) => {

    if (statedata) {
      this.selectedLocationType = 'state';
      this.selectedLocationData = statedata;

    }

  },
  (err) => {
    console.error('Error fetching state details:', err);
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
        this.selectedLocationId = districtID;
        console.log('District ID selected:', this.selectedLocationId);
        this.applyFilters();
        // this.locationservice.getDistrictDetails(districtID).subscribe(
        //   (districtData) => {
        //     if (districtData?.name?.includes('')) {
        //       this.districtDialogRef = this.dialog.open(this.districtDetailsTemplate, {
        //         width: '400px',
        //         data: districtData,
        //         position: { top: '5%', right: '2%' }
        //       });
        //     }
        //   },
        //   (err) => console.error('Error fetching district details:', err)
        // );

        this.locationservice.getDistrictDetails(districtID).subscribe(
  (districtdata) => {
    if (districtdata) {
      this.selectedLocationType = 'district';
      this.selectedLocationData = districtdata;
    }
  },
  err => console.error(err)
);

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
        this.selectedLocationId = mandalID;
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

            } else {
              console.error("Response is not an array type", res);
            }
          },
          (err) => {
            console.log(err);
          }
        );

        // this.locationservice.getMandalDetails(mandalID).subscribe(
        //   (mandalData) => {
        //     if (mandalData?.name?.includes('')) {
        //       this.mandalDialogRef = this.dialog.open(this.mandalDetailsTemplate, {
        //         width: '400px',
        //         data: mandalData,
        //         position: { top: '5%', left: '2%' }
        //       });
        //     }
        //   },
        //   (err) => console.error('Error fetching Mandal details:', err)
        // );
        this.locationservice.getMandalDetails(mandalID).subscribe(
  (mandaldata) => {
    if (mandaldata) {
      this.selectedLocationType = 'mandal';
      this.selectedLocationData = mandaldata;
    }
  },
  err => console.error(err)
);

        this.resetVillage();
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
      // console.log("frwfffdcvf")
      if (villageID) {
        this.selectedLocationId = villageID;
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

  resetFormControls(): void {
    this.validatorForm.get('state')?.reset();
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // Clear the dropdown options to remove old data
    this.StateOptions = [];
    this.DistrictOptions = [];
    this.MandalOptions = [];
    this.VillageOptions = [];
  }

  resetDistrictMandalVillage(): void {
    this.validatorForm.get('district')?.reset();
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // Clear the dropdown options
    this.DistrictOptions = [];
    this.MandalOptions = [];
    this.VillageOptions = [];
  }

  resetMandalVillage(): void {
    this.validatorForm.get('mandal')?.reset();
    this.validatorForm.get('village')?.reset();

    // Clear the dropdown options
    this.MandalOptions = [];
    this.VillageOptions = [];
  }

  resetVillage(): void {
    this.VillageOptions = []
    this.validatorForm.get('village')?.reset();

    // Clear the dropdown options
    this.VillageOptions = [];
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  navigateTempleDetail(_id: string): void {
    this.router.navigate(["templedetailsview", _id])
      .then(() => {
        console.log("Navigation successful");
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
      })
      .catch(error => console.error("Navigation failed:", error));
  }



  village_id: any;


  // navigateTo(route: string): void {
  //   const ismemberin = localStorage.getItem('is_member') === 'true';
  //   if (ismemberin === false) {
  //     this.openmemberDialog();
  //   } else {

  //     this.router.navigate([route], { state: { village_id: this.village_id } });
  //   }

  // }

  navigateTo(route: string): void {

  const user = this.authenticationService.getCurrentUser();

  // 1️⃣ NOT LOGGED IN → LOGIN POPUP
  if (!user) {
    this.authenticationService.showLoginModal();
    return;
  }

  // 2️⃣ LOGGED IN BUT NOT MEMBER → MEMBER FORM
  const isMember = localStorage.getItem('is_member') === 'true';

  if (!isMember) {
    this.openmemberDialog();
    return;
  }

  // 3️⃣ LOGGED IN + MEMBER → NAVIGATE
  this.router.navigate([route], {
    state: { village_id: this.village_id }
  });
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

  onScroll(event: any) {
    const element = event.target;
    // Check if scrolled to bottom with a small buffer (e.g. 50px)
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      if (!this.isLoadingNextPage) { // Check if we are already loading a page
        console.log("Buffered Scroll to bottom detected!");
        this.loadMore();
      }
    }
  }




  imageUrl: string = 'https://sathayushstorage.blob.core.windows.net/sathayush/temple/0005a9ca-225e-4c8f-820e-31fb64718096/SRI%20NALLAMMA%20SWAMY%20TEMPLE.jpg';

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



  fetchallcatgeories() {
    this.templeCategoryService.GetallCategories().subscribe(
      (res: any[]) => {
        console.log(res, "API Response Data");
        this.categoryList = res.filter(category =>
          !['Buddist Temples', 'Gurudwara Temples', 'Jain Temples'].includes(category.name)
        );
        this.categoryList.push({
          _id: 'AllTemples',
          name: 'All Temples',
          shortname: 'AT',
          pic: '',
          desc: 'A collection of all temple categories.',
          created_at: new Date().toISOString()
        });

        const priorityNodes = ["All Temples", "Jyotirlingas", "Maha Sakthi peetas", "Asta Vinayaka", "Chardham", "Chota Chardham"];

        this.categoryList.sort((a, b) => {
          const aPriority = priorityNodes.includes(a.name) ? 0 : 1;
          const bPriority = priorityNodes.includes(b.name) ? 0 : 1;
          return aPriority !== bPriority ? aPriority - bPriority : a.name.localeCompare(b.name);
        });

        console.log(this.categoryList, "Filtered Categories for Dropdown");
      },
      (err: any) => console.error('Error loading category data:', err)
    );
  }







  filteredCategories() {
    this.isDropdownOpen = true;
    if (!this.searchText) {
      return this.categoryList;
    }
    return this.categoryList.filter(category =>
      category.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }


  toggleDropdown(state: boolean) {
    this.isDropdownOpen = state;
  }

  onSearchInput() {
    if (!this.searchText) {
      this.selectedCategoryId = '';
      this.applyFilters();
    }
    this.isDropdownOpen = true;

  }
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.querySelector('.dropdown')?.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }





  differentcategory: any[] = [];

  fetchMainCategory() {
    this.templeserviceservice.getmaincategorytemple().subscribe({
      next: (response) => {
        this.differentcategory = response;
        console.log("Fetched main categories:", this.differentcategory);
      },
      error: (error) => {
        console.error("Error fetching main categories:", error);
      }
    });
  }




  @ViewChild('districtDetailsTemplate') districtDetailsTemplate!: TemplateRef<any>;
  @ViewChild('mandalDetailsTemplate') mandalDetailsTemplate!: TemplateRef<any>;
  @ViewChild('stateDetailsTemplate') stateDetailsTemplate!: TemplateRef<any>;


  viewdistrict(districtId: string, dialogRef: MatDialogRef<any>) {
    this.dialog.closeAll();
    this.router.navigate(['/district-details', districtId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    }).catch(error => {
      console.error("Failed to navigate to district details:", error);
    });
  }

  viewMandal(districtId: string, dialogRef: MatDialogRef<any>) {
    this.dialog.closeAll();
    this.router.navigate(['/mandal-details', districtId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    }).catch(error => {
      console.error("Failed to navigate to district details:", error);
    });
  }




  screenWidth = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }



  getCountryLabel(value: string): string {
    const selected = this.CountryOptions.find((opt: any) => opt.value === value);
    return selected ? selected.label : '';
  }

  getStateLabel(value: string): string {
    const selected = this.StateOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }

  getDistrictLabel(value: string): string {
    const selected = this.DistrictOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }

  getMandalLabel(value: string): string {
    const selected = this.MandalOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }

  getVillageLabel(value: string): string {
    const selected = this.VillageOptions.find(opt => opt.value === value);
    return selected ? selected.label : '';
  }

  getLocationLabel(type: string, value: string | null): string {
    if (!value) return '';
    switch (type) {
      case 'country': return this.getCountryLabel(value);
      case 'state': return this.getStateLabel(value);
      case 'district': return this.getDistrictLabel(value);
      case 'mandal': return this.getMandalLabel(value);
      case 'village': return this.getVillageLabel(value);
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
      case 'state': this.clearState(); break;
      case 'district': this.clearDistrict(); break;
      case 'mandal': this.clearMandal(); break;
      case 'village': this.clearVillage(); break;
    }
  }

  hasAnyLocationSelected(): boolean {
    const { country, state, district, mandal, village } = this.validatorForm.value;
    return !!(country || state || district || mandal || village);
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



  viewstate(stateId: string, dialogRef: MatDialogRef<any>): void {
    this.dialog.closeAll();
    this.router.navigate(['/statewisetemples', stateId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    }).catch(error => {
      console.error("Failed to navigate to district details:", error);
    });
  }


goToState(stateId: string) {
  if (stateId) {
    this.router.navigate(['/statewisetemples', stateId]);
  }
}


selectedLocationData: any = null;
selectedLocationType: 'state' | 'district' | 'mandal' | 'village' | null = null;

viewSelectedLocation() {
  if (!this.selectedLocationData) return;

  const id = this.selectedLocationData._id;

  switch (this.selectedLocationType) {

    case 'state':
      this.navigateToState(id);
      break;

    case 'district':
      this.navigateToDistrict(id);
      break;

    case 'mandal':
      this.navigateToMandal(id);
      break;

    case 'village':
      this.navigateToVillage(id);
      break;
  }
}
navigateToState(stateId: string) {
  this.router.navigate(['/statewisetemples', stateId]);
}

navigateToDistrict(districtId: string) {
  this.router.navigate(['/district-details', districtId]);
}

navigateToMandal(mandalId: string) {
  this.router.navigate(['/mandal-details', mandalId]);
}

navigateToVillage(villageId: string) {
  this.router.navigate(['/village', villageId]);
}


clearSelectedLocation() {
  this.selectedLocationData = null;
  this.selectedLocationType = null;

  this.validatorForm.patchValue({
    state: null,
    district: null,
    mandal: null,
    village: null
  });
}



// onStateChange(stateId: string) {
//   const state = this.StateOptions.find(
//     s => s.value === stateId
//   );

//   if (state) {
//     this.selectedLocationType = 'state';
//     this.selectedLocationData = state;
//   }
// }

// onMandalChange(mandalId: string) {
//   const mandal = this.MandalOptions.find(
//     m => m.value === mandalId
//   );

//   if (mandal) {
//     this.selectedLocationType = 'mandal';
//     this.selectedLocationData = mandal;
//   }
// }
// onDistrictChange(districtId: string) {
//   const district = this.DistrictOptions.find(
//     d => d.value === districtId
//   );

//   if (district) {
//     this.selectedLocationType = 'district';
//     this.selectedLocationData = district;
//   }
// }



updateSelectedLocationFallback() {

  const villageId = this.validatorForm.value.village;
  const mandalId = this.validatorForm.value.mandal;
  const districtId = this.validatorForm.value.district;
  const stateId = this.validatorForm.value.state;

 if (mandalId) {
    this.onMandalChange(mandalId);
  }
  else if (districtId) {
    this.onDistrictChange(districtId);
  }
  else if (stateId) {
    this.onStateChange(stateId);
  }
  else {
    this.selectedLocationData = null;
    this.selectedLocationType = null;
  }
}
onMandalChange(mandalId: string | null) {

  // 🔹 If cleared → fallback
  if (!mandalId) {
    this.updateSelectedLocationFallback();
    return;
  }

  this.locationservice.getMandalDetails(mandalId).subscribe(
    (mandaldata) => {
      if (mandaldata) {
        this.selectedLocationType = 'mandal';
        this.selectedLocationData = mandaldata;
      }
    }
  );
}
onDistrictChange(districtId: string | null) {

  if (!districtId) {
    this.updateSelectedLocationFallback();
    return;
  }

  this.locationservice.getDistrictDetails(districtId).subscribe(
    (districtdata) => {
      if (districtdata) {
        this.selectedLocationType = 'district';
        this.selectedLocationData = districtdata;
      }
    }
  );
}
onStateChange(stateId: string | null) {

  if (!stateId) {
    this.updateSelectedLocationFallback();
    return;
  }

  this.locationservice.getstateDetails(stateId).subscribe(
    (statedata) => {
      if (statedata) {
        this.selectedLocationType = 'state';
        this.selectedLocationData = statedata;
      }
    }
  );
}


}