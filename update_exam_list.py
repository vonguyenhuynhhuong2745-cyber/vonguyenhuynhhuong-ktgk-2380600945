def update_exam_list():
    with open('student_exam_list.html', 'r', encoding='utf-8') as f:
        html = f.read()

    scripts = """
<script src="toeic_data.js"></script>
<script src="toeic_storage.js"></script>
<script src="student_exam_list.js"></script>
</body>
"""
    if '<script src="student_exam_list.js">' not in html:
        html = html.replace('</body>', scripts)

    with open('student_exam_list.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated student_exam_list.html")

if __name__ == '__main__':
    update_exam_list()
