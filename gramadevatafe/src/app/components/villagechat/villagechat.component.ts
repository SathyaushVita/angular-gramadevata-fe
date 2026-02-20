


import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WebscoketService } from '../../services/webscoketservice/webscoket.service';
import { ChatService } from '../../services/chatservice/chat.service';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild } from '@angular/core';
  import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-villagechat',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './villagechat.component.html',
  styleUrl: './villagechat.component.css'
})
export class VillagechatComponent {
  @ViewChild('chatBox') chatBox!: ElementRef;
  village :any;
  currentUser:any;
  messages: any[] = [];
  newMessage = '';
  temple:any;
  templemessages:any;
  templeMessage:any;
  userId:any;
  connnectionsdata: any;
  villageconnections: any;
  templeconnections:any;
  selectedVillageName:any;
  selectedTemplename:any;
  selectedTempleImagelocation:any;

  constructor(
    private route: ActivatedRoute,
    private wsService: WebscoketService,
    private chatService: ChatService
  ) {}

  
  // ngOnInit() {
  //   this.route.params.subscribe(params => {
  //     this.currentUser = localStorage.getItem('user');
  //     console.log("User ID from localStorage:", this.currentUser); // Debugging user_id

  //     this.wsService.connect(this.village);
  //     this.loadVillageMessages();
  //     this.wsService.connect(this.temple);
  //     this.loadTempleMessages();
  
  //     setInterval(() => {
  //       this.loadVillageMessages();
  //       this.loadTempleMessages();
  //     }, 1000);
  //   });
  
  //   this.wsService.onMessage().subscribe((msg) => {
  //     console.log("New WebSocket message:", msg);
  //     this.messages = [...this.messages, msg];
  //   });
  //   this.FetchConnections();


  //     this.wsService.connectionStatus$.subscribe(status => {
  //   this.isConnected = status;
  //   console.log('WebSocket connection status:', status);
  // });

  // this.wsService.onMessage().subscribe(msg => {
  //   console.log('New WebSocket message:', msg);
  //   this.messages.push(msg);
  // });
  // }
 private messageSubscription!: Subscription;


  ngOnDestroy() {
    // important to unsubscribe when the component is destroyed
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentUser = localStorage.getItem('user');
      console.log("User ID from localStorage:", this.currentUser); // Debugging user_id

      this.wsService.connect(this.village);
      this.loadVillageMessages();
      this.wsService.connect(this.temple);
      this.loadTempleMessages();
  
      // setInterval(() => {
      //   this.loadVillageMessages();
      //   this.loadTempleMessages();
      // }, 1000);

         this.messageSubscription = interval(1000).subscribe(() => {
      this.loadVillageMessages();
      this.loadTempleMessages();
    });
    });
  
    this.wsService.onMessage().subscribe((msg) => {
      console.log("New WebSocket message:", msg);
      this.messages = [...this.messages, msg];
    });
    this.FetchConnections();


      this.wsService.connectionStatus$.subscribe(status => {
    this.isConnected = status;
    console.log('WebSocket connection status:', status);
  });

  this.wsService.onMessage().subscribe(msg => {
    console.log('New WebSocket message:', msg);
    this.messages.push(msg);
  });
  }

  isConnected: boolean = false;

  

  // loadVillageMessages() {
  //   this.chatService.getMessages(this.village).subscribe((data) => {
  //     this.messages = data.data;
  //     console.log(this.messages, "fdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
  //     setTimeout(() => this.scrollToBottom(), 100);
  //   });
  // }
loadVillageMessages(): void {
  if (!this.village) return;

  this.chatService.getMessages(this.village).subscribe({
    next: (res) => {
      this.messages = res.data || [];
      setTimeout(() => this.scrollToBottom(), 100);
    },
    error: (err) => {
      console.error("Error loading messages:", err);
    }
  });
}


  loadTempleMessages() {
    this.chatService.getTempleMessages(this.temple).subscribe((data) => {
      this.templemessages = data.data;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }



  
  FetchConnections(): void {
    this.userId = localStorage.getItem('user');
    this.chatService.GetUserConnections(this.userId).subscribe((data) => {
      this.connnectionsdata = data;
      this.villageconnections = this.connnectionsdata.village;
      this.templeconnections = this.connnectionsdata.temple
      
      console.log("qqqqqqqqqqqqqqqqqqqqqqqqqq", this.connnectionsdata.village)
      
    });
  }
  
  //  selectVillage(village: any) {
  //   this.village = village._id;
  //   this.scrollToBottom();
  //   this.selectedVillageName = village.name;
  //   console.log("village nameeee",this.selectedVillageName)
  //   console.log("villalalalalal",this.village)
  //   this.wsService.connect(this.village);
  //   this.loadVillageMessages();
  //   setTimeout(() => {
  //     this.scrollToBottom();
  //   }, 100);
  // }
 

selectVillage(village: any) {
  if (!village || !village._id) {
    console.error("selectVillage: village is invalid", village);
    return;
  }

  this.village = village._id;
  this.selectedVillageName = village.name;

  console.log("Selected Village ID:", this.village);
  console.log("Village Name:", this.selectedVillageName);

  this.wsService.connect(this.village);  // Initiates WebSocket connection

  this.loadVillageMessages();
}


  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // selectTemple(temple: any) {
  //   this.temple = temple._id;
  //   this.selectedTemplename = temple.name;
  //   this.selectedTempleImagelocation = temple.image_location;
  //   console.log("templeeeee",this.temple)
  //   this.wsService.templeconnect(this.temple);
  //   this.loadTempleMessages();
  //   setTimeout(() => {
  //     this.scrollToBottom();
  //   }, 100);
  // }

  selectTemple(temple: any) {
  if (!temple?._id) return console.error('Invalid temple selected');

  this.temple = temple._id;
  this.selectedTemplename = temple.name;
  this.selectedTempleImagelocation = temple.image_location;

  console.log("Temple ID:", this.temple);

  this.wsService.templeconnect(this.temple);  // ✅ Initiates secure connection with token
  this.loadTempleMessages();                  // Load chat history

  // setTimeout(() => this.scrollToBottom(), 100);
}


 

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profile1.webp';
  }

  
  sendvillageMessage() {
    if (this.newMessage.trim()) {
      const payload = { message: this.newMessage, user: this.currentUser };
      this.wsService.sendMessage(payload);
      this.chatService.sendMessage(this.newMessage, this.currentUser, this.village)
        .subscribe(() => {
          this.messages.push(payload);
        });
      this.newMessage = '';
    }
  }

 
  sendTempleMessage() {
    if (this.templeMessage.trim()) {
      const payload = { message: this.templeMessage, user: this.currentUser };
      this.wsService.sendMessage(payload);
      this.chatService.sendTempleMessage(this.templeMessage, this.currentUser, this.temple)
        .subscribe(() => {
          this.templemessages.push(payload);
        });
      this.templeMessage = '';
    }
  }



//  sendvillageMessage() {

//     if (this.newMessage.trim()) {
//       const payload = { message: this.newMessage, user: this.currentUser };
//       this.wsService.sendMessage(payload);
//       // ... also send via REST or push locally ...
//       this.newMessage = '';
//     }
//   }

  trackByMessageId(index: number, msg: any): any {
    return msg._id || index;  //(user not show to refresh type)
  }
  onMediaSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Selected file:', file);
    }
  }
  
  onVillageMediaSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      console.log('Village selected file:', file);
    }
  }
}