import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpclient:HttpClient) { }


  GetConnections(id:string):Observable<any>{
    return this.httpclient.get(URL+'connect?village='+id)
  }

  GetTempleConnections(id:string):Observable<any>{
    return this.httpclient.get(URL+'connect?temple='+id)
  }


  getChat(id:string):Observable<any>{
    return this.httpclient.get('http://templesofworld.com/village_GetItemByfield_InputView/village/'+id+'/')
  }

  getTempleChat(id:string):Observable<any>{
   return this.httpclient.get('http://templesofworld.com/village_GetItemByfield_InputView/temple/'+id +'/')
  }

  postchat(chatdata:string):Observable<any>{
    return this.httpclient.post("http://templesofworld.com/api/chatrooms/",chatdata)

  
  }


  private apiUrl = 'https://chatserver-api.in/api/chatrooms/';
  private getMessagesUrl = 'https://chatserver-api.in/village_GetItemByfield_InputView/village/';
  private getTempleMessagesUrl = 'https://chatserver-api.in/village_GetItemByfield_InputView/temple/';

  getMessages(village: string): Observable<any> {
    return this.httpclient.get(`${this.getMessagesUrl}${village}/`);
  }

  getTempleMessages(temple: string): Observable<any> {
    return this.httpclient.get(`${this.getTempleMessagesUrl}${temple}/`);
  }
  // Send a message to the backend
  sendMessage(message: string, user: string, village: string): Observable<any> {
    const payload = { message, user, village };
    return this.httpclient.post(`${this.apiUrl}`, payload);
  }

  sendTempleMessage(message: string, user: string, temple: string): Observable<any> {
    const payload = { message, user, temple };
    return this.httpclient.post(`${this.apiUrl}`, payload);
  }

  GetUserConnections(id:any):Observable<any>{
    return this.httpclient.get(URL+'connect?user='+id)
  }
}
