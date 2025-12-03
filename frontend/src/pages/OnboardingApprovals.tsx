import React, { useState } from 'react';

const mockRequests = [
  {
    id: 1,
    name: 'Titan Ind.',
    commodity: 'Chemicals',
    requestedDate: '2025-11-27',
    status: 'Pending',
    contactEmail: 'titan@example.com',
  },
  {
    id: 2,
    name: 'Delta Metals',
    commodity: 'Copper',
    requestedDate: '2025-11-26',
    status: 'Pending',
    contactEmail: 'delta@example.com',
  }
];

function OnboardingApprovals() {
  const [requests, setRequests] = useState(mockRequests);

  function approve(id: number) {
    setRequests(reqs =>
      reqs.map(r => r.id === id ? {...r, status: 'Approved'} : r)
    );
  }
  function reject(id: number) {
    setRequests(reqs =>
      reqs.map(r => r.id === id ? {...r, status: 'Rejected'} : r)
    );
  }

  return (
    <div style={{padding: '2rem'}}>
      <h2>Onboarding Approvals</h2>
      <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '2rem'}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Commodity</th>
            <th>Requested</th>
            <th>Contact Email</th>
            <th>Status</th>
            <th>Decision</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.commodity}</td>
              <td>{r.requestedDate}</td>
              <td>{r.contactEmail}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'Pending' ? (
                  <>
                    <button onClick={() => approve(r.id)} style={{marginRight: '6px'}}>Approve</button>
                    <button onClick={() => reject(r.id)}>Reject</button>
                  </>
                ) : (
                  <span>{r.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OnboardingApprovals;
