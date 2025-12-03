import { useEffect, useState } from 'react';
import { getSuppliers, Supplier } from '../api/supplierApi';

function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Commodity</th>
          <th>Contact Email</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map(s => (
          <tr key={s.id}>
            <td>{s.name}</td>
            <td>{s.commodity}</td>
            <td>{s.contactEmail}</td>
            <td>{new Date(s.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SupplierList;
