CWS (Chrome Web Store) Updating Notes
===============

Update Extension Information via Developer Dashboard.

Just use https://chrome.google.com/webstore/developer/dashboard if your're me.

Project Summary
===============

```
Google Chrome extension to automatically save all editable and input text fields to sync storage, except for input type password
```

Extension Description from Manifest
===============

See extension_description in (../autoSaveText/messages.json)

```
Automatically save all edited and input text fields to sync storage (available in all your syncing chrome installations), except for input type password.
```

CWS Detailed Description
===============

CWS Detailed Description English
---------------

```
Text will be saved automatically when no changes to it are made
within a timeout period in seconds.
Any change restarts the timeout operation.

Text will no longer be automatically saved when it shortens by
more than the given number of characters from its last autosave length.
Autosaving resumes when it grows within bounds again.

Text will only be automatically saved when it has at least the
given number of characters. This avoids saving cleartext account numbers and the like.

All edited and input text fields are automatically saved to sync storage (available in all your syncing chrome installations), except for input type password.
```

CWS Detailed Description German
---------------

```
Text wird automatisch gesichert, wenn für eine bestimmte Dauer  (timeout in Sekunken) nicht verändert wird.
Jede Änderung startet diese Zeitspanne erneut.

Text wird nicht mehr automatisch gesichert wenn er um mehr Zeichen als vorgegeben ()  gegenüber der letzten Sicherung verkürzt wird.
Die Sicherung beginnt erneut wenn die Textlänge diese Vorgabe wieder erfüllt.

Text wird erst ab einer bestimmten Mindestlänge automatisch gesichert. Damit kann die Sicherung von im Klartext angezeigen Kundennummern und dergleichen verhindert werden.

Alle Inhalte von bearbeiteten und input Text Feldern werden automatisch im sync storage (in alle deinen synchronisierten Chrome Installationen verfügbar) gespechert, außer für input type password.
```

Images for Chrome Web Store
===============

See images alongside this README.md file.

Links
===============

**Website** points to https://code.google.com/p/autosave-text

**Send Feedback** points to https://chrome.google.com/webstore/support/omgpghebcjlafeegihofjnhhmllplnie?hl=en&gl=DE

**Support** points to https://code.google.com/p/autosave-text/issues/list

**Report Abuse** points to https://chrome.google.com/webstore/report/omgpghebcjlafeegihofjnhhmllplnie

CWS Problems
===============

So far this extension does not seem to be affected, but here are some common issues.

[Extension listing disappeared from Webstore](http://code.google.com/p/chromium/issues/detail?id=282760)
