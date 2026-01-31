import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  stats = [
    { value: '5K+', label: 'משתמשים מרוצים' },
    { value: '150K+', label: 'משימות בוצעו' },
    { value: '98%', label: 'שביעות רצון' }
  ];

  features = [
    { 
      icon: 'people', 
      title: 'שיתוף פעולה קבוצתי', 
      description: 'עבדו יחד בצורה חלקה עם הקבוצה שלכם' 
    },
    { 
      icon: 'folder_special', 
      title: 'ארגון חכם', 
      description: 'סדרו את כל הפרויקטים שלכם במקום אחד' 
    },
    { 
      icon: 'checklist', 
      title: 'מעקב אחר משימות', 
      description: 'עקבו בקלות אחרי ההתקדמות של כל משימה' 
    },
    { 
      icon: 'bar_chart', 
      title: 'ניתוח נתונים', 
      description: 'קבלו תובנות מעמיקות על ביצועי העבודה' 
    }
  ];
}