'use client';
import {useEffect,useMemo,useState} from 'react';
import {createClient} from '../lib/supabase';
const supabase=createClient();
const today=()=>new Date().toISOString().slice(0,10);
const statusText=s=>s==='approved'?'Onaylandı':s==='rejected'?'Reddedildi':'Bekliyor';
const duration=(a,b)=>{const [ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number);let m=bh*60+bm-(ah*60+am);if(m<0)m+=1440;return m/60};

export default function PlanningApp(){
 const [session,setSession]=useState(null),[profile,setProfile]=useState(null),[loading,setLoading]=useState(true);
 useEffect(()=>{let mounted=true;
  async function boot(){const {data}=await supabase.auth.getSession();if(!mounted)return;setSession(data.session||null);if(data.session)loadProfile(data.session.user.id);else setLoading(false)}
  async function loadProfile(id){const {data,error}=await supabase.from('profiles').select('id,full_name,role').eq('id',id).single();if(error){console.error(error);setLoading(false);return}setProfile(data);setLoading(false)}
  boot();const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);if(!s){setProfile(null);setLoading(false)}else loadProfile(s.user.id)});return()=>{mounted=false;subscription.unsubscribe()}
 },[]);
 async function logout(){await supabase.auth.signOut()}
 if(loading)return <div className="loading">Yükleniyor...</div>;
 if(!session)return <AuthScreen/>;
if (!profile) return <div className="loading">Profil yükleniyor...</div>;

if (profile.role === 'admin') {
  return <AdminPanel profile={profile} onLogout={logout}/>;
}

return <EmployeePanel profile={profile} onLogout={logout}/>;
}

function AuthScreen(){
 const [mode,setMode]=useState('login'),[fullName,setFullName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function submit(e){e.preventDefault();setBusy(true);setMessage('');
  if(mode==='signup'){
  const {error}=await supabase.auth.signUp({
    email,
    password,
    options:{
      data:{full_name:fullName},
      emailRedirectTo:`${window.location.origin}/`
    }
  });
  setMessage(error ? error.message : 'Hesap oluşturuldu. E-posta doğrulaması açıksa gelen kutunu kontrol et.');
}
else{
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error)setMessage(error.message);
}
  setBusy(false);
 }
 return <main className="auth-page"><div className="auth-card"><div className="logo">COMPANY <span>PLANNING</span></div><p className="eyebrow">{mode==='login'?'GİRİŞ':'YENİ HESAP'}</p><h1>{mode==='login'?'Hoş geldin.':'Hesap oluştur.'}</h1><p className="muted">{mode==='login'?'Planning sistemine giriş yap.':'Çalışan hesabını oluştur.'}</p>
 <form onSubmit={submit} className="form">{mode==='signup'&&<label>İsim Soyisim<input value={fullName} onChange={e=>setFullName(e.target.value)} required placeholder="Ahmet Yılmaz"/></label>}
 <label>E-posta<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="ahmet@company.com"/></label>
 <label>Şifre<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength="6" placeholder="En az 6 karakter"/></label>
 <button className="primary" disabled={busy}>{busy?'Bekleyin...':mode==='login'?'GİRİŞ YAP →':'HESAP OLUŞTUR →'}</button></form>
 {message&&<div className="notice">{message}</div>}
 <button className="link-btn" onClick={()=>{setMode(mode==='login'?'signup':'login');setMessage('')}}>{mode==='login'?'İlk kez mi kullanıyorsun? Hesap oluştur':'Zaten hesabın var mı? Giriş yap'}</button>
 </div></main>
}

function Header({name,role,onLogout}){return <header className="topbar"><div className="logo">COMPANY <span>PLANNING</span></div><div className="user"><span><strong>{name}</strong><small>{role}</small></span><button onClick={onLogout}>Çıkış</button></div></header>}

function EmployeePanel({profile,onLogout}){
 const [date,setDate]=useState(today()),[start,setStart]=useState('09:00'),[end,setEnd]=useState('17:00'),[locationId,setLocationId]=useState(''),[locations,setLocations]=useState([]),[shifts,setShifts]=useState([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 async function load(){const [{data:locs},{data:ss}]=await Promise.all([supabase.from('locations').select('id,name').order('name'),supabase.from('shifts').select('id,date,start_time,end_time,status,locations(name)').order('date',{ascending:false}).limit(20)]);setLocations(locs||[]);setShifts(ss||[]);if(!locationId&&locs?.[0])setLocationId(locs[0].id)}
 useEffect(()=>{load()},[]);
 async function submit(e){e.preventDefault();setBusy(true);setMessage('');const {error}=await supabase.from('shifts').insert({employee_id:profile.id,date,start_time:start,end_time:end,location_id:locationId});if(error)setMessage(error.message);else{setMessage('✓ Plan başarıyla gönderildi.');load()}setBusy(false)}
 return <main className="page"><Header name={profile.full_name} role="Çalışan" onLogout={onLogout}/><div className="content"><div className="hero"><p className="eyebrow">ÇALIŞAN PANELİ</p><h1>Çalışma planını gönder.</h1><p className="muted">Tarih, saat ve çalışma yerini gir.</p></div><div className="grid-two"><section className="card"><h2>Yeni plan</h2><form className="form" onSubmit={submit}><label>Tarih<input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></label><div className="two"><label>Başlangıç<input type="time" value={start} onChange={e=>setStart(e.target.value)} required/></label><label>Bitiş<input type="time" value={end} onChange={e=>setEnd(e.target.value)} required/></label></div><label>Yer<select value={locationId} onChange={e=>setLocationId(e.target.value)} required><option value="">Yer seçin</option>{locations.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></label><button className="primary" disabled={busy}>{busy?'Gönderiliyor...':'PLAN GÖNDER →'}</button>{message&&<div className="notice">{message}</div>}</form></section><section className="card"><h2>Son planlarım</h2>{!shifts.length?<p className="muted">Henüz plan gönderilmedi.</p>:<div className="mini-list">{shifts.map(s=><div className="mini-row" key={s.id}><div><strong>{s.date}</strong><span>{s.locations?.name||'-'}</span></div><div><span>{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</span><em className={s.status}>{statusText(s.status)}</em></div></div>)}</div>}</section></div></div></main>
}

function AdminPanel({profile,onLogout}){
 const [shifts,setShifts]=useState([]),[locations,setLocations]=useState([]),[search,setSearch]=useState(''),[date,setDate]=useState(''),[location,setLocation]=useState('');
 async function load(){const [{data:ss},{data:locs}]=await Promise.all([supabase.from('shifts').select('id,date,start_time,end_time,status,profiles(full_name),locations(name)').order('date',{ascending:false}).order('start_time'),supabase.from('locations').select('id,name').order('name')]);setShifts(ss||[]);setLocations(locs||[])}
 useEffect(()=>{load()},[]);
 async function updateStatus(id,status){const {error}=await supabase.from('shifts').update({status}).eq('id',id);if(error)alert(error.message);else load()}
 async function remove(id){if(!confirm('Bu plan silinsin mi?'))return;const {error}=await supabase.from('shifts').delete().eq('id',id);if(error)alert(error.message);else load()}
 const filtered=useMemo(()=>shifts.filter(s=>(!search||(s.profiles?.full_name||'').toLowerCase().includes(search.toLowerCase()))&&(!date||s.date===date)&&(!location||s.locations?.name===location)),[shifts,search,date,location]);
 function exportCsv(){const rows=[['İsim Soyisim','Tarih','Başlangıç','Bitiş','Yer','Durum'],...filtered.map(s=>[s.profiles?.full_name||'',s.date,s.start_time.slice(0,5),s.end_time.slice(0,5),s.locations?.name||'',statusText(s.status)])];const csv='\ufeff'+rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='planning.csv';a.click()}
 const total=shifts.reduce((n,s)=>n+duration(s.start_time,s.end_time),0),employees=new Set(shifts.map(s=>s.profiles?.full_name).filter(Boolean)).size;
 return <main className="page"><Header name={profile.full_name} role="Yönetici" onLogout={onLogout}/><div className="content"><div className="admin-head"><div><p className="eyebrow">YÖNETİCİ PANELİ</p><h1>Planning</h1><p className="muted">Şirketin bütün çalışma planlarını yönet.</p></div><button className="secondary" onClick={exportCsv}>CSV İNDİR</button></div><div className="stats"><div className="stat"><span>Toplam plan</span><strong>{shifts.length}</strong></div><div className="stat"><span>Çalışan</span><strong>{employees}</strong></div><div className="stat"><span>Toplam saat</span><strong>{total.toFixed(1)}</strong></div></div><div className="toolbar card"><input placeholder="Çalışan ara..." value={search} onChange={e=>setSearch(e.target.value)}/><input type="date" value={date} onChange={e=>setDate(e.target.value)}/><select value={location} onChange={e=>setLocation(e.target.value)}><option value="">Tüm yerler</option>{locations.map(l=><option key={l.id}>{l.name}</option>)}</select></div><div className="card table-card"><div className="table-wrap"><table><thead><tr><th>Çalışan</th><th>Tarih</th><th>Saat</th><th>Yer</th><th>Durum</th><th></th></tr></thead><tbody>{filtered.map(s=><tr key={s.id}><td><strong>{s.profiles?.full_name||'Bilinmiyor'}</strong></td><td>{s.date}</td><td>{s.start_time.slice(0,5)} – {s.end_time.slice(0,5)}</td><td><span className="badge">{s.locations?.name||'-'}</span></td><td><select className="status-select" value={s.status} onChange={e=>updateStatus(s.id,e.target.value)}><option value="pending">Bekliyor</option><option value="approved">Onaylandı</option><option value="rejected">Reddedildi</option></select></td><td><button className="delete" onClick={()=>remove(s.id)}>Sil</button></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="empty">Bu filtrelere uyan plan yok.</div>}</div></div></main>
}
