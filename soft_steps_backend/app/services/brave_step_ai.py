from app.models.brave_steps import BraveStepSuggestion

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