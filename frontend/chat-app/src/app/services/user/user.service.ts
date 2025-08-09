import { Injectable } from '@angular/core';
import { auth } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  async getUsers(): Promise<any[]> {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('http://localhost:3000/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.users;
  }
}
