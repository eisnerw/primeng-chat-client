import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {ChatRoutingModule} from './chat.routing.module';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';
import {FormsModule} from '@angular/forms';
import {ProgressBarModule} from 'primeng/progressbar';
import {MessageEntryComponent} from './message-entry/message-entry.component';
import {TooltipModule} from 'primeng/tooltip';
import {LinkifyPipe} from './linkify.pipe';
import {DeferLoadDirective} from './defer-load.directive';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RippleModule} from 'primeng/ripple';

@NgModule({
  declarations: [
    ChatComponent,
    MessageEntryComponent,
    LinkifyPipe,
    DeferLoadDirective
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    FormsModule,
    ProgressBarModule,
    TooltipModule,
    ToastModule,
    ProgressSpinnerModule,
    RippleModule,
  ]
})
export class ChatModule {
}
