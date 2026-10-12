// Exam List Controller for Student
document.addEventListener('DOMContentLoaded', function() {
  renderStudentExamList();

  // Search input
  const searchInput = document.querySelector('input[type="text"][placeholder*="Tìm kiếm"]');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      renderStudentExamList(e.target.value.trim().toLowerCase());
    });
  }

  // Filter chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      filterChips.forEach(c => {
        c.classList.remove('bg-primary', 'text-on-primary');
        c.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      this.classList.add('bg-primary', 'text-on-primary');
      this.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
      renderStudentExamList('', this.dataset.filter);
    });
  });

  // Update latest score card if available
  const latestResult = ToeicDB.getLatestResult();
  if (latestResult) {
    const scoreVal = document.querySelector('.font-headline-md.text-secondary');
    if (scoreVal) scoreVal.textContent = latestResult.estimatedScore;
  }
});

function renderStudentExamList(query = '', filter = 'all') {
  // Find exams container
  const container = document.querySelector('.flex.flex-col.gap-space-sm') || document.querySelector('main .flex.flex-col.w-full.pb-8');
  if (!container) return;

  const exams = ToeicDB.getExams();
  let filtered = exams;

  if (query) {
    filtered = filtered.filter(e => e.title.toLowerCase().includes(query) || (e.description && e.description.toLowerCase().includes(query)));
  }

  // Update exam count badge
  const countBadge = document.querySelector('.filter-chip[data-filter="all"] span:last-child');
  if (countBadge) countBadge.textContent = exams.length;

  // Find or create cards list wrapper
  let listWrapper = document.getElementById('student-exams-wrapper');
  if (!listWrapper) {
    listWrapper = document.createElement('div');
    listWrapper.id = 'student-exams-wrapper';
    listWrapper.className = 'flex flex-col gap-space-sm mt-space-sm';
    
    // Insert after section title
    const titleEl = document.querySelector('.font-headline-sm.text-headline-sm.text-primary:has(+ span)');
    if (titleEl && titleEl.parentElement) {
      titleEl.parentElement.insertAdjacentElement('afterend', listWrapper);
    } else {
      container.appendChild(listWrapper);
    }
  }

  let html = '';
  filtered.forEach((exam, idx) => {
    const qCount = exam.questions ? exam.questions.length : 100;
    const isSpecial = idx === 0;

    html += `
      <div class="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm border border-surface-container-high hover:border-secondary transition-all">
        <div class="flex items-start justify-between gap-space-sm mb-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full ${isSpecial ? 'bg-secondary-fixed text-primary' : 'bg-surface-container text-on-surface-variant'} font-label-sm font-bold">
              ${isSpecial ? 'ĐỀ MỚI NHẤT' : 'LUYỆN TẬP'}
            </span>
            <span class="font-label-sm text-outline font-mono">${(exam.id || 'EXAM').substring(0, 10).toUpperCase()}</span>
          </div>
          <span class="inline-flex items-center gap-1 font-label-sm text-secondary font-semibold">
            <span class="material-symbols-outlined text-[16px]">timer</span> ${exam.durationMinutes || 75} phút
          </span>
        </div>

        <h3 class="font-headline-sm text-primary font-bold mb-1">${escapeHtml(exam.title)}</h3>
        <p class="font-body-sm text-on-surface-variant mb-space-md line-clamp-2">${escapeHtml(exam.description || 'Đề thi đọc hiểu tiếng Anh chuẩn định dạng ETS TOEIC.')}</p>

        <div class="flex items-center justify-between pt-2 border-t border-surface-container-high/60">
          <div class="flex items-center gap-3 font-label-sm text-on-surface-variant">
            <span><strong>${qCount}</strong> câu hỏi</span>
            <span>•</span>
            <span>Part 5, 6, 7</span>
          </div>

          <a href="student_take_exam.html?examId=${exam.id}" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold shadow-sm transition-all active:scale-95">
            <span>Bắt đầu thi</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </a>
        </div>
      </div>
    `;
  });

  listWrapper.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
