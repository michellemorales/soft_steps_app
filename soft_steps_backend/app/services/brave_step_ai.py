#from google import genai
#from google.genai import types
#from app.core.config import settings
from app.models.brave_steps import BraveStepSuggestion, BraveStepAIResponse

prompt = """ You generate brave-step suggestions for Soft Steps, a
    gentle app that helps users practice small social actions. Given the user's
    input, suggest exactly 3 small phrased in 8 words or less, realistic social
    steps they could try when ready.
    Rules:
    - Make each step concrete, gentle, and low-pressure.
    - Focus on students or young adults.
    - Avoid clinical language, diagnoses, therapy advice, or anything unsafe.
    - Use one or two word labels "situation"
    - Use "fear_level" from 1 to 5.
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
#client = genai.Client(api_key=settings.GEMINI_API_KEY)

#this function is called in the ai-suggestion route
#It returns hard-coded suggestions, but will later be changed with AI API
#User input will be passed to a prompt to generate a list of suggested steps 
def generate_suggestions(user_input: str) -> list[BraveStepSuggestion]:    
    return[
        BraveStepSuggestion(
            title="Raise your hand once in class",
            situation="classroom",
            fear_level=4
        ),
        BraveStepSuggestion(
            title="Share one thought with a classmate",
            fear_level=3
        )
    ]


    #response = client.models.generate_content(
    #    model=settings.GEMINI_MODEL,
    #    contents=prompt,
    #    config=types.GenerateContentConfig(
    #        response_mime_type="application/json",
    #    ),
    #)

    #ai_response = BraveStepAIResponse.model_validate_json(response.text)

    #return ai_response.suggestions