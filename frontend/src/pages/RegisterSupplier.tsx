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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('Registered mock supplier:\n' + JSON.stringify(form, null, 2));
    // TODO: wire up to backend API
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
