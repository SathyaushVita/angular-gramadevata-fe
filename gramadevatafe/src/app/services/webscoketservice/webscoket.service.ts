// import { Injectable } from '@angular/core';
// import { Observable, Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebscoketService {

//   // constructor() { }

//   // // almost working
//   // private socket!: WebSocket;
//   // private messagesSubject = new Subject<any>();


//   // // Connect to the WebSocket server for a specific village
//   // connect(village: string) {
//   //   this.socket = new WebSocket(`ws://templesofworld.com/api/chatrooms/${village}/`);

//   //   this.socket.onopen = () => {
//   //     console.log(`Connected to WebSocket for village: ${village}`);
//   //   };

//   //   this.socket.onmessage = (event) => {
//   //     const data = JSON.parse(event.data);
//   //     this.messagesSubject.next(data);
//   //   };

//   //   this.socket.onerror = (error) => {
//   //     console.error("WebSocket error:", error);
//   //   };

//   //   this.socket.onclose = () => {
//   //     console.log("WebSocket connection closed.");
//   //   };
//   // }

//   // // Return observable for incoming messages
//   // onMessage(): Observable<any> {
//   //   return this.messagesSubject.asObservable();
//   // }

//   // // Send a message through the WebSocket
//   // sendMessage(data: { message: string; user: string }) {
//   //   if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//   //     this.socket.send(JSON.stringify(data));
//   //   } else {
//   //     console.error("WebSocket is not connected.");
//   //   }
//   // }


//     // almost working
//     private socket!: WebSocket;
//     private messagesSubject = new Subject<any>();
  
//     constructor() {}
  
//     // Connect to the WebSocket server for a specific village
//     connect(village: string) {
//       // this.socket = new WebSocket(`ws://templesofworld.com/ws/chat/${village}/`);
//       this.socket = new WebSocket(`ws://chatserver-api.in/ws/chat/${village}/`);
    
//       this.socket.onopen = () => {
//         console.log(`Connected to WebSocket for village: ${village}`);
//       };
  
//       this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         this.messagesSubject.next(data);
//       };
  
//       this.socket.onerror = (error) => {
//         console.error("WebSocket error:", error);
//       };
  
//       this.socket.onclose = () => {
//         console.log("WebSocket connection closed.");
//       };
//     }
  
//     // Return observable for incoming messages
//     onMessage(): Observable<any> {
//       return this.messagesSubject.asObservable();
//     }
  
//     // Send a message through the WebSocket
//     sendMessage(data: { message: string; user: string }) {
//       if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//         this.socket.send(JSON.stringify(data));
//       } else {
//         console.error("WebSocket is not connected.");
//       }
//     }

  
//     templeconnect(temple: string) {
//       this.socket = new WebSocket(`ws://templesofworld.com/ws/chat/${temple}/`);
    
//       this.socket.onopen = () => {
//         console.log(`Connected to WebSocket for village: ${temple}`);
//       };
  
//       this.socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         this.messagesSubject.next(data);
//       };
  
//       this.socket.onerror = (error) => {
//         console.error("WebSocket error:", error);
//       };
  
//       this.socket.onclose = () => {
//         console.log("WebSocket connection closed.");
//       };
//     }
    
// }


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebscoketService {
  // private socket: WebSocket | null = null;

  // private messagesSubject = new Subject<any>();

  // constructor() {}


  // connect(villageId: string): void {
  //   const token = localStorage.getItem('access_token');

  //   if (!token) {
  //     console.error('No access_token in localStorage');
  //     return;
  //   }

  //   const wsUrl = `wss://chatserver-api.in/ws/chat/${villageId}/?token=${token}`;
  //   console.log('Connecting to:', wsUrl);

  //   this.socket = new WebSocket(wsUrl);

  //   this.socket.onopen = (event) => {
  //     console.log('WebSocket connection opened:', event);
  //   };

  //   this.socket.onmessage = (event) => {
  //     console.log('Message received:', event.data);
  //     // You can use Subject here to push messages to component
  //   };

  //   this.socket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   this.socket.onclose = (event) => {
  //     console.warn('WebSocket closed:', event);
  //   };
  // }



  //   templeconnect(templeId: string) {
  //   if (!templeId) {
  //     console.error("templeconnect: Invalid temple ID");
  //     return;
  //   }

  //   const token = localStorage.getItem('access_token');
  //   if (!token) {
  //     console.error("templeconnect: No access_token found in localStorage");
  //     return;
  //   }

  //   const url = `wss://templesofworld.com/ws/chat/${templeId}/?token=${token}`;
  //   console.log(`Connecting to WebSocket: ${url}`);

  //   this.socket = new WebSocket(url);

  //   this.socket.onopen = () => {
  //     console.log(`✅ Connected to WebSocket for temple: ${templeId}`);
  //   };

  //   this.socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     this.messagesSubject.next(data);
  //   };

  //   this.socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   this.socket.onclose = () => {
  //     console.log("WebSocket connection closed.");
  //   };
  // }

  // // Listen to incoming messages
  // onMessage(): Observable<any> {
  //   return this.messagesSubject.asObservable();
  // }

  // // Send a message
  // sendMessage(data: { message: string; user: string }) {
  //   if (this.socket && this.socket.readyState === WebSocket.OPEN) {
  //     this.socket.send(JSON.stringify(data));
  //   } else {
  //     console.error("WebSocket is not connected.");
  //   }
  // }


  //   close() {
  //   if (this.socket) {
  //     this.socket.close();
  //   }
  // }


   private socket: WebSocket | null = null;
  private messagesSubject = new Subject<any>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {}

  connect(villageId: string): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access_token in localStorage');
      return;
    }

    const wsUrl = `wss://chatserver-api.in/ws/chat/${villageId}/?token=${token}`;
    console.log('Connecting to:', wsUrl);

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened:', event);
      this.connectionStatusSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      console.log('Message received:', event.data);
      this.messagesSubject.next(JSON.parse(event.data));
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.warn('WebSocket closed:', event);
      this.connectionStatusSubject.next(false);
    };
  }

  templeconnect(templeId: string) {
    if (!templeId) {
      console.error("templeconnect: Invalid temple ID");
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("templeconnect: No access_token found in localStorage");
      return;
    }

    const url = `wss://templesofworld.com/ws/chat/${templeId}/?token=${token}`;
    console.log(`Connecting to WebSocket: ${url}`);

    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log(`✅ Connected to WebSocket for temple: ${templeId}`);
      this.connectionStatusSubject.next(true);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed.");
      this.connectionStatusSubject.next(false);
    };
  }

  onMessage(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  sendMessage(data: { message: string; user: string }) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

