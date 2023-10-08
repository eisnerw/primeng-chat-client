import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ServerMessageModel} from '../../../core/models/server-message.model';
import {UserModel} from '../../../core/models/user.model';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.css']
})
export class MessageEntryComponent implements OnInit {

  @Input() message: ServerMessageModel;
  @Input() principal: UserModel;

  isSelfMessage: boolean;
  isInfo: boolean;

  constructor() {
  }

  ngOnInit(): void {
    const client = this.message.client;
    this.isSelfMessage = client && client.clientId === this.principal.id;
    this.isInfo = this.message.type === 'info';
  }
}
