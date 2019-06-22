import { Message } from './message.model';
export interface MappedThread {
    SelectedTypeIdList: [];
    ThreadGID: String;
    ThreadReferenceText: String;
    ThreadSubject: String;
    ThreadUId: String;
    Messages: Message[];
}

