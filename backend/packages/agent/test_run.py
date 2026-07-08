from graph import abi_agent

print("Abi is executing via LangGraph...")

# Test 1: Hit the top conversational path
print("\n--- RUNNING CHAT PATH ---")
chat_result = abi_agent.invoke({"user_message": "Hello Abi."})
print(f"Final App Response: {chat_result['response']}")

# Test 2: Hit the bottom sequential report path from your diagram
print("\n--- RUNNING REPORT PATH ---")
report_result = abi_agent.invoke({"user_message": "Please generate a sales report for me?"})
print(f"Final App Response: {report_result['response']}")
print(f"Generated Layout JSON: {report_result['presentation_json']}")