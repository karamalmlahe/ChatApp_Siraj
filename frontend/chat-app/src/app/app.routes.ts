import { Routes } from '@angular/router';
import { Login } from './screens/login/login';
import { Chat } from './screens/chat/chat';
import { authGuard } from './guards/auth/auth-guard';
import { loginRedirectGuard } from './guards/login-redirect/login-redirect-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginRedirectGuard] },
  { path: 'chat', component: Chat, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' },
];
