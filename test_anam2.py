import requests

api_key = "MmE1ZWMwYzQtNDMxMC00ZDJiLWJjZjUtODhhNjgzNTIwYmJjOjlNajh5Um9DSzlhd21MSWRONUdzY3JVN0xMaHA1djk4cnZOS0RjSkF2SFU9"
avatar_id = "290ef1d5-9201-40f4-8c88-394a6317f10d" # Original Evelyn avatarId

persona_config = {
    "name": "Emma",
    "avatarId": avatar_id,
    "avatarModel": "cara-4",
    "voiceId": "04965b9e-ff4c-4b54-a4dc-fba6e458c760",
    "llmId": "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",
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
