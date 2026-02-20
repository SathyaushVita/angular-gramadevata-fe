import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MemberService } from '../../services/memberservice/member.service';
import { UserService } from '../../services/userservice/user.service';
import { SharedService } from '../../services/sharedservice/shared.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-updateroots',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './updateroots.component.html',
  styleUrl: './updateroots.component.css'
})
export class UpdaterootsComponent {

  userId:any;


  updateProfileForm!: FormGroup;

  constructor(
    private fb:FormBuilder,
    private userservice: UserService,
    private sharedservice: SharedService,
    private router: Router,
    public dialogRef: MatDialogRef<UpdaterootsComponent>,



  ){}

  ngOnInit():void{
    this.RootsUpdateForm();
    this.getProfileData();
 

  }

  RootsUpdateForm(){

    this.updateProfileForm = this.fb.group({
      
      // full_name: ['', Validators.required],
      // gender: ['', Validators.required],
      // account_type: ['', Validators.required],
      father_name: [''],
      // profile_pic: [''],
      // dob: ['', Validators.required],
      // contact_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      // family_images: [''],
      // email: ['', [Validators.required, Validators.email]],
      mother_name: [''],
      paternal_grandmother_name: [''],
      paternal_grandfather_name: [''],
      paternal_great_grandfather_name: [''],
      paternal_great_grandmother_name: [''],
      paternal_grandmother_father_name: [''],
      paternal_grandmother_mother_name: [''],
      maternal_grandfather_name: [''],
      maternal_grandmother_name: [''],
      maternal_great_grandfather_name: [''],
      maternal_great_grandmother_name: [''],
      maternal_grandmother_father_name: [''],
      maternal_grandmother_mother_name: ['']
    });
  }




  getProfileData() {
    this.userId = localStorage.getItem('user');
    this.userservice.profiledata(this.userId).subscribe((response: any) => {
      this.updateProfileForm.patchValue({
        father_name: response.father_name,
        mother_name: response.mother_name,
        paternal_grandmother_name: response.paternal_grandmother_name,
        paternal_grandfather_name: response.paternal_grandfather_name,
        paternal_great_grandfather_name: response.paternal_great_grandfather_name,
        paternal_great_grandmother_name:response.paternal_great_grandmother_name,
        paternal_grandmother_father_name:response.paternal_grandmother_father_name,
        paternal_grandmother_mother_name:response.paternal_grandmother_mother_name,
        maternal_grandfather_name:response.maternal_grandfather_name,
        maternal_grandmother_name:response.maternal_grandmother_name,
        maternal_great_grandfather_name:response.maternal_great_grandfather_name,
        maternal_great_grandmother_name:response.maternal_great_grandmother_name,
        maternal_grandmother_father_name:response.maternal_grandmother_father_name,
        maternal_grandmother_mother_name:response.maternal_grandmother_mother_name,

        email: response.email,
      });

      
    });
  }




  updateProfile() {
    if (this.updateProfileForm.valid) {
      console.log('Form is valid', this.updateProfileForm.value);
      this.userservice.updateroots(this.updateProfileForm.value, this.userId).subscribe(
        (response: any) => {
          this.sharedservice.fetchByProfiledata();
          this.router.navigate(['/userprofile', this.userId]);
          this.dialogRef.close(); 

        },
        (error: any) => {
          console.error('Failed to update profile!', error);
          this.updateProfileForm.markAllAsTouched();
        }
      );
    } else {
      console.log('Form is invalid', this.updateProfileForm.errors);
      this.updateProfileForm.markAllAsTouched();
    }
  }
  


}
