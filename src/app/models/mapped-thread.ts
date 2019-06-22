import { Message } from './message.model';
export interface MappedThread {
    SelectedTypeIdList: [];
    ThreadGID: string;
    ThreadReferenceText: string;
    ThreadSubject: string;
    ThreadUId: string;
    Messages: Message[];
}

