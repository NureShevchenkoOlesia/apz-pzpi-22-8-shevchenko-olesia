import requests
import json
import time

class AstrometryClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "http://nova.astrometry.net/api/"
        self.session = self.login()

    def safe_json(self, response):
        try:
            return response.json()
        except Exception:
            raise Exception(f"Invalid JSON response: {response.text[:300]}")

    def login(self):
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; AstrometryClient/1.0)"
        }
        try:
            response = requests.post(
                f"{self.base_url}login",
                data={"request-json": json.dumps({"apikey": self.api_key})},
                headers=headers,
                timeout=10
            )
            data = self.safe_json(response)
            if data.get("status") != "success":
                raise Exception(f"Login failed: {data.get('errormessage', 'Unknown error')}")
            return data["session"]
        except requests.exceptions.RequestException as e:
            raise Exception(f"Connection to astrometry.net failed: {str(e)}")

    def upload_image(self, image_path):
        with open(image_path, "rb") as f:
            files = {"file": f}
            payload = {
                "request-json": json.dumps({
                    "publicly_visible": "n",
                    "allow_modifications": "d",
                    "session": self.session
                })
            }
            response = requests.post(f"{self.base_url}upload", files=files, data=payload)
            data = self.safe_json(response)
            if data.get("status") != "success":
                raise Exception(f"Upload failed: {data.get('errormessage', 'Unknown error')}")
            return data["subid"]

    def wait_for_submission(self, subid, timeout=1000):
        start_time = time.time()
        while time.time() - start_time < timeout:
            response = requests.get(f"{self.base_url}submissions/{subid}")
            data = self.safe_json(response)
            jobs = data.get("jobs", [])
            if jobs and jobs[0] is not None:
                return jobs[0]
            time.sleep(5)
        raise TimeoutError("Timed out waiting for job.")

    def wait_for_calibration(self, job_id, timeout=1000):
        start_time = time.time()
        while time.time() - start_time < timeout:
            response = requests.get(f"{self.base_url}jobs/{job_id}")
            data = self.safe_json(response)
            if data.get("status") == "success":
                return
            elif data.get("status") == "failure":
                raise Exception("Calibration failed.")
            time.sleep(5)
        raise TimeoutError("Timed out waiting for calibration.")

    def get_calibration(self, job_id):
        response = requests.get(f"{self.base_url}jobs/{job_id}/calibration")
        return self.safe_json(response)

    def get_objects_in_field(self, job_id):
        response = requests.get(f"{self.base_url}jobs/{job_id}/objects_in_field")
        return self.safe_json(response)
