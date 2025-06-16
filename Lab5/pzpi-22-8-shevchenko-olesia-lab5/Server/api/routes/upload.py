from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from api.astrometry_client import AstrometryClient
import tempfile
import shutil
import os
from uuid import uuid4

router = APIRouter()

API_KEY = "hdcpwrlgsblxpkbw"

UPLOAD_DIR = "static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    try:
        client = AstrometryClient(API_KEY)
        print(f"Received file: {file.filename}")

        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[-1]) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        print(f"Temporary file saved at: {tmp_path}")

        subid = client.upload_image(tmp_path)
        print(f"Submission ID: {subid}")

        job_id = client.wait_for_submission(subid)
        print(f"Job ID: {job_id}")

        client.wait_for_calibration(job_id)
        print("Calibration complete")

        calibration = client.get_calibration(job_id)
        objects = client.get_objects_in_field(job_id)

        ext = os.path.splitext(file.filename)[-1]
        final_name = f"{uuid4().hex}{ext}"
        final_path = os.path.join(UPLOAD_DIR, final_name)
        shutil.move(tmp_path, final_path)

        image_url = f"http://localhost:8000/images/{final_name}"

        print("Upload complete")

        return {
            "status": "success",
            "image_url": image_url,
            "calibration": calibration,
            "objects_in_field": objects,
        }

    except Exception as e:
        print("Error during upload:", str(e))
        return JSONResponse(
            status_code=500,
            content={"status": "error", "detail": str(e)}
        )
