(() => {
  if (document.getElementById('scara-ai')) return;
  const root = document.createElement('aside'); root.id = 'scara-ai'; root.setAttribute('aria-label', 'Asistent AI text');
  root.innerHTML = `<button class="ai-launch" type="button" aria-expanded="false" aria-controls="scara-ai-panel" aria-label="Deschide asistentul AI conversațional" title="Întreabă asistentul AI"><img class="ai-launch-avatar" src="https://scara.dev/assistant/avatar.gif" alt="" aria-hidden="true" width="64" height="64" loading="eager" decoding="async" onerror="this.style.display='none';this.parentNode.textContent='AI'"></button>
  <section id="scara-ai-panel" class="ai-panel" role="dialog" aria-labelledby="scara-ai-title" hidden>
  <div class="ai-head"><div><h2 id="scara-ai-title" class="ai-title">Asistent AI text</h2><small>SCARA · Etalon 4322</small></div><button class="ai-close" type="button" aria-label="Închide conversația">×</button></div>
  <div class="ai-log" role="log" aria-live="polite" aria-relevant="additions" aria-label="Conversație"></div>
  <div class="ai-suggestions"><button type="button">Ce servicii găsesc aici?</button><button type="button">Pompe de căldură</button><button type="button">Modernizarea băii</button></div>
  <p class="ai-status" role="status"></p>
  <form class="ai-form"><textarea aria-label="Întrebarea dumneavoastră" maxlength="1200" rows="2" placeholder="Scrieți întrebarea…" required></textarea><button class="ai-send" type="submit">Trimite</button></form>
  <p class="ai-privacy">Răspunsuri generate de AI, posibil inexacte. Mesajele sunt procesate de Cloudflare AI. Nu introduceți date personale. <a href="/confidentialitate/">Confidențialitate</a></p></section>`;
  document.body.append(root);
  const $ = selector => root.querySelector(selector);
  const launch=$('.ai-launch'), panel=$('.ai-panel'), log=$('.ai-log'), input=$('textarea'), send=$('.ai-send'), status=$('.ai-status');
  const history=[]; let busy=false;
  function message(role,text,error=false) { 
    // Repair split Markdown links returned by the model.
    text=text.replace(/\[[^\]]+\]\((\/servicii\/(?:incalzire|sanitare|climatizare)\/)\)\s*([a-z0-9-]+)\/?/gi,(_,base,slug)=>base+slug+'/');
    text=text.replace(/\[[^\]]+\]\((\/servicii\/(?:incalzire|sanitare|climatizare)\/[a-z0-9-]+\/)\)/gi,'$1');
    const p=document.createElement('p'); p.className='ai-message '+role+(error?' error':'');
    // Model output is text, never HTML. Only known same-site service URLs become links.
    const pattern=/(?:https:\/\/scara\.dev\/|\/servicii\/(?:incalzire|sanitare|climatizare)\/(?:[a-z0-9-]+\/)?)/g;
    let offset=0;
    for(const match of text.matchAll(pattern)) {
      p.append(document.createTextNode(text.slice(offset,match.index)));
      const a=document.createElement('a'); a.href=match[0]; a.textContent=match[0]==='https://scara.dev/'?'Descoperă SCARA':'Vezi serviciul';p.append(a);offset=match.index+match[0].length;
    }
    p.append(document.createTextNode(text.slice(offset))); log.append(p); log.scrollTop=log.scrollHeight;
  }
  message('assistant','Bună! Sunt asistentul AI al etalonului SCARA 4322. Vă pot ghida printre serviciile de încălzire, sanitare și climatizare. Acesta este un model demonstrativ, nu o firmă care preia lucrări.');
  function close(){panel.hidden=true;launch.hidden=false;launch.setAttribute('aria-expanded','false');launch.focus();}
  launch.addEventListener('click',()=>{panel.hidden=false;launch.hidden=true;launch.setAttribute('aria-expanded','true');input.focus();});
  $('.ai-close').addEventListener('click',close);
  root.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close();}});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();$('.ai-form').requestSubmit();}});
  $('.ai-suggestions').addEventListener('click',e=>{const button=e.target.closest('button');if(button&&!busy){input.value=button.textContent;$('.ai-form').requestSubmit();}});
  $('.ai-form').addEventListener('submit',async e=>{
    e.preventDefault();const question=input.value.trim();if(!question||busy)return;
    busy=true;send.disabled=true;root.querySelectorAll('.ai-suggestions button').forEach(b=>b.disabled=true);
    input.value='';message('user',question);status.textContent='Asistentul răspunde…';
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),45000);
    try {
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history:history.slice(-6)}),signal:controller.signal});
      if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Asistentul AI nu este încă disponibil. Reîncercați mai târziu.');
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Asistentul nu a putut răspunde.');
      if(typeof data.reply!=='string'||!data.reply.trim())throw new Error('Răspuns indisponibil. Reîncercați.');
      message('assistant',data.reply);history.push({role:'user',content:question},{role:'assistant',content:data.reply});if(history.length>6)history.splice(0,history.length-6);
    } catch(error) {
      message('assistant',error.name==='AbortError'?'Răspunsul durează prea mult. Reîncercați.':error.message,true);
      if(!input.value)input.value=question;
    } finally {clearTimeout(timeout);busy=false;send.disabled=false;root.querySelectorAll('.ai-suggestions button').forEach(b=>b.disabled=false);status.textContent='';}
  });
})();
