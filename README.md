# OtwlGmailApp

### PLAN OF ACTION

1. Create Draft

2. View Draft
3. View Attached Drive Files
4. Remove Attached Drive File
5. Download Attached Drive File

6. Send draft by ID

7. Update existing draft

8. Delete Draft


### PLAN 2 

1. TODOS - Frontend actions 
2. Service : Overflow Drive Owners -> Indicate whether drive is usable or not
3. Service : Cleaner Service for older folders than X months

## C# Endpoints for actions 

--> <<Create Draft>> 
[Drafts Create](/postNewMail)
1. if there exists a driveservice, return that token id as well to be used as a hidden field X-otwl-dserv-id & X-otwl-dserv-owner

--> <<view Draft>>
[Drafts List](/getDraftThreads)
[Drafts View](/getDraftData?ThreadId)
1. When viewing ask to bring hidden X-otwl-dserv-vsid & X-otwl-dserv-owner ==> indicate to front end that there is a drive resource from older mails 
2. This front end DRIVE_VIEWSTATE_ID, DRIVE_VIEWSTATE_OWNER is important. 


--> <<view Attached Drive Files>>
[Drive List Files](/getDrvSrvAttFiles)
1. Use the front end DRIVE_VIEWSTATE_ID & DRIVE_VIEWSTATE_OWNER to get the files in that drive.
2. Files should be downloadable 
3. Call returns list of files in that drive of type Model.DriveResourceType.FileListResource 

--> <<Remove Attached Drive File>>
[Drive Remove File](/trashDrvSrvAttFile)
1. Use the front end DRIVE_VIEWSTATE_OWNER & Model.DriveResourceType.FileListResource.files[].id to remove files from the attached drive
2. Singular file call only

--> <<Download Attached Drive File>>
1. Currently single file download & view available inside Model.DriveResourceType.FileListResource.files[].webviewLink
2. PENDING : Can be configured for zip approach if needed, but expensive and unnecessary in my opinion.

--> <<Send draft by ID>>
[Only Send Existing Draft](/sendDraft?DraftId)
1. Only send the existing draft that is on the server (Either consume directly or call after updating a draft)
2. Make sure the DraftId being sent is the correct Id. (In this case i think msgList[].ThreadId)

--> <<Update existing draft>>
[Drafts Update](/postDraft?DraftId)
PENDING TO COMMIT

--> <<Delete Draft by ID>>
[Drafts Delete](/discardDraftMsg?ThreadId,DRIVE_VIEWSTATE_ID,DRIVE_VIEWSTATE_OWNER)
1. This will permanently remove the draft from server. 
2. You MUST provide the existing DRIVE_VIEWSTATE_ID & DRIVE_VIEWSTATE_OWNER of the draft IF IT SO EXISTS. 
MAKE SURE TO PASS "" (empty quotes) for both ID and Owner if they dont exist.
If that draft has no allocated drive resource then it is fine, otherwise the backend automatically attempt to first trash the drive folder then it will trash the mail.





--> Update Draft
1. accept incoming draft with X-otwl-dserv-vsid

Flow ==> 

1. [Frontend] -> iF Ask to Create new draft =]  <<Create Draft>>
GO to PostNewMail -> MultipartEmailGenerator -> Allocate drive.id and .webviewlink
Embed beautified .webviewlink into mail body 
Embed .id into X-otwl-dserv-vsid property inside mail packet 
Post Draft


2. [Frontend] -> iF ask to view existing draft =] <<view Draft>>
While fetching draft data OR draft thread list -> initialize the DRIVE_VIEWSTATE_ID using the "X-otwl-dserv-vsid" header property in Thread.cs object 
Make Sure the send this as a NEW PARAMETER from frontend when updating/sending the draft 

3. [Frontend] -> iF ask to list files inside drive folder 
While fetching folder contents using DRIVE_VIEWSTATE_ID, make sure send this as a parameter to get a list of items that you can show in the "Drive Attached" files Dialog.


4. [Frontend] -> iF ask to send existing draft 
