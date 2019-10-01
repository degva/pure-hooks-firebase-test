# Web test app

This project tries to imitate Workflowy using React hooks and Firestore only.

## Deploy

- Create project in Firebase
- Clone the project
- `firebase init` into the project
- Create a web app in firebase and copy the credentials into `src/config`.

## Nasty stuff

You need to create one document into the `items` collection to have it working.
The document has to have 'main' as id and contain the following:
`{isDone: false, text: 'Main'}`.

With that in place the app _should_ run without issue.

## Current state

The app contains one single issue which is the delay when saving data into
firestore. Maybe it's because of hooks or maybe it is because firebase, I don't
really know (but if you do, please send me a message or a PR).
