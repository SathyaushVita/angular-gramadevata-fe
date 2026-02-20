import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { state } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../../services/userservice/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-getmember',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getmember.component.html',
  styleUrl: './getmember.component.css'
})
export class GetmemberComponent {

  member:any;
  userid: any;
  account_type: any;
  IsPrivate: any;
  IsPublic: any;
  user: any;

  constructor(
    private userservice:UserService,
    private router:Router,
    public dialogRef: MatDialogRef<GetmemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  handleProfileImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profile1.webp';
  }
  
  ngOnInit(): void {
    this.member = this.data.member;
    console.log(this.member, "11111111111");
    
    this.userid = localStorage.getItem('user');
    this.userservice.profiledata(this.member).subscribe(
      data => {
        this.member = data;
        this.account_type = data.account_type;
        this.user = data.id;
        console.log(this.user, "ewrtg");
    
        if (this.userid === this.user) {
          console.log("aqswfrgh");
          this.IsPublic = true;  // If the current user matches, the profile is public
        } else {
          this.IsPrivate = (this.account_type === 'PRIVATE');
          this.IsPublic = (this.account_type === 'PUBLIC');
        }
    
        console.log(this.IsPrivate, "IsPrivate");
        console.log(this.IsPublic, "IsPublic");
      }
    );
    
  }

  navigateToProfile(id:any):void{
    this.router.navigate(['userprofile',id]);
    this.dialogRef.close()
  }
}
