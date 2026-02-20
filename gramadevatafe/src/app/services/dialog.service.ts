import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type DialogType = 'pooja' | 'bloodbank' | 'vet' | 'operator';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() { }

   private dialogSubject = new Subject<DialogType>();
  dialog$ = this.dialogSubject.asObservable();

  open(type: DialogType) {
    this.dialogSubject.next(type);
  }
}
