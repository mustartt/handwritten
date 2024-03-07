import asyncio
import base64
import logging

import httpx
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel, Field

from scanner_service.transform import ScanType, ScanBorder, scan_image


class HTTPXClientWrapper:
    async_client = None

    def start(self):
        self.async_client = httpx.AsyncClient()
        logging.info(f'httpx AsyncClient instantiated. Id {id(self.async_client)}')

    async def stop(self):
        logging.info(
            f'httpx async_client.is_closed(): {self.async_client.is_closed} - Now close it. Id (will be unchanged): {id(self.async_client)}')
        await self.async_client.aclose()
        logging.info(
            f'httpx async_client.is_closed(): {self.async_client.is_closed}. Id (will be unchanged): {id(self.async_client)}')
        self.async_client = None
        logging.info('httpx AsyncClient closed')

    def __call__(self):
        assert self.async_client is not None
        logging.info(
            f'httpx async_client.is_closed(): {self.async_client.is_closed}. Id (will be unchanged): {id(self.async_client)}')
        return self.async_client


httpx_client_wrapper = HTTPXClientWrapper()
app = FastAPI()


@app.on_event("startup")
async def startup_event():
    httpx_client_wrapper.start()


@app.on_event("shutdown")
async def shutdown_event():
    await httpx_client_wrapper.stop()


async def get_image_data(url: str) -> bytes:
    if url.startswith("data:") and ";base64," in url:
        base64_data = url.split(";base64,")[-1]
        return base64.b64decode(base64_data, validate=True)
    else:
        client = httpx_client_wrapper()
        response = await client.get(url=url)
        return response.content


class ImageScanRequest(BaseModel):
    id: str = Field(..., description="Request ID")
    scan_border: Optional[ScanBorder] = Field(None, description="Optional scan border defining the area to scan")
    scan_type: ScanType = Field(..., description="Scan type")
    image_url: str = Field(..., description="image uri or base64 encoded image")


class ImageScanResponse(BaseModel):
    id: str = Field(..., description="Request ID")
    image_data: str = Field(..., description="Image base64 data")
    scan_border: ScanBorder = Field(..., description="Scan border defining the area scanned")


@app.post("/api/v1/image/scan")
async def scan(request: ImageScanRequest):
    image_bytes = await get_image_data(request.image_url)
    result_bytes, scanned_border = await asyncio.to_thread(
        scan_image,
        image_bytes,
        request.scan_type,
        request.scan_border
    )

    return ImageScanResponse(
        id=request.id,
        image_data=f"data:image/jpeg;base64,{base64.b64encode(result_bytes).decode()}",
        scan_border=scanned_border
    )
