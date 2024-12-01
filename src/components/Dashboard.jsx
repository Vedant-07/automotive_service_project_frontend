import React, {useEffect, useState} from 'react'
import api from '../lib/api'

// Dummy data for presentation
const DUMMY_COMPLAINTS = [
  {
    id: 1,
    vehicleReg: 'MH-01-AB-1234',
    customer: 'Rajesh Kumar',
    complaint: 'Engine making strange noise, seems like a transmission issue. Need immediate attention.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    vehicleReg: 'KA-02-CD-5678',
    customer: 'Priya Singh',
    complaint: 'Brake pads need replacement, braking distance increased significantly.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1494976866556-6812c9d1c72e?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    vehicleReg: 'DL-03-EF-9012',
    customer: 'Amit Patel',
    complaint: 'Air conditioning not working properly, only blowing warm air.',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4628d?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    vehicleReg: 'TN-04-GH-3456',
    customer: 'Neha Sharma',
    complaint: 'Battery keeps dying after short drives. Alternator might be faulty.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    vehicleReg: 'GJ-05-IJ-7890',
    customer: 'Vikram Singh',
    complaint: 'Suspension is too stiff, causing discomfort during regular driving.',
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    vehicleReg: 'RJ-06-KL-2345',
    customer: 'Suresh Desai',
    complaint: 'Headlights flickering intermittently, need electrical check.',
    status: 'pending',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=300&h=200&fit=crop'
  },
  {
    id: 7,
    vehicleReg: 'UP-07-MN-6789',
    customer: 'Ananya Verma',
    complaint: 'Steering wheel vibrates at high speeds, wheel alignment needed.',
    status: 'accepted',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1502877917128-1aa500764cbd?w=300&h=200&fit=crop'
  },
  {
    id: 8,
    vehicleReg: 'MP-08-OP-0123',
    customer: 'Arjun Reddy',
    complaint: 'Oil leak detected underneath the vehicle, needs urgent inspection.',
    status: 'pending',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=200&fit=crop'
  }
]

function ActionButton({onClick, children, title}){
  return (
    <button className="action-button" title={title} onClick={onClick}>{children}</button>
  )
}

function Modal({open, onClose, title, children}){
  if(!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default function Dashboard(){
  const [complaints, setComplaints] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [detailModal, setDetailModal] = useState({open:false, content:null, title:''})
  const [imageModal, setImageModal] = useState({open:false, url:null})
  const [useDummyData, setUseDummyData] = useState(false)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)
    api.get('/api/callcentre/complaints')
      .then(r => { 
        if(mounted) {
          setComplaints(Array.isArray(r) && r.length > 0 ? r : DUMMY_COMPLAINTS)
          setUseDummyData(!Array.isArray(r) || r.length === 0)
        }
      })
      .catch((e)=>{
        console.warn('failed to load complaints, using dummy data', e)
        if(mounted){
          setComplaints(DUMMY_COMPLAINTS)
          setUseDummyData(true)
          setError('Using demonstration data')
        }
      })
      .finally(()=>{ if(mounted) setLoading(false) })
    return ()=> { mounted = false }
  },[])

  async function fetchDetails(id){
    try{
      const d = await api.get(`/api/callcentre/complaints/${id}`)
      return d
    }catch(e){
      console.warn('Using dummy data for details')
      // Return dummy data if API fails
      return complaints.find(c => c.id === id) || null
    }
  }

  async function onVehicleImage(){
    if(!selected){ setError('Select a complaint first'); return }
    const d = await fetchDetails(selected)
    if(d && d.imageUrl){
      setImageModal({open:true, url:d.imageUrl})
    }else if(d){
      setError('No image available for this complaint')
    }
  }

  async function onViewComplaint(){
    if(!selected){ setError('Select a complaint first'); return }
    const d = await fetchDetails(selected)
    if(d){
      setDetailModal({open:true, title:`Complaint #${d.id}`, content:d})
    }
  }

  async function onCopyField(field){
    if(!selected){ setError('Select a complaint first'); return }
    const d = await fetchDetails(selected)
    if(d && d[field]){
      try{ await navigator.clipboard.writeText(String(d[field]))
        setError('Copied to clipboard')
      }catch(e){ setError('Unable to copy') }
    }else{
      setError('Field not available')
    }
  }

  async function acceptAndRespond(){
    if(!selected){ setError('Select a complaint first'); return }
    const original = [...complaints]
    setComplaints(complaints.map(x => x.id===selected ? {...x, status:'accepted'} : x))
    try{
      if(!useDummyData) {
        await api.post(`/api/callcentre/complaints/${selected}/accept`, { response: 'Accepted by call centre' })
      }
      setError('Complaint accepted')
    }catch(e){
      console.error('accept failed', e)
      setComplaints(original)
      setError(e.message || 'Accept failed')
    }
  }

  async function closeComplaint(){
    if(!selected){ setError('Select a complaint first'); return }
    const original = [...complaints]
    setComplaints(complaints.filter(x=>x.id!==selected))
    try{
      if(!useDummyData) {
        await api.put(`/api/callcentre/complaints/${selected}/close`, { closed:true })
      }
      setSelected(null)
      setError('Complaint closed')
    }catch(e){
      console.error('close failed', e)
      setComplaints(original)
      setError(e.message || 'Close failed')
    }
  }

  function onLogout(){
    // placeholder logout behaviour
    setError('Logged out (placeholder)')
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">PitStopPro</div>
        <div className="top-actions">
          <div className="circle-image">Service\nCall\nCentre</div>
        </div>
      </header>

      <div className="action-row">
        <div className="action-buttons">
          <ActionButton onClick={onVehicleImage}>Vehicle Image</ActionButton>
          <ActionButton onClick={()=>onCopyField('vehicleReg')}>Vehicle Reg Number</ActionButton>
          <ActionButton onClick={()=>onCopyField('customer')}>Customer Name</ActionButton>
          <ActionButton onClick={onViewComplaint}>View Complaint</ActionButton>
          <ActionButton onClick={acceptAndRespond}>Accept Complaint and send response</ActionButton>
          <ActionButton onClick={closeComplaint}>Close Com</ActionButton>
        </div>

        <div className="action-right">
          <button className="logout action-right-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="content">
        <main className="main">
          <h2>Incoming Complaints</h2>
          {loading && <div>Loading complaints...</div>}
          {error && <div style={{color:'#ffb84d',marginBottom:8,padding:'12px',borderRadius:8,background:'rgba(255,184,77,0.1)',border:'1px solid rgba(255,184,77,0.2)'}}>{error}</div>}

          {(!loading && complaints.length===0) ? (
            <div style={{padding:24,background:'rgba(26,34,55,0.5)',borderRadius:8,border:'1px solid rgba(0,153,255,0.2)'}}>No complaints available</div>
          ) : (
            <div className="complaint-list">
              {complaints.map(c => (
                <div key={c.id} className={`complaint ${selected===c.id? 'selected':''}`} onClick={()=> setSelected(c.id)}>
                  <div className="reg">{c.vehicleReg}</div>
                  <div className="cust">{c.customer}</div>
                  <div className="text">{c.complaint}</div>
                  <div style={{width:84,height:54,background:'rgba(0,153,255,0.1)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#8b95a5',border:'1px solid rgba(0,153,255,0.2)',overflow:'hidden'}}>
                    <img src={c.imageUrl} alt="vehicle" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <section className="details">
              <h3>Details</h3>
              <p>Selected complaint id: {selected}</p>
              <div className="detail-actions">
                <button className="btn primary" onClick={acceptAndRespond}>Accept & Respond</button>
                <button className="btn" onClick={closeComplaint}>Close</button>
              </div>
            </section>
          )}
        </main>
      </div>

      <footer className="footer">&copy; PitStopPro</footer>

      <Modal open={detailModal.open} onClose={()=>setDetailModal({open:false,content:null})} title={detailModal.title}>
        <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(detailModal.content, null, 2)}</pre>
      </Modal>

      <Modal open={imageModal.open} onClose={()=>setImageModal({open:false,url:null})} title={imageModal.url ? 'Vehicle Image' : ''}>
        {imageModal.url ? <img src={imageModal.url} alt="vehicle" style={{maxWidth:'100%'}}/> : <div>No image</div>}
      </Modal>
    </div>
  )
}
