import zipfile
import xml.etree.ElementTree as ET
import re
import json

def parse_docx(filename):
    with zipfile.ZipFile(filename) as z:
        xml_content = z.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        raw_text = '\n'.join([p for p in tree.itertext() if p.strip()])
    
    with open('docx_full_text.txt', 'w', encoding='utf-8') as f:
        f.write(raw_text)
    print("Exported full docx text, length:", len(raw_text))

if __name__ == '__main__':
    parse_docx('TOEIC_Reading_Test_Tagged.docx')
