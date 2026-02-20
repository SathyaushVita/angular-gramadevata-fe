// locations.component.ts
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../services/location/location.service';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [NzFormModule, NzSelectModule, CommonModule, ReactiveFormsModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent {
  @Input() initialStateData: any[] = []; // Input property

  locationForm: FormGroup;
  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];
  villages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      state: [null],
      district: [null],
      block: [null],
      village: [null]
    });
  }

  ngOnInit(): void {
    if (this.initialStateData.length) {
      this.states = this.initialStateData; // Use initial data if available
    } else {
      this.loadStates();
    }
  }

  loadStates(): void {
    this.locationService.getAllStates().subscribe(
      (data: any[]) => {
        this.states = data;
      },
      (error: any) => console.error('Error fetching states:', error)
    );
  }

  onStateChange(value: any): void {
    this.locationService.getdistricts(value).subscribe(
      (data: any[]) => {
        this.districts = data;
        this.locationForm.get('district')?.setValue(null);
        this.locationForm.get('block')?.setValue(null);
        this.locationForm.get('village')?.setValue(null);
      },
      (error: any) => console.error('Error fetching districts:', error)
    );
  }

  onDistrictChange(value: any): void {
    this.locationService.getblocks(value).subscribe(
      (data: any[]) => {
        this.blocks = data;
        this.locationForm.get('block')?.setValue(null);
        this.locationForm.get('village')?.setValue(null);
      },
      (error: any) => console.error('Error fetching blocks:', error)
    );
  }

  onBlockChange(value: any): void {
    this.locationService.getvillages(value).subscribe(
      (data: any[]) => {
        this.villages = data;
        this.locationForm.get('village')?.setValue(null);
      },
      (error: any) => console.error('Error fetching villages:', error)
    );
  }
}
