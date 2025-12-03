import React from 'react';

function Dashboard() {
  return (
    <div style={{padding: '2rem'}}>
      <h1>SIM Dashboard</h1>
      <div style={{display: 'flex', gap: '2rem', marginBottom: '2rem'}}>
        <div style={{border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center'}}>
          <h2>120</h2>
          <p>Total Suppliers</p>
        </div>
        <div style={{border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center'}}>
          <h2>6</h2>
          <p>Pending Approvals</p>
        </div>
        <div style={{border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', flex: 1, textAlign: 'center'}}>
          <h2>271</h2>
          <p>Total Documents</p>
        </div>
      </div>
      <h3>Recent Suppliers</h3>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Commodity</th>
            <th>Onboarding Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acme Corp</td>
            <td>Steel</td>
            <td>2025-11-29</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Titan Ind.</td>
            <td>Chemicals</td>
            <td>2025-11-27</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
