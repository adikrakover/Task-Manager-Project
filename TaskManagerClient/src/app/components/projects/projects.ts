import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../services/project';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ייבוא ה-SnackBar
import { BidiModule } from '@angular/cdk/bidi';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule, // הוספה כאן
    BidiModule
  ],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit {
  teamId: string = '';
  projects = signal<any[]>([]);
  newProjectName: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private snackBar: MatSnackBar // הזרקת ה-SnackBar
  ) {}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('teamId') || '';
    if (this.teamId) {
      this.loadProjects();
    }
  }

  loadProjects(): void {
    this.projectService.getProjectsByTeam(this.teamId).subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => this.showNotification('שגיאה בטעינת פרויקטים')
    });
  }

  addProject(): void {
    if (!this.teamId || !this.newProjectName.trim()) return;
  
    this.projectService.createProject(this.teamId, this.newProjectName).subscribe({
      next: (newProject) => {
        this.projects.update(old => [...old, newProject]);
        this.newProjectName = '';
        this.showNotification('הפרויקט נוצר בהצלחה');
      },
      error: (err) => {
        this.showNotification('שגיאה ביצירת פרויקט: ' + (err.error?.message || 'שגיאה כללית'));
      }
    });
  }

  deleteProject(projectId: string): void {
    Swal.fire({
      title: 'מחיקת פרויקט',
      text: 'האם את בטוחה שברצונך למחוק את הפרויקט? פעולה זו אינה ניתנת לביטול!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'כן, מחק פרויקט',
      cancelButtonText: 'ביטול'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            this.projects.update(all => all.filter(p => p.id !== projectId));
            
            Swal.fire({
              title: 'נמחק!',
              text: 'הפרויקט הוסר בהצלחה.',
              icon: 'success',
              confirmButtonColor: '#7b68ee'
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'שגיאה',
              text: 'לא ניתן למחוק את הפרויקט כרגע.',
              icon: 'error'
            });
          }
        });
      }
    });
  }
  editProject(project: any): void {
    Swal.fire({
      title: 'עריכת שם הפרויקט',
      input: 'text',
      inputValue: project.name,
      confirmButtonText: 'שמור שינויים',
      cancelButtonText: 'ביטול',
      showCancelButton: true,
      confirmButtonColor: '#7b68ee'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // כאן את קוראת ל-Service שלך עם result.value (השם החדש)
        this.projectService.updateProject(project.id, result.value).subscribe(() => {
          this.loadProjects(); // רענון הרשימה
        });
      }
    });
  }
  // פונקציית עזר להודעות
  private showNotification(message: string) {
    this.snackBar.open(message, 'סגור', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      direction: 'rtl'
    });
  }
}