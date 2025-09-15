DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- Tabela de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    quantidade INTEGER DEFAULT 1,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pago BOOLEAN DEFAULT FALSE,
    valor_unitario DECIMAL(10,2) DEFAULT 50.00,
    observacoes TEXT,
    entregue BOOLEAN DEFAULT FALSE
);