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
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({name:'',destination:'',currency:'CNY'});
  const [pin, setPin] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(()=>{setTimeout(()=>setShowSplash(false),1500)},[]);

  const checkPin = () => { if(pin === '1234') setAuthorized(true); else alert('PIN اشتباه است'); }

  const addTrip = () => {
    if(!newTrip.name.trim()) return alert("نام سفر اجباری است");
    setTrips([...trips,newTrip]);
    setNewTrip({name:'',destination:'',currency:'CNY'});
  }

  if(showSplash) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'2rem'}}>💰 دستیار مالی سفر</div>;

  if(!authorized) return (
    <div style={{padding:'20px'}}>
      <h2>ورود با PIN</h2>
      <input type="password" placeholder="PIN ۴ رقمی" value={pin} onChange={e=>setPin(e.target.value)} />
      <button onClick={checkPin}>ورود</button>
    </div>
  );

  if(currentTrip !== null){
    const trip = trips[currentTrip];
    const [expenses,setExpenses] = useState([]);
    const [newExpense,setNewExpense] = useState({desc:'',amount:0});
    const addExpense = () => {
      if(!newExpense.desc || !newExpense.amount) return alert('توضیح و مبلغ لازم است');
      setExpenses([...expenses,newExpense]);
      setNewExpense({desc:'',amount:0});
    }
    const total = expenses.reduce((a,b)=>a+b.amount,0);
    return (
      <div style={{padding:'20px'}}>
        <h2>{trip.name} - {trip.destination}</h2>
        <h3>مبلغ کل: {total} {trip.currency}</h3>
        <div>
          <input placeholder="توضیح" value={newExpense.desc} onChange={e=>setNewExpense({...newExpense,desc:e.target.value})}/>
          <input type="number" placeholder="مبلغ" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense,amount:Number(e.target.value)})}/>
          <button onClick={addExpense}>افزودن هزینه</button>
        </div>
        <button onClick={()=>setCurrentTrip(null)}>بازگشت</button>
        <div className="card">
          <canvas id="chart"></canvas>
        </div>
      </div>
    )
  }

  return (
    <div style={{padding:'20px'}}>
      <h1>سفرها</h1>
      <ul>
        {trips.map((t,i)=><li key={i}><button onClick={()=>setCurrentTrip(i)}>{t.name} - {t.destination}</button></li>)}
      </ul>
      <div className="card">
        <h3>افزودن سفر جدید</h3>
        <input placeholder="نام سفر" value={newTrip.name} onChange={e=>setNewTrip({...newTrip,name:e.target.value})} /><br/>
        <input placeholder="مقصد (اختیاری)" value={newTrip.destination} onChange={e=>setNewTrip({...newTrip,destination:e.target.value})} /><br/>
        <select value={newTrip.currency} onChange={e=>setNewTrip({...newTrip,currency:e.target.value})}>
          {currencies.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}
        </select><br/>
        <button className="fab" onClick={addTrip}>+</button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
