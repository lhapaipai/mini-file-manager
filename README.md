Work In Progress

```js
const options = {
	endPoints: {
        deleteFile   :"/media-manager/delete"
        downloadArchive :"/media-manager/download-archive"
        showFile     :"/media-manager/get/{mode}/{origin}/{uploadRelativePath}"
        editFile     :"/media-manager/edit"
        getFiles     :"/media-manager/get-files"
        uploadFile   :"/media-manager/upload"
        addDirectory :"/media-manager/add-directory"
      },
      isAdmin:
      entryPoints :[
        {
            label: 'Conversation',
            directory: 'projet/puplinge-classique/todo',
            origin: 'private',
            readOnly: false,
            icon: 'fa-lock'
        },
      ]
};

createFileManager(options, el);
```
