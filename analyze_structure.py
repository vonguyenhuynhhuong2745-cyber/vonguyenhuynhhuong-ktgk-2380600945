import re
import json

def analyze():
    with open('docx_full_text.txt', 'r', encoding='utf-8') as f:
        text = f.read()

    # Search tags
    parts = re.findall(r'<PART\s+id=[\"|\']?(\d+)[\"|\']?>', text)
    print("Parts:", parts)

    # Search Question tags
    questions = re.findall(r'<QUESTION\s+id=[\"|\']?(\d+)[\"|\']?>', text)
    print(f"Total questions: {len(questions)}")
    if questions:
        print(f"First question: {questions[0]}, Last question: {questions[-1]}")

    # Search passages
    passages = re.findall(r'<PASSAGE_GROUP\s+questions=[\"|\']?([0-9\-]+)[\"|\']?>', text)
    print(f"Passage groups: {len(passages)} -> {passages[:5]}")

if __name__ == '__main__':
    analyze()
