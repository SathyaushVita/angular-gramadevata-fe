import { Component ,ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visionmission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visionmission.component.html',
  styleUrl: './visionmission.component.css'
})
export class VisionmissionComponent {
  @ViewChild('progressBar', { static: false }) progressBar!: ElementRef<HTMLInputElement>;

  ads:any;
  currentIndex:number=0;

  constructor( private sanitizer: DomSanitizer){
    this.ads = [
      { videoUrl: this.sanitizeUrl('../../../assets/gramadevata_aboutus.mp4'), isVideo: true },
    ];
  }

//   sanitizeUrl(url: string): SafeResourceUrl {
//     return this.sanitizer.bypassSecurityTrustResourceUrl(url);
//   }

//   togglePlay(video: HTMLVideoElement) {
//     if (video.paused) {
//         video.play();
//     } else {
//         video.pause();
//     }
// }


sanitizeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}

togglePlay(video: HTMLVideoElement) {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

updateProgress(video: HTMLVideoElement) {
  if (this.progressBar && video.duration) {
    this.progressBar.nativeElement.value = ((video.currentTime / video.duration) * 100).toString();
  }
}

seekVideo(video: HTMLVideoElement, event: Event) {
  const target = event.target as HTMLInputElement;
  const seekTime = (Number(target.value) / 100) * video.duration;
  video.currentTime = seekTime;
}

formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

downloadDocument() {
  const link = document.createElement('a');
  link.href = 'assets/Gramadevata Foundation note.pdf';
  link.download = 'Gramadevata_Foundation_Note.pdf'; // Use .pdf extension
  link.click();
}


isExpanded = false;
  
  toggleReadMore() {
    this.isExpanded = !this.isExpanded;
  }


  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  
}
