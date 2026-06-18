"""
ABI — Automated Business Intelligence
Main orchestrator: chains Abi Data → Abi Convert → Abi Design → Abi Present
"""

import sys
import os
import time
from data.loader import load_csv

sys.path.append(os.path.dirname(__file__))

import agents.abi_data as abi_data
import agents.abi_convert as abi_convert
import agents.abi_design as abi_design
import agents.abi_present as abi_present


def run_abby(user_prompt: str, csv_data: dict = None):
    print("\n" + "="*60)
    print("   ABI — Automated Business Intelligence Multi-Agent Pipeline")
    print("="*60)
    print(f"\nPrompt: {user_prompt}\n")

    timestamp = time.strftime("%Y%m%d-%H%M%S")
    output_path = f"outputs/presentation_{timestamp}.pptx"
    media_output_dir = f"outputs/media_{timestamp}"

    # Step 1: Abi Data -> Process context/user request and pull relevant datasets
    data_package = abi_data.run(user_prompt, csv_data=csv_data)

    # Step 2: Abi Convert -> Map datasets to structural layouts using real metrics in Rands
    slide_outline = abi_convert.run(data_package)

    # Step 3: Abi Design -> Create graphs and compile the premium presentation deck
    output_file = abi_design.run(slide_outline, output_path)

    # Step 4: Abi Present -> Transcribe script, save full text narration, and compile MP4 video
    media_package = abi_present.run(
        slide_outline=slide_outline, 
        output_dir=media_output_dir, 
        pptx_path=output_file
    )

    print("\n" + "="*60)
    print("   Done! Multi-Agent Production Sequence Completed Successfully")
    print("="*60)
    print(f" ▸ Executive Slide Deck : {os.path.abspath(output_file)}")
    print(f" ▸ Full Narration Text  : {os.path.abspath(media_package['script_path'])}")
    print(f" ▸ Voice Audio Clips    : {os.path.abspath(media_output_dir)}/")
    if media_package.get("video_path") and media_package["video_path"] != "Not Generated":
        print(f" ▸ Compiled Master Video: {os.path.abspath(media_package['video_path'])}")
    print("="*60 + "\n")

    return output_file, media_package


if __name__ == "__main__":
    print("============================================================")
    print("  Welcome to ABI — Automated Business Intelligence Pipeline")
    print("============================================================")
    
    # Prompt the user before doing anything else
    prompt = input("\nEnter your analytics request or prompt: \n> ")
    
    if not prompt.strip():
        prompt = "Give me a detailed summary of this supermarket sales data and top recommendations."

    csv_path = "data/supermarket_sales_new.csv"
    csv_data = load_csv(csv_path)
    
    print("\nInitializing pipeline sequence... User prompt captured successfully.")
    run_abby(prompt, csv_data=csv_data)