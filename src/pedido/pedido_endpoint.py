from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.core.session import SessionLocal
from src.pedido.pedido_schema import PedidoCreate, PedidoRead, PedidoUpdate
from src.pedido.pedido_service import pedido_service
from typing import List

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def create_pedido_api(pedido: PedidoCreate, db: Session = Depends(get_db)):
    db_pedido = pedido_service.create_pedido(db, pedido)
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Erro ao criar pedido. Verifique se o cliente existe."
        )
    return db_pedido

@router.get("/get", response_model=List[PedidoRead])
def get_all_pedidos_api(db: Session = Depends(get_db)):
    return pedido_service.get_all_pedidos(db)

@router.get("/get/{pedido_id}", response_model=PedidoRead)
def get_pedido_by_id_api(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = pedido_service.get_pedido_by_id(db, pedido_id)
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Pedido não encontrado."
        )
    return db_pedido

@router.get("/get/cliente/{cliente_id}", response_model=List[PedidoRead])
def get_pedidos_by_cliente_api(cliente_id: int, db: Session = Depends(get_db)):
    return pedido_service.get_pedidos_by_cliente(db, cliente_id)

@router.get("/get/nao-pagos", response_model=List[PedidoRead])
def get_pedidos_nao_pagos_api(db: Session = Depends(get_db)):
    return pedido_service.get_pedidos_nao_pagos(db)

@router.get("/get/pendentes-entrega", response_model=List[PedidoRead])
def get_pedidos_pendentes_entrega_api(db: Session = Depends(get_db)):
    return pedido_service.get_pedidos_pendentes_entrega(db)

@router.put("/update/{pedido_id}", response_model=PedidoRead)
def update_pedido_api(pedido_id: int, pedido: PedidoUpdate, db: Session = Depends(get_db)):
    db_pedido = pedido_service.update_pedido(db, pedido_id, pedido)
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Pedido não encontrado."
        )
    return db_pedido

@router.patch("/marcar-pago/{pedido_id}", response_model=PedidoRead)
def marcar_pedido_pago_api(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = pedido_service.update_pedido(db, pedido_id, PedidoUpdate(pago=True))
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Pedido não encontrado."
        )
    return db_pedido

@router.patch("/marcar-entregue/{pedido_id}", response_model=PedidoRead)
def marcar_pedido_entregue_api(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = pedido_service.update_pedido(db, pedido_id, PedidoUpdate(entregue=True))
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Pedido não encontrado."
        )
    return db_pedido

@router.delete("/delete/{pedido_id}", response_model=PedidoRead)
def delete_pedido_api(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = pedido_service.delete_pedido(db, pedido_id)
    if not db_pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Pedido não encontrado."
        )
    return db_pedido