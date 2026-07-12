import os
from dotenv import load_dotenv
from openai import OpenAI
from .state import AbiState

# This line forces Python to read your .env file and load the variables
load_dotenv()

# Initialize the OpenAI client to use the Fireworks AI endpoint
client = OpenAI(
    api_key=os.environ.get("FIREWORKS_API_KEY"),
    base_url="https://api.fireworks.ai/inference/v1"
)

def conversation_node(state: AbiState):
    print("\n(->) Conversation Mode: Handling a normal chat message...")
    return {
        "messages": ["Conversation processed"],
        "response": "Hi! I am Abi. I am ready to help you analyze data or just chat."
    }

def classifier_node(state: AbiState) -> str:
    message = state.get("user_message", "").lower()
    return "report" if any(w in message for w in ["report", "data", "analytics"]) else "chat"

def report_mode_node(state: AbiState):
    return {"status": "starting_report"}

def access_map_data_node(state: AbiState):
    return {"status": "accessing_map"}

def run_sql_queries_node(state: AbiState):
    return {"status": "queries_run"}

def summarize_findings_node(state: AbiState):
    print("\n(->) Report Mode: Summarizing SQL findings into technical report...")
    
    # 1. Retrieve the raw data from the pipeline state
    findings = state.get("sql_results", "No results found")
    
    if findings == "No results found" or not findings:
        return {"summary": "No data available to summarize.", "status": "summarized"}

    # 2. Design the prompt for a statistical/financial analyst persona
    prompt = f"""
    You are an expert statistical and financial data analyst. 
    Analyze the following raw SQL query results and generate a highly structured, technical quantitative report.
    This report will be directly ingested by an automated presentation builder, so keep your insights precise, data-driven, and clear.
    
    Include the following sections in your response:
    - Key Metrics & KPIs (Highlight specific figures and percentages)
    - Trend Analysis (Describe directional movements in the data)
    - Actionable Insights (Provide business or trading takeaways based strictly on the figures)
    
    Raw SQL Data:
    {findings}
    """

    try:
        # 3. Call the gpt-oss-120b model via the Fireworks AI endpoint
        response = client.chat.completions.create(
            model="accounts/fireworks/models/gpt-oss-120b",
            messages=[
                {"role": "system", "content": "You are a precise data analysis agent for an automated business intelligence pipeline."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2 
        )
        
        # 4. Extract the generated technical report
        technical_report = response.choices[0].message.content

    except Exception as e:
        print(f"Error during Fireworks AI API call: {e}")
        technical_report = f"Failed to generate report due to an error: {str(e)}"

    # 5. Save the report back into your state management system
    return {"summary": technical_report, "status": "summarized"}

def create_layout_json_node(state: AbiState):
    return {"status": "layout_created"}