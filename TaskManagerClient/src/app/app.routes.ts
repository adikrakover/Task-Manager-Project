import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { TeamsComponent } from './components/teams/teams';
import { ProjectsComponent } from './components/projects/projects';
import { TasksComponent } from './components/tasks/tasks';
import { LandingComponent } from './components/landing/landing'; // 👈 הוסף את זה
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // עמוד ראשי (Landing Page) - ללא הגנה
  { path: '', component: LandingComponent }, // 👈 שנה את זה!

  // נתיבים ציבוריים (ללא הגנה)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // נתיבים מוגנים (עם canActivate)
  { 
    path: 'teams', 
    component: TeamsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'teams/:teamId/projects', 
    component: ProjectsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'projects/:projectId/tasks', 
    component: TasksComponent, 
    canActivate: [authGuard] 
  },
  
  // נתיב "תופס הכל" למקרה של טעות בכתובת
  { path: '**', redirectTo: '' } // 👈 שנה גם את זה - מחזיר ל-Landing
];