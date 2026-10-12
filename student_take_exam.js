// TOEIC Exam Engine
let examData = null;
let currentQuestionIndex = 0;
let userAnswers = {}; // { questionId: 'A' | 'B' | 'C' | 'D' }
let flaggedQuestions = new Set();
let timerInterval = null;
let remainingSeconds = 75 * 60; // 75 mins

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('examId');

  if (examId) {
    examData = ToeicDB.getExamById(examId);
  } else {
    examData = ToeicDB.getExams()[0];
  }

  if (!examData) {
    alert('Không tìm thấy dữ liệu đề thi!');
    window.location.href = 'student_exam_list.html';
    return;
  }

  initExamUI();
  startTimer();
});

function initExamUI() {
  // Title
  const titleEl = document.querySelector('.font-headline-sm.text-headline-sm.text-primary.truncate');
  if (titleEl) titleEl.textContent = examData.title;

  // Header Back Button
  const backBtn = document.querySelector('header button[onclick="history.back()"]');
  if (backBtn) {
    backBtn.onclick = function(e) {
      e.preventDefault();
      if (confirm('Bạn có chắc chắn muốn rời khỏi phòng thi? Bài thi chưa nộp sẽ không được ghi nhận.')) {
        window.location.href = 'student_exam_list.html';
      }
    };
  }

  // Setup Part Switch Buttons
  const partBtns = document.querySelectorAll('.flex.items-center.gap-space-xs.mb-space-md button');
  if (partBtns.length >= 3) {
    partBtns[0].onclick = () => jumpToFirstQuestionOfPart(5);
    partBtns[1].onclick = () => jumpToFirstQuestionOfPart(6);
    partBtns[2].onclick = () => jumpToFirstQuestionOfPart(7);
  }

  // Render first question
  currentQuestionIndex = 0;
  renderQuestion(currentQuestionIndex);
  renderMatrixGrid();
}

function startTimer() {
  remainingSeconds = (examData.durationMinutes || 75) * 60;
  const timerEl = document.getElementById('exam-timer');

  timerInterval = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      alert('⏰ Đã hết thời gian làm bài! Hệ thống đang tự động nộp bài của bạn.');
      submitExam(true);
      return;
    }

    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;

    if (timerEl) {
      timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

function renderQuestion(index) {
  if (!examData.questions || index < 0 || index >= examData.questions.length) return;
  currentQuestionIndex = index;
  const q = examData.questions[index];

  // Update question header
  const qNumBadge = document.querySelector('section:nth-of-type(2) .font-headline-sm.text-headline-sm.text-primary.font-bold');
  if (qNumBadge) qNumBadge.textContent = `Câu ${q.id} / ${examData.questions[examData.questions.length - 1].id}`;

  const partBadge = document.querySelector('section:nth-of-type(2) .px-2.py-0\\.5.rounded-full.bg-secondary-fixed');
  if (partBadge) partBadge.textContent = `Part ${q.part}`;

  // Flag button
  const flagBtn = document.getElementById('btn-flag');
  const flagText = document.getElementById('flag-text');
  const flagIcon = document.getElementById('flag-icon');
  if (flagBtn) {
    if (flaggedQuestions.has(q.id)) {
      flagBtn.className = 'flex items-center gap-1 px-2.5 py-1 rounded-full bg-error text-white font-label-sm active:scale-95 transition-all';
      if (flagText) flagText.textContent = 'Đã đánh dấu';
      if (flagIcon) flagIcon.textContent = 'bookmark_added';
    } else {
      flagBtn.className = 'flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm active:scale-95 transition-all';
      if (flagText) flagText.textContent = 'Đánh dấu';
      if (flagIcon) flagIcon.textContent = 'bookmark';
    }
  }

  // Question Prompt Text
  const promptEl = document.querySelector('section:nth-of-type(2) > p.font-headline-sm');
  if (promptEl) promptEl.textContent = q.text;

  // Passage update for Part 6 & 7
  const passageSection = document.querySelector('section:first-of-type');
  const passageTitle = passageSection ? passageSection.querySelector('.uppercase') : null;
  const passageCanvas = document.getElementById('passage-canvas');

  if (q.part === 5) {
    if (passageSection) passageSection.style.display = 'none';
  } else {
    if (passageSection) passageSection.style.display = 'flex';
    // Find matching passage
    const passage = findPassageForQuestion(q.id);
    if (passage && passageCanvas) {
      if (passageTitle) passageTitle.textContent = passage.title || `Passage Part ${q.part}`;
      passageCanvas.innerHTML = `
        <div class="whitespace-pre-line text-sm leading-relaxed">${escapeHtml(passage.content)}</div>
      `;
    }
  }

  // Render Choices A, B, C, D
  renderChoices(q);

  // Update Navigation buttons (Prev / Next)
  updateNavButtons();

  // Update progress
  updateProgressBar();
  renderMatrixGrid();
}

function renderChoices(q) {
  const choicesContainer = document.querySelector('div[role="radiogroup"]');
  if (!choicesContainer) return;

  const currentAns = userAnswers[q.id];
  const labels = ['A', 'B', 'C', 'D'];

  let html = '';
  labels.forEach(lbl => {
    const isSelected = currentAns === lbl;
    const optText = q.options[lbl] || '';

    html += `
      <label class="flex items-center gap-space-sm p-3 rounded-xl ${isSelected ? 'bg-secondary-fixed/60 border border-secondary text-primary' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'} cursor-pointer transition-all active:scale-[0.99] shadow-xs" onclick="pickOption('${lbl}')">
        <input type="radio" name="current_question" value="${lbl}" class="hidden" ${isSelected ? 'checked' : ''} />
        <div class="w-8 h-8 rounded-full ${isSelected ? 'bg-secondary-container text-on-secondary-container shadow-sm' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center font-label-lg font-bold shrink-0">
          ${isSelected ? '<span class="material-symbols-outlined text-[18px]">check</span>' : lbl}
        </div>
        <span class="font-body-md ${isSelected ? 'font-semibold text-primary' : ''}">${escapeHtml(optText)}</span>
      </label>
    `;
  });

  choicesContainer.innerHTML = html;
}

function pickOption(lbl) {
  const q = examData.questions[currentQuestionIndex];
  if (!q) return;

  userAnswers[q.id] = lbl;
  renderChoices(q);
  updateProgressBar();
  renderMatrixGrid();
}

function clearSelectedAnswer() {
  const q = examData.questions[currentQuestionIndex];
  if (!q) return;

  delete userAnswers[q.id];
  renderChoices(q);
  updateProgressBar();
  renderMatrixGrid();
}

function toggleFlagCurrentQuestion() {
  const q = examData.questions[currentQuestionIndex];
  if (!q) return;

  if (flaggedQuestions.has(q.id)) {
    flaggedQuestions.delete(q.id);
  } else {
    flaggedQuestions.add(q.id);
  }
  renderQuestion(currentQuestionIndex);
}

function updateNavButtons() {
  const navContainer = document.querySelector('.grid.grid-cols-2.gap-space-sm.mb-space-md');
  if (!navContainer) return;

  const prevBtn = navContainer.children[0];
  const nextBtn = navContainer.children[1];

  const total = examData.questions.length;

  if (currentQuestionIndex > 0) {
    prevBtn.style.visibility = 'visible';
    const prevQ = examData.questions[currentQuestionIndex - 1];
    prevBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">chevron_left</span><span>Câu ${prevQ.id}</span>`;
    prevBtn.onclick = () => renderQuestion(currentQuestionIndex - 1);
  } else {
    prevBtn.style.visibility = 'hidden';
  }

  if (currentQuestionIndex < total - 1) {
    const nextQ = examData.questions[currentQuestionIndex + 1];
    nextBtn.innerHTML = `<span>Câu ${nextQ.id}</span><span class="material-symbols-outlined text-[20px]">chevron_right</span>`;
    nextBtn.onclick = () => renderQuestion(currentQuestionIndex + 1);
  } else {
    nextBtn.innerHTML = `<span>Hoàn tất & Nộp</span><span class="material-symbols-outlined text-[20px]">check</span>`;
    nextBtn.onclick = () => toggleSubmitModal(true);
  }
}

function updateProgressBar() {
  const answeredCount = Object.keys(userAnswers).length;
  const total = examData.questions.length;
  const pct = Math.round((answeredCount / total) * 100);

  const progressText = document.querySelector('.flex.flex-col.gap-1.mt-space-sm strong');
  if (progressText) progressText.textContent = `${answeredCount}/${total} câu`;

  const pctText = document.querySelector('.flex.flex-col.gap-1.mt-space-sm .text-secondary');
  if (pctText) pctText.textContent = `${pct}%`;

  const progressBar = document.querySelector('.flex.flex-col.gap-1.mt-space-sm .bg-secondary-container');
  if (progressBar) progressBar.style.width = `${pct}%`;
}

function renderMatrixGrid() {
  const matrixContainer = document.getElementById('matrix-container');
  if (!matrixContainer || !examData.questions) return;

  let html = '';
  examData.questions.forEach((q, idx) => {
    const isAnswered = !!userAnswers[q.id];
    const isCurrent = idx === currentQuestionIndex;
    const isFlagged = flaggedQuestions.has(q.id);

    let btnClass = 'h-9 rounded-lg font-label-sm font-semibold flex items-center justify-center active:scale-90 relative cursor-pointer ';

    if (isCurrent) {
      btnClass += 'bg-secondary-container text-on-secondary-container shadow-md scale-105 ring-2 ring-secondary font-bold';
    } else if (isAnswered) {
      btnClass += 'bg-primary-container text-on-primary';
    } else {
      btnClass += 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest';
    }

    html += `
      <button class="${btnClass}" onclick="renderQuestion(${idx})" type="button">
        ${q.id}
        ${isFlagged ? '<span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>' : ''}
      </button>
    `;
  });

  matrixContainer.innerHTML = html;

  // Update counts in legend
  const legendAnswered = document.querySelector('.bg-surface-container-low strong.text-primary');
  if (legendAnswered) legendAnswered.textContent = Object.keys(userAnswers).length;

  const legendUnanswered = document.querySelector('.bg-surface-container-low strong.text-on-surface-variant');
  if (legendUnanswered) legendUnanswered.textContent = examData.questions.length - Object.keys(userAnswers).length;

  const legendFlagged = document.querySelector('.bg-surface-container-low strong.text-error');
  if (legendFlagged) legendFlagged.textContent = flaggedQuestions.size;
}

function jumpToFirstQuestionOfPart(part) {
  const idx = examData.questions.findIndex(q => q.part === part);
  if (idx >= 0) {
    renderQuestion(idx);
  }
}

function findPassageForQuestion(qId) {
  if (!examData.passages) return null;
  for (const p of examData.passages) {
    if (p.questions) {
      const parts = p.questions.split('-');
      if (parts.length === 2) {
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);
        if (qId >= start && qId <= end) return p;
      }
    }
  }
  return examData.passages[0] || null;
}

function toggleSubmitModal(show) {
  const modal = document.getElementById('submit-confirm-modal');
  if (!modal) return;
  if (show) {
    modal.classList.remove('hidden');
    // Update answered summary in modal
    const summary = modal.querySelector('p');
    if (summary) {
      summary.innerHTML = `Bạn đã hoàn thành <strong>${Object.keys(userAnswers).length}/${examData.questions.length}</strong> câu hỏi.<br/>Bạn có chắc chắn muốn kết thúc bài thi?`;
    }

    // Attach submit button
    const confirmBtn = modal.querySelector('button.bg-primary') || modal.querySelector('button:last-child');
    if (confirmBtn) {
      confirmBtn.onclick = () => submitExam(false);
    }
    const cancelBtn = modal.querySelector('button:first-of-type');
    if (cancelBtn) {
      cancelBtn.onclick = () => toggleSubmitModal(false);
    }
  } else {
    modal.classList.add('hidden');
  }
}

function submitExam(isAuto = false) {
  clearInterval(timerInterval);

  // Score calculation
  let correctCount = 0;
  let part5Correct = 0, part5Total = 0;
  let part6Correct = 0, part6Total = 0;
  let part7Correct = 0, part7Total = 0;

  examData.questions.forEach(q => {
    const userChoice = userAnswers[q.id];
    const isCorrect = userChoice && userChoice.toUpperCase() === q.correctAnswer.toUpperCase();

    if (q.part === 5) {
      part5Total++;
      if (isCorrect) part5Correct++;
    } else if (q.part === 6) {
      part6Total++;
      if (isCorrect) part6Correct++;
    } else {
      part7Total++;
      if (isCorrect) part7Correct++;
    }

    if (isCorrect) correctCount++;
  });

  const total = examData.questions.length;
  const incorrectCount = Object.keys(userAnswers).length - correctCount;
  const unansweredCount = total - Object.keys(userAnswers).length;
  const estimatedScore = ToeicDB.calculateToeicScore(correctCount);

  const resultObj = {
    examId: examData.id,
    examTitle: examData.title,
    submittedAt: new Date().toISOString(),
    durationSecondsSpent: (examData.durationMinutes * 60) - remainingSeconds,
    totalQuestions: total,
    correctCount: correctCount,
    incorrectCount: Math.max(0, incorrectCount),
    unansweredCount: Math.max(0, unansweredCount),
    accuracyPct: Math.round((correctCount / total) * 100),
    estimatedScore: estimatedScore,
    partStats: {
      part5: { correct: part5Correct, total: part5Total },
      part6: { correct: part6Correct, total: part6Total },
      part7: { correct: part7Correct, total: part7Total }
    },
    userAnswers: userAnswers
  };

  ToeicDB.saveResult(resultObj);
  window.location.href = `student_exam_result.html?examId=${examData.id}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
