import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loadingService.service';
import { finalize } from 'rxjs';
import { SKIP_LOADING } from '../tokens/skip-loading.token';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // أي request عليه علامة SKIP_LOADING (زي الـ AI Chat) بيتنفذ عادي من غير
  // ما يشغّل الـ Global Loading Overlay خالص - عنده اللودينج الخاص بيه (chatLoading()).
  if (req.context.get(SKIP_LOADING)) {
    return next(req);
  }

  const loadingService = inject(LoadingService);

  // if (req.url.includes('/login')) {
  //   return next(req);
  // }

  loadingService.show();
  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};