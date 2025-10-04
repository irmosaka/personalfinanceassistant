const { useState } = React;

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [trips, setTrips] = useState([]);
  const [newTripName, setNewTripName] = useState("");

  React.useEffect(() => {
    setTimeout(() => setShowSplash(false), 2000);
  }, []);

  const addTrip = () => {
    if(newTripName.trim() === "") return alert("نام سفر اجباری است");
    setTrips([...trips, { name: newTripName }]);
    setNewTripName("");
  }

  if(showSplash) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'2rem'}}>
      💰 دستیار مالی سفر
    </div>
  );

  return (
    <div style={{padding:'20px'}}>
      <h1>سفرها</h1>
      <ul>
        {trips.map((t,i) => <li key={i}>{t.name}</li>)}
      </ul>
      <input placeholder="نام سفر" value={newTripName} onChange={e=>setNewTripName(e.target.value)} />
      <button className="fab" onClick={addTrip}>+</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
