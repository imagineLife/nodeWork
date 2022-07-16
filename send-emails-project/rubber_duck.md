# Hello Rubber Duck
This is a proof-of-concept quick-win emailing system.  
It will have a few parts, but at it's core - 
- "poll" a data-source for email recipients
- email recipients

## Emailing Logic
### Error Handling
- How should the system handle "failures"? 
  - if the email address recipient doesn't work? 
  - if the system breaks or errors for some other reason?

## Event-Driven Architecture
The mailing system will be built leveraging events at the "highest" level here.
- "get_email_recipients"
  - async
  - fetches data external from the node process
  - calls next event, "store_email_recipients" with recipient list AND recipient survey to use
- "store_email_recipients"
  - adds recipients to an 
- "get_first_recipient"
- "send_email"
- "document_email_send_status"