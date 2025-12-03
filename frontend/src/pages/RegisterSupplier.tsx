import React, { useState } from 'react';

function RegisterSupplier() {
  const [form, setForm] = useState({
    name: '',
    commodity: '',
    contactEmail: '',
    companyAddress: '',
    taxId: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({...form, [e.target.name]: e.target.value});
  }

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    if (response.ok) {
      alert('Supplier registered successfully!');
      // Optionally, reset form fields:
      // setForm({name: '', commodity: '', contactEmail: '', companyAddress: '', taxId: ''});
    } else {
      alert('Failed to register supplier.');
    }
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

  return (
    <div style={{padding: '2rem', maxWidth: 480}}>
      <h2>Register Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label>Name<br/>
            <input name="name" value={form.name} onChange={handleChange} required style={{width: '100%'}} />
          </label>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Commodity<br/>
            <input name="commodity" value={form.commodity} onChange={handleChange} required style={{width: '100%'}} />
          </label>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Contact Email<br/>
            <input name="contactEmail" value={form.contactEmail} onChange={handleChange} required type="email" style={{width: '100%'}} />
          </label>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Company Address<br/>
            <input name="companyAddress" value={form.companyAddress} onChange={handleChange} style={{width: '100%'}} />
          </label>
        </div>
        <div style={{marginBottom: '1rem'}}>
          <label>Tax ID<br/>
            <input name="taxId" value={form.taxId} onChange={handleChange} style={{width: '100%'}} />
          </label>
        </div>
        <button type="submit">Register Supplier</button>
      </form>
    </div>
  );
}

export default RegisterSupplier;
