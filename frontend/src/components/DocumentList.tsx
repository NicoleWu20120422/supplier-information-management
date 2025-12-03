import { useEffect, useState } from 'react';
import { Document, getDocuments } from '../api/supplierApi';

function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    getDocuments().then(setDocuments);
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>File Name</th>
          <th>Supplier ID</th>
          <th>Blob Uri</th>
          <th>Uploaded At</th>
        </tr>
      </thead>
      <tbody>
        {documents.map(d => (
          <tr key={d.id}>
            <td>{d.fileName}</td>
            <td>{d.supplierId}</td>
            <td>{d.blobUri}</td>
            <td>{new Date(d.uploadedAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DocumentList;
