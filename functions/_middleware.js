// SCARA ETALON 4322: attach shared conversational widget to every HTML page.
// In the etalon, the site key is a demonstrative placeholder. For a published firm,
// the generator MUST replace this with its provisioned/approved D1 site_key.
export async function onRequest(context){
 const response=await context.next();
 const contentType=response.headers.get('content-type')||'';
 if(!response.ok||!contentType.includes('text/html'))return response;
 const widget='<script defer src="https://scara.dev/assistant/widget.js" data-site-key="etalon-4322-demo" data-company="Etalon CAEN 4322 — demonstrație" data-api="https://scara.dev/api/site-assistant"></script>';
 return new HTMLRewriter().on('body',{element(el){el.append(widget,{html:true})}}).transform(response);
}
