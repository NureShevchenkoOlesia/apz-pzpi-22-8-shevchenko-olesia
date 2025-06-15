from fastapi import APIRouter, UploadFile, File, HTTPException
from api.astrometry_client import AstrometryClient
import os
import uuid

router = APIRouter()
client = AstrometryClient("azdpbbbjiduwbsbm")  

@router.post("/process")
async def process_astrometry(file: UploadFile = File(...)):
    try:
        filename = f"photos/{uuid.uuid4()}_{file.filename}"
        with open(filename, "wb") as f:
            f.write(await file.read())

        submission_id = client.upload_image(filename)
        job_id = client.wait_for_submission(submission_id)
        client.wait_for_calibration(job_id)

        calibration = client.get_calibration(job_id)
        objects = client.get_objects_in_field(job_id)

        return {
            "job_id": job_id,
            "calibration": calibration,
            "objects": objects,
            "filename": filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
