import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user.model';
import { ChatService } from '../../services/chat/chat.service';
import { auth } from '../../firebase.config';
import { Message } from '../../models/message.model';
@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  currentUser$;
  users: User[] = [];
  selectedUser: User | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.loadUsers();
    this.initWebSocket();
  }

  async loadUsers(): Promise<void> {
    this.users = await this.userService.getUsers();
  }

  async initWebSocket() {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      this.chatService.connect(token, (msg) => {
        if (
          this.selectedUser &&
          (msg.senderId === this.selectedUser.uid ||
            msg.receiverId === this.selectedUser.uid)
        ) {
          this.messages.push(msg);
          this.scrollToBottom();
        }
      });
    }
  }

  sendMessage() {
    const messageText = this.newMessage.trim();
    if (this.selectedUser && messageText) {
      this.chatService.sendMessage(this.selectedUser.uid, messageText);
      this.messages.push({
        senderId: (auth.currentUser as any)?.uid,
        receiverId: this.selectedUser.uid,
        message: messageText,
        timestamp: new Date().toISOString(),
      });
      this.newMessage = '';
      this.scrollToBottom();
    }
  }

  async loadMessages(selectedUser: string) {
    this.messages = await this.chatService.getMessages(selectedUser);
    this.scrollToBottom();
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.loadMessages(user.uid);
  }

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.querySelector('.messages-list');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
