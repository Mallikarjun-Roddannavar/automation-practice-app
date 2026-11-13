from pathlib import Path
import os
import base64
import binascii
from datetime import datetime, timezone
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import create_engine, String, Integer, ForeignKey, select, inspect, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session, sessionmaker
from auth import passwords, create_token, get_current_user, require_admin
from models import AppUser, ProductInput, Checkout, OrderStatus

DB_PATH = Path(os.getenv('SHOP_DB_PATH', str(Path(__file__).resolve().parent / 'shop.sqlite3'))).resolve()
engine = create_engine(f'sqlite:///{DB_PATH.as_posix()}', connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)
class Base(DeclarativeBase): pass
class User(Base):
    __tablename__ = 'users'
    username: Mapped[str] = mapped_column(String, primary_key=True)
    password_hash: Mapped[str] = mapped_column(String)
    role: Mapped[str] = mapped_column(String)
class Product(Base):
    __tablename__ = 'products'
    __table_args__ = {'sqlite_autoincrement': True}
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String, default='')
    price_cents: Mapped[int] = mapped_column(Integer)
class Order(Base):
    __tablename__ = 'orders'
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(ForeignKey('users.username'))
    name: Mapped[str] = mapped_column(String)
    address: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default='Placed')
    created_at: Mapped[str] = mapped_column(String)
    gift_wrap: Mapped[int] = mapped_column(Integer, default=0)
    delivery_method: Mapped[str] = mapped_column(String, default='standard')
    delivery_date: Mapped[str | None] = mapped_column(String, nullable=True)
    attachment_name: Mapped[str | None] = mapped_column(String, nullable=True)
    attachment_base64: Mapped[str | None] = mapped_column(String, nullable=True)
    items: Mapped[list['OrderItem']] = relationship(cascade='all, delete-orphan')
class OrderItem(Base):
    __tablename__ = 'order_items'
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey('orders.id'))
    product_id: Mapped[int] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String)
    price_cents: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer)

new_database = not inspect(engine).has_table('products')
Base.metadata.create_all(engine)
# Add optional checkout fields to existing databases without changing existing orders.
columns = {column['name'] for column in inspect(engine).get_columns('orders')}
with engine.begin() as connection:
    for name, definition in [('gift_wrap', 'INTEGER NOT NULL DEFAULT 0'), ('delivery_method', "VARCHAR NOT NULL DEFAULT 'standard'"), ('delivery_date', 'VARCHAR'), ('attachment_name', 'VARCHAR'), ('attachment_base64', 'VARCHAR')]:
        if name not in columns:
            connection.execute(text(f'ALTER TABLE orders ADD COLUMN {name} {definition}'))
with SessionLocal() as db:
    for username, password, role in [('admin', 'admin123', 'admin'), ('shopper', 'shopper123', 'shopper'), ('shopper2', 'shopper123', 'shopper')]:
        if not db.get(User, username): db.add(User(username=username, password_hash=passwords.hash(password), role=role))
    if new_database:
        db.add_all([Product(name=n, description=d, price_cents=p) for n,d,p in [('Notebook','A handy everyday notebook',499), ('Coffee mug','A classic ceramic mug',1299), ('Desk lamp','A compact reading light',2499), ('Water bottle','Reusable bottle for everyday use',1599)]])
    db.commit()
app = FastAPI(title='Shopping API')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
def session():
    with SessionLocal() as db: yield db

def product_data(p): return {'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price_cents / 100}
def order_data(o):
    return {'id': o.id, 'username': o.username, 'name': o.name, 'address': o.address, 'status': o.status, 'created_at': o.created_at, 'gift_wrap': bool(o.gift_wrap), 'delivery_method': o.delivery_method, 'delivery_date': o.delivery_date, 'attachment_name': o.attachment_name, 'total': sum(i.price_cents * i.quantity for i in o.items) / 100, 'items': [{'product_id': i.product_id, 'name': i.name, 'price': i.price_cents / 100, 'quantity': i.quantity} for i in o.items]}
def get_order(db, order_id, user):
    order = db.get(Order, order_id)
    if not order or (user.role != 'admin' and order.username != user.username): raise HTTPException(404, 'Order not found')
    return order
@app.get('/health')
def health(): return {'status': 'ok'}
@app.post('/token')
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(session)):
    user = db.get(User, form.username)
    if not user or not passwords.verify(form.password, user.password_hash): raise HTTPException(401, 'Incorrect username or password', headers={'WWW-Authenticate':'Bearer'})
    return {'access_token': create_token(user.username, user.role), 'token_type': 'bearer', 'username': user.username, 'role': user.role}
@app.get('/products')
def products(user: AppUser = Depends(get_current_user), db: Session = Depends(session)):
    return [product_data(p) for p in db.scalars(select(Product).order_by(Product.id)).all()]
@app.post('/products', status_code=201)
def create_product(data: ProductInput, user: AppUser = Depends(require_admin), db: Session = Depends(session)):
    if not data.name.strip(): raise HTTPException(422, 'Product name is required')
    p = Product(name=data.name.strip(), description=data.description.strip(), price_cents=round(data.price * 100))
    if p.price_cents < 1: raise HTTPException(422, 'Price must be at least 0.01')
    db.add(p); db.commit(); db.refresh(p); return product_data(p)
@app.put('/products/{product_id}')
def update_product(product_id: int, data: ProductInput, user: AppUser = Depends(require_admin), db: Session = Depends(session)):
    p = db.get(Product, product_id)
    if not p: raise HTTPException(404, 'Product not found')
    if not data.name.strip() or round(data.price * 100) < 1: raise HTTPException(422, 'Valid name and price required')
    p.name, p.description, p.price_cents = data.name.strip(), data.description.strip(), round(data.price * 100)
    db.commit(); return product_data(p)
@app.delete('/products/{product_id}')
def delete_product(product_id: int, user: AppUser = Depends(require_admin), db: Session = Depends(session)):
    p = db.get(Product, product_id)
    if not p: raise HTTPException(404, 'Product not found')
    db.delete(p); db.commit(); return {'message': 'Product deleted'}
@app.post('/orders', status_code=201)
def checkout(data: Checkout, user: AppUser = Depends(get_current_user), db: Session = Depends(session)):
    if not data.name.strip() or not data.address.strip(): raise HTTPException(422, 'Name and address are required')
    if len({i.product_id for i in data.items}) != len(data.items): raise HTTPException(422, 'Duplicate products in cart')
    if bool(data.attachment_name) != bool(data.attachment_base64): raise HTTPException(422, 'Attachment name and contents are required together')
    if data.attachment_base64:
        try:
            contents = base64.b64decode(data.attachment_base64, validate=True)
        except (binascii.Error, ValueError):
            raise HTTPException(422, 'Invalid attachment')
        if len(contents) > 1024 * 1024: raise HTTPException(422, 'Attachment must be 1 MB or smaller')
    order = Order(username=user.username, name=data.name.strip(), address=data.address.strip(), status='Placed', created_at=datetime.now(timezone.utc).isoformat(), gift_wrap=int(data.gift_wrap), delivery_method=data.delivery_method, delivery_date=data.delivery_date.isoformat() if data.delivery_date else None, attachment_name=data.attachment_name, attachment_base64=data.attachment_base64)
    for item in data.items:
        p = db.get(Product, item.product_id)
        if not p: raise HTTPException(400, 'A product in your cart is no longer available')
        order.items.append(OrderItem(product_id=p.id, name=p.name, price_cents=p.price_cents, quantity=item.quantity))
    db.add(order); db.commit(); db.refresh(order); return order_data(order)
@app.get('/orders')
def orders(user: AppUser = Depends(get_current_user), db: Session = Depends(session)):
    query = select(Order).order_by(Order.id.desc())
    if user.role != 'admin': query = query.where(Order.username == user.username)
    return [order_data(o) for o in db.scalars(query).all()]
@app.get('/orders/{order_id}')
def order_detail(order_id: int, user: AppUser = Depends(get_current_user), db: Session = Depends(session)):
    return order_data(get_order(db, order_id, user))
@app.patch('/orders/{order_id}/status')
def update_status(order_id: int, data: OrderStatus, user: AppUser = Depends(require_admin), db: Session = Depends(session)):
    order = get_order(db, order_id, user); order.status = data.status; db.commit(); return order_data(order)

@app.get('/orders/{order_id}/attachment')
def order_attachment(order_id: int, user: AppUser = Depends(get_current_user), db: Session = Depends(session)):
    order = get_order(db, order_id, user)
    if not order.attachment_base64: raise HTTPException(404, 'Attachment not found')
    return Response(content=base64.b64decode(order.attachment_base64), media_type='application/octet-stream', headers={'Content-Disposition': 'attachment'})
