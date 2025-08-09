import { Injectable } from '@angular/core';
import { auth } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  ws: WebSocket | null = null;

  connect(token: string, onMessage: (msg: any) => void) {
    this.ws = new WebSocket(`ws://localhost:3000/?token=${token}`);
    this.ws.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };
  }

  sendMessage(receiverId: string, message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ receiverId, message }));
    }
  }

  async getMessages(selectedUser: string): Promise<any[]> {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch(
      `http://localhost:3000/api/messages/${selectedUser}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    return data.messages;
  }
}
