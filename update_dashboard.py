import re

def update_dashboard():
    with open('admin_dashboard.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Link navigation
    content = content.replace('data-path="tong-quan" href="#"', 'href="admin_dashboard.html"')
    content = content.replace('data-path="quan-ly-de-thi" href="#"', 'href="admin_dashboard.html"')
    content = content.replace('data-path="import-de-thi-word" href="#"', 'href="admin_import_preview.html"')

    # Inject scripts
    script_content = """
<script src="toeic_data.js"></script>
<script src="toeic_storage.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  renderExamsTable();

  // Search input
  const searchInput = document.getElementById('examSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      renderExamsTable(e.target.value.trim().toLowerCase());
    });
  }
});

function renderExamsTable(query = '') {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;
  let exams = ToeicDB.getExams();

  if (query) {
    exams = exams.filter(e => e.title.toLowerCase().includes(query) || (e.id && e.id.toLowerCase().includes(query)));
  }

  // Update KPI card count
  const kpiCount = document.querySelector('.font-display-lg');
  if (kpiCount && !query) kpiCount.textContent = exams.length;

  let html = '';
  exams.forEach((exam, idx) => {
    html += `
    <tr class="hover:bg-surface-container-low/60 transition-colors group">
      <td class="py-4 px-space-md text-center font-label-md text-outline">${idx + 1}</td>
      <td class="py-4 px-space-md font-mono font-semibold text-primary">
        <span class="bg-surface-container px-2 py-1 rounded text-primary">${(exam.id || 'EXAM').substring(0, 12).toUpperCase()}</span>
      </td>
      <td class="py-4 px-space-md">
        <div class="flex flex-col">
          <span class="font-label-lg text-label-lg font-bold text-on-surface group-hover:text-secondary transition-colors">
            ${exam.title}
          </span>
          <span class="font-label-sm text-label-sm text-outline">${exam.description || 'Đề thi chuẩn TOEIC Reading'}</span>
        </div>
      </td>
      <td class="py-4 px-space-md text-center">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container font-semibold text-primary">
          ${exam.questions ? exam.questions.length : 100} câu
        </span>
      </td>
      <td class="py-4 px-space-md text-center">
        <span class="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
          <span class="material-symbols-outlined text-[16px] text-outline">schedule</span> ${exam.durationMinutes || 75} phút
        </span>
      </td>
      <td class="py-4 px-space-md text-center text-outline font-label-sm text-label-sm">
        ${exam.createdAt ? new Date(exam.createdAt).toLocaleDateString('vi-VN') : '12/10/2026'}
      </td>
      <td class="py-4 px-space-md text-center">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold bg-emerald-100 text-emerald-800">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Đang mở
        </span>
      </td>
      <td class="py-4 px-space-md text-center">
        <div class="flex items-center justify-center gap-1">
          <a href="student_take_exam.html?examId=${exam.id}" target="_blank" class="p-1.5 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-all" title="Làm bài thi">
            <span class="material-symbols-outlined text-[20px]">play_circle</span>
          </a>
          <a href="admin_import_preview.html?examId=${exam.id}" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" title="Chỉnh sửa nội dung đề">
            <span class="material-symbols-outlined text-[20px]">edit</span>
          </a>
          <button onclick="deleteExamItem('${exam.id}', '${exam.title}')" class="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container transition-all" title="Xóa đề thi" type="button">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
    `;
  });
  tbody.innerHTML = html;
}

function deleteExamItem(id, title) {
  if (confirm(`Bạn có chắc chắn muốn xóa đề thi: ${title}?`)) {
    ToeicDB.deleteExam(id);
    renderExamsTable();
    alert('Đã xóa đề thi thành công!');
  }
}
</script>
</body>
"""
    if '<script src="toeic_data.js">' not in content:
        content = content.replace('</body>', script_content)

    with open('admin_dashboard.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated admin_dashboard.html")

if __name__ == '__main__':
    update_dashboard()
