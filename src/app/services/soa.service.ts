import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AccessSOAPayload } from '../models/soa.model';

@Injectable({
  providedIn: 'root'
})
export class SoaService {

  private baseUrl = 'https://localhost:5081/api/AccessSOA';

  constructor(private http: HttpClient) { }

  // Get all SOA records
  getAll(): Observable<AccessSOAPayload[]> {
    return this.http.get<AccessSOAPayload[]>(this.baseUrl);
  }

  // Get latest record (safe version)
  getLatestSoa(): Observable<AccessSOAPayload> {
    return this.getAll().pipe(
      map(records => {
        if (!records || records.length === 0) {
          throw new Error('No SOA records found');
        }
        return records[records.length - 1];
      })
    );
  }

  // Get by ID
  getById(id: number): Observable<AccessSOAPayload> {
    return this.http.get<AccessSOAPayload>(`${this.baseUrl}/${id}`);
  }
}
