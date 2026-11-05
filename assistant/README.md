# AI Conversațional SCARA — ETALON CAEN 4322
Widgetul comun este injectat automat pe toate paginile HTML ale etalonului prin `functions/_middleware.js`.
**Atenție:** `etalon-4322-demo` este un identificator demonstrativ, nu un tenant autorizat. Chatul nu poate furniza răspunsuri AI specifice unei firme până la configurarea bindingului `SCARA_DB`, popularea serviciilor confirmate și activarea tenantului în platforma centrală.
În website-urile finale, Generatorul B inserează `templates/assistant-snippet.html` în toate paginile, substituind `{{APPROVED_SITE_KEY}}` și `{{VERIFIED_COMPANY_NAME}}` cu datele validate.
Pachetele START, CERERI și IDENTITATE includ asistentul conversațional text; VOICE este funcționalitate separată.
Un serviciu debifat trebuie actualizat în D1 prin editorul autorizat; API-ul central citește numai serviciile cu `confirmed=1`.
Backend, migrare D1, securitate și limite: https://github.com/aipath512/scara-valorii/tree/main/assistant
