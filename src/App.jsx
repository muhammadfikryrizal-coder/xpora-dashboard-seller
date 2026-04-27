import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Package, Factory, ShieldCheck, TruckIcon, Users, AlertTriangle, ChevronRight, ArrowUpRight, ArrowDownRight, Bell, Search, Menu, X, MessageSquare, Clock, CheckCircle, XCircle, Eye, Pause, Settings, BarChart3, Home, FileText, Globe, Layers, Send, RefreshCw, Star, Zap, Activity, TrendingUp, Box, Clipboard, Award, Target } from "lucide-react";

// ── Design Tokens ──
const T = {
  bg: "#0B0F1A",
  surface: "#111827",
  surfaceAlt: "#1A2236",
  card: "#151D2E",
  cardHover: "#1C2640",
  border: "#1E293B",
  borderLight: "#2A3654",
  text: "#F1F5F9",
  textSec: "#94A3B8",
  textMuted: "#64748B",
  primary: "#6366F1",
  primaryGlow: "rgba(99,102,241,0.15)",
  accent: "#22D3EE",
  accentGlow: "rgba(34,211,238,0.12)",
  success: "#10B981",
  successBg: "rgba(16,185,129,0.12)",
  warning: "#F59E0B",
  warningBg: "rgba(245,158,11,0.12)",
  danger: "#EF4444",
  dangerBg: "rgba(239,68,68,0.12)",
  info: "#3B82F6",
  infoBg: "rgba(59,130,246,0.12)",
  gradient1: "linear-gradient(135deg,#6366F1,#8B5CF6)",
  gradient2: "linear-gradient(135deg,#22D3EE,#06B6D4)",
  gradient3: "linear-gradient(135deg,#10B981,#059669)",
  radius: 16,
  radiusSm: 10,
  shadow: "0 4px 24px rgba(0,0,0,0.3)",
};

const CHART_COLORS = ["#6366F1","#22D3EE","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#14B8A6"];

// ── Fake Data ──
const kpiData = [
  { label:"Pesanan Aktif", value:"1,247", change:"+12.3%", up:true, icon:Package, color:T.primary, bg:T.primaryGlow },
  { label:"Pesanan Baru", value:"89", change:"+8.1%", up:true, icon:FileText, color:T.accent, bg:T.accentGlow },
  { label:"UMKM Aktif", value:"342", change:"+3.2%", up:true, icon:Factory, color:T.success, bg:T.successBg },
  { label:"Nilai Escrow", value:"Rp 2.8M", change:"-1.4%", up:false, icon:Target, color:T.warning, bg:T.warningBg },
  { label:"Kapasitas Harian", value:"4,520", change:"+5.7%", up:true, icon:Zap, color:T.info, bg:T.infoBg },
  { label:"Rasio QC Lolos", value:"94.2%", change:"+1.8%", up:true, icon:ShieldCheck, color:T.success, bg:T.successBg },
];

const orderTrend = Array.from({length:14},(_,i)=>({day:`${i+1} Apr`,baru:Math.floor(Math.random()*40+30),proses:Math.floor(Math.random()*60+50),selesai:Math.floor(Math.random()*50+40)}));

const qcData = [{name:"Lolos",value:942},{name:"Cacat Minor",value:38},{name:"Cacat Mayor",value:15},{name:"Ditolak",value:5}];

const productionHouses = [
  {name:"Batik Sekar Arum",owner:"Ibu Sari",loc:"Yogyakarta",capacity:120,score:96,orders:14,status:"active",type:"Batik"},
  {name:"Tenun Makmur Jaya",owner:"Pak Budi",loc:"NTT",capacity:80,score:91,orders:9,status:"active",type:"Tenun"},
  {name:"Keramik Nusantara",owner:"Ibu Dewi",loc:"Bali",capacity:200,score:88,orders:22,status:"active",type:"Keramik"},
  {name:"Ukir Jepara Indah",owner:"Pak Hasan",loc:"Jepara",capacity:60,score:93,orders:7,status:"active",type:"Ukiran"},
  {name:"Songket Palembang",owner:"Ibu Rina",loc:"Palembang",capacity:45,score:85,orders:5,status:"warning",type:"Songket"},
  {name:"Rotan Kalimantan",owner:"Pak Eko",loc:"Banjarmasin",capacity:150,score:79,orders:18,status:"active",type:"Rotan"},
  {name:"Perak Celuk Bali",owner:"Pak Wayan",loc:"Bali",capacity:90,score:94,orders:11,status:"active",type:"Perhiasan"},
  {name:"Gerabah Kasongan",owner:"Ibu Tutik",loc:"Bantul",capacity:110,orders:13,score:87,status:"active",type:"Gerabah"},
];

const bottlenecks = [
  {house:"Songket Palembang",issue:"Keterlambatan bahan baku",severity:"high",delay:"3 hari"},
  {house:"Rotan Kalimantan",issue:"Kapasitas melebihi kuota",severity:"medium",delay:"1 hari"},
  {house:"Gerabah Kasongan",issue:"QC gagal berulang",severity:"high",delay:"2 hari"},
];

const ordersList = [
  {id:"ORD-2841",buyer:"Global Crafts Co.",product:"Batik Tulis",qty:500,deadline:"28 Apr",status:"production",house:"Batik Sekar Arum",progress:68},
  {id:"ORD-2842",buyer:"Artisan Direct UK",product:"Tenun Ikat",qty:200,deadline:"30 Apr",status:"production",house:"Tenun Makmur Jaya",progress:45},
  {id:"ORD-2843",buyer:"Asia Home Decor",product:"Keramik Set",qty:1000,deadline:"5 Mei",status:"qc",house:"Keramik Nusantara",progress:82},
  {id:"ORD-2844",buyer:"Nordic Imports",product:"Ukiran Kayu",qty:150,deadline:"10 Mei",status:"new",house:"Ukir Jepara Indah",progress:12},
  {id:"ORD-2845",buyer:"Pacific Trade LLC",product:"Rotan Basket",qty:800,deadline:"3 Mei",status:"shipping",house:"Rotan Kalimantan",progress:95},
  {id:"ORD-2846",buyer:"Heritage Goods SG",product:"Perak Ring",qty:300,deadline:"15 Mei",status:"new",house:"Perak Celuk Bali",progress:5},
];

const defectTypes = [
  {type:"Warna Pudar",count:12,pct:31.6},{type:"Jahitan Lepas",count:8,pct:21.1},{type:"Retak Halus",count:6,pct:15.8},{type:"Ukuran Salah",count:5,pct:13.2},{type:"Bahan Cacat",count:4,pct:10.5},{type:"Lainnya",count:3,pct:7.9},
];

const capacityByRegion = [
  {region:"Jawa",capacity:1800,used:1520},{region:"Bali",capacity:850,used:710},{region:"NTT/NTB",capacity:400,used:320},{region:"Sumatera",capacity:500,used:380},{region:"Kalimantan",capacity:350,used:290},{region:"Sulawesi",capacity:200,used:140},
];

const exportStats = [
  {month:"Jan",volume:12400},{month:"Feb",volume:13800},{month:"Mar",volume:15200},{month:"Apr",volume:14600},{month:"Mei",volume:16100},{month:"Jun",volume:17800},
];

const applicants = [
  {name:"Tenun Lombok Baru",loc:"Lombok",type:"Tenun",progress:65,status:"standardisasi"},
  {name:"Bambu Craft Bandung",loc:"Bandung",type:"Kerajinan Bambu",progress:30,status:"review"},
  {name:"Anyaman Papua",loc:"Jayapura",type:"Anyaman",progress:10,status:"baru"},
];

// ── Components ──
const AnimatedNumber = ({value, suffix=""}) => {
  const [display, setDisplay] = useState("0");
  useEffect(()=>{
    const num = parseFloat(value.replace(/[^0-9.]/g,""));
    if(isNaN(num)){setDisplay(value);return;}
    const prefix = value.replace(/[0-9.,]/g,"").trim();
    let start = 0;
    const dur = 1200;
    const st = performance.now();
    const tick = (now) => {
      const p = Math.min((now-st)/dur,1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = Math.floor(num * ease);
      setDisplay(prefix ? `${prefix} ${cur.toLocaleString("id-ID")}` : cur.toLocaleString("id-ID"));
      if(p < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  },[value]);
  return <span>{display}{suffix}</span>;
};

const Sidebar = ({active, setActive, collapsed, setCollapsed}) => {
  const navItems = [
    {id:"dashboard",label:"Dashboard",icon:Home},
    {id:"orders",label:"Pesanan",icon:Package},
    {id:"production",label:"Rumah Produksi",icon:Factory},
    {id:"quality",label:"Pusat QC",icon:ShieldCheck},
    {id:"export",label:"Ekspor",icon:Globe},
    {id:"applicants",label:"Pelamar Baru",icon:Users},
  ];
  return (
    <div style={{
      width: collapsed ? 72 : 260,
      minHeight:"100vh",
      background: T.surface,
      borderRight:`1px solid ${T.border}`,
      display:"flex",flexDirection:"column",
      transition:"width 0.3s cubic-bezier(.4,0,.2,1)",
      position:"fixed",left:0,top:0,zIndex:50,
      overflow:"hidden",
    }}>
      <div style={{padding:collapsed?"20px 16px":"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`}}>
        {!collapsed && (
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:T.gradient1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Layers size={20} color="#fff" />
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:T.text,letterSpacing:"-0.02em"}}>UMKM Hub</div>
              <div style={{fontSize:11,color:T.textMuted,marginTop:1}}>Production Platform</div>
            </div>
          </div>
        )}
        <button onClick={()=>setCollapsed(!collapsed)} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,padding:4}} aria-label={collapsed?"Expand sidebar":"Collapse sidebar"}>
          {collapsed ? <Menu size={20}/> : <X size={18}/>}
        </button>
      </div>
      <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
        {navItems.map(item=>{
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={()=>setActive(item.id)}
              style={{
                display:"flex",alignItems:"center",gap:14,
                padding:collapsed?"12px 16px":"12px 16px",
                borderRadius:T.radiusSm,border:"none",cursor:"pointer",
                width:"100%",textAlign:"left",
                background:isActive ? T.primaryGlow : "transparent",
                color:isActive ? T.primary : T.textSec,
                transition:"all 0.2s",
                fontSize:14,fontWeight:isActive?600:400,
              }}
              onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=T.surfaceAlt}}
              onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent"}}
              aria-label={item.label}
            >
              <Icon size={20} style={{minWidth:20}} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      {!collapsed && (
        <div style={{padding:"16px 20px",borderTop:`1px solid ${T.border}`,margin:"0 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,borderRadius:999,background:T.gradient2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#0B0F1A"}}>A</div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:T.text}}>Admin</div>
              <div style={{fontSize:11,color:T.textMuted}}>Seller Platform</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({item, index}) => {
  const Icon = item.icon;
  return (
    <div style={{
      background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,
      padding:"22px 24px",position:"relative",overflow:"hidden",
      transition:"all 0.3s",cursor:"default",
      animation:`fadeSlideUp 0.5s ease ${index*0.08}s both`,
    }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor=item.color;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${item.bg}`}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
    >
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:item.bg,filter:"blur(20px)"}} />
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative",zIndex:1}}>
        <div>
          <div style={{fontSize:12,color:T.textMuted,fontWeight:500,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>{item.label}</div>
          <div style={{fontSize:28,fontWeight:800,color:T.text,letterSpacing:"-0.03em",lineHeight:1}}><AnimatedNumber value={item.value} /></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginTop:10,fontSize:13,fontWeight:600,color:item.up?T.success:T.danger}}>
            {item.up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
            {item.change}
          </div>
        </div>
        <div style={{width:44,height:44,borderRadius:12,background:item.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={22} color={item.color} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({status}) => {
  const map = {
    production:{bg:T.infoBg,color:T.info,label:"Produksi"},
    qc:{bg:T.warningBg,color:T.warning,label:"QC"},
    new:{bg:T.primaryGlow,color:T.primary,label:"Baru"},
    shipping:{bg:T.successBg,color:T.success,label:"Kirim"},
    active:{bg:T.successBg,color:T.success,label:"Aktif"},
    warning:{bg:T.warningBg,color:T.warning,label:"Peringatan"},
    standardisasi:{bg:T.infoBg,color:T.info,label:"Standardisasi"},
    review:{bg:T.warningBg,color:T.warning,label:"Review"},
    baru:{bg:T.primaryGlow,color:T.primary,label:"Baru"},
  };
  const s = map[status]||map.new;
  return <span style={{padding:"4px 12px",borderRadius:999,background:s.bg,color:s.color,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{s.label}</span>;
};

const ProgressBar = ({value, color=T.primary, height=6}) => (
  <div style={{width:"100%",height,borderRadius:999,background:T.surfaceAlt,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${value}%`,borderRadius:999,background:color,transition:"width 1.2s cubic-bezier(.4,0,.2,1)"}} />
  </div>
);

const SectionCard = ({title, icon:Icon, children, action, style:s}) => (
  <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,overflow:"hidden",...s}}>
    <div style={{padding:"18px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {Icon && <Icon size={18} color={T.primary}/>}
        <span style={{fontSize:15,fontWeight:700,color:T.text}}>{title}</span>
      </div>
      {action}
    </div>
    <div style={{padding:24}}>{children}</div>
  </div>
);

// ── Pages ──
const DashboardPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:28}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:16}}>
      {kpiData.map((k,i)=><KPICard key={i} item={k} index={i}/>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
      <SectionCard title="Tren Pesanan" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={orderTrend}>
            <defs>
              <linearGradient id="gBaru" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366F1" stopOpacity={0.3}/><stop offset="100%" stopColor="#6366F1" stopOpacity={0}/></linearGradient>
              <linearGradient id="gProses" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3}/><stop offset="100%" stopColor="#22D3EE" stopOpacity={0}/></linearGradient>
              <linearGradient id="gSelesai" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981" stopOpacity={0.3}/><stop offset="100%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="day" stroke={T.textMuted} tick={{fontSize:11}} />
            <YAxis stroke={T.textMuted} tick={{fontSize:11}} />
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text}} />
            <Area type="monotone" dataKey="baru" stroke="#6366F1" fill="url(#gBaru)" strokeWidth={2} name="Baru" />
            <Area type="monotone" dataKey="proses" stroke="#22D3EE" fill="url(#gProses)" strokeWidth={2} name="Proses" />
            <Area type="monotone" dataKey="selesai" stroke="#10B981" fill="url(#gSelesai)" strokeWidth={2} name="Selesai" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Distribusi QC" icon={ShieldCheck}>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={qcData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
              {qcData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i]}/>)}
            </Pie>
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text}} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginTop:8}}>
          {qcData.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.textSec}}>
              <div style={{width:8,height:8,borderRadius:999,background:CHART_COLORS[i]}}/>
              {d.name}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <SectionCard title="Kapasitas Produksi per Wilayah" icon={BarChart3}>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={capacityByRegion} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="region" stroke={T.textMuted} tick={{fontSize:11}} />
            <YAxis stroke={T.textMuted} tick={{fontSize:11}}/>
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text}}/>
            <Bar dataKey="capacity" fill="#6366F133" radius={[6,6,0,0]} name="Kapasitas"/>
            <Bar dataKey="used" fill="#6366F1" radius={[6,6,0,0]} name="Terpakai"/>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Peringatan Bottleneck" icon={AlertTriangle}
        action={<span style={{fontSize:12,color:T.danger,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Bell size={14}/>{bottlenecks.length} aktif</span>}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {bottlenecks.map((b,i)=>(
            <div key={i} style={{padding:"14px 18px",borderRadius:T.radiusSm,border:`1px solid ${b.severity==="high"?T.danger+"40":T.warning+"40"}`,background:b.severity==="high"?T.dangerBg:T.warningBg,display:"flex",alignItems:"center",justifyContent:"space-between",animation:`fadeSlideUp 0.4s ease ${i*0.1}s both`}}>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:T.text}}>{b.house}</div>
                <div style={{fontSize:12,color:T.textSec,marginTop:3}}>{b.issue}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,fontWeight:600,color:b.severity==="high"?T.danger:T.warning}}>+{b.delay}</div>
                <button style={{marginTop:6,fontSize:11,padding:"4px 12px",borderRadius:999,border:`1px solid ${T.primary}`,background:"transparent",color:T.primary,cursor:"pointer",fontWeight:600}}>Intervensi</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);

const OrdersPage = ({setModal}) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? ordersList : ordersList.filter(o=>o.status===filter);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {[{id:"all",label:"Semua"},{id:"new",label:"Baru"},{id:"production",label:"Produksi"},{id:"qc",label:"QC"},{id:"shipping",label:"Pengiriman"}].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            style={{padding:"8px 20px",borderRadius:999,fontSize:13,fontWeight:600,border:`1px solid ${filter===f.id?T.primary:T.border}`,background:filter===f.id?T.primaryGlow:"transparent",color:filter===f.id?T.primary:T.textSec,cursor:"pointer",transition:"all 0.2s"}}>
            {f.label}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map((o,i)=>(
          <div key={o.id} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"20px 24px",display:"grid",gridTemplateColumns:"0.8fr 1.2fr 1fr 0.6fr 1.5fr 0.8fr",alignItems:"center",gap:16,transition:"all 0.2s",cursor:"pointer",animation:`fadeSlideUp 0.4s ease ${i*0.06}s both`}}
            onClick={()=>setModal(o)}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.background=T.cardHover}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.card}}
          >
            <div>
              <div style={{fontSize:14,fontWeight:700,color:T.primary}}>{o.id}</div>
              <div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{o.deadline}</div>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:T.text}}>{o.buyer}</div>
              <div style={{fontSize:12,color:T.textSec,marginTop:2}}>{o.product} × {o.qty}</div>
            </div>
            <div style={{fontSize:13,color:T.textSec}}>{o.house}</div>
            <StatusBadge status={o.status}/>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <ProgressBar value={o.progress} color={o.progress>80?T.success:o.progress>50?T.accent:T.primary}/>
              <span style={{fontSize:13,fontWeight:700,color:T.text,minWidth:36}}>{o.progress}%</span>
            </div>
            <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
              <button style={{width:34,height:34,borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.textSec}} aria-label="Lihat detail"><Eye size={15}/></button>
              <button style={{width:34,height:34,borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:T.textSec}} aria-label="Kirim pesan"><MessageSquare size={15}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductionPage = () => {
  const [search, setSearch] = useState("");
  const list = productionHouses.filter(h=>h.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        {[{label:"Total Rumah Produksi",value:"342",icon:Factory,color:T.primary},{label:"Kapasitas Total/Hari",value:"4,520",icon:Zap,color:T.accent},{label:"Rata-rata Skor",value:"89.1",icon:Star,color:T.warning},{label:"Pesanan Aktif",value:"1,247",icon:Package,color:T.success}].map((s,i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>{<s.icon size={20} color={s.color}/>}</div>
            <div>
              <div style={{fontSize:11,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:800,color:T.text,letterSpacing:"-0.02em"}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{position:"relative",flex:1,maxWidth:360}}>
          <Search size={16} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:T.textMuted}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari rumah produksi..." style={{width:"100%",padding:"10px 14px 10px 40px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:T.surfaceAlt,color:T.text,fontSize:14,outline:"none"}} />
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
        {list.map((h,i)=>(
          <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"22px 24px",transition:"all 0.25s",animation:`fadeSlideUp 0.4s ease ${i*0.05}s both`}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=T.shadow}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none"}}
          >
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:T.text}}>{h.name}</div>
                <div style={{fontSize:12,color:T.textSec,marginTop:3}}>{h.owner} · {h.loc}</div>
              </div>
              <StatusBadge status={h.status}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <span style={{padding:"3px 10px",borderRadius:999,background:T.surfaceAlt,fontSize:11,color:T.accent,fontWeight:600}}>{h.type}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
              <div><div style={{fontSize:11,color:T.textMuted}}>Kapasitas</div><div style={{fontSize:16,fontWeight:700,color:T.text}}>{h.capacity}<span style={{fontSize:11,color:T.textMuted}}>/hari</span></div></div>
              <div><div style={{fontSize:11,color:T.textMuted}}>Pesanan</div><div style={{fontSize:16,fontWeight:700,color:T.text}}>{h.orders}</div></div>
              <div><div style={{fontSize:11,color:T.textMuted}}>Skor</div><div style={{fontSize:16,fontWeight:700,color:h.score>=90?T.success:h.score>=80?T.warning:T.danger}}>{h.score}</div></div>
            </div>
            <ProgressBar value={h.score} color={h.score>=90?T.success:h.score>=80?T.warning:T.danger}/>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${T.primary}`,background:"transparent",color:T.primary,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Eye size={14}/>Rapor</button>
              <button style={{flex:1,padding:"8px 0",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Settings size={14}/>Kuota</button>
              <button style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} aria-label="Chat"><MessageSquare size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QualityPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:24}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      {[{label:"Rasio Lolos QC",value:"94.2%",icon:CheckCircle,color:T.success},{label:"Cacat Terdeteksi",value:"58",icon:XCircle,color:T.danger},{label:"Akurasi Klasifikasi AI",value:"97.8%",icon:Activity,color:T.primary},{label:"Penjadwalan Perbaikan",value:"12",icon:RefreshCw,color:T.warning}].map((s,i)=>(
        <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,animation:`fadeSlideUp 0.4s ease ${i*0.08}s both`}}>
          <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><s.icon size={20} color={s.color}/></div>
          <div>
            <div style={{fontSize:11,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:T.text}}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <SectionCard title="Klasifikasi Cacat Otomatis" icon={Layers}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {defectTypes.map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:120,fontSize:13,color:T.textSec,flexShrink:0}}>{d.type}</div>
              <div style={{flex:1}}><ProgressBar value={d.pct} color={CHART_COLORS[i%CHART_COLORS.length]} height={8}/></div>
              <div style={{fontSize:13,fontWeight:700,color:T.text,minWidth:40,textAlign:"right"}}>{d.count}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Galeri Anomali & IoT" icon={Eye}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {["Warna Inkonsisten","Tekstur Abnormal","Dimensi Salah","Retakan Mikro","Bahan Asing","Pola Rusak"].map((a,i)=>(
            <div key={i} style={{aspectRatio:"1",borderRadius:T.radiusSm,background:T.surfaceAlt,border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.danger;e.currentTarget.style.background=T.dangerBg}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surfaceAlt}}
            >
              <AlertTriangle size={22} color={T.danger}/>
              <div style={{fontSize:11,color:T.textSec,textAlign:"center",padding:"0 8px"}}>{a}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:16,padding:"14px 18px",borderRadius:T.radiusSm,background:T.surfaceAlt,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:12,color:T.textMuted,marginBottom:6}}>Summary Kinerja IoT</div>
          <div style={{display:"flex",gap:20}}>
            <div><span style={{fontSize:18,fontWeight:800,color:T.success}}>98.1%</span><span style={{fontSize:11,color:T.textMuted,marginLeft:4}}>Uptime</span></div>
            <div><span style={{fontSize:18,fontWeight:800,color:T.accent}}>124</span><span style={{fontSize:11,color:T.textMuted,marginLeft:4}}>Sensor</span></div>
            <div><span style={{fontSize:18,fontWeight:800,color:T.warning}}>3</span><span style={{fontSize:11,color:T.textMuted,marginLeft:4}}>Perlu Kalibrasi</span></div>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
);

const ExportPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:24}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
      {[{label:"Dalam Pengiriman",value:"47",icon:TruckIcon,color:T.primary},{label:"Dokumen Siap",value:"89",icon:FileText,color:T.success},{label:"Partner Logistik",value:"12",icon:Globe,color:T.accent},{label:"Volume Bulan Ini",value:"16,100",icon:Box,color:T.warning}].map((s,i)=>(
        <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:T.radius,padding:"18px 20px",display:"flex",alignItems:"center",gap:14,animation:`fadeSlideUp 0.4s ease ${i*0.08}s both`}}>
          <div style={{width:40,height:40,borderRadius:10,background:`${s.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}><s.icon size={20} color={s.color}/></div>
          <div>
            <div style={{fontSize:11,color:T.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
            <div style={{fontSize:22,fontWeight:800,color:T.text}}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
      <SectionCard title="Volume Ekspor (6 Bulan)" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={exportStats}>
            <defs><linearGradient id="gExport" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3}/><stop offset="100%" stopColor="#22D3EE" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="month" stroke={T.textMuted} tick={{fontSize:12}}/>
            <YAxis stroke={T.textMuted} tick={{fontSize:12}}/>
            <Tooltip contentStyle={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,fontSize:13,color:T.text}}/>
            <Area type="monotone" dataKey="volume" stroke="#22D3EE" fill="url(#gExport)" strokeWidth={2.5} name="Volume"/>
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
      <SectionCard title="Checklist Dokumen" icon={Clipboard}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {["Certificate of Origin","Packing List","Commercial Invoice","Bill of Lading","Phytosanitary Cert","Fumigation Cert"].map((d,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:8,background:T.surfaceAlt}}>
              <span style={{fontSize:13,color:T.text}}>{d}</span>
              <CheckCircle size={16} color={i<4?T.success:T.textMuted}/>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  </div>
);

const ApplicantsPage = () => (
  <div style={{display:"flex",flexDirection:"column",gap:24}}>
    <SectionCard title="Pipeline Standardisasi" icon={Award}
      action={<span style={{fontSize:13,color:T.primary,fontWeight:600}}>{applicants.length} Pelamar</span>}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {applicants.map((a,i)=>(
          <div key={i} style={{padding:"20px 24px",borderRadius:T.radius,border:`1px solid ${T.border}`,background:T.surfaceAlt,animation:`fadeSlideUp 0.4s ease ${i*0.1}s both`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:T.text}}>{a.name}</div>
                <div style={{fontSize:12,color:T.textSec,marginTop:3}}>{a.loc} · {a.type}</div>
              </div>
              <StatusBadge status={a.status}/>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <ProgressBar value={a.progress} color={T.primary} height={8}/>
              <span style={{fontSize:14,fontWeight:700,color:T.text}}>{a.progress}%</span>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{padding:"8px 18px",borderRadius:8,background:T.gradient1,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><CheckCircle size={14}/>Terima</button>
              <button style={{padding:"8px 18px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Eye size={14}/>Detail</button>
              <button style={{padding:"8px 18px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Send size={14}/>Pesan</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
    <SectionCard title="Rumah Produksi Tidak Aktif" icon={Pause}>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{name:"Wayang Kulit Solo",reason:"Pemilik sakit",date:"10 Mar 2026",status:"ditangguhkan"},{name:"Bordir Tasik",reason:"Renovasi workshop",date:"22 Mar 2026",status:"ditangguhkan"}].map((h,i)=>(
          <div key={i} style={{padding:"16px 20px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:T.surfaceAlt,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:T.text}}>{h.name}</div>
              <div style={{fontSize:12,color:T.textSec,marginTop:2}}>Alasan: {h.reason} · Sejak {h.date}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={{padding:"6px 14px",borderRadius:8,background:T.gradient3,color:"#fff",border:"none",fontSize:12,fontWeight:600,cursor:"pointer"}}>Aktifkan</button>
              <button style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,fontSize:12,fontWeight:600,cursor:"pointer"}}>Nudge</button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

// ── Order Detail Modal ──
const OrderModal = ({order, onClose}) => {
  if(!order) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:T.radius,width:"100%",maxWidth:540,padding:32,position:"relative",animation:"fadeSlideUp 0.3s ease"}} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:T.textMuted,cursor:"pointer"}} aria-label="Tutup"><X size={20}/></button>
        <div style={{fontSize:12,color:T.primary,fontWeight:700,marginBottom:4}}>{order.id}</div>
        <div style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:4}}>{order.buyer}</div>
        <div style={{fontSize:14,color:T.textSec,marginBottom:20}}>{order.product} × {order.qty} unit</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
          <div style={{padding:"12px 16px",borderRadius:T.radiusSm,background:T.surfaceAlt}}><div style={{fontSize:11,color:T.textMuted}}>Rumah Produksi</div><div style={{fontSize:14,fontWeight:600,color:T.text,marginTop:4}}>{order.house}</div></div>
          <div style={{padding:"12px 16px",borderRadius:T.radiusSm,background:T.surfaceAlt}}><div style={{fontSize:11,color:T.textMuted}}>Tenggat</div><div style={{fontSize:14,fontWeight:600,color:T.text,marginTop:4}}>{order.deadline}</div></div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:T.textSec}}>Progres</span><span style={{fontSize:14,fontWeight:700,color:T.text}}>{order.progress}%</span></div>
          <ProgressBar value={order.progress} color={order.progress>80?T.success:T.primary} height={10}/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{flex:1,padding:"12px",borderRadius:10,background:T.gradient1,color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><MessageSquare size={16}/>Chat Produksi</button>
          <button style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",color:T.textSec,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Send size={16}/>Kirim WA</button>
        </div>
      </div>
    </div>
  );
};

// ── Main App ──
const pageTitles = {dashboard:"Dashboard Eksekutif",orders:"Manajemen Pesanan & Pemenuhan",production:"Manajemen Rumah Produksi",quality:"Pusat Kendali Mutu",export:"Manajemen Ekspor",applicants:"Pipeline Standardisasi"};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(()=>{setLoaded(true)},[]);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'Segoe UI','Helvetica Neue',sans-serif",color:T.text}}>
      <style>{`
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:${T.bg}; }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:3px; }
        input::placeholder { color:${T.textMuted}; }
      `}</style>
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div style={{marginLeft:collapsed?72:260,transition:"margin-left 0.3s cubic-bezier(.4,0,.2,1)",minHeight:"100vh"}}>
        {/* Header */}
        <header style={{
          padding:"16px 36px",
          borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:`${T.surface}cc`,backdropFilter:"blur(16px)",
          position:"sticky",top:0,zIndex:40,
        }}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-0.03em",color:T.text}}>{pageTitles[page]}</h1>
            <p style={{fontSize:13,color:T.textMuted,marginTop:2}}>Seller Dashboard · April 2026</p>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative"}}>
              <Search size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.textMuted}}/>
              <input placeholder="Cari..." style={{padding:"9px 12px 9px 36px",borderRadius:T.radiusSm,border:`1px solid ${T.border}`,background:T.surfaceAlt,color:T.text,fontSize:13,width:200,outline:"none"}}/>
            </div>
            <button style={{width:40,height:40,borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",color:T.textSec}} aria-label="Notifikasi">
              <Bell size={18}/>
              <div style={{position:"absolute",top:8,right:8,width:8,height:8,borderRadius:999,background:T.danger,border:`2px solid ${T.surface}`}}/>
            </button>
          </div>
        </header>
        {/* Content */}
        <main style={{padding:36,animation:loaded?"fadeSlideUp 0.5s ease":"none"}}>
          {page==="dashboard" && <DashboardPage/>}
          {page==="orders" && <OrdersPage setModal={setModal}/>}
          {page==="production" && <ProductionPage/>}
          {page==="quality" && <QualityPage/>}
          {page==="export" && <ExportPage/>}
          {page==="applicants" && <ApplicantsPage/>}
        </main>
      </div>
      <OrderModal order={modal} onClose={()=>setModal(null)}/>
    </div>
  );
}
