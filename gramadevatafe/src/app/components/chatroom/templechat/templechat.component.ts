import { Component } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chatservice/chat.service';
import { CommonModule } from '@angular/common';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../services/authenticationservice/authentication.service';

@Component({
  selector: 'app-templechat',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './templechat.component.html',
  styleUrl: './templechat.component.css'
})
export class TemplechatComponent {


  chatform!:FormGroup;
  templeId:any;
  membersdata: any;
  chatdata:any;
  chat:any;
  chatBox: any;


  constructor(
    private route:ActivatedRoute,
    private chatservice:ChatService,
    private fb:FormBuilder,
    private authenticationService:AuthenticationService,
    private router:Router
  ){ }


  ngOnInit():void{
    this.fetchchatdata();
    this.fetchmembers();
    this.scrollToBottom();
   


    this.chatform= this.fb.group({
     
      message:['',Validators.required],
      

  })

    

    
  }

  fetchmembers():void{
    this.templeId = this.route.snapshot.paramMap.get("id")
    console.log("villageid",this.templeId)

    this.chatservice.GetTempleConnections(this.templeId).subscribe(data =>{
      this.membersdata = data.temple
      console.log(this.membersdata,"cccccccc")
    })
  }



  fetchchatdata():void{

    this.templeId = this.route.snapshot.paramMap.get("id")
    this.chatservice.getTempleChat(this.templeId).subscribe(
      data =>{
        this.chatdata = data.temple_messages
        this.scrollToBottom();
      }
    )
  }

  addchat(): void {
    const messageFormData = this.chatform.value;
    console.log("12345");
    this.chat = {
      message: messageFormData.message,
      user: localStorage.getItem('user'),
      temple: this.route.snapshot.paramMap.get("id")
    };

    this.chatservice.postchat(this.chat).subscribe(
      data => {
        console.log("Chat added");
        // Update the chat data and scroll to bottom
        // this.chatdata.push({
        //   isSent: true,
        //   user: { name: 'Me' },
        //   message: this.chat.message,
        //   posted_time_ago: 'Just now'
        // });
        this.fetchchatdata();
        this.chatform.reset();
        this.scrollToBottom();
      }
    );
  }

  scrollToBottom(): void {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }



}
