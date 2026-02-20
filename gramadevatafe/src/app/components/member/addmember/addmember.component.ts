
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators ,FormControl, FormArray} from '@angular/forms';
import { MemberService } from '../../../services/memberservice/member.service';
import { your_role_in_our_village, enumToMap } from '../../../enums/member_role';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { UserService } from '../../../services/userservice/user.service';
import { SharedService } from '../../../services/sharedservice/shared.service';
import { NotificationHelper } from '../../commons/notification';



@Component({
  selector: 'app-addmember',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NzInputModule,NzFormModule],
  templateUrl: './addmember.component.html',
  styleUrl: './addmember.component.css'
})
export class AddmemberComponent implements OnInit {
  memberform!: FormGroup;
  ConnectForm!:FormGroup;
  villageroleoptions: any;
  villageid: any;
  connectdata:any;
  isMember=false;
  isMemberIn=false
  full_name: any;
  userId: any;
  heading: string;
  

  constructor(
    private memberservice: MemberService,
    private fb: FormBuilder,
    protected userservice:UserService,
    private sharedservice:SharedService,private notificationHelper: NotificationHelper,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddmemberComponent>
    
  ) {
    this.villageid = data.villageid; 
     // Get the heading passed from the dialog
     this.heading = data.heading || 'Member Registration'; 
    console.log(this.villageid,"ffffsfd")
  }



  ngOnInit(): void {
    this.getProfileData();
    this.initializeForm();
    this.connectionsForm();
    this.isMemberUser();
  }


  get selectedCheckboxes(): FormArray {
    return this.memberform.get('belongs_as') as FormArray;
  }


  isMemberUser() {
    const isMemberIn = localStorage.getItem("is_member") === "true";
  if (isMemberIn) {
    this.isMemberIn = true
  } else {
    this.isMemberIn = false
  } 
}


  checkboxes = [
    {
      label: 'I was born in this village',
      value: 'BORN_HERE',
      formControl: new FormControl(false),
    },
    {
      label: 'I was Boughtup here',
      value: 'BOUGHTUP_HERE',
      formControl: new FormControl(false),
    },
    {
      label: 'Currently I am living',
      value: 'EDUCATED_HERE',
      formControl: new FormControl(false),
    },
    {
      label:" Father home town",
      value: 'FATHERS_VILLAGE',
      formControl: new FormControl(false),
    },
    {
      label: "Mother home town",
      value: 'MOTHERS_VILLAGE',
      formControl: new FormControl(false),
    },
    {
      label: "GrandFather Village/Area",
      value: 'GRAND_FATHERS_VILLAGE',
      formControl: new FormControl(false),
    },
    {
      label: "GrandMother Vilage/Area",
      value: 'GRAND_MOTHERS_VILLAGE',
      formControl: new FormControl(false),
    },
    {
      label: "In Laws Village/Area",
      value: 'IN_LAWS_VILLAGE',
      formControl: new FormControl(false),
    },
    // {
    //   label: 'Other’s',
    //   value: 'OTHER',
    //   formControl: new FormControl(false),
    // },
  ];


  // get selectedCheckboxes(): FormArray {
  //   return this.memberRegistrationForm.get('belongs_as') as FormArray;
  // }

  connectionsForm(): void {
    this.ConnectForm = this.fb.group(
      {
      belongs_as: this.fb.array([]),
      description: [''],
      village: this.villageid, 
      user : localStorage.getItem('user')
      }
    );
  }

  initializeForm(): void {
    this.memberform = this.fb.group({
      full_name: ["", Validators.required,Validators],


      // surname: ['', Validators.required],
      father_name: ['', Validators.required],


      contact_number: ['', [Validators.required,Validators.pattern('^[0-9]{10}$'),],],
      // dob: ['',Validators.required],
      gender: [null,Validators.required],
      belongs_as: this.fb.array([]),
      description: [''],
      // type:'MEMBER',
      type: [this.data?.type || 'MEMBER'], // If data.type is missing, fallback to MEMBER

      is_member:"true",
      
      village: this.villageid,
      user : localStorage.getItem('user'),
      account_type:[null,Validators.required],
      email:['',Validators.required],
      surname:['',Validators.required],
      profession: this.fb.array([])
      
    });
    
  }


  // get professionArray() {
  //   return this.memberform.get('profession') as FormArray;
  // }
  



  // onProfessionChange(event: any) {
  //   const formArray: FormArray = this.professionArray;
  
  //   // Clear existing selections
  //   formArray.clear();
  
  //   if (event.target.checked) {
  //     formArray.push(this.fb.control(event.target.value));
  //   }
  // }
  get professionArray(): FormArray {
  return this.memberform.get('profession') as FormArray;
}

onProfessionChange(event: any): void {
  const formArray = this.professionArray;
  const value = event.target.value;
  const checked = event.target.checked;

  if (checked) {
    if (!formArray.value.includes(value)) {
      formArray.push(this.fb.control(value));
    }
  } else {
    const index = formArray.controls.findIndex(ctrl => ctrl.value === value);
    if (index !== -1) {
      formArray.removeAt(index);
    }
  }

  // Optionally reset the otherProfessionControl if "others" is deselected
  if (value === 'others' && !checked) {
    this.otherProfessionControl.reset();
  }
}
otherProfessionControl = new FormControl('');


  get contactNumber() {
    return this.memberform.get('contact_number');
  }


  getProfileData() {
    this.userId = localStorage.getItem('user');
    this.userservice.profiledata(this.userId).subscribe((response: any) => {
      this.memberform.patchValue({
        full_name: response.full_name,
        father_name: response.father_name,
        gender: response.gender,
        // dob: response.dob,
        contact_number: response.contact_number,
        email: response.email,
        marital_status:response.marital_status,
        gotram:response.gotram,
        siblings:response.siblings,
        children:response.children,
        wife:response.wife,
        husband:response.husband,
        account_type:response.account_type,
        


      });

      
    });
  }


 

  onSubmit(): void {
    if (localStorage.getItem('is_member') === 'false') {

      const userId = localStorage.getItem('user');
      console.log(userId, "uuuuuuuuuuuuu");
      const { belongs_as, description, village, user, ...memberData } = this.memberform.value;
      const { full_name, father_name, contact_number, dob, ...connectdata } = this.memberform.value;
  
      this.memberservice.AddMember(memberData, userId).subscribe(
        response => {
          console.log('Member added successfully:', response);
          this.notificationHelper.showSuccessNotification('Member added successfully', '');

          localStorage.setItem('is_member', 'true');
          this.full_name = this.memberform.get('full_name')?.value || ''; 
          localStorage.setItem('full_name', this.full_name);
        window.location.reload();   // 👈 reload after navigation


          // this.userservice.isMemberIn = true
          this.memberform.reset();
          this.dialogRef.close();

          // this.memberservice.refreshvillagedata();
          
          this.memberservice.connect(connectdata).subscribe(
            response => {
              console.log(response);
              this.sharedservice.fetchVillagedata()
              this.sharedservice.fetchByTempleData()
            },
            error => {
              console.error('Error connecting:', error);
          this.notificationHelper.showErrorNotification('Member added Failed');
            }
          );
        },
        error => {
          console.error('Error adding member:', error);
          this.notificationHelper.showErrorNotification('Please fill all required fields');
          

          this.memberform.markAllAsTouched();

          // Handle add member error here
        }
      );
      
    } else {
      // const connectdata = this.ConnectForm.value;
      const connectdata = {
        village: this.memberform.get('village')?.value,
        user: this.memberform.get('user')?.value,
        type: this.memberform.get('type')?.value,
        connected_as: this.memberform.get('type')?.value // if your API uses this
      };
      
      this.memberservice.connect(connectdata).subscribe(
        response => {
          console.log(response);
          this.ConnectForm.reset();
          this.dialogRef.close();
          this.sharedservice.fetchVillagedata()
          // this.memberservice.refreshvillagedata();
        },
        error => {
          console.error('Error connecting:', error);
          // Handle connection error here
        }
      );
    }
  }
  

  preventLeadingSpace(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;

  if (event.key === ' ' && input.selectionStart === 0) {
    event.preventDefault(); // 🚫 prevent first space
  }
}
validateNameInput(event: KeyboardEvent) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  const key = event.key;

  // Allow control keys (Backspace, Delete, Arrow keys, Tab)
  if (
    key === 'Backspace' ||
    key === 'Delete' ||
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'Tab'
  ) {
    return;
  }

  // Block numbers and special characters
  if (!/^[A-Za-z ]$/.test(key)) {
    event.preventDefault();
    return;
  }

  // Block leading space
  if (key === ' ' && value.length === 0) {
    event.preventDefault();
    return;
  }

  // Block double space
  if (key === ' ' && value.endsWith(' ')) {
    event.preventDefault();
    return;
  }
}


}
