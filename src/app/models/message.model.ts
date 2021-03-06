import { MessageUiAttach } from './message-ui-attach.model';

export interface Message {
    body: string;
    msgid: string;
    from: string;
    msgTo: string;
    msgBcc: string;
    msgCc: string;
    date: string;
    err: Number;
    isOpen: boolean;
    isUnread: boolean;
    showSignature: boolean;
    showFooter: boolean;
    attachments: MessageUiAttach[];
}
