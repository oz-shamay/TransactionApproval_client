import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean>;
  context?: HttpContext;
  responseType?: 'json';
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), this.toHttpOptions(options));
  }

  post<T>(
    path: string,
    body: unknown,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.post<T>(
      this.buildUrl(path),
      body,
      this.toHttpOptions(options),
    );
  }

  put<T>(
    path: string,
    body: unknown,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.put<T>(
      this.buildUrl(path),
      body,
      this.toHttpOptions(options),
    );
  }

  patch<T>(
    path: string,
    body: unknown,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.patch<T>(
      this.buildUrl(path),
      body,
      this.toHttpOptions(options),
    );
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(
      this.buildUrl(path),
      this.toHttpOptions(options),
    );
  }

  private buildUrl(path: string): string {
    const normalizedPath = path.replace(/^\//, '');
    return `${this.baseUrl}/${normalizedPath}`;
  }

  private toHttpOptions(
    options?: ApiRequestOptions,
  ): {
    headers?: HttpHeaders | Record<string, string | string[]>;
    params?: HttpParams | Record<string, string | number | boolean>;
    context?: HttpContext;
    responseType?: 'json';
  } {
    if (!options) {
      return {};
    }

    return {
      headers: options.headers,
      params: options.params,
      context: options.context,
      responseType: options.responseType,
    };
  }
}
