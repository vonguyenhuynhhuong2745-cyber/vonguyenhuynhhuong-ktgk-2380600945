import os

frontend_dir = r'c:\Users\nhi\Downloads\Huong\frontend'

for filename in os.listdir(frontend_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(frontend_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update script paths
        content = content.replace('src="jszip.min.js"', 'src="js/jszip.min.js"')
        content = content.replace('src="mammoth.browser.min.js"', 'src="js/mammoth.browser.min.js"')
        content = content.replace('src="toeic_data.js"', 'src="js/toeic_data.js"')
        content = content.replace('src="toeic_storage.js"', 'src="js/toeic_storage.js"')
        content = content.replace('src="admin_import_editor.js"', 'src="js/admin_import_editor.js"')
        content = content.replace('src="student_exam_list.js"', 'src="js/student_exam_list.js"')
        content = content.replace('src="student_take_exam.js"', 'src="js/student_take_exam.js"')
        content = content.replace('src="student_exam_result.js"', 'src="js/student_exam_result.js"')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated paths in {filename}")
