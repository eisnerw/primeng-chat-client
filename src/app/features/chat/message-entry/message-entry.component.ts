import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ServerMessageModel} from '../../../core/models/server-message.model';
import {UserModel} from '../../../core/models/user.model';
import {Observable} from 'rxjs';
import { RichMessageModel } from 'src/app/core/models/rich-message.model';


@Component({
  selector: 'app-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.css']
})
export class MessageEntryComponent implements OnInit {

  @Input() message: ServerMessageModel;
  @Input() principal: UserModel;

  richMessage: RichMessageModel;
  isSelfMessage: boolean;
  isInfo: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.richMessage = this.message.type === 'richMsg' ? JSON.parse(this.message.payload) as RichMessageModel : null;
    const client = this.message.client;
    this.isSelfMessage = client && client.clientId === this.principal.id;
    this.isInfo = this.message.type === 'info';
  }
}
