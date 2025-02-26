import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    position: '',
  };

  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((result) => {
      const id = result.get('id');
      if (id) {
        this.isEditing = true;

        this.employeeService.getEmployee(Number(id)).subscribe({
          next: (employee: Employee) => (this.employee = employee),
          error: (error) =>
            (this.errorMessage = `Error occured (${error.status})`),
        });
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = `Error occured during updating (${error.status})`;
        },
      });
    } else {
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = `Error occured during creating (${error.status})`;
        },
      });
    }
  }
}
