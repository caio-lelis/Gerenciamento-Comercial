from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime

class PedidoBase(BaseModel):
    cliente_id: int
    quantidade: int = Field(1, gt=0)
    valor_unitario: Decimal = Field(..., gt=0)
    observacoes: Optional[str] = Field(None, max_length=500)
    pago: Optional[bool] = False
    entregue: Optional[bool] = False

class PedidoCreate(PedidoBase):
    pass

class PedidoRead(PedidoBase):
    id: int
    data_pedido: datetime

    class Config:
        from_attributes = True

class PedidoUpdate(BaseModel):
    quantidade: Optional[int] = Field(None, gt=0)
    valor_unitario: Optional[Decimal] = Field(None, gt=0)
    observacoes: Optional[str] = Field(None, max_length=500)
    pago: Optional[bool] = None
    entregue: Optional[bool] = None