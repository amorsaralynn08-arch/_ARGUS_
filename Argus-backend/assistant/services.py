import requests
from django.conf import settings


def get_nearby_mechanics(address, radius_meters=5000):
    """Geocode an address via Nominatim, then find nearby car repair
    shops via the Overpass API — both free, no API key required."""

    headers = {"User-Agent": "ARGUS-Fleet-App/1.0 (student project)"}

    geocode_resp = requests.get(
        "https://nominatim.openstreetmap.org/search",
        params={"q": address, "format": "json", "limit": 1},
        headers=headers,
        timeout=10,
    ).json()

    if not geocode_resp:
        return []

    lat = geocode_resp[0]["lat"]
    lon = geocode_resp[0]["lon"]

    overpass_query = f"""
    [out:json];
    node["shop"="car_repair"](around:{radius_meters},{lat},{lon});
    out;
    """

    overpass_resp = requests.post(
        "https://overpass-api.de/api/interpreter",
        data={"data": overpass_query},
        headers=headers,
        timeout=15,
    ).json()

    shops = []
    for element in overpass_resp.get("elements", [])[:5]:
        tags = element.get("tags", {})
        shops.append({
            "name": tags.get("name", "Unnamed repair shop"),
            "address": tags.get("addr:street", "Address unavailable"),
            "rating": None,  # OSM doesn't provide ratings, unlike Google Places
        })
    return shops


def get_ai_recommendation(vehicle, alerts, nearby_shops):
    """Build a prompt from real vehicle data and get a recommendation."""
    alert_summary = "\n".join(
        f"- {a.severity}: {a.message} ({a.created_at.strftime('%Y-%m-%d')})"
        for a in alerts
    ) or "No recent alerts."

    shops_summary = "\n".join(
        f"- {s['name']} ({s['address']})" for s in nearby_shops
    ) or "No nearby repair shops found."

    system_prompt = (
        "You are ARGUS Assistant, a maintenance advisor for a fleet health "
        "monitoring platform. You help fleet managers understand why a "
        "vehicle was flagged and what to do next. Be concise and practical. "
        "Only use the information provided below — never invent vehicle "
        "history or shop details you weren't given."
    )

    user_prompt = (
        f"Vehicle: {vehicle.manufacturer} {vehicle.model} "
        f"({vehicle.registration_number})\n"
        f"Current status: {vehicle.status}\n\n"
        f"Recent alerts:\n{alert_summary}\n\n"
        f"Nearby repair shops:\n{shops_summary}\n\n"
        "Explain briefly why this vehicle may need attention, and recommend "
        "a next step, mentioning a nearby shop if relevant."
    )

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": settings.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": settings.ANTHROPIC_MODEL,
                "max_tokens": 300,
                "system": system_prompt,
                "messages": [{"role": "user", "content": user_prompt}],
            },
            timeout=15,
        )
        response.raise_for_status()
        data = response.json()
        return data["content"][0]["text"]
    except requests.RequestException as e:
        print("ANTHROPIC API ERROR:", e)
        if hasattr(e, "response") and e.response is not None:
            print("RESPONSE BODY:", e.response.text)
        return "Sorry, the AI assistant is unavailable right now. Please try again later."