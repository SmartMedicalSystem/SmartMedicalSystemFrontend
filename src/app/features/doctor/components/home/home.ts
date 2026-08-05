import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { DoctorService, DoctorReadDto } from '../../../../core/services/doctor-service.service';
import { AuthenticationService } from '../../../../core/services/authenticationService.service';
import { getCurrentDoctorIdFromToken } from '../../../../core/utils/jwt-utils';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private authService: AuthenticationService
  ) {}

  loading = signal(true);
  loadError = signal<string | null>(null);

  doctor = signal<DoctorReadDto | null>(null);
  totalPatients = signal<number | null>(null);
  totalLabTests = signal<number | null>(null);

  ngOnInit(): void {
    const token = this.authService.getAccessToken();
    const doctorId = getCurrentDoctorIdFromToken(token);

    if (!doctorId) {
      this.loadError.set('Could not determine the current doctor from the session.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    // pageSize=1 لأن المطلوب بس totalCount من الـ response، مش الداتا نفسها
    // (الداتا نفسها معروضة أصلاً في صفحة Patients، مش هنكررها هنا).
    forkJoin({
      doctor: this.doctorService.getDoctorById(doctorId),
      patients: this.doctorService.getAllPatients(1, 1),
      labTests: this.doctorService.getLabTests(1, 1),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ doctor, patients, labTests }) => {
          this.doctor.set(doctor);
          this.totalPatients.set(patients.totalCount);
          this.totalLabTests.set(labTests.totalCount);
        },
        error: () => this.loadError.set('Failed to load dashboard data.'),
      });
  }
}
