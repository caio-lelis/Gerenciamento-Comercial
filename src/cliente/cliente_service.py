from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from src.cliente.cliente_schema import ClienteCreate, ClienteUpdate
from src.cliente.cliente_model import Cliente as ClienteModel
from typing import List, Optional

class ClienteService:
    def create_cliente(self, db: Session, cliente: ClienteCreate) -> ClienteModel:
        db_cliente = ClienteModel(
            nome=cliente.nome,
            telefone=cliente.telefone
        )
        db.add(db_cliente)
        db.commit()
        db.refresh(db_cliente)
        return db_cliente

    def get_all_clientes(self, db: Session) -> List[ClienteModel]:
        return db.query(ClienteModel).all()

    def get_cliente_by_id(self, db: Session, cliente_id: int) -> Optional[ClienteModel]:
        return db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()

    def get_cliente_by_telefone(self, db: Session, telefone: str) -> Optional[ClienteModel]:
        return db.query(ClienteModel).filter(ClienteModel.telefone == telefone).first()

    def update_cliente(self, db: Session, cliente_id: int, cliente: ClienteUpdate) -> Optional[ClienteModel]:
        db_cliente = self.get_cliente_by_id(db, cliente_id)
        if not db_cliente:
            return None
        
        if cliente.nome is not None:
            db_cliente.nome = cliente.nome
        if cliente.telefone is not None:
            db_cliente.telefone = cliente.telefone
            
        db.commit()
        db.refresh(db_cliente)
        return db_cliente

    def delete_cliente(self, db: Session, cliente_id: int) -> Optional[ClienteModel]:
        db_cliente = self.get_cliente_by_id(db, cliente_id)
        if not db_cliente:
            return None
        
        db.delete(db_cliente)
        db.commit()
        return db_cliente

cliente_service = ClienteService()