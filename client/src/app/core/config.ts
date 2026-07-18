import { isDevMode } from '@angular/core';

// In development, we use the Angular CLI proxy to avoid CORS issues (requests go to http://localhost:4200/api -> http://localhost:3000/api).
// In production, we point directly to the deployed backend URL.
export const API_URL = isDevMode()
  ? ''
  : 'https://task-manager-6hh3.onrender.com'; // We will update this with your actual deployed Render URL
