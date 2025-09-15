from sqlalchemy.orm import Session
from src.pedido.pedido_schema import PedidoCreate, PedidoUpdate
from src.pedido.pedido_model import Pedido as PedidoModel
from src.cliente.cliente_model import Cliente as ClienteModel
from typing import List, Optional

class PedidoService:
    def create_pedido(self, db: Session, pedido: PedidoCreate) -> Optional[PedidoModel]:
        # Verificar se o cliente existe
        cliente = db.query(ClienteModel).filter(ClienteModel.id == pedido.cliente_id).first()
        if not cliente:
            return None
            
        db_pedido = PedidoModel(
            cliente_id=pedido.cliente_id,
            quantidade=pedido.quantidade,
            valor_unitario=pedido.valor_unitario,
            observacoes=pedido.observacoes,
            pago=pedido.pago,
            entregue=pedido.entregue
        )
        db.add(db_pedido)
        db.commit()
        db.refresh(db_pedido)
        return db_pedido

    def get_all_pedidos(self, db: Session) -> List[PedidoModel]:
        return db.query(PedidoModel).all()

    def get_pedido_by_id(self, db: Session, pedido_id: int) -> Optional[PedidoModel]:
        return db.query(PedidoModel).filter(PedidoModel.id == pedido_id).first()

    def get_pedidos_by_cliente(self, db: Session, cliente_id: int) -> List[PedidoModel]:
        return db.query(PedidoModel).filter(PedidoModel.cliente_id == cliente_id).all()

    def get_pedidos_nao_pagos(self, db: Session) -> List[PedidoModel]:
        return db.query(PedidoModel).filter(PedidoModel.pago == False).all()

    def get_pedidos_pendentes_entrega(self, db: Session) -> List[PedidoModel]:
        return db.query(PedidoModel).filter(
            PedidoModel.entregue == False, 
            PedidoModel.pago == True
        ).all()

    def update_pedido(self, db: Session, pedido_id: int, pedido: PedidoUpdate) -> Optional[PedidoModel]:
        db_pedido = self.get_pedido_by_id(db, pedido_id)
        if not db_pedido:
            return None
        
        if pedido.quantidade is not None:
            db_pedido.quantidade = pedido.quantidade
        if pedido.valor_unitario is not None:
            db_pedido.valor_unitario = pedido.valor_unitario
        if pedido.observacoes is not None:
            db_pedido.observacoes = pedido.observacoes
        if pedido.pago is not None:
            db_pedido.pago = pedido.pago
        if pedido.entregue is not None:
            db_pedido.entregue = pedido.entregue
            
        db.commit()
        db.refresh(db_pedido)
        return db_pedido

    def delete_pedido(self, db: Session, pedido_id: int) -> Optional[PedidoModel]:
        db_pedido = self.get_pedido_by_id(db, pedido_id)
        if not db_pedido:
            return None
        
        db.delete(db_pedido)
        db.commit()
        return db_pedido

pedido_service = PedidoService()