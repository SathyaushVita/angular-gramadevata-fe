import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root', // or provide the module where you want to use it
})



export class NotificationHelper {
  constructor(private notification: NzNotificationService) { }

  showSuccessNotification(title: string, message: string = ''): void {
    console.log("111111111111111111")
    this.notification.success(
      title,
      message,
      {
        nzPlacement: 'topRight',
        nzStyle: {
          margin: '20px',
        }
      }
    );
  }

  showErrorNotification(title: string, message: string = '') {
    this.notification.error(
      title,
      message,
      {
        nzPlacement: 'topRight',
        nzStyle: {
          margin: '20px',
        }
      }
    )
  }

}
