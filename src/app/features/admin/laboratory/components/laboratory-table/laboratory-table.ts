import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface LaboratoryRow {
  name: string;
  id: string;
  location: string;
  headName: string;
  initials: string;
  initialsBg: string;
  capacity: number;
  capacityColor: string;
  status: 'Active' | 'Inactive';
  statusClass: string;
}

@Component({
  selector: 'app-laboratory-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './laboratory-table.html',
  styleUrl: './laboratory-table.css',
})
export class LaboratoryTable {
 facilities = [
  {
    name: 'North Wing Pathology',
    id: 'ID: LAB-NW-001',
    location: 'Building A, Wing 4',
    headName: 'Dr. Julian Smith',
    initials: 'JS',
    initialsBg: 'bg-cyan-200 text-cyan-700',
    capacity: 92,
    capacityColor: 'bg-red-500',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    name: 'Genomic Research Unit',
    id: 'ID: LAB-GR-012',
    location: 'Tech Plaza, Level 3',
    headName: 'Dr. Elena Lopez',
    initials: 'EL',
    initialsBg: 'bg-blue-200 text-blue-700',
    capacity: 45,
    capacityColor: 'bg-blue-700',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    name: 'Biotech Molecular Lab',
    id: 'ID: LAB-BM-088',
    location: 'South Annex, B2',
    headName: 'Dr. Amit Khan',
    initials: 'AK',
    initialsBg: 'bg-purple-200 text-purple-700',
    capacity: 78,
    capacityColor: 'bg-teal-600',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    name: 'Stat Urgency Center',
    id: 'ID: LAB-SU-004',
    location: 'ER Corridor',
    headName: 'Dr. Clara White',
    initials: 'CW',
    initialsBg: 'bg-red-200 text-red-700',
    capacity: 12,
    capacityColor: 'bg-gray-400',
    status: 'Inactive',
    statusClass: 'bg-red-100 text-red-600'
  },
  {
    name: 'Advanced Diagnostics',
    id: 'ID: LAB-AD-015',
    location: 'Building C',
    headName: 'Dr. Adam Ibrahim',
    initials: 'AI',
    initialsBg: 'bg-green-200 text-green-700',
    capacity: 63,
    capacityColor: 'bg-green-600',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    name: 'Virology Center',
    id: 'ID: LAB-VC-009',
    location: 'Research Block',
    headName: 'Dr. Nora Hassan',
    initials: 'NH',
    initialsBg: 'bg-orange-200 text-orange-700',
    capacity: 84,
    capacityColor: 'bg-orange-500',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
    name: 'Clinical Chemistry',
    id: 'ID: LAB-CC-022',
    location: 'Building D',
    headName: 'Dr. Omar Salem',
    initials: 'OS',
    initialsBg: 'bg-indigo-200 text-indigo-700',
    capacity: 56,
    capacityColor: 'bg-indigo-600',
    status: 'Active',
    statusClass: 'bg-cyan-100 text-cyan-700'
  },
  {
  name: 'Immunology Research Lab',
  id: 'ID: LAB-IR-031',
  location: 'Medical Tower, Floor 5',
  headName: 'Dr. Emily Carter',
  initials: 'EC',
  initialsBg: 'bg-pink-200 text-pink-700',
  capacity: 71,
  capacityColor: 'bg-pink-500',
  status: 'Active',
  statusClass: 'bg-cyan-100 text-cyan-700'
}
];
}