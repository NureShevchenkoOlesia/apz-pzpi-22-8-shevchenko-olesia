import httpx

async def geocode_place_name(place_name: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": place_name, "format": "json", "limit": 1},
            headers={"User-Agent": "CosmorumAstroApp"}
        )

        try:
            data = response.json()
        except Exception:
            return None, None

        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
        return None, None
