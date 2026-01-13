"""
RPA Demo Sites - Special government forms that simulate auto-fill animation
These pages show animated form filling to simulate RPA experience
"""

from fastapi import APIRouter, Request, Query
from fastapi.responses import HTMLResponse
from typing import Optional

router = APIRouter(prefix="/rpa-demo", tags=["RPA Demo Sites"])

@router.get("/torrent-power", response_class=HTMLResponse)
def rpa_demo_torrent_power(
    name: Optional[str] = Query(None),
    mobile: Optional[str] = Query(None),
    service_number: Optional[str] = Query(None),
    t_no: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    a