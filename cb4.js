
/* ================= 脚本 ================= */
(function(){
  var book=document.getElementById('book');
  var pages=[].slice.call(document.querySelectorAll('.book .page'));
  var dots=[].slice.call(book.querySelectorAll('.dots i'));
  var cur=0;

  pages.forEach(function(pg,i){
    var n=pg.querySelector('.pno');
    if(n) n.textContent=('0'+(i+1)).slice(-2)+' / '+('0'+pages.length).slice(-2);
  });

  function show(i){
    var n=pages.length; cur=(i%n+n)%n;
    pages.forEach(function(p,k){
      var on=(k===cur);
      if(on && !p.classList.contains('on')){
        p.classList.add('flip');
        setTimeout(function(){p.classList.remove('flip');},560);
      }
      p.classList.toggle('on',on);
    });
    dots.forEach(function(d,k){ d.classList.toggle('on',k===cur); });
  }

  window.jumpTo=function(i){ show(i); };
  window.turn=function(d){ show(cur+d); };
  dots.forEach(function(d){ d.addEventListener('click',function(){ show(+d.dataset.i); }); });
  document.addEventListener('keydown',function(e){
    if(!book.classList.contains('open')) return;
    if(e.key==='ArrowLeft') show(cur-1);
    if(e.key==='ArrowRight') show(cur+1);
  });
  show(0);

  /* 打开书本 */
  window.openBook=function(){
    if(book.classList.contains('open')) return;
    book.classList.remove('closed'); book.classList.add('open');
  };

  /* 密码锁 */
  var CODE='0407', entry='', rot=0, current='', LEN=CODE.length;
  var modal=document.getElementById('lockmodal'), dial=document.getElementById('dial');
  var lkdotsBox=document.getElementById('lkdots');
  lkdotsBox.innerHTML=''; for(var d=0;d<LEN;d++){lkdotsBox.appendChild(document.createElement('i'));}
  var lkdots=[].slice.call(lkdotsBox.querySelectorAll('i'));
  var msg=document.getElementById('lkmsg'), box=document.querySelector('.lockbox');

  for(var i=0;i<10;i++){
    (function(n){
      var s=document.createElement('span');
      s.className='num'; s.textContent=n;
      var a=n*36*Math.PI/180, r=82;
      s.style.transform='translate('+(Math.sin(a)*r).toFixed(1)+'px,'+(-Math.cos(a)*r).toFixed(1)+'px)';
      s.addEventListener('click',function(e){ e.stopPropagation(); spinTo(n); });
      dial.appendChild(s);
    })(i);
  }
  function spinTo(n){
    var target=Math.round(rot/36)*36 - n*36;
    while(target > rot-30) target -= 360;
    rot=target;
    dial.style.transform='rotate('+rot+'deg)';
    [].slice.call(dial.querySelectorAll('.num')).forEach(function(el){
      el.style.transform=el.style.transform.replace(/ rotate\([^)]*\)/,'')+' rotate('+(-rot)+'deg)';
    });
    msg.textContent='已选 '+n;
    [].slice.call(dial.querySelectorAll('.num')).forEach(function(el){
      el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/,'');
    });
    current=n;
    setTimeout(function(){ if(current!=='') window.commitDigit(); }, 520);
  }
  function paint(){ var rd=document.getElementById('lkread'); if(rd) rd.textContent=(entry?entry.split('').join(' '):Array(LEN+1).join('— '));
    lkdots.forEach(function(d,i){ d.classList.toggle('on', i<entry.length); }); }
  window.commitDigit=function(){
    if(current===''){ msg.textContent='先把数字转到上面的指针'; return; }
    if(entry.length>=LEN) return;
    entry+=current; paint(); current='';
    var rd=document.getElementById('lkread'); if(rd) rd.textContent=entry.split('').join(' ')+(' —'.repeat(LEN-entry.length));
    msg.textContent = entry.length<LEN ? ('已输入 '+entry.length+' 位') : '';
    if(entry.length===LEN){
      if(entry===CODE){ setTimeout(function(){ window.closeLock(); window.openBook(); },240); }
      else{
        msg.textContent='密码不对，重新来';
        box.classList.add('shake');
        setTimeout(function(){ box.classList.remove('shake'); entry=''; paint(); },420);
      }
    }
  };
  window.undoDigit=function(){ entry=entry.slice(0,-1); paint(); msg.textContent=entry.length?('已输入 '+entry.length+' 位'):'把数字转到上面的指针'; };
  window.resetDial=function(){ entry=''; paint(); msg.textContent='把数字转到上面的指针'; };
  window.openLock=function(){ if(book.classList.contains('open')) return; modal.classList.add('on'); window.resetDial(); };
  window.closeLock=function(){ modal.classList.remove('on'); };
  modal.addEventListener('click',function(e){ if(e.target===modal) window.closeLock(); });


  window.closeBook=function(){
    if(!book.classList.contains('open')) return;
    book.classList.remove('open'); book.classList.add('closed');
    show(0);
    modal.classList.remove('on');
  };

  /* 文库 */
  var gate=document.getElementById('gate'), main=document.getElementById('libmain');
  window.enterLib=function(){ if(gate) gate.style.display='none'; if(main) main.style.display='block'; };
  var tabs=[].slice.call(document.querySelectorAll('#tabs .tab')), list=document.getElementById('ficlist');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      tabs.forEach(function(x){ x.classList.toggle('on',x===t); });
      var c=t.dataset.cat;
      [].slice.call(list.children).forEach(function(card){
        var ok=(c==='all')||card.dataset.src===c||card.dataset.cat===c;
        card.style.display=ok?'':'none';
      });
    });
  });

  /* 留言 */
  var form=document.querySelector('form.memo');
  if(form) form.addEventListener('submit',function(e){
    e.preventDefault();
    var i=document.getElementById('mi'), v=(i.value||'').trim(); if(!v) return;
    var li=document.createElement('li');
    li.innerHTML='<b>我</b><span>'+v.replace(/</g,'&lt;')+'</span>';
    document.getElementById('mlist').prepend(li); i.value='';
  });

  /* 灯箱 */
  window.openLb=function(src){ var b=document.getElementById('lbimg'); if(!b) return; b.src=src; document.getElementById('lb').classList.add('on'); };
  window.closeLb=function(){ document.getElementById('lb').classList.remove('on'); };
})();
