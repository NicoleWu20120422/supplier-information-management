CREATE TABLE suppliers (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    contact_email VARCHAR(255)
);

INSERT INTO suppliers (id, name, contact_email) VALUES
(1, 'Supplier A', 'contact@supplier-a.com'),
(2, 'Supplier B', 'contact@supplier-b.com');