import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
// import { Router, NavigationEnd } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
declare let gtag: Function;


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule, HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gramadevatafe';



 constructor(private router: Router) {}

// ngOnInit() {
//   this.router.events.subscribe(event => {
//     if (event instanceof NavigationEnd) {
//       const path = event.urlAfterRedirects;

//       // ✅ Only track if user is on the home page
//       if (path === '/' || path === '/home') {
//         gtag('config', 'G-GN4626TM62', {
//           page_path: path
//         });
//       }
//     }
//   });
// }



 ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event) => {

        if (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home') {
          gtag('event', 'page_view', {
            page_title: 'Home Page',
            page_path: event.urlAfterRedirects
          });
        }

      });


      
  }

  
}
