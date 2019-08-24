import { Message } from './message.model';
export interface MappedThread {
    SelectedTypeIdList: string[];
    ThreadGID: string;
    ThreadReferenceText: string;
    ThreadSubject: string;
    ThreadUId: string;
    Remarks: string;
    Messages: Message[];
}

