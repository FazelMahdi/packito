import { keys } from '@baya/constants';
import type { NavigationGuard } from 'vue-router';
import { get } from 'idb-keyval';

export const beforeEnter: NavigationGuard = async (_to, _from, next) => {
  const token = await get<string>(keys.ACCESS_TOKEN_KEY);
  if (token) return next();
  next({ name: 'error', params: { code: '401' } });
  // const routes = auth.getAccessRoute();

  // const skipRoutes = [100, 101, 102, 103];
  // if (skipRoutes.includes(to.meta.id) || routes) {
  //     let access = true;
  //     if (routes) {
  //         access = routes.includes(to.meta.id);
  //     }

  //     if (access) next()
  //     else {
  //         next({
  //             path: '/error/403'
  //         });
  //     }
  // } else {
  //     next({
  //         path: 'login'
  //     });
  // }
};
