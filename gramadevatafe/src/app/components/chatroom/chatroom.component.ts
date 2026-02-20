import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chatservice/chat.service';
import { CommonModule } from '@angular/common';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent {

  chatform!:FormGroup;
  villageId:any;
  membersdata: any;
  chatdata:any;
  chat:any;
  chatBox: any;
  villageName: any;


  constructor(private route:ActivatedRoute,private chatservice:ChatService,private fb:FormBuilder){ }


  ngOnInit():void{
    this.fetchchatdata();
    this.fetchmembers();
    this.scrollToBottom();
   


    this.chatform= this.fb.group({

      message:['',Validators.required],

  })

   
  }

  fetchmembers():void{
    this.villageId = this.route.snapshot.paramMap.get("id")
    console.log("villageid",this.villageId)

    this.chatservice.GetConnections(this.villageId).subscribe(data =>{
      this.membersdata = data.village
      console.log(this.membersdata,"cccccccc")
      this.villageName = this.membersdata[0].village.name
      console.log(this.villageName,"vvvvvvvvvvvv")
    })
  }



  // fetchchatdata():void{

  //   this.villageId = this.route.snapshot.paramMap.get("id")
  //   this.chatservice.getChat(this.villageId).subscribe(
  //     data =>{
  //       this.chatdata = data
  //       this.scrollToBottom();
  //     }
  //   )
  // }


  fetchchatdata(): void {
    const villageId = this.route.snapshot.paramMap.get("id");
    if (!villageId) {
      console.error("Village ID is null or undefined");
      return;
    }
    this.villageId = villageId; 
    this.chatservice.getChat(this.villageId).subscribe({
      next: (data) => {
        console.log("Fetched chat data successfully");
        this.chatdata = data?.village_messages || []; 
        console.log("Chat Messages:", this.chatdata);
        this.scrollToBottom();
      },
      error: (error) => {
        console.error("Error fetching chat data:", error);
      }
    });
  }








  // addchat(): void {
  //   const messageFormData = this.chatform.value;
  //   console.log("12345");
  //   this.chat = {
  //     message: messageFormData.message,
  //     user: localStorage.getItem('user'),
  //     village: this.route.snapshot.paramMap.get("id")
  //   };

  //   this.chatservice.postchat(this.chat).subscribe(
  //     data => {
  //       console.log("Chat added");
      
  //       this.fetchchatdata();
  //       this.chatform.reset();
  //       this.scrollToBottom();
  //     }
  //   );
  // }

  addchat(): void {
    if (this.chatform.valid) {  // Check if the form is valid
      const messageFormData = this.chatform.value;
      console.log("12345");
  
      this.chat = {
        message: messageFormData.message,
        user: localStorage.getItem('user'),
        village: this.route.snapshot.paramMap.get("id")
      };
  
      this.chatservice.postchat(this.chat).subscribe(
        data => {
          console.log("Chat added");
          this.fetchchatdata();
          this.chatform.reset();
          this.scrollToBottom();
        },
        error => {
          console.error("Error adding chat", error);
        }
      );
    } else {
      console.log("Form is invalid");  // If the form is not valid, log a message or show an error
    }
  }
  

  scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}
