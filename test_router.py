# Force it to import from explorer.py where we just built our compiled graph
from backend.packages.agent.explorer import explorer_agent

def test_pipeline(prompt: str):
    print(f"\nTesting prompt: '{prompt}'")
    inputs = {"user_prompt": prompt}
    output = explorer_agent.invoke(inputs)
    
    print(f"-> Classification Decision: {output.get('classification')}")
    print(f"-> Final Response: {output.get('response')}")

if __name__ == "__main__":
    test_pipeline("Hey, can you explain what revenue means?")
    test_pipeline("Generate a quarterly financial report for Q2 based on our sales data.")