from sqlalchemy import Column, Integer, Boolean, Numeric, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from src.core.session import Base

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id", ondelete="RESTRICT"), unique=True)
    quantidade = Column(Integer, nullable=False, default=1)
    data_pedido = Column(DateTime, default=datetime.utcnow)
    pago = Column(Boolean, default=False)
    valor_unitario = Column(Numeric(10, 2), nullable=False)
    observacoes = Column(String(500))
    entregue = Column(Boolean, default=False)
    
    # Relacionamento
    cliente = relationship("Cliente")

# Adicionar relacionamento inverso no modelo Cliente
# Cliente.pedidos = relationship("Pedido", back_populates="cliente", cascade="all, delete-orphan")