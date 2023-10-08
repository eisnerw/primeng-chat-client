import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserPrincipalService} from '../../core/services/user-principal.service';
import {Router} from '@angular/router';
import {MenuItem, MessageService} from 'primeng/api';
import {combineLatest, EMPTY, from, Observable, Subject, zip} from 'rxjs';
import {WsService} from '../../core/services/ws.service';
import {ChatSnapshotService} from '../../core/services/chat-snapshot.service';
import {
  bufferTime,
  catchError,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  finalize,
  map,
  sampleTime,
  tap,
  throttleTime
} from 'rxjs/operators';
import {ServerMessageModel} from '../../core/models/server-message.model';
import {UserModel} from '../../core/models/user.model';
import {HttpService} from '../../core/services/http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [MessageService]
})
export class ChatComponent implements OnInit, OnDestroy {

  cornerMenuItems: MenuItem[];
  messages: ServerMessageModel[] = [];
  users = [];
  progress: number = null;
  fixedScroll = false;

  scrollEmitter = new EventEmitter<number>();

  nick: string;
  nickChanged: Subject<string> = new Subject();

  @ViewChild('messagesScroll') private msgScroll: ElementRef;

  constructor(private userPrincipalService: UserPrincipalService,
              private router: Router,
              private ws: WsService,
              private snapshotService: ChatSnapshotService,
              private httpService: HttpService,
              private changeDetectionRef: ChangeDetectorRef
  ) {
  }

  get principal(): UserModel {
    return this.userPrincipalService.getUser();
  }

  ngOnInit(): void {
    this.nick = this.principal.nick;
    this.setIncomingMessageHandlers();
    this.setMessageHistoryHandler();
  }

// ====== INCOMING WS MESSAGES ========
  setIncomingMessageHandlers() {
    this.ws.incoming.pipe(
      tap(m => this.snapshotService.handle(m)),
      tap(m => {
          if (m.id === 'internal' && m.type === 'command' && m.payload === 'clearChatAppender') {
            this.messages = [];
          }
        }
      ),
      filter(m => m.type === 'msg' || m.type === 'info'),
      bufferTime(600),
      filter(buffer => buffer.length > 0),
      tap(m => {
        this.messages.push(...m);
        this.changeDetectionRef.detectChanges();
        this.scrollToBottom(false);
      })
    ).subscribe();
  }

  scrollToBottom(force: boolean) {
    if (!force && this.fixedScroll) {
      return;
    }
    try {
      const el = this.msgScroll.nativeElement;
      el.scrollTop = el.scrollHeight - el.clientHeight;
    } catch (err) {
    }
  }

// ====== SCROLL UI EVENT ========
  onScroll() {
    const el = this.msgScroll.nativeElement;
    this.fixedScroll = el.scrollTop < el.scrollHeight - el.clientHeight * 1.1;
    this.scrollEmitter.emit(el.scrollTop);
  }

  private setMessageHistoryHandler() { // fires when a scroll position reaches the top of the chat
    this.scrollEmitter.pipe(
      debounceTime(200),
      filter(pos => pos === 0),
      map(_ => this.messages.find(m => m.id !== 'internal')),
      filter(m => m !== undefined && m.id !== undefined),
      exhaustMap(m => zip(from([m]), this.httpService.getMessageHistory(m)))
    ).subscribe(z => {
      const [mes, res] = [...z];
      if (res.length > 0) {
        const pos = this.messages.findIndex(m => m.id === mes.id);
//        this.messages.splice(pos, 0, ...res); // this will NOT remove internal messages
        this.messages.splice(0, pos, ...res); // this WILL remove internal messages
        this.changeDetectionRef.detectChanges();
        document.getElementById('m' + mes.id).scrollIntoView();
      }
    });
  }

  ngOnDestroy(): void {
    // this also cancels all subscriptions to the ws subject
    // so a manual unsubscription is unnecessary
    this.ws.closeConnection();
  }
}
