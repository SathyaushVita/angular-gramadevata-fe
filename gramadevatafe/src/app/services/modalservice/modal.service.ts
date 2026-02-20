// import { Injectable } from '@angular/core';
// import { ComponentType } from '@angular/cdk/portal';
// import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';


// @Injectable({
//   providedIn: 'root'
  
// })
// export class ModalService {

  
//   private currentModal: NzModalRef | null = null;

//   // data =null;
//   data: any = null;


  

//   constructor(private nzModalService : NzModalService) { }

//   openModal(component: ComponentType<any>, title='', data=undefined): void {

//     this.data = data
    
    
//     // Close the current modal if it exists
//     this.closeCurrentModal();
//     // Open the new modal
//     this.currentModal = this.nzModalService.create({
//       nzTitle: title,
//       nzFooter: null,
//       nzCentered:true,
//       nzMaskClosable:false,
//       nzContent: component,
//       nzOnCancel: () => {
//         this.closeCurrentModal();
//       }
//     });
//   }

//   public closeCurrentModal(): void {
//     if (this.currentModal) {
//       this.currentModal.close();
//       this.currentModal = null;
//     }
//   }
// }



import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private currentModal: NzModalRef | null = null;
  data: any = null;

  constructor(private nzModalService: NzModalService) { }

  openModal(component: ComponentType<any>, title = '', data: any = undefined): void {
    this.data = data;
    
    // Close the current modal if it exists
    this.closeCurrentModal();
    // Open the new modal
    this.currentModal = this.nzModalService.create({
      nzTitle: title,
      nzFooter: null,
      nzCentered: true,
      nzMaskClosable: false,
      nzContent: component,
      nzOnCancel: () => {
        this.closeCurrentModal();
      }
    });
  }

  public closeCurrentModal(): void {
    if (this.currentModal) {
      this.currentModal.close();
      this.currentModal = null;
    }
  }
}
