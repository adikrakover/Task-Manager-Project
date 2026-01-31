import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../services/team';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // הוסף את זה בראש הקובץ

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatDividerModule,
    MatSelectModule, MatTooltipModule
  ],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css']
})
export class TeamsComponent implements OnInit {
  teams = signal<any[]>([]);
  allUsers = signal<any[]>([]);
  newTeamName: string = '';
  selectedUserForTeam: { [key: string]: string } = {}; // אובייקט עזר לבחירת משתמש לכל צוות

  constructor(private teamService: TeamService  , private router: Router // הוסף את זה
  ) {}

  logout(): void {
    // ניקוי localStorage או sessionStorage אם יש
    localStorage.removeItem('token'); // אם יש טוקן
    // או כל דבר אחר ששמרת
    
    // ניווט לעמוד התחברות
    this.router.navigate(['/login']); // או הנתיב שלך לעמוד התחברות
  }
  ngOnInit(): void {
    this.loadInitialTeams();
    this.loadAllUsers();
  }

  loadInitialTeams(): void {
    this.teamService.getTeams().subscribe({
      next: (data: any[]) => {
        this.teams.set(data);
        // שליפת חברים עבור כל צוות ועדכון ה-Signal בצורה נכונה
        data.forEach(team => {
          this.teamService.listTeamMembers(team.id).subscribe((members: any) => {
            this.teams.update(currentTeams => 
              currentTeams.map(t => t.id === team.id ? { ...t, members } : t)
            );
          });
        });
      }
    });
  }

  loadAllUsers(): void {
    this.teamService.getUsers().subscribe({
      next: (users) => this.allUsers.set(users)
    });
  }

  addMember(teamId: string): void {
    const userId = this.selectedUserForTeam[teamId];
    if (!userId) return;

    this.teamService.addMemberToTeam(teamId, userId).subscribe({
      next: () => {
        this.loadInitialTeams(); // ריענון הנתונים
        this.selectedUserForTeam[teamId] = ''; // איפוס הבחירה
      }
    });
  }

  removeMember(teamId: string, userId: string): void {
    this.teamService.removeMemberFromTeam(teamId, userId).subscribe({
      next: () => this.loadInitialTeams()
    });
  }

  deleteTeam(teamId: string): void {
    // הפופ-אפ החדש והמעוצב
    Swal.fire({
      title: 'מחיקת צוות',
      text: 'האם את בטוחה שברצונך למחוק את הצוות? פעולה זו אינה ניתנת לביטול!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // צבע אדום למחיקה
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'כן, מחק צוות',
      cancelButtonText: 'ביטול'
    }).then((result) => {
      // רק אם המשתמש לחץ על כפתור האישור
      if (result.isConfirmed) {
        this.teamService.deleteTeam(teamId).subscribe({
          next: () => {
            // עדכון הרשימה על המסך
            this.teams.update(all => all.filter(t => t.id !== teamId));
            
            // הודעת הצלחה קטנה אחרי המחיקה
            Swal.fire({
              title: 'נמחק!',
              text: 'הצוות הוסר בהצלחה.',
              icon: 'success',
              confirmButtonColor: '#7b68ee'
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'שגיאה',
              text: 'לא ניתן למחוק את הצוות כרגע.',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  addTeam(): void {
    if (!this.newTeamName.trim()) return;
    this.teamService.createTeam(this.newTeamName).subscribe({
      next: () => {
        this.loadInitialTeams();
        this.newTeamName = '';
      }
    });
  }
}