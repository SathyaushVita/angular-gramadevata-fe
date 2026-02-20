

import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, AfterViewInit, ElementRef } from '@angular/core';






@Component({
  selector: 'app-addspaceright',
  standalone: true,
  imports: [CommonModule,AddspacerightComponent],
  templateUrl: './addspaceright.component.html',
  styleUrl: './addspaceright.component.css'
})
export class AddspacerightComponent {

  showAddSpace: boolean = true;
  showAddSpaces: boolean = true;
  timeoutId: any;


  constructor(private sanitizer: DomSanitizer,private elRef: ElementRef) {


  }



  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  video: HTMLVideoElement | null = null;


  ngAfterViewInit(): void {
    const videos = this.elRef.nativeElement.querySelectorAll('video');

    videos.forEach((video: HTMLVideoElement) => {
      video.muted = true;

      video.addEventListener('mouseover', () => {
        this.pauseAllVideosExcept(video, videos);  
        video.muted = false;  
      });

      video.addEventListener('mouseout', () => {
        video.muted = true;  
      });
    });
  }

  pauseAllVideosExcept(currentVideo: HTMLVideoElement, videos: NodeListOf<HTMLVideoElement>): void {
    videos.forEach((video: HTMLVideoElement) => {
      if (video !== currentVideo) {
        video.pause(); 
      }
    });
  }
}