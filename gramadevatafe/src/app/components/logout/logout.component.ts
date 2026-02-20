import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [   MatDialogModule,
    MatButtonModule,],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {


  constructor(private dialogRef: MatDialogRef<LogoutComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // User clicked 'Yes'
  }

  onCancel(): void {
    this.dialogRef.close(false); // User clicked 'No'
  }

}
