
import os
from dotenv import load_dotenv
from google import genai
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Please set GEMINI_API_KEY in your .env file")

client = genai.Client(api_key=api_key)

SYSTEM_PROMPT = """
You are a helpful AI tutor.

Follow these rules:
1. Explain everything in simple English.
2. Assume the user is a beginner.
3. Give a practical example whenever possible.
4. Keep the answer clear and easy to understand.
"""

@require_POST
def chat(request):
    try:
        data = json.loads(request.body)
        user_message = data.get("message", "").strip()

        if not user_message:
            return JsonResponse(
                {"error": "Please enter a message."},
                status=400
            )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message,
            config={
                "system_instruction": SYSTEM_PROMPT
            }
        )

        answer = response.text

        if not answer:
            return JsonResponse(
                {"error": "Gemini returned no response."},
                status=502
            )

        return JsonResponse({"reply": answer})

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON request."},
            status=400
        )

    except Exception:
        return JsonResponse(
            {"error": "Something went wrong. Please try again."},
            status=500
        )
