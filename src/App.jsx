import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, Bell, CalendarDays, Check, ChevronDown, ClipboardList, Clock3,
  CreditCard, LayoutDashboard, LogOut, Menu, Plus, Search, Settings, ShieldCheck,
  Stethoscope, Users, UserRound, X, Pencil, Trash2, HeartPulse, ArrowUpRight,
  BedDouble, FileText, Filter, RotateCcw, Download, MoreHorizontal
} from 'lucide-react'

const DEMO_PASSWORD = 'carepoint123'
const accounts = [
  { email:'admin@carepoint.in', password:DEMO_PASSWORD, name:'Abhay Patel', role:'Admin', initials:'AP' },
  { email:'doctor@carepoint.in', password:DEMO_PASSWORD, name:'Dr. Priya Sharma', role:'Doctor', initials:'PS' },
  { email:'reception@carepoint.in', password:DEMO_PASSWORD, name:'Neha Kapoor', role:'Receptionist', initials:'NK' },
  { email:'patient@carepoint.in', password:DEMO_PASSWORD, name:'Abhay Patel', role:'Patient', initials:'AP' }
]
const seed = {
 patients:[
  {id:'PT-1001',name:'Abhay Patel',age:34,gender:'Male',phone:'+91 98765 43210',email:'abhay@example.com',blood:'B+',condition:'Hypertension',status:'Active'},
  {id:'PT-1002',name:'Ananya Iyer',age:28,gender:'Female',phone:'+91 98220 11880',email:'ananya@example.com',blood:'O+',condition:'Migraine',status:'Active'},
  {id:'PT-1003',name:'Vikram Singh',age:56,gender:'Male',phone:'+91 98111 22003',email:'vikram@example.com',blood:'A+',condition:'Diabetes',status:'Admitted'},
  {id:'PT-1004',name:'Meera Joshi',age:42,gender:'Female',phone:'+91 98900 77221',email:'meera@example.com',blood:'AB+',condition:'Post-operative care',status:'Discharged'},
  {id:'PT-1005',name:'Kabir Khan',age:19,gender:'Male',phone:'+91 97654 33210',email:'kabir@example.com',blood:'O-',condition:'Fracture',status:'Active'}
 ],
 doctors:[
  {id:'DR-201',name:'Dr. Priya Sharma',specialty:'Cardiology',experience:'12 years',phone:'+91 98200 11122',availability:'Available',fee:900},
  {id:'DR-202',name:'Dr. Arjun Rao',specialty:'Neurology',experience:'9 years',phone:'+91 98200 11123',availability:'Available',fee:800},
  {id:'DR-203',name:'Dr. Sana Khan',specialty:'Orthopedics',experience:'15 years',phone:'+91 98200 11124',availability:'On leave',fee:1000},
  {id:'DR-204',name:'Dr. Kunal Shah',specialty:'General Medicine',experience:'7 years',phone:'+91 98200 11125',availability:'Available',fee:600}
 ],
 appointments:[
  {id:'AP-501',patient:'Abhay Patel',doctor:'Dr. Priya Sharma',date:'2026-10-30',time:'09:30',type:'Follow-up',status:'Confirmed'},
  {id:'AP-502',patient:'Ananya Iyer',doctor:'Dr. Arjun Rao',date:'2026-10-30',time:'10:15',type:'Consultation',status:'Waiting'},
  {id:'AP-503',patient:'Vikram Singh',doctor:'Dr. Priya Sharma',date:'2026-10-30',time:'11:00',type:'Review',status:'Confirmed'},
  {id:'AP-504',patient:'Meera Joshi',doctor:'Dr. Kunal Shah',date:'2026-10-31',time:'12:30',type:'Consultation',status:'Cancelled'},
  {id:'AP-505',patient:'Kabir Khan',doctor:'Dr. Sana Khan',date:'2026-11-01',time:'15:00',type:'Check-up',status:'Confirmed'}
 ],
 bills:[
  {id:'BL-801',patient:'Abhay Patel',description:'Cardiology consultation',date:'2026-10-29',amount:900,status:'Paid'},
  {id:'BL-802',patient:'Vikram Singh',description:'Lab tests & diagnostics',date:'2026-10-28',amount:2450,status:'Pending'},
  {id:'BL-803',patient:'Ananya Iyer',description:'Neurology consultation',date:'2026-10-27',amount:800,status:'Paid'},
  {id:'BL-804',patient:'Kabir Khan',description:'X-ray and orthopedics',date:'2026-10-26',amount:1350,status:'Overdue'}
 ]
}
const money = n => '₹' + Number(n||0).toLocaleString('en-IN')
const readStore = () => {
 try {
  const stored=JSON.parse(localStorage.getItem('carepoint_data'))
  if(!stored)return seed
  const migratePatient=record=>record?.name==='Rahul Verma'?{...record,name:'Abhay Patel',...(record.email==='rahul@example.com'?{email:'abhay@example.com'}:{})}:record
  return {
   ...stored,
   patients:Array.isArray(stored.patients)?stored.patients.map(migratePatient):stored.patients,
   appointments:Array.isArray(stored.appointments)?stored.appointments.map(record=>record?.patient==='Rahul Verma'?{...record,patient:'Abhay Patel'}:record):stored.appointments,
   bills:Array.isArray(stored.bills)?stored.bills.map(record=>record?.patient==='Rahul Verma'?{...record,patient:'Abhay Patel'}:record):stored.bills
  }
 } catch { return seed }
}
const saveStore = data => localStorage.setItem('carepoint_data', JSON.stringify(data))
const today = '2026-10-30'
const nav = [
 ['Overview',LayoutDashboard,['Admin','Doctor','Receptionist','Patient']],
 ['Patients',Users,['Admin','Doctor','Receptionist']],
 ['Doctors',Stethoscope,['Admin','Receptionist','Patient']],
 ['Appointments',CalendarDays,['Admin','Doctor','Receptionist','Patient']],
 ['Billing',CreditCard,['Admin','Receptionist','Patient']]
]
function App(){
 const [user,setUser]=useState(()=>{try{const stored=JSON.parse(sessionStorage.getItem('carepoint_user'));return stored?.name==='Rahul Verma'?{...stored,name:'Abhay Patel',initials:'AP'}:stored}catch{return null}})
 const [data,setData]=useState(readStore)
 const [page,setPage]=useState('Overview')
 const [query,setQuery]=useState('')
 const [modal,setModal]=useState(null)
 const [editing,setEditing]=useState(null)
 const [mobile,setMobile]=useState(false)
 const [toast,setToast]=useState('')
 const [filter,setFilter]=useState('All')
 const [patientName,setPatientName]=useState(()=>{const stored=sessionStorage.getItem('carepoint_patient_name')||'';return stored==='Rahul Verma'?'Abhay Patel':stored})
 useEffect(()=>saveStore(data),[data])
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2600);return()=>clearTimeout(t)}},[toast])
 const notify=m=>setToast(m)
 const login=(email,password)=>{const found=accounts.find(a=>a.email.toLowerCase()===email.toLowerCase()&&a.password===password);if(!found)return false;setUser(found);sessionStorage.setItem('carepoint_user',JSON.stringify(found));setPage('Overview');return true}
 const logout=()=>{setUser(null);sessionStorage.removeItem('carepoint_user')}
 const role=user?.role
 const activeUser=role==='Patient'?{...user,name:patientName.trim()||user.name}:user
 const visibleNav=nav.filter(n=>n[2].includes(role))
 const update=(key,record)=>setData(d=>({...d,[key]:d[key].some(x=>x.id===record.id)?d[key].map(x=>x.id===record.id?record:x):[record,...d[key]]}))
 const remove=(key,id)=>{setData(d=>({...d,[key]:d[key].filter(x=>x.id!==id)}));notify('Record deleted')}
 const openAdd=(key)=>{setEditing(null);setModal(key)}
 const openEdit=(key,item)=>{setEditing(item);setModal(key)}
 const reset=()=>{if(confirm('Restore all demo records? Your current browser data will be replaced.')){setData(seed);notify('Demo data restored')}}
 if(!user)return <Login onLogin={login}/>
 const patientSelf=data.patients.find(p=>p.name===user.name)||data.patients[0]
 const pageTitle=page==='Overview'?'Good evening, '+user.name.split(' ')[0] : page
 return <div className="app-shell">
  <aside className={`sidebar ${mobile?'mobile-open':''}`}>
   <div className="brand"><div className="brand-mark"><HeartPulse size={22}/></div><div><b>carepoint</b><small>HOSPITAL SYSTEM</small></div><button className="close-mobile" onClick={()=>setMobile(false)}><X/></button></div>
   <div className="workspace"><span className="workspace-dot"/><span>City General Hospital</span><ChevronDown size={14}/></div>
   <div className="nav-label">WORKSPACE</div>
   <nav>{visibleNav.map(([label,Icon])=><button key={label} className={`nav-item ${page===label?'active':''}`} onClick={()=>{setPage(label);setMobile(false);setQuery('');setFilter('All')}}><Icon size={18}/><span>{label}</span>{label==='Appointments'&&<i>{data.appointments.length}</i>}</button>)}</nav>
   {role==='Admin'&&<><div className="nav-label">ADMINISTRATION</div><button className={`nav-item ${page==='Staff'?'active':''}`} onClick={()=>setPage('Staff')}><ShieldCheck size={18}/><span>Staff & access</span></button></>}
   <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><Activity size={18}/></div><b>Need a hand?</b><p>Visit the help centre for tips and support.</p><button onClick={()=>notify('Help centre is coming soon')}>Get support <ArrowUpRight size={14}/></button></div><div className="profile-mini"><div className="avatar">{user.initials}</div><div className="profile-text"><b>{user.name}</b><small>{user.role}</small></div><button title="Sign out" onClick={logout}><LogOut size={17}/></button></div></div>
  </aside>
  {mobile&&<div className="scrim" onClick={()=>setMobile(false)}/>}
  <main className="main">
   <header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="crumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="searchbox"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..."/><kbd>⌘ K</kbd></div><button className="icon-btn notification" onClick={()=>notify('You are all caught up')}><Bell size={18}/><i/></button><div className="top-avatar">{user.initials}</div></div></header>
   <div className="content">
    <div className="page-heading"><div><div className="eyebrow">{page==='Overview'?'FRIDAY, OCTOBER 30, 2026':'CITY GENERAL HOSPITAL'}</div><h1>{pageTitle}</h1><p>{page==='Overview'?'Here’s what’s happening at your hospital today.':'Manage and keep track of your hospital '+page.toLowerCase()+'.'}</p></div> {['Patients','Doctors','Appointments','Billing'].includes(page)&&(role!=='Patient'||page==='Appointments')&&<button className="primary-btn" onClick={()=>openAdd(page.toLowerCase())}><Plus size={17}/> {role==='Patient'?'Book appointment':`Add ${page==='Appointments'?'appointment':page==='Billing'?'bill':page==='Patients'?'patient':'doctor'}`}</button>}</div>
    {page==='Overview'&&<Dashboard data={data} role={role} setPage={setPage} openAdd={openAdd}/>}
    {page==='Patients'&&<Patients data={data} query={query} filter={filter} setFilter={setFilter} role={role} edit={x=>openEdit('patients',x)} remove={x=>remove('patients',x)}/>}
    {page==='Doctors'&&<Doctors data={data} query={query} role={role} edit={x=>openEdit('doctors',x)} remove={x=>remove('doctors',x)}/>}
     {page==='Appointments'&&<Appointments data={data} query={query} filter={filter} setFilter={setFilter} role={role} currentUser={activeUser} add={()=>openAdd('appointments')} edit={x=>openEdit('appointments',x)} remove={x=>remove('appointments',x)} update={update}/>}
    {page==='Billing'&&<Billing data={data} query={query} role={role} currentUser={activeUser} edit={x=>openEdit('bills',x)} remove={x=>remove('bills',x)} update={update}/>}
    {page==='Staff'&&<Staff/>}
    <footer>© 2026 CarePoint Health Systems <span>Built for better care <HeartPulse size={13}/></span></footer>
   </div>
  </main>
   {modal&&<RecordModal type={modal} editing={editing} data={data} currentUser={activeUser} onClose={()=>setModal(null)} onSave={record=>{update(modal,record);if(modal==='appointments'&&role==='Patient'){setPatientName(record.patient);sessionStorage.setItem('carepoint_patient_name',record.patient)}setModal(null);notify(editing?'Changes saved successfully':modal==='appointments'?'Appointment booked successfully':'New record added successfully')}}/>}
  {toast&&<div className="toast"><Check size={17}/>{toast}</div>}
 </div>
}
function Login({onLogin}){
 const [email,setEmail]=useState('admin@carepoint.in'),[password,setPassword]=useState(DEMO_PASSWORD),[error,setError]=useState('')
 const submit=e=>{e.preventDefault();if(!onLogin(email,password))setError('Email or password is incorrect. Try a demo account below.')}
 return <div className="login-page"><div className="login-art"><div className="login-brand"><div className="brand-mark"><HeartPulse size={23}/></div><b>carepoint</b></div><div className="art-copy"><span className="pill-light"><span/> YOUR HEALTH, OUR PRIORITY</span><h1>Care that connects.<br/><em>Health that thrives.</em></h1><p>A smarter, more connected way to manage hospital operations and deliver exceptional patient care.</p><div className="art-stats"><div><b>24/7</b><small>Care coordination</small></div><div><b>100%</b><small>Patient focused</small></div><div><b>One</b><small>Connected system</small></div></div></div><div className="art-footer">© 2026 CarePoint Health Systems <span>Trusted care, every day.</span></div><div className="decor decor-one"/><div className="decor decor-two"/></div><div className="login-panel"><div className="login-card"><div className="mobile-login-brand"><div className="brand-mark"><HeartPulse/></div><b>carepoint</b></div><div className="eyebrow">WELCOME BACK</div><h2>Sign in to your account</h2><p className="login-sub">Enter your credentials to access your workspace.</p><form onSubmit={submit}><label>Email address</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@hospital.com" required/><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/><div className="login-meta"><label className="remember"><input type="checkbox" defaultChecked/> Keep me signed in</label><a href="#demo" onClick={e=>{e.preventDefault();setError('Demo access only. Use one of the role accounts below.')}}>Need help?</a></div>{error&&<div className="error-msg">{error}</div>}<button className="login-btn">Sign in <ArrowUpRight size={17}/></button></form><div className="demo-block" id="demo"><div className="demo-title"><span>DEMO ACCESS</span><span>Choose a role</span></div><div className="role-grid">{accounts.map(a=><button key={a.role} onClick={()=>{setEmail(a.email);setPassword(a.password);setError('')}} className={email===a.email?'selected':''}><span className="role-symbol">{a.role==='Admin'?<ShieldCheck/>:a.role==='Doctor'?<Stethoscope/>:a.role==='Receptionist'?<ClipboardList/>:<UserRound/>}</span><span><b>{a.role}</b><small>{a.email}</small></span></button>)}</div><p className="demo-password">Demo password for all roles: <b>carepoint123</b></p></div><div className="secure-note"><ShieldCheck size={15}/> Secure access · Role-based workspace</div></div></div></div>
}
function Dashboard({data,role,setPage,openAdd}){
 const total=data.patients.length, active=data.patients.filter(p=>p.status==='Active'||p.status==='Admitted').length
 const appts=data.appointments.filter(a=>a.date===today&&a.status!=='Cancelled')
 const pending=data.bills.filter(b=>b.status!=='Paid').reduce((s,b)=>s+b.amount,0)
 const stats=[{label:'Total patients',value:total,change:'+12.5%',icon:Users,tint:'mint',sub:'Across all records'},{label:'Appointments today',value:appts.length,change:'Today',icon:CalendarDays,tint:'blue',sub:'Scheduled visits'},{label:'Available doctors',value:data.doctors.filter(d=>d.availability==='Available').length,change:`of ${data.doctors.length}`,icon:Stethoscope,tint:'purple',sub:'Ready for consultation'},{label:'Outstanding bills',value:money(pending),change:'Needs attention',icon:CreditCard,tint:'amber',sub:'Pending + overdue'}]
 return <><div className="stats-grid">{stats.map(s=><div className="stat-card" key={s.label}><div className="stat-top"><span>{s.label}</span><div className={`stat-icon ${s.tint}`}><s.icon size={19}/></div></div><div className="stat-value">{s.value}</div><div className="stat-bottom"><b>{s.change}</b><span>{s.sub}</span></div></div>)}</div><div className="dashboard-grid"><section className="panel appointments-panel"><div className="panel-head"><div><h3>Today’s appointments</h3><p>Your schedule at a glance</p></div><button className="text-btn" onClick={()=>setPage('Appointments')}>View schedule <ArrowUpRight size={15}/></button></div><div className="appointment-list">{appts.slice(0,5).map(a=><div className="appointment-row" key={a.id}><div className="time-block"><b>{a.time}</b><small>{a.date===today?'Today':'Upcoming'}</small></div><div className="person-dot">{a.patient.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div className="appointment-person"><b>{a.patient}</b><small>{a.doctor} · {a.type}</small></div><Status value={a.status}/></div>)}{!appts.length&&<Empty text="No appointments scheduled for today"/>}</div></section><section className="panel quick-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Common tasks, one click away</p></div></div><div className="quick-actions"><button onClick={()=>role==='Patient'?setPage('Appointments'):openAdd('patients')}><span className="quick-icon mint"><UserRound/></span><span><b>{role==='Patient'?'My profile':'Register patient'}</b><small>{role==='Patient'?'View your information':'Create a new patient record'}</small></span><ArrowUpRight/></button><button onClick={()=>role==='Patient'?setPage('Appointments'):openAdd('appointments')}><span className="quick-icon blue"><CalendarDays/></span><span><b>Book appointment</b><small>Schedule a consultation</small></span><ArrowUpRight/></button><button onClick={()=>setPage('Billing')}><span className="quick-icon amber"><CreditCard/></span><span><b>View billing</b><small>Track invoices and payments</small></span><ArrowUpRight/></button></div></section></div><div className="bottom-grid"><section className="panel"><div className="panel-head"><div><h3>Patient overview</h3><p>Recent patient registrations</p></div><button className="text-btn" onClick={()=>setPage('Patients')}>All patients <ArrowUpRight size={15}/></button></div><div className="mini-table"><div className="mini-head"><span>PATIENT</span><span>CONDITION</span><span>STATUS</span></div>{data.patients.slice(0,4).map(p=><div className="mini-row" key={p.id}><div className="table-person"><span className="person-dot">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><span><b>{p.name}</b><small>{p.id}</small></span></div><span>{p.condition}</span><Status value={p.status}/></div>)}</div></section><section className="panel occupancy-panel"><div className="panel-head"><div><h3>Hospital snapshot</h3><p>Operational overview</p></div><MoreHorizontal size={19}/></div><div className="occupancy-number"><b>{active}</b><span>active patients</span></div><div className="progress-track"><i style={{width:`${Math.min(100,active/Math.max(1,total)*100)}%`}}/></div><div className="snapshot-lines"><div><span><i className="dot green"/> Active / admitted</span><b>{active}</b></div><div><span><i className="dot gray"/> Discharged</span><b>{total-active}</b></div><div><span><i className="dot blue"/> Total doctors</span><b>{data.doctors.length}</b></div></div></section></div></>
}
function Status({value}){let cls=value?.toLowerCase().replaceAll(' ','-');return <span className={`status ${cls}`}>{value}</span>}
function TableToolbar({query,filter,setFilter,filters=['All','Active','Admitted','Discharged']}){return <div className="toolbar"><div className="toolbar-search"><Search size={16}/><span>{query?'Search applied in top bar':'Use the search field above to find records'}</span></div><div className="filter-wrap"><Filter size={15}/><select value={filter} onChange={e=>setFilter(e.target.value)}>{filters.map(f=><option key={f}>{f}</option>)}</select></div></div>}
function Patients({data,query,filter,setFilter,role,edit,remove}){let rows=data.patients.filter(p=>([p.name,p.id,p.phone,p.condition].join(' ').toLowerCase().includes(query.toLowerCase()))&&(filter==='All'||p.status===filter));return <section className="panel data-panel"><TableToolbar query={query} filter={filter} setFilter={setFilter}/><div className="table-scroll"><table><thead><tr><th>Patient</th><th>Contact</th><th>Age / gender</th><th>Blood group</th><th>Condition</th><th>Status</th>{role==='Admin'&&<th>Actions</th>}</tr></thead><tbody>{rows.map(p=><tr key={p.id}><td><div className="table-person"><span className="person-dot">{p.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><span><b>{p.name}</b><small>{p.id}</small></span></div></td><td>{p.phone}<small className="sub-cell">{p.email}</small></td><td>{p.age} yrs · {p.gender}</td><td><span className="blood">{p.blood}</span></td><td>{p.condition}</td><td><Status value={p.status}/></td>{role==='Admin'&&<td><Actions edit={()=>edit(p)} remove={()=>remove(p.id)}/></td>}</tr>)}</tbody></table>{!rows.length&&<Empty text="No patients match your search"/>}</div><div className="table-foot">Showing <b>{rows.length}</b> of <b>{data.patients.length}</b> patient records</div></section>}
function Doctors({data,query,role,edit,remove}){let rows=data.doctors.filter(d=>([d.name,d.specialty,d.id].join(' ').toLowerCase().includes(query.toLowerCase())));return <div className="doctor-grid">{rows.map(d=><div className="doctor-card" key={d.id}><div className="doctor-top"><div className="doctor-avatar">{d.name.replace('Dr. ','').split(' ').map(x=>x[0]).join('')}</div><Status value={d.availability}/></div><h3>{d.name}</h3><p>{d.specialty}</p><div className="doctor-meta"><span><Clock3 size={15}/> {d.experience} experience</span><span><CreditCard size={15}/> {money(d.fee)} / visit</span><span><Activity size={15}/> {d.phone}</span></div><div className="doctor-bottom"><small>{d.id}</small>{role==='Admin'&&<Actions edit={()=>edit(d)} remove={()=>remove(d.id)}/>}</div></div>)}{!rows.length&&<Empty text="No doctors found"/>}</div>}
function Appointments({data,query,filter,setFilter,role,currentUser,add,edit,remove,update}){
 let rows=data.appointments.filter(a=>([a.id,a.patient,a.doctor,a.type].join(' ').toLowerCase().includes(query.toLowerCase()))&&(filter==='All'||a.status===filter)&&(role!=='Patient'||a.patient===currentUser.name)&&(role!=='Doctor'||a.doctor===currentUser.name));
 const cancel=id=>{const item=data.appointments.find(a=>a.id===id);if(item&&confirm('Cancel this appointment?'))update('appointments',{...item,status:'Cancelled'})}
 return <section className="panel data-panel">
  <TableToolbar query={query} filter={filter} setFilter={setFilter} filters={['All','Confirmed','Waiting','Cancelled']}/>
  <div className="table-scroll"><table><thead><tr><th>Appointment ID</th><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Visit type</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  {rows.map(a=><tr key={a.id}><td><b className="id-text">{a.id}</b></td><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}<small className="sub-cell">{a.time}</small></td><td>{a.type}</td><td><Status value={a.status}/></td><td>{role==='Patient'?(a.status!=='Cancelled'&&a.date>=today?<button className="cancel-link" onClick={()=>cancel(a.id)}>Cancel</button>:<span className="muted">—</span>):<Actions edit={()=>edit(a)} remove={()=>remove(a.id)}/>}</td></tr>)}
  </tbody></table>{!rows.length&&<Empty text="No appointments found"/>}</div>
  <div className="table-foot">{role==='Patient'?'Your appointments':'Showing appointments'} · <b>{rows.length}</b> records</div>
 </section>
}
function Billing({data,query,role,currentUser,edit,remove,update}){let rows=data.bills.filter(b=>([b.id,b.patient,b.description].join(' ').toLowerCase().includes(query.toLowerCase()))&&(role!=='Patient'||b.patient===currentUser.name));let total=data.bills.reduce((s,b)=>s+b.amount,0),paid=data.bills.filter(b=>b.status==='Paid').reduce((s,b)=>s+b.amount,0);return <><div className="billing-summary"><div><span>Total billed</span><b>{money(total)}</b></div><div><span>Collected</span><b>{money(paid)}</b></div><div><span>Outstanding</span><b>{money(total-paid)}</b></div></div><section className="panel data-panel"><div className="toolbar"><div className="toolbar-search"><FileText size={16}/><span>Invoices and payment records</span></div><span className="muted">{rows.length} records</span></div><div className="table-scroll"><table><thead><tr><th>Invoice</th><th>Patient</th><th>Description</th><th>Date</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(b=><tr key={b.id}><td><b className="id-text">{b.id}</b></td><td>{b.patient}</td><td>{b.description}</td><td>{b.date}</td><td><b>{money(b.amount)}</b></td><td><Status value={b.status}/></td><td>{role==='Patient'?<span className="muted">—</span>:<Actions edit={()=>edit(b)} remove={()=>remove(b.id)}/>}</td></tr>)}</tbody></table>{!rows.length&&<Empty text="No billing records found"/>}</div></section></>}
function Staff(){return <section className="panel staff-panel"><div className="panel-head"><div><h3>Staff & access management</h3><p>Demo accounts available in this environment</p></div><ShieldCheck/></div>{accounts.map(a=><div className="staff-row" key={a.role}><div className="avatar">{a.initials}</div><div><b>{a.name}</b><small>{a.email}</small></div><Status value={a.role}/><span className="staff-access">Demo access</span></div>)}<div className="notice"><ShieldCheck size={18}/><p><b>Role-based access is enabled.</b> Admin can manage records and staff overview. Doctors, receptionists and patients see only the sections intended for their role.</p></div></section>}
function Actions({edit,remove}){return <div className="row-actions"><button title="Edit" onClick={edit}><Pencil size={15}/></button><button title="Delete" onClick={()=>{if(confirm('Delete this record? This cannot be undone.'))remove()}}><Trash2 size={15}/></button></div>}
function Empty({text}){return <div className="empty-state"><div><Search size={20}/></div><b>{text}</b><span>Try adjusting your search or filters.</span></div>}
function RecordModal({type,editing,data,currentUser,onClose,onSave}){const config={patients:{title:'Patient',fields:[['name','Full name','text'],['age','Age','number'],['gender','Gender','select',['Male','Female','Other']],['phone','Phone number','text'],['email','Email address','email'],['blood','Blood group','select',['A+','A-','B+','B-','AB+','AB-','O+','O-']],['condition','Medical condition','text'],['status','Status','select',['Active','Admitted','Discharged']]]},doctors:{title:'Doctor',fields:[['name','Doctor name','text'],['specialty','Specialty','text'],['experience','Experience','text'],['phone','Phone number','text'],['fee','Consultation fee (₹)','number'],['availability','Availability','select',['Available','On leave']]]},appointments:{title:'Appointment',fields:[['patient','Patient name','text'],['doctor','Doctor','select',data.doctors.filter(d=>d.availability==='Available').map(d=>d.name)],['date','Date','date'],['time','Time','time'],['type','Visit type','select',['Consultation','Follow-up','Review','Check-up']],['status','Status','select',['Confirmed','Waiting','Cancelled']]]},bills:{title:'Bill',fields:[['patient','Patient name','select',data.patients.map(p=>p.name)],['description','Description','text'],['date','Invoice date','date'],['amount','Amount (₹)','number'],['status','Payment status','select',['Paid','Pending','Overdue']]]}}
 const c=config[type],initial=editing||Object.fromEntries(c.fields.map(f=>[f[0],f[0]==='date'?today:f[0]==='status'?(type==='patients'?'Active':type==='appointments'?'Confirmed':'Pending'):f[0]==='age'||f[0]==='amount'||f[0]==='fee'?'':f[3]?.[0]||'']))
 if(type==='appointments'&&currentUser?.role==='Patient')initial.patient=currentUser.name;
 const [form,setForm]=useState(initial),[err,setErr]=useState('')
 const change=(k,v)=>setForm(f=>({...f,[k]:v}))
 const submit=e=>{e.preventDefault();if(!form.name&&!form.patient){setErr('Please complete the required fields.');return}if(type==='appointments'&&form.date<today){setErr('Please choose today or a future date.');return}const id=editing?.id||({patients:'PT-',doctors:'DR-',appointments:'AP-',bills:'BL-'}[type]+Math.floor(1000+Math.random()*8999));onSave({...form,id,age:Number(form.age)||form.age,fee:Number(form.fee)||0,amount:Number(form.amount)||0})}
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal"><div className="modal-head"><div><div className="eyebrow">{editing?'UPDATE RECORD':'NEW RECORD'}</div><h2>{editing?'Edit':'Add'} {c.title}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div><form onSubmit={submit}><div className="form-grid">{c.fields.map(([key,label,kind,options])=><label className="field" key={key}>{label}{kind==='select'?<select value={form[key]??''} onChange={e=>change(key,e.target.value)} required ><option value="">Select {label.toLowerCase()}</option>{options.map(o=><option key={o}>{o}</option>)}</select>:<input type={kind} value={form[key]??''} onChange={e=>change(key,e.target.value)} required placeholder={`Enter ${label.toLowerCase()}`} min={kind==='number'?'0':kind==='date'&&type==='appointments'?today:undefined}/>}</label>)}</div>{err&&<div className="error-msg">{err}</div>}<div className="modal-actions"><button type="button" className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn"><Check size={16}/>{editing?'Save changes':'Create record'}</button></div></form></div></div>
}
export default App
