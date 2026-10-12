def update_result_page():
    with open('student_exam_result.html', 'r', encoding='utf-8') as f:
        html = f.read()

    scripts = """
<script src="toeic_data.js"></script>
<script src="toeic_storage.js"></script>
<script src="student_exam_result.js"></script>
</body>
"""
    if '<script src="student_exam_result.js">' not in html:
        html = html.replace('</body>', scripts)

    with open('student_exam_result.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated student_exam_result.html")

if __name__ == '__main__':
    update_result_page()
