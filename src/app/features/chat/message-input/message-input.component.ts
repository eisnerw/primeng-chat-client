import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {throttleTime} from 'rxjs/operators';
import {MenuItem} from 'primeng/api';

export interface MessageWithAttachment {
  message: string;
}

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnInit {

  inputText = '';

  userTypingRaw = new EventEmitter<void>();

  @Output() newMessage = new EventEmitter<MessageWithAttachment>();
  @Output() userTyping = this.userTypingRaw.pipe(throttleTime(2000));

  constructor() {
  }

  ngOnInit(): void {
  }

  send() {
    if (this.inputText === '') {
      return;
    }
    this.newMessage.emit({message: this.inputText});
    this.inputText = '';
  }
}
