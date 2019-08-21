import { Message } from './message.model';

export interface Thread {
    ThreadId?: string;
    Subject: string;
    Msg_From: string;
    Msg_To: string;
    Msg_Date: string;
    MessagesCount: string;
    errId: string;
    errMsg: string;
    Messages: Message[];
    //Snippet: String;
    isChecked: boolean;
    isUnread: boolean;
    isMapped: boolean;
}
