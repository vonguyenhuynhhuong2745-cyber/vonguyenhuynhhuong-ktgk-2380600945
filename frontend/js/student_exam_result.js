// Exam Result Controller
document.addEventListener('DOMContentLoaded', function() {
  const result = ToeicDB.getLatestResult();
  if (!result) {
    // If no test completed, let's keep mock or redirect
    return;
  }

  // Title
  const titleEl = document.querySelector('h2.font-headline-lg-mobile');
  if (titleEl) titleEl.textContent = result.examTitle || 'TOEIC Reading Practice Test';

  // Date & Duration
  const metaContainer = document.querySelector('.flex.flex-wrap.items-center.gap-y-1');
  if (metaContainer) {
    const mins = Math.floor((result.durationSecondsSpent || 0) / 60);
    const secs = (result.durationSecondsSpent || 0) % 60;
    const dateStr = result.submittedAt ? new Date(result.submittedAt).toLocaleString('vi-VN') : 'Vừa xong';
    metaContainer.innerHTML = `
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px]">event</span>
        <span>${dateStr}</span>
      </div>
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px]">timer</span>
        <span>${mins} phút ${secs} giây / 75 phút</span>
      </div>
    `;
  }

  // Score Hero
  const scoreEl = document.querySelector('.font-display-lg.text-display-lg.text-primary');
  if (scoreEl) scoreEl.textContent = result.estimatedScore;

  // Level Badge
  const levelBadge = document.querySelector('section:nth-of-type(2) .rounded-full.bg-surface-container');
  if (levelBadge) {
    let level = 'A2';
    if (result.estimatedScore >= 400) level = 'C1 (Advanced)';
    else if (result.estimatedScore >= 350) level = 'B2 (Upper-Intermediate)';
    else if (result.estimatedScore >= 250) level = 'B1 (Intermediate)';
    levelBadge.innerHTML = `<span class="material-symbols-outlined text-[14px] text-secondary">verified</span> Trình độ tương đương ${level}`;
  }

  // Accuracy Ring
  const pctText = document.querySelector('section:nth-of-type(2) .font-headline-sm.text-primary.font-bold');
  if (pctText) pctText.textContent = `${result.accuracyPct}%`;

  const svgCircle = document.querySelector('svg circle:last-child');
  if (svgCircle) {
    // Circumference 2 * pi * 15.5 = ~97.38
    const offset = 97.38 * (1 - result.accuracyPct / 100);
    svgCircle.setAttribute('stroke-dashoffset', offset);
  }

  // Quick Stats
  const statGrid = document.querySelector('.grid.grid-cols-3');
  if (statGrid) {
    const correctEl = statGrid.children[0].querySelector('.font-headline-sm');
    if (correctEl) correctEl.textContent = result.correctCount;

    const wrongEl = statGrid.children[1].querySelector('.font-headline-sm');
    if (wrongEl) wrongEl.textContent = result.incorrectCount;

    const skipEl = statGrid.children[2].querySelector('.font-headline-sm');
    if (skipEl) skipEl.textContent = result.unansweredCount;
  }

  // Part Breakdown
  if (result.partStats) {
    const partSections = document.querySelectorAll('.flex.flex-col.gap-space-sm > div.bg-surface-container-lowest');
    if (partSections.length >= 3) {
      // Part 5
      updatePartCard(partSections[0], result.partStats.part5);
      // Part 6
      updatePartCard(partSections[1], result.partStats.part6);
      // Part 7
      updatePartCard(partSections[2], result.partStats.part7);
    }
  }

  // Render Detailed Question Review List
  renderQuestionReviewList(result);
});

function updatePartCard(card, stats) {
  if (!card || !stats) return;
  const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  const pctEl = card.querySelector('.font-headline-sm.text-tertiary-container, .font-headline-sm');
  if (pctEl) pctEl.textContent = `${pct}%`;

  const countEl = card.querySelector('.font-label-sm.text-on-surface-variant.block, .text-right span.block');
  if (countEl) countEl.textContent = `${stats.correct} / ${stats.total} câu`;

  const bar = card.querySelector('.bg-tertiary-fixed-dim, .bg-secondary-container, .bg-secondary');
  if (bar) bar.style.width = `${pct}%`;
}

function renderQuestionReviewList(result) {
  const exam = ToeicDB.getExamById(result.examId);
  if (!exam || !exam.questions) return;

  // Create review section
  let reviewSection = document.getElementById('detailed-review-section');
  if (!reviewSection) {
    reviewSection = document.createElement('section');
    reviewSection.id = 'detailed-review-section';
    reviewSection.className = 'flex flex-col w-full mb-space-lg';
    
    const mainContent = document.querySelector('main .flex.flex-col.w-full.pb-28');
    if (mainContent) {
      mainContent.appendChild(reviewSection);
    }
  }

  let html = `
    <div class="flex items-center justify-between mb-space-sm pt-4 border-t border-surface-container-high">
      <div class="flex items-center gap-1.5">
        <span class="material-symbols-outlined text-primary text-[20px]">fact_check</span>
        <h3 class="font-headline-sm text-headline-sm text-primary">Bảng giải thích chi tiết từng câu</h3>
      </div>
      <span class="font-label-sm text-label-sm text-on-surface-variant">${exam.questions.length} câu</span>
    </div>
    <div class="flex flex-col gap-3">
  `;

  exam.questions.slice(0, 30).forEach(q => {
    const userAns = result.userAnswers ? result.userAnswers[q.id] : null;
    const isCorrect = userAns && userAns.toUpperCase() === q.correctAnswer.toUpperCase();
    const isSkip = !userAns;

    let badgeClass = isCorrect ? 'bg-emerald-100 text-emerald-800' : (isSkip ? 'bg-surface-container text-outline' : 'bg-rose-100 text-rose-800');
    let badgeText = isCorrect ? 'Chính xác' : (isSkip ? 'Chưa trả lời' : 'Sai');

    html += `
      <div class="p-space-md rounded-xl bg-surface-container-lowest border ${isCorrect ? 'border-emerald-200' : 'border-surface-container-high'} shadow-xs flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-primary font-mono">Câu ${q.id}</span>
            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container text-primary">Part ${q.part}</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}">${badgeText}</span>
        </div>
        <p class="font-body-sm text-on-surface">${escapeHtml(q.text)}</p>
        <div class="flex items-center gap-4 text-xs font-semibold pt-1">
          <span>Bạn chọn: <strong class="${isCorrect ? 'text-emerald-700' : 'text-rose-600'}">${userAns || 'Chưa chọn'}</strong></span>
          <span>Đáp án đúng: <strong class="text-emerald-700">${q.correctAnswer}</strong></span>
        </div>
        <div class="p-2 rounded bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
          <strong class="text-primary">💡 Giải thích:</strong> ${escapeHtml(q.explanation || 'Xem lại kiến thức ngữ pháp và ngữ cảnh bài đọc.')}
        </div>
      </div>
    `;
  });

  html += `
    <div class="pt-4 flex items-center justify-center gap-4">
      <a href="student_exam_list.html" class="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md font-bold transition-all">
        Trở về danh sách đề
      </a>
      <a href="student_take_exam.html?examId=${result.examId}" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md font-bold shadow-sm transition-all">
        Làm lại đề này
      </a>
    </div>
  </div>`;

  reviewSection.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
