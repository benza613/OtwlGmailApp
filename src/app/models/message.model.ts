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
}
