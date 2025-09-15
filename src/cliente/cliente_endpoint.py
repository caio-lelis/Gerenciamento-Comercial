from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.session import SessionLocal
from src.cliente.cliente_schema import ClienteCreate, ClienteRead, ClienteUpdate
from src.cliente.cliente_service import cliente_service
from typing import List

router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=ClienteRead, status_code=status.HTTP_201_CREATED)
def create_cliente_api(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = cliente_service.create_cliente(db, cliente)
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Erro ao criar cliente."
        )
    return db_cliente

@router.get("/get", response_model=List[ClienteRead])
def get_all_clientes_api(db: Session = Depends(get_db)):
    return cliente_service.get_all_clientes(db)

@router.get("/get/{cliente_id}", response_model=ClienteRead)
def get_cliente_by_id_api(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = cliente_service.get_cliente_by_id(db, cliente_id)
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente não encontrado."
        )
    return db_cliente

@router.get("/get/telefone/{telefone}", response_model=ClienteRead)
def get_cliente_by_telefone_api(telefone: str, db: Session = Depends(get_db)):
    db_cliente = cliente_service.get_cliente_by_telefone(db, telefone)
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente não encontrado."
        )
    return db_cliente

@router.put("/update/{cliente_id}", response_model=ClienteRead)
def update_cliente_api(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    db_cliente = cliente_service.update_cliente(db, cliente_id, cliente)
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente não encontrado."
        )
    return db_cliente

@router.delete("/delete/{cliente_id}", response_model=ClienteRead)
def delete_cliente_api(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = cliente_service.delete_cliente(db, cliente_id)
    if not db_cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Cliente não encontrado."
        )
    return db_cliente