import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_fireworks import ChatFireworks
from dotenv import load_dotenv

# Force load the .env file from the current directory
load_dotenv()

def create_classifier(model_name: str = "accounts/fireworks/models/gpt-oss-120b"):
    """Creates a routing node using the serverless gpt-oss-120b model on Fireworks."""
    
    # Grab the key directly from the environment to ensure it loaded
    api_key = os.getenv("FIREWORKS_API_KEY")
    
    if not api_key:
        raise ValueError("API Key still not found! Check your .env file name and location.")

    # Pass the key directly to the client
    llm = ChatFireworks(
        model=model_name, 
        temperature=0,
        max_tokens=1000,
        api_key=api_key
    )
    
    system_prompt = (
        "You are an expert intent classifier for a business intelligence system. "
        "Analyze the user's prompt and reply with EXACTLY one word: "
        "Return 'chat' if the user wants a simple, direct conversational answer. "
        "Return 'report' if the user requires a comprehensive analysis or data document. "
        "Do not include any punctuation, formatting, or extra text."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{user_prompt}")
    ])
    
    classifier_chain = prompt | llm
    return classifier_chain