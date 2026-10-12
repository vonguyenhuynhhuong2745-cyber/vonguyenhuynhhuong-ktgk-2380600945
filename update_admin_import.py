def update_admin_import():
    with open('admin_import_preview.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('data-path="tong-quan" href="#"', 'href="admin_dashboard.html"')
    html = html.replace('data-path="quan-ly-de-thi" href="#"', 'href="admin_dashboard.html"')
    html = html.replace('data-path="import-de-thi-word" href="#"', 'href="admin_import_preview.html"')

    # Replace back button
    html = html.replace('href="#">\n<span class="material-symbols-outlined text-[18px]">arrow_back</span>\n<span>Quay lại danh sách đề thi</span>',
                        'href="admin_dashboard.html">\n<span class="material-symbols-outlined text-[18px]">arrow_back</span>\n<span>Quay lại danh sách đề thi</span>')

    # Add questions preview table if not exists
    if 'id="questions-preview-section"' not in html:
        table_markup = """
<!-- DYNAMIC QUESTIONS TABLE INSERTION -->
<section id="questions-preview-section" class="bg-surface-container-lowest rounded-xl shadow-md p-space-xl mb-space-xl">
  <div class="flex items-center justify-between pb-space-md border-b border-surface-container-high mb-space-md">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-[24px]">list_alt</span>
      <h3 class="font-headline-sm text-headline-sm text-primary">Danh sách & Chỉnh sửa Câu hỏi (Trực quan)</h3>
    </div>
    <span class="px-3 py-1 rounded-full bg-secondary-fixed text-primary font-label-sm font-bold">
      Nhấp vào từng câu hoặc đáp án để sửa trực tiếp
    </span>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-surface-container-low text-on-surface-variant font-label-sm uppercase tracking-wider">
          <th class="py-3 px-space-md text-center w-16">Câu</th>
          <th class="py-3 px-space-md w-24">Phần</th>
          <th class="py-3 px-space-md">Nội dung câu hỏi</th>
          <th class="py-3 px-space-md w-72">4 Đáp án lựa chọn</th>
          <th class="py-3 px-space-md text-center w-28">Đáp án đúng</th>
          <th class="py-3 px-space-md text-right w-24">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <!-- Filled by admin_import_editor.js -->
      </tbody>
    </table>
  </div>
</section>
"""
        html = html.replace('<!-- SECTION 3: INTERACTIVE PREVIEW & EDIT CANVAS -->', table_markup + '\n<!-- SECTION 3: INTERACTIVE PREVIEW & EDIT CANVAS -->')

    scripts = """
<script src="jszip.min.js"></script>
<script src="mammoth.browser.min.js"></script>
<script src="toeic_data.js"></script>
<script src="toeic_storage.js"></script>
<script src="admin_import_editor.js"></script>
</body>
"""
    if '<script src="admin_import_editor.js">' not in html:
        html = html.replace('</body>', scripts)

    with open('admin_import_preview.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully updated admin_import_preview.html")

if __name__ == '__main__':
    update_admin_import()
