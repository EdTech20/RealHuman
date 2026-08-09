import requests

api_key = "MmE1ZWMwYzQtNDMxMC00ZDJiLWJjZjUtODhhNjgzNTIwYmJjOjlNajh5Um9DSzlhd21MSWRONUdzY3JVN0xMaHA1djk4cnZOS0RjSkF2SFU9"
persona_id = "e0048945-6519-5316-af20-37729c9e36ca"

persona_config = {
    "personaId": persona_id,
    "systemPrompt": "You are Emma, a helpful AI assistant."
}

res1 = requests.post(
    "https://api.anam.ai/v1/auth/session-token",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"personaConfig": persona_config}
)
print("Auth Response:", res1.status_code, res1.text)

if res1.status_code == 200:
    token = res1.json().get("sessionToken")
    res2 = requests.post(
        "https://api.anam.ai/v1/engine/session",
        headers={"Authorization": f"Bearer {token}"},
        json={} 
    )
    print("Engine Response:", res2.status_code, res2.text)
