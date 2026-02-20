import { Injectable } from '@angular/core';
import { BASE_URL, URL } from '../../constants';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../../components/signup/signup.component';
import { UserService } from '../userservice/user.service';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn = false;

  constructor(private httpClient: HttpClient,
     private router:Router,
    private dialog:MatDialog,
    private userservice:UserService,

  ) {
    let user = localStorage.getItem('user');
    this.isLoggedIn = user != null;
   }




   isLoggedInUser() {
    return this.isLoggedIn;
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userservice.isMemberIn = false;
    this.userservice.isPujariIn =false;
    this.userservice.isvolunary = false;
    this.router.navigate(['home'])
    localStorage.removeItem('profile_pic');

     
    
  }

  // showLoginModal(): void {
  //   this.openSignupDialog();
  // }

    showLoginModal() {
    return this.openSignupDialog();
  }




    openSignupDialog() {
    return this.dialog.open(SignupComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop'
    });
  }

  getCurrentUser() {
    return localStorage.getItem('user');
  }


  refreshToken(refreshToken:any) {
    return this.httpClient.post(URL + 'token/refresh', {
      refresh: refreshToken,
    });
  }


  
}
