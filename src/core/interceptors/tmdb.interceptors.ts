// src/core/interceptors/tmdb.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
// import { environment } from '@/environments/environment';

export const tmdbInterceptor: HttpInterceptorFn = (req, next) => {
  const { baseUrl, apiKey, defaultLang } = environment.tmdb;

  // Prepend baseUrl if caller passed a relative path like '/trending/movie/day'
  const url = req.url.startsWith('http') ? req.url : `${baseUrl}${req.url}`;

  // Append api_key & language to query string
  const authReq = req.clone({
    url,
    params: req.params.set('api_key', apiKey).set('language', defaultLang),
  });

  return next(authReq);
};
