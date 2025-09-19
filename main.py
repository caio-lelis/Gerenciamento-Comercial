from fastapi import FastAPI
from src.cliente.cliente_endpoint import router as cliente_router
from src.pedido.pedido_endpoint import router as pedido_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Sistema Gerenciamento Comércio", version="1.0.0")

app.include_router(cliente_router)
app.include_router(pedido_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ou ["*"] para desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Sistema de Gerenciamento de Frango Assado"}