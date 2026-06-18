from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1)
    sku: str = Field(..., min_length=1)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# --- Customer Schemas ---
class CustomerBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# --- Order Item Schemas ---
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)
    unit_price: float

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderItemResponse(OrderItemBase):
    id: int
    order_id: int

    model_config = ConfigDict(from_attributes=True)

# --- Order Schemas ---
class OrderBase(BaseModel):
    customer_id: int
    status: Optional[str] = "Pending"
    total_amount: Optional[float] = 0.0

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderResponse(OrderBase):
    id: int
    order_date: datetime
    items: List[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)
