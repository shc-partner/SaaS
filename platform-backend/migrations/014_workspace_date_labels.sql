UPDATE workspace_calendar_event_types
   SET event_key = 'start',
       event_name = '시작일자'
 WHERE event_key = 'shoot';

UPDATE workspace_calendar_event_types
   SET event_key = 'due',
       event_name = '마감일자'
 WHERE event_key = 'editDue';

DELETE FROM workspace_calendar_event_types
 WHERE event_key = 'publish';

UPDATE workspace_content_fields
   SET field_label = '마감일자'
 WHERE field_key = 'publishDate';

UPDATE workspace_content_fields
   SET field_label = '시작일자'
 WHERE field_key = 'shootingDate';
