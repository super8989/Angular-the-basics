import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Optional way to provide service to the root (instead of adding in app.module)
@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient) {}
}
