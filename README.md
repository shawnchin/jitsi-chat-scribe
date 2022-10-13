# Jitsi Chat Scribe

Jitsi wrapper page that allows you to join a room and transcribe chat content. This lets you accumulate the full chat 
history for later saving/printing.

:warning: This is a Proof of Concept app that was hastily cobbled together. It _kinda works_ but is unpolished and not
thoroughly tested. If you see value in this project, PRs welcome.

### Usage:
1. Start a [Jitsi](https://meet.jit.si) meeting as usual.
2. Join the same meeting using jitsi-chat-scribe in another tab.
   * Jitsi audio, video, notifications, etc in this app has been disabled to reduce resource overheads and distraction.
3. Double check that chat messages are showing up in the scribe page.
4. When you meeting is over, you can print the page as PDF or just copy-paste the content.


### Possible improvements:
* Nicer UI
* Nicer formatting of chat messages
* Handle other events too e.g. participant join/leave/kick messages
* Export chat as CSV/JSON/*
* Use lib-jitsi-meet instead of IFrame API?