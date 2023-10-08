import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RouteUrls} from './app-routing.config';
import {ErrorComponent} from './shared/error/error.component';

const appRoutes: Routes = [
  {
    path: RouteUrls.CHAT,
    loadChildren: () => import('src/app/features/chat/chat.module').then(m => m.ChatModule)
  },
  {path: '**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
