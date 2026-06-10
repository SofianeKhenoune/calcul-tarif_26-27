const TARIFS={
  arabe:[{n:320,s:290},{n:290,s:260},{n:260,s:230}],
  coran:[{n:290,s:260},{n:260,s:230},{n:230,s:205}]
};

const MAX_TIER_COUNT=3;

const state={a:[false,false,false,false,false],c:[false,false,false,false,false]};

function buildGrid(){
  ['a','c'].forEach(type=>{
    const col=document.getElementById('col-'+type);
    col.innerHTML='';

    for(let i=0;i<5;i++){
      const d=document.createElement('div');
      d.className='case'+(state[type][i]?(type==='a'?' on-a':' on-c'):'' );
      d.innerHTML=`<div class="lbl">Enfant ${i+1}</div><div class="num">${getTarif(type,i)}</div>`;
      d.onclick=()=>{
        state[type][i]=!state[type][i];
        buildGrid();
      };
      col.appendChild(d);

      if(i<4){
        col.appendChild(Object.assign(document.createElement('div'),{style:'height:6px'}));
      }
    }
  });
}

function getTarif(type,idx){
  const nbA=state.a.filter(Boolean).length;
  const nbC=state.c.filter(Boolean).length;
  const nb=type==='a'?nbA:nbC;

  if(nb===0){
    return type==='a'?'320':type==='c'?'290':'—';
  }

  const sp=state.a[idx]&&state.c[idx];
  const key=type==='a'?'arabe':'coran';
  const row=TARIFS[key][getTierIndex(nb)];
  return sp?row.s:row.n;
}

function getTierIndex(nbInscrits){
  return Math.min(nbInscrits,MAX_TIER_COUNT)-1;
}

function fmt(v){
  return v.toLocaleString('fr-FR')+' €';
}

function cheques(restant,nbMois){
  if(restant<=0){
    return '';
  }

  const base=Math.floor(restant/nbMois);
  const reste=restant-base*nbMois;

  let h='<div class="chq-box"><div class="chq-title">Plan de règlement</div>';
  if(reste>0){
    h+=`<div class="chq-row"><span class="cl">${nbMois-1} chèque${nbMois>2?'s':''} de</span><span class="cv">${fmt(base)}</span></div>`;
    h+=`<div class="chq-row"><span class="cl">1 chèque de (solde)</span><span class="cv">${fmt(base+reste)}</span></div>`;
  }else{
    h+=`<div class="chq-row"><span class="cl">${nbMois} chèques de</span><span class="cv">${fmt(base)}</span></div>`;
  }

  return h+'</div>';
}

function getMoisValue(id){
  const v=parseInt(document.getElementById(id).value,10);
  if(!Number.isFinite(v)){
    return 5;
  }
  return Math.min(12,Math.max(1,v));
}

function getAcompteValue(id){
  const v=parseFloat(document.getElementById(id).value);
  if(!Number.isFinite(v)){
    return 0;
  }
  return Math.max(0,v);
}

function calculer(){
  const acompteA=getAcompteValue('acompteA');
  const acompteC=getAcompteValue('acompteC');
  const nbMoisA=getMoisValue('nbmoisA');
  const nbMoisC=getMoisValue('nbmoisC');

  const nbA=state.a.filter(Boolean).length;
  const nbC=state.c.filter(Boolean).length;

  if(nbA+nbC===0){
    alert('Sélectionnez au moins un enfant.');
    return;
  }

  let totalA=0;
  let totalC=0;

  for(let i=0;i<5;i++){
    if(state.a[i]){
      const sp=state.a[i]&&state.c[i];
      totalA+=TARIFS.arabe[getTierIndex(nbA)][sp?'s':'n'];
    }
    if(state.c[i]){
      const sp=state.a[i]&&state.c[i];
      totalC+=TARIFS.coran[getTierIndex(nbC)][sp?'s':'n'];
    }
  }

  const accA=nbA>0?acompteA:0;
  const accC=nbC>0?acompteC:0;
  const restA=Math.max(0,totalA-accA);
  const restC=Math.max(0,totalC-accC);

  function bloc(id,titre,cls,nb,total,acc,rest,nbMois){
    const el=document.getElementById(id);
    if(nb===0){
      el.style.display='none';
      return;
    }

    el.style.display='';
    el.innerHTML=`
      <div class="res-title ${cls}">${titre} — ${nb} enfant${nb>1?'s':''}</div>
      <div class="res-row"><span class="rl">Total annuel</span><span class="rv">${fmt(total)}</span></div>
      <div class="res-row"><span class="rl">Acompte versé</span><span class="rv">− ${fmt(acc)}</span></div>
      <div class="res-row big"><span class="rl">Restant à régler</span><span class="rv">${fmt(rest)}</span></div>
      ${cheques(rest,nbMois)}`;
  }

  bloc('blocA','Arabe','a',nbA,totalA,accA,restA,nbMoisA);
  bloc('blocC','Coran','c',nbC,totalC,accC,restC,nbMoisC);

  document.getElementById('totalGlobal').textContent=fmt(restA+restC);
  document.getElementById('result').style.display='block';
  document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});
}

function reset(){
  state.a=[false,false,false,false,false];
  state.c=[false,false,false,false,false];
  document.getElementById('result').style.display='none';
  buildGrid();
  window.scrollTo({top:0,behavior:'smooth'});
}

buildGrid();
