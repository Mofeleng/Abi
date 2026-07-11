from agents.abi_data import run as r1
from agents.abi_convert import run as r2
from agents.abi_design import run as r3
from agents.abi_present import run as r4

print("--- Starting AI Pipeline ---")
# 1. Ingest Data
data = r1('Analyze store performance')
# 2. Convert to slide schema
slides = r2(data)
# 3. Design PPTX
ppt = r3(slides, 'outputs/final_presentation.pptx')
# 4. Generate Narration & Video
r4(slides, 'outputs/narration', ppt)
print("--- Pipeline Finished Successfully ---")