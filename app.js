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
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({name:'',destination:'',currency:'CNY'});

  useEffect(() => setTimeout(() => setShowSplash(false), 1500), []);

  const checkPin = () => { 
    if(pin === '1234') setAuthorized(true); 
    else alert('PIN اشتباه است'); 
  }

  const addTrip = () => {
    if(!newTrip.name.trim()) return alert("نام سفر اجباری است");
    setTrips([...trips, {...newTrip, expenses:[]}]);
    setNewTrip({name:'',destination:'',currency:'CNY'});
  }

  const addExpense = (tripIndex, desc, amount) => {
    if(!desc || !amount) return alert('توضیح و مبلغ لازم است');
    const newTrips = [...trips];
    newTrips[tripIndex].expenses.push({desc, amount:Number(amount)});
    setTrips(newTrips);
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
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const total = trip.expenses.reduce((a,b)=>a+b.amount,0);
    
    useEffect(() => {
      const ctx = document.getElementById('chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: trip.expenses.map(e=>e.desc),
          datasets: [{ label:'هزینه', data: trip.expenses.map(e=>e.amount), backgroundColor:'#4CAF50' }]
        },
        options: { responsive:true, plugins:{legend:{display:false}} }
      });
    }, [trip.expenses]);

    return (
      <div style={{padding:'20px'}}>
        <h2>{trip.name} - {trip.destination}</h2>
        <h3>مجموع هزینه‌ها: {total} {trip.currency}</h3>

        <div className="card">
          <input placeholder="توضیح" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input type="number" placeholder="مبلغ" value={amount} onChange={e=>setAmount(e.target.value)} />
          <button onClick={()=>{addExpense(currentTrip, desc, amount); setDesc(''); setAmount('');}}>افزودن هزینه</button>
        </div>

        <canvas id="chart"></canvas>
        <button onClick={()=>setCurrentTrip(null)}>بازگشت</button>
      </div>
    );
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
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
