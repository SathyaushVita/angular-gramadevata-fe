import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/userservice/user.service';
import { ChatService } from '../../services/chatservice/chat.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebscoketService } from '../../services/webscoketservice/webscoket.service';

@Component({
  selector: 'app-chatgroups',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chatgroups.component.html',
  styleUrl: './chatgroups.component.css'
})
export class ChatgroupsComponent {
  chatform!: FormGroup;
  connnectionsdata: any;
  userId: any;
  templeconnections: any;
  villageconnections: any;
  chat: any;
  villageId: any;
  chatdata: any = [];
  templechatdata: any = [];
  selectedVillageName: any;
  selectedTemplename: any;
  selectedTempleImagelocation: any;
  templeId: any;

  private villageChatSocket!: WebSocketSubject<any>;
  private templeChatSocket!: WebSocketSubject<any>;

  constructor(
    private chatservice: ChatService,
    private wsService: WebscoketService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  // ngOnInit() {
  //   this.FetchConnections();
  //   this.chatform = this.fb.group({
  //     message: ['', Validators.required],
  //   });
  // }
  
  ngOnInit() {
    this.userId = localStorage.getItem('user_id') || ''; 
    this.route.paramMap.subscribe(params => {
      const chatId = params.get('_id'); 
      console.log("Navigated to chat group:", chatId);
    });
    this.FetchConnections();
      this.chatform = this.fb.group({
        message: ['', Validators.required],
      });

  }
  

 village = ''
  // ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     // this.village = params['village'];
  //     // this.currentUser = params['user'];
  //     this.wsService.connect(this.village);
  //     this.fetchchatdata();
  
  //     // Fetch messages every 5 seconds
  //     setInterval(() => {
  //       this.fetchchatdata();
  //     }, 1000);
  //   });
  
  //   // WebSocket real-time update
  //   this.wsService.onMessage().subscribe((msg) => {
  //     console.log("New WebSocket message:", msg);
  //     // this.messages = [...this.messages, msg];
  //   });
  // }

  // connectVillageWebSocket(villageId: string) {
  //   if (this.villageChatSocket) {
  //     this.villageChatSocket.unsubscribe();
  //   }
  //   this.villageChatSocket = new WebSocketSubject(`ws://templesofworld.com/api/chatrooms/${villageId}/`);
  //   this.villageChatSocket.subscribe({
  //     next: (message) => {
  //       if (message.type === 'chat_message') {
  //         this.chatdata.push(message);
  //       }
  //     },
  //     error: (err) => console.error('WebSocket error', err),
  //     complete: () => console.warn('WebSocket connection closed'),
  //   });
  // }

  connectVillageWebSocket(villageId: string, userId: string) {
    if (!villageId || !userId) {
      console.error("Village ID or User ID is missing!", villageId, userId);
      return;
    }
  
    if (this.villageChatSocket) {
      this.villageChatSocket.unsubscribe();
    }
  
    const websocketUrl = `ws://templesofworld.com/ws/chat/${villageId}/${userId}/`;
    // const websocketUrl = `ws://127.0.0.1:8000/ws/chat/${villageId}/${userId}/`;
    console.log("Connecting to WebSocket:", websocketUrl);
  
    this.villageChatSocket = new WebSocketSubject(websocketUrl);
    
    this.villageChatSocket.subscribe({
      next: (message) => {
        if (message.type === 'chat_message') {
          this.chatdata.push(message);
        }
      },
      error: (err) => console.error('WebSocket error', err),
      complete: () => console.warn('WebSocket connection closed'),
    });
  }
  
  

  connectTempleWebSocket(templeId: string) {
    if (this.templeChatSocket) {
      this.templeChatSocket.unsubscribe();
    }
    this.templeChatSocket = new WebSocketSubject(`ws://yourserver.com/ws/temple_chat/${templeId}/`);
    this.templeChatSocket.subscribe({
      next: (message) => {
        if (message.type === 'chat_message') {
          this.templechatdata.push(message);
        }
      },
      error: (err) => console.error('WebSocket error', err),
      complete: () => console.warn('WebSocket connection closed'),
    });
  }

  onClickVillage(village: any): void {
    this.chatdata = [];
    this.villageId = village._id;
    this.selectedVillageName = village.name;

    this.fetchchatdata();
    this.connectVillageWebSocket(this.villageId, this.userId); // Connect to WebSocket
  }

  onClickTemple(temple: any): void {
    this.templechatdata = [];
    this.templeId = temple._id;
    this.selectedTemplename = temple.name;
    this.selectedTempleImagelocation = temple.image_location;

    this.fetchTemplechatdata();
    this.connectTempleWebSocket(this.templeId); // Connect to WebSocket
  }

  FetchConnections(): void {
    this.userId = localStorage.getItem('user');
    this.chatservice.GetUserConnections(this.userId).subscribe((data) => {
      this.connnectionsdata = data;
      this.villageconnections = this.connnectionsdata.village;
      this.templeconnections = this.connnectionsdata.temple;
    });
  }

  fetchchatdata(): void {
    this.chatservice.getChat(this.villageId).subscribe((data) => {
      this.chatdata = data.data;
    });
  }

  fetchTemplechatdata(): void {
    this.chatservice.getTempleChat(this.templeId).subscribe((data) => {
      this.templechatdata = data.data;
    });
  }
  // addchat(): void {
  //   if (this.chatform.valid) {
  //     const messageFormData = this.chatform.value;
  
  //     this.chat = {
  //       message: messageFormData.message,
  //       user: localStorage.getItem('user') || 'Anonymous', // Fallback for user
  //       village: this.villageId, // Correct village ID usage
  //     };
  
  //     // Send message through WebSocket
  //     this.wsService.sendMessage(this.chat);
  
  //     // Clear the form after sending
  //     this.chatform.reset();
  //   }
  // }
  
  addchat(): void {
    if (this.chatform.valid) {
      const messageFormData = this.chatform.value;

      this.chat = {
        message: messageFormData.message,
        user: localStorage.getItem('user'),
        village: this.villageId,
      };

      this.chatservice.postchat(this.chat).subscribe(
        () => {
          this.chatform.reset();
          this.fetchchatdata()
        },
        (error) => {
          console.error('Error adding chat', error);
        }
      );
    }
  }

  templeaddchat(): void {
    if (this.chatform.valid) {
      const messageFormData = this.chatform.value;

      this.chat = {
        message: messageFormData.message,
        user: localStorage.getItem('user'),
        temple: this.templeId,
      };

      this.chatservice.postchat(this.chat).subscribe(
        () => {
          this.chatform.reset();
          this.fetchTemplechatdata();
        },
        (error) => {
          console.error('Error adding chat', error);
        }
      );
    }
  }
}

