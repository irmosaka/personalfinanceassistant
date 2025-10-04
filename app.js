const { useState, useEffect } = React;

const currencies = [
  { code: 'CNY', label: 'یوان 🇨🇳', rate: 1 },
  { code: 'USD', label: 'دلار 💵', rate: 0.14 },
  { code: 'AED', label: 'درهم 🇦🇪', rate: 0.51 },
  { code: 'TRY', label: 'لیر 🇹🇷', rate: 41.69 },
  { code: 'EUR', label: 'یورو 🇪🇺', rate: 0.85 },
];

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [pin, setPin] = useState('');
  const [trips, setTrips] = useState(JSON.parse(localStorage.getItem('trips')||'[]'));
  const [currentTrip, setCurrentTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({name:'',destination:'',currency:'CNY'});

  useEffect(()=>{ setTimeout(()=>setShowSplash(false),1500) },[]);
  useEffect(()=>{ localStorage.setItem('trips',JSON.stringify(trips)) },[trips]);

  const checkPin = () => { if(pin==='1234') setAuthorized(true); else alert('PIN اشتباه است'); }
  const addTrip = () => {
    if(!newTrip.name.trim()) return alert('نام سفر اجباری است');
    setTrips([...trips,{...newTrip,expenses:[]}]);
    setNewTrip({name:'',destination:'',currency:'CNY'});
  }

  const addExpense = (tripIndex, desc, amount) => {
    if(!desc || !amount) return alert('توضیح و مبلغ لازم است');
    const newTrips = [...trips];
    const expense = {desc, amount:Number(amount), date:new Date().toLocaleDateString()};
    newTrips[tripIndex].expenses.push(expense);
    setTrips(newTrips);

    const totalToday = newTrips[tripIndex].expenses.filter(e=>e.date===expense.date).reduce((a,b)=>a+b.amount,0);
    if(totalToday>40) alert('⚠️ هزینه روزانه بیشتر از 40 دلار شد!');
    if(amount>120) alert('⚠️ هزینه هتل بیشتر از 120 دلار شد!');
  }

  if(showSplash) return <div className="fade-in" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'2rem'}}>💰 دستیار مالی سفر</div>;

  if(!authorized) return (
    <div className="slide-up" style={{padding:'20px'}}>
      <h2>ورود با PIN</h2>
      <input type="password" placeholder="PIN ۴ رقمی" value={pin} onChange={e=>setPin(e.target.value)} />
      <button onClick={checkPin}>ورود</button>
    </div>
  );

  if(currentTrip!==null){
    const trip=trips[currentTrip];
    const [desc,setDesc]=useState('');
    const [amount,setAmount]=useState('');
    const total=trip.expenses.reduce((a,b)=>a+b.amount,0);

    useEffect(()=>{
      const ctx=document.getElementById('chart').getContext('2d');
      new Chart(ctx,{type:'bar',data:{labels:trip.expenses.map(e=>e.desc),datasets:[{label:'هزینه',data:trip.expenses.map(e=>e.amount),backgroundColor:'#4CAF50'}]},options:{responsive:true,plugins:{legend:{display:false}}}});
    },[trip.expenses]);

    return <div className="slide-up" style={{padding:'20px'}}>
      <button onClick={()=>setCurrentTrip(null)} style={{marginBottom:'10px', background:'#ddd', padding:'8px 12px', borderRadius:'5px'}}>⬅️ بازگشت</button>
      <h2>{trip.name} - {trip.destination}</h2>
      <h3>مجموع: {total} {trip.currency}</h3>
      <div className="card">
        <input placeholder="توضیح هزینه" value={desc} onChange={e=>setDesc(e.target.value)} /><br/>
        <input type="number" placeholder="مبلغ" value={amount} onChange={e=>setAmount(e.target.value)} /><br/>
        <button onClick={()=>{addExpense(currentTrip,desc,amount); setDesc(''); setAmount('');}}>➕ افزودن هزینه</button>
      </div>
      <canvas id="chart" style={{marginTop:'20px'}}></canvas>
      {trip.expenses.length > 0 && <div className="card" style={{marginTop:'10px'}}>
        <h4>لیست هزینه‌ها:</h4>
        <ul>
          {trip.expenses.map((e,i)=><li key={i}>{e.date} - {e.desc}: {e.amount} {trip.currency}</li>)}
        </ul>
      </div>}
    </div>;
  }

  return <div style={{padding:'20px'}}>
    <h1>سفرها</h1>
    <ul>{trips.map((t,i)=><li key={i}><div className="card"><button style={{width:'100%',background:'none',border:'none',textAlign:'left'}} onClick={()=>setCurrentTrip(i)}>{t.name} - {t.destination}</button></div></li>)}</ul>
    <div className="card">
      <h3>افزودن سفر جدید</h3>
      <input placeholder="نام سفر" value={newTrip.name} onChange={e=>setNewTrip({...newTrip,name:e.target.value})} /><br/>
      <input placeholder="مقصد (اختیاری)" value={newTrip.destination} onChange={e=>setNewTrip({...newTrip,destination:e.target.value})} /><br/>
      <select value={newTrip.currency} onChange={e=>setNewTrip({...newTrip,currency:e.target.value})}>
        {currencies.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
      </select><br/>
      <button className="fab" onClick={addTrip}>+</button>
    </div>
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
