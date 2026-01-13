from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, ElectricityAccount, GasAccount, WaterAccount, PropertyAccount
from app.schemas import (
    ElectricityAccountCreate, ElectricityAccountResponse,
    GasAccountCreate, GasAccountResponse,
    WaterAccountCreate, WaterAccountResponse,
    PropertyAccountCreate, PropertyAccountResponse
)
from app.auth import get_current_user

router = APIRouter(prefix="/api/services", tags=["Services"])

# ============ ELECTRICITY ============
@router.post("/electricity", response_model=ElectricityAccountResponse)
def add_electricity_account(
    account_data: ElectricityAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = ElectricityAccount(user_id=current_user.id, **account_data.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

@router.get("/electricity", response_model=List[ElectricityAccountResponse])
def get_electricity_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(ElectricityAccount).filter(ElectricityAccount.user_id == current_user.id).all()

@router.delete("/electricity/{account_id}")
def delete_electricity_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = db.query(ElectricityAccount).filter(
        ElectricityAccount.id == account_id,
        ElectricityAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return {"message": "Account deleted"}

# ============ GAS ============
@router.post("/gas", response_model=GasAccountResponse)
def add_gas_account(
    account_data: GasAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = GasAccount(user_id=current_user.id, **account_data.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

@router.get("/gas", response_model=List[GasAccountResponse])
def get_gas_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(GasAccount).filter(GasAccount.user_id == current_user.id).all()

@router.delete("/gas/{account_id}")
def delete_gas_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = db.query(GasAccount).filter(
        GasAccount.id == account_id,
        GasAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return {"message": "Account deleted"}


# ============ WATER ============
@router.post("/water", response_model=WaterAccountResponse)
def add_water_account(
    account_data: WaterAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = WaterAccount(user_id=current_user.id, **account_data.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

@router.get("/water", response_model=List[WaterAccountResponse])
def get_water_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(WaterAccount).filter(WaterAccount.user_id == current_user.id).all()

@router.delete("/water/{account_id}")
def delete_water_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = db.query(WaterAccount).filter(
        WaterAccount.id == account_id,
        WaterAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return {"message": "Account deleted"}

# ============ PROPERTY ============
@router.post("/property", response_model=PropertyAccountResponse)
def add_property_account(
    account_data: PropertyAccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = PropertyAccount(user_id=current_user.id, **account_data.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account

@router.get("/property", response_model=List[PropertyAccountResponse])
def get_property_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(PropertyAccount).filter(PropertyAccount.user_id == current_user.id).all()

@router.delete("/property/{account_id}")
def delete_property_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = db.query(PropertyAccount).filter(
        PropertyAccount.id == account_id,
        PropertyAccount.user_id == current_user.id
    ).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    db.delete(account)
    db.commit()
    return {"message": "Account deleted"}
