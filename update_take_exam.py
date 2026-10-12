def update_take_exam():
    with open('student_take_exam.html', 'r', encoding='utf-8') as f:
        html = f.read()

    scripts = """
<script src="toeic_data.js"></script>
<script src="toeic_storage.js"></script>
<script src="student_take_exam.js"></script>
</body>
"""
    if '<script src="student_take_exam.js">' not in html:
        html = html.replace('</body>', scripts)

    with open('student_take_exam.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated student_take_exam.html")

if __name__ == '__main__':
    update_take_exam()
