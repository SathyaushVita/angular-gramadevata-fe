

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/eventservice/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeViewComponent } from '../tree-view/tree-view.component';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Subscription, interval, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location/location.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/userservice/user.service';
import { AuthenticationService } from '../../services/authenticationservice/authentication.service';
import { AddSpaceComponent } from '../add-space/add-space.component';
import { AddSpace1Component } from '../add-space1/add-space1.component';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms'; // <-- Required for ngModel


@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, TreeViewComponent, NzSelectModule, NzFormModule, ReactiveFormsModule, AddSpaceComponent, AddSpace1Component, NgxSpinnerModule,
    RouterModule, FormsModule
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  validatorForm!: FormGroup;
  categoryId: any;
  eventdata: any;
  picdata: any;
  eventcategorydata: any;
  selected = false;
  locationId = '';
  location: any;
  selectedCategoryId: any;
  selectedLocationId: any;
  currentPage: number = 1;
  subscription: Subscription = new Subscription();
  destroy$: Subject<void> = new Subject<void>();
  StateOptions: any[] = [];
  DistrictOptions: any[] = [];
  MandalOptions: any[] = [];
  VillageOptions: any[] = [];
  CountryOptions: any;
  activeTab: string = 'present';
  filtersVisible: boolean = true;
  UpComingeventdata: any;
  Completedeventdata: any;
  presenteventdata: any;




  constructor(
    private route: ActivatedRoute,
    private eventservice: EventService,
    private router: Router,
    private fb: FormBuilder,
    private locationservice: LocationService,
    private authenticationService: AuthenticationService,
    private userservice: UserService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.selectedCategoryId = this.route.snapshot.paramMap.get('id');
    // if (this.selectedCategoryId === 'AllEvents') {
    //   console.log(this.selectedCategoryId, "poiuy")
    //   this.selectedCategoryId = '';
    // }

    if (!this.selectedCategoryId || this.selectedCategoryId === 'AllEvents') {
      this.selectedCategoryId = '';
    }

    this.loadlocations()

    if (this.selectedCategoryId) {
      this.applyFilters();

    }
    this.fetchMainCategory();

  }

  updateTab(tab: string) {
    this.activeTab = tab;
  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  navigateEventdata(event: string): void {
    this.router.navigate(['detailviewevent', event])
  }


  onCategoryClick(event: NzFormatEmitEvent) {
    this.selectedCategoryId = event.node?.origin?.key;
    console.log(this.selectedCategoryId, "1111111111111")
    this.router.navigate(["events", this.selectedCategoryId])
    if (this.selectedCategoryId === 'AllEvents') {
      console.log(this.selectedCategoryId, "poiuy")
      this.selectedCategoryId = '';
    }


    this.applyFilters();

  }






  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = null;
    this.applyFilters();
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/ohm.jpg';
  }


  applyFilters() {
    this.currentPage = 1;
    this.eventdata = []; // Clear previous data
    this.loadFilteredTemples();
  }

  loadFilteredTemples() {
    this.spinner.show();
    if (this.selectedCategoryId && this.selectedLocationId) {
      this.eventservice.filterEvents(this.selectedCategoryId, this.selectedLocationId, this.currentPage).subscribe(
        (response) => {
          this.UpComingeventdata = [...this.eventdata, ...response.event_upcoming];
          this.Completedeventdata = [...this.eventdata, ...response.event_completed];
          this.presenteventdata = [...this.eventdata, ...response.event_ongoing];




          console.log(this.UpComingeventdata, "33333333333333333333");
          console.log(this.Completedeventdata, "33333333333333333333");
          this.spinner.hide();

        },
        (error) => {
          console.error('Error fetching filtered temples:', error);
          this.spinner.hide();

        }
      );
    } else if (this.selectedCategoryId) {
      this.eventservice.filterEvents(this.selectedCategoryId, '', this.currentPage).subscribe(
        (response) => {
          this.UpComingeventdata = [...this.eventdata, ...response.event_upcoming];
          this.Completedeventdata = [...this.eventdata, ...response.event_completed];
          this.presenteventdata = [...this.eventdata, ...response.event_ongoing];

          console.log(this.UpComingeventdata, "33333333333333333333");
          console.log(this.Completedeventdata, "33333333333333333333");
          this.spinner.hide();


        },
        (error) => {
          console.error('Error fetching filtered temples:', error);
          this.spinner.hide();

        }
      );
    } else if (this.selectedLocationId) {
      this.eventservice.filterEvents('', this.selectedLocationId, this.currentPage).subscribe(
        (response) => {
          this.UpComingeventdata = [...this.eventdata, ...response.event_upcoming];
          this.Completedeventdata = [...this.eventdata, ...response.event_completed];
          this.presenteventdata = [...this.eventdata, ...response.event_ongoing];

          console.log(this.UpComingeventdata, "33333333333333333333");
          console.log(this.Completedeventdata, "33333333333333333333");
          this.eventcategorydata = null
          this.spinner.hide();


        },
        (error) => {
          console.error('Error fetching filtered temples:', error);
          this.spinner.hide();

        }
      );
    }

    else {
      this.eventservice.GetallEvents().subscribe(
        (response) => {

          this.UpComingeventdata = [...this.eventdata, ...response.event_upcoming];
          this.Completedeventdata = [...this.eventdata, ...response.event_completed];
          this.presenteventdata = [...this.eventdata, ...response.event_ongoing];

          console.log(this.UpComingeventdata, "33333333333333333333");
          console.log(this.Completedeventdata, "33333333333333333333");
          console.log(this.eventdata, "Filtered Temples without Category or Location");
          this.eventcategorydata = null
          this.spinner.hide();

        },
        (error) => {
          console.error('Error fetching filtered temples:', error);
          this.spinner.hide();

        }
      );
    }
    this.eventservice.getByEventCategory(this.selectedCategoryId).subscribe(data => {
      this.eventcategorydata = data;
      console.log(this.eventcategorydata, "/////////////////////////");
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




    this.locationservice.countryevents('event').subscribe(
      (res) => {
        if (Array.isArray(res)) {
          this.CountryOptions = res.map((country: any) => ({
            label: country.name,
            value: country._id
          }));

          // Sort the countries alphabetically by label
          this.CountryOptions.sort((a: { label: string; value: any }, b: { label: string; value: any }) =>
            a.label.localeCompare(b.label)
          );

          // Find the country object with the label "India"
          const indiaIndex = this.CountryOptions.findIndex((option: { label: string; value: any }) => option.label === 'India');

          if (indiaIndex !== -1) {
            // Remove "India" from its current position
            const india = this.CountryOptions.splice(indiaIndex, 1)[0];

            // Insert "India" at the beginning of the array
            this.CountryOptions.unshift(india);
          }

          const Country = this.CountryOptions.find((option: { label: string; value: any }) => option.label === 'India');

          // Optional: Set the default country if found
          if (Country) {
            this.validatorForm.controls['country'].setValue(Country.value);
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




  sharepage() {
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

  clearState(): void {
    console.log("State cleared");
    this.validatorForm.get('state')?.setValue(null); // Clear state
    this.selectedLocationId = this.validatorForm.get('country')?.value || null;
    if (this.selectedLocationId) {
      this.applyFilters();
    }
  }
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

  differentcategory: any[] = [];

  fetchMainCategory() {
    this.eventservice.getEventCategory().subscribe({
      next: (response: any[]) => {
        // Prepend 'All Events' option
        this.differentcategory = [{ _id: 'AllEvents', name: 'All Events' }, ...response];
        console.log("Fetched main categories:", this.differentcategory);

        // Ensure the selectedCategoryId maps to a valid option
        if (this.selectedCategoryId) {
          const exists = this.differentcategory.find(cat => cat._id === this.selectedCategoryId);
          if (!exists) this.selectedCategoryId = '';
        }
      },
      error: (error) => {
        console.error("Error fetching main categories:", error);
      }
    });
  }

  onCategoryChange(selectedId: string) {
    console.log("Selected category:", selectedId);

    if (selectedId === 'AllEvents') {
      this.selectedCategoryId = '';
    } else {
      this.selectedCategoryId = selectedId;
    }

    // Navigate to keep URL in sync
    this.router.navigate(["events", this.selectedCategoryId || 'AllEvents']);

    // Apply any filter logic
    this.applyFilters();
  }


}

