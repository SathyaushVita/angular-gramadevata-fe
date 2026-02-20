import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-share-temple',
  standalone: true,
  imports: [],
  templateUrl: './share-temple.component.html',
  styleUrl: './share-temple.component.css'
})
export class ShareTempleComponent {
  templeName: any;
  templeDescription: any;
  shareUrl: any;
  imageUrl: any;

  constructor(private meta: Meta) {}


  async updateMetaTags(temple: any): Promise<void> {
    if (!temple) {
      console.error('Temple data is missing for meta tag updates');
      return;
    }

    this.templeName = temple.name || 'Temple';
    this.templeDescription = temple.desc || 'Check out this amazing temple!';
    this.shareUrl = `${window.location.origin}/getbytemples/${temple._id}`;
    this.imageUrl =  window.location.href;

    try {
      if (temple.image_location) {
        const imageResponse = await fetch(temple.image_location);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from ${temple.image_location}`);
        }
        const imageBlob = await imageResponse.blob();
        this.imageUrl = URL.createObjectURL(imageBlob); // Convert blob to usable URL
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('Using default image due to error:', errorMessage);
    }

    // Update Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.templeName });
    this.meta.updateTag({ property: 'og:description', content: this.templeDescription });
    this.meta.updateTag({ property: 'og:url', content: this.shareUrl });
    this.meta.updateTag({ property: 'og:image', content: this.imageUrl });

    // Update Twitter meta tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: this.templeName });
    this.meta.updateTag({ name: 'twitter:description', content: this.templeDescription });
    this.meta.updateTag({ name: 'twitter:image', content: this.imageUrl });

    console.log('Meta tags updated successfully');
  }

}
