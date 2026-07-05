from google import genai
from google.genai import types
from app.core.config import settings
from app.models.brave_steps import BraveStepSuggestion, BraveStepAIResponse

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def generate_suggestions(user_input: str) -> list[BraveStepSuggestion]:    
    prompt = f""" You generate brave-step suggestions for Soft Steps, a
    gentle app that helps users practice small social actions. Given the user's
    input, suggest exactly 3 small phrased in 8 words or less, realistic social
    steps they could try when ready.
    Rules:
    - Make each step concrete, gentle, and low-pressure.
    - Focus on students or young adults.
    - Avoid clinical language, diagnoses, therapy advice, or anything unsafe.
    - Use one or two word labels "situation"
    - Use "fear_level" increasing from 1 to 3.
    User input: "{user_input}"
    Return only valid JSON: {{ 
        "suggestions": [ 
        {{ 
            "title": "Say hello to one classmate", 
            "situation": "classroom", 
            "fear_level": 2 
        }} 
        ] 
    }}
    """
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=BraveStepAIResponse,
            temperature=settings.GEMINI_TEMPERATURE,
        ),
    )
    print("Prompt tokens:", response.usage_metadata.prompt_token_count)
    print("Output tokens:", response.usage_metadata.candidates_token_count)
    print("Total tokens:", response.usage_metadata.total_token_count)
    print("RAW RESPONSE:\n", response.text)

    if response.parsed:
        return response.parsed.suggestions

    ai_response = BraveStepAIResponse.model_validate_json(response.text)

    return ai_response.suggestions

def generate_retry_suggestions(user_input: str, previous_suggestions: list[BraveStepSuggestion]) -> list[BraveStepSuggestion]:
    previous_steps = "\n".join(
        f"- {suggestion.title}"
        for suggestion in previous_suggestions)
    
    prompt = f"""Generate exactly 3 small social actions according to this user input:
    "{user_input}"
    Avoid repeating previous suggestions:
    {previous_steps}
    Rules:
    - Do not repeat or lightly reword any previous suggestion.
    - Each action must be gentle, realistic, and low-pressure.
    - Each title must be 8 words or less.
    - Use a short situation label.
    - Use fear_level increasing from 1 to 3.
    - Avoid therapy, diagnosis, or medical advice.
    Return only valid JSON: {{ 
        "suggestions": [ 
        {{ 
            "title": "Say hello to one classmate", 
            "situation": "classroom", 
            "fear_level": 2 
        }} 
        ] 
    }}
    """
    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=BraveStepAIResponse,
            temperature=settings.GEMINI_TEMPERATURE,
        ),
    )
    print("Prompt tokens:", response.usage_metadata.prompt_token_count)
    print("Output tokens:", response.usage_metadata.candidates_token_count)
    print("Total tokens:", response.usage_metadata.total_token_count)
    print("RAW RESPONSE:\n", response.text)
    
    if response.parsed:
        return response.parsed.suggestions

    ai_response = BraveStepAIResponse.model_validate_json(response.text)
    return ai_response.suggestions