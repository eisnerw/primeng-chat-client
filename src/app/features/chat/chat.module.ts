import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatComponent} from './chat.component';
import {ChatRoutingModule} from './chat.routing.module';
import {PanelModule} from 'primeng/panel';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';
import {FormsModule} from '@angular/forms';
import {MessageInputComponent} from './message-input/message-input.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {MessageEntryComponent} from './message-entry/message-entry.component';
import {TooltipModule} from 'primeng/tooltip';
import {FileSizePipe} from './file-size.pipe';
import {ProgressSpinnerModule, ToastModule} from 'primeng';
import {MessageAttachmentComponent} from './message-entry/message-attachment/message-attachment.component';
import {LinkifyPipe} from './linkify.pipe';
import {DeferLoadDirective} from './defer-load.directive';

@NgModule({
  declarations: [
    ChatComponent,
    MessageInputComponent,
    MessageEntryComponent,
    FileSizePipe,
    MessageAttachmentComponent,
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
  ]
})
export class ChatModule {
}
