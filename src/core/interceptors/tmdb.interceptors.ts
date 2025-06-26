import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const TmdbInterceptor: HttpInterceptorFn = (req, next) => {
  const isTmdb = req.url.startsWith(environment.tmdb.tmdbBaseUrl);

  if (!isTmdb) return next(req);

  const cloned = req.clone({
    setParams: {
      api_key: environment.tmdb.tmdbApiKey,
    },
  });

  return next(cloned);
};
