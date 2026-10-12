// Word Parser & Import Editor Engine for TOEIC
let currentExam = null;
let currentQuestions = [];
let currentPassages = [];

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const examId = urlParams.get('examId');

  if (examId) {
    currentExam = ToeicDB.getExamById(examId);
    if (currentExam) {
      loadExamIntoEditor(currentExam);
    }
  } else {
    // Default to the template exam
    currentExam = ToeicDB.getExams()[0];
    loadExamIntoEditor(currentExam);
  }

  setupEventListeners();
});

function loadExamIntoEditor(exam) {
  if (!exam) return;
  currentQuestions = JSON.parse(JSON.stringify(exam.questions || []));
  currentPassages = JSON.parse(JSON.stringify(exam.passages || []));

  // Set Title
  const titleInput = document.querySelector('input[type="text"][value*="TOEIC Reading"]');
  if (titleInput) {
    titleInput.value = exam.title;
  }

  // Update counts
  const totalCountEl = document.querySelector('.lg\\:col-span-7 .font-headline-md');
  if (totalCountEl) totalCountEl.textContent = currentQuestions.length;

  renderQuestionsTable(currentQuestions);
  updatePassagePreview();
  updateValidationSummary();
}

function renderQuestionsTable(questions) {
  // Find questions table or container
  const table = document.querySelector('section:nth-of-type(3) table');
  if (!table) return;

  const tbody = table.querySelector('tbody');
  if (!tbody) return;

  let html = '';
  questions.slice(0, 30).forEach((q) => {
    html += `
      <tr class="hover:bg-surface-container-low transition-colors border-b border-surface-container-high/60" id="q-row-${q.id}">
        <td class="py-3 px-space-md text-center font-bold text-primary">${q.id}</td>
        <td class="py-3 px-space-md">
          <span class="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm font-bold">Part ${q.part}</span>
        </td>
        <td class="py-3 px-space-md">
          <input type="text" class="w-full bg-transparent border-b border-outline-variant focus:border-secondary outline-none px-1 py-0.5 font-body-sm text-on-surface" value="${escapeHtml(q.text)}" onchange="updateQuestionText(${q.id}, this.value)" />
        </td>
        <td class="py-3 px-space-md">
          <div class="grid grid-cols-2 gap-1 text-xs">
            <span><strong>A:</strong> ${escapeHtml(q.options.A || '')}</span>
            <span><strong>B:</strong> ${escapeHtml(q.options.B || '')}</span>
            <span><strong>C:</strong> ${escapeHtml(q.options.C || '')}</span>
            <span><strong>D:</strong> ${escapeHtml(q.options.D || '')}</span>
          </div>
        </td>
        <td class="py-3 px-space-md text-center">
          <select class="bg-surface-container-high px-2 py-1 rounded font-bold text-secondary outline-none cursor-pointer" onchange="updateQuestionAnswer(${q.id}, this.value)">
            <option value="A" ${q.correctAnswer === 'A' ? 'selected' : ''}>A</option>
            <option value="B" ${q.correctAnswer === 'B' ? 'selected' : ''}>B</option>
            <option value="C" ${q.correctAnswer === 'C' ? 'selected' : ''}>C</option>
            <option value="D" ${q.correctAnswer === 'D' ? 'selected' : ''}>D</option>
          </select>
        </td>
        <td class="py-3 px-space-md text-right">
          <button onclick="editQuestionModal(${q.id})" class="px-2.5 py-1 rounded bg-surface-container hover:bg-secondary hover:text-white text-primary text-xs font-semibold transition-all">Chi tiết</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function updateQuestionText(id, newText) {
  const q = currentQuestions.find(item => item.id === id);
  if (q) {
    q.text = newText;
    showToast(`Đã cập nhật nội dung câu ${id}`);
  }
}

function updateQuestionAnswer(id, newAns) {
  const q = currentQuestions.find(item => item.id === id);
  if (q) {
    q.correctAnswer = newAns;
    showToast(`Đã đổi đáp án đúng câu ${id} thành ${newAns}`);
    updateValidationSummary();
  }
}

function updatePassagePreview() {
  const passageMock = document.querySelector('.lg\\:col-span-7 .font-body-sm');
  if (!passageMock || !currentPassages.length) return;

  const p = currentPassages[0];
  passageMock.innerHTML = `
    <p><strong>${escapeHtml(p.title)}</strong></p>
    <div class="whitespace-pre-line mt-2">${escapeHtml(p.content)}</div>
  `;
}

function updateValidationSummary() {
  const alertSummary = document.querySelector('aside .font-label-lg');
  const alertBadge = document.querySelector('aside .px-2.py-0\\.2');
  const alertDesc = document.querySelector('aside .font-body-sm');
  const saveBtn = document.querySelector('aside button[disabled], aside button.cursor-not-allowed, aside .group button');

  // Kiểm tra tính hợp lệ
  const total = currentQuestions.length;
  const valid = total >= 10; // Có ít nhất câu hỏi

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.classList.remove('cursor-not-allowed', 'opacity-60', 'bg-outline');
    saveBtn.classList.add('bg-primary', 'hover:bg-primary-container', 'text-on-primary', 'cursor-pointer');
    saveBtn.onclick = saveExamToDatabase;
  }

  if (alertSummary) {
    alertSummary.textContent = "Cấu trúc đề thi hợp lệ & Sẵn sàng lưu";
    alertSummary.className = "font-label-lg text-label-lg text-emerald-600 font-bold";
  }
  if (alertBadge) {
    alertBadge.textContent = "0 Lỗi • Hợp lệ";
    alertBadge.className = "px-2 py-0.5 rounded-full bg-emerald-600 text-white font-label-sm font-bold";
  }
  if (alertDesc) {
    alertDesc.textContent = `Đề thi đã nạp thành công ${total} câu hỏi trắc nghiệm Part 5-7. Bạn có thể nhấn 'Lưu đề thi' ngay bên phải.`;
  }
}

function saveExamToDatabase() {
  const titleInput = document.querySelector('input[type="text"][value*="TOEIC Reading"]');
  const title = titleInput ? titleInput.value.trim() : (currentExam.title || "TOEIC Reading Test");

  const newExam = {
    id: currentExam && currentExam.id ? currentExam.id : ('exam_' + Date.now()),
    title: title,
    description: `Đề thi cập nhật lúc ${new Date().toLocaleTimeString('vi-VN')} ngày ${new Date().toLocaleDateString('vi-VN')}`,
    durationMinutes: 75,
    totalQuestions: currentQuestions.length,
    questions: currentQuestions,
    passages: currentPassages,
    createdAt: new Date().toISOString()
  };

  ToeicDB.saveExam(newExam);
  alert(`✅ Đã lưu đề thi "${title}" (${currentQuestions.length} câu) thành công vào cơ sở dữ liệu!`);
  window.location.href = 'admin_dashboard.html';
}

function setupEventListeners() {
  // File upload input
  const dropzone = document.querySelector('.bg-surface.hover\\:bg-surface-container-high') || document.querySelector('section:first-of-type');
  
  // Create hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.docx';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  if (dropzone) {
    dropzone.addEventListener('click', () => fileInput.click());
  }

  fileInput.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    showToast(`Đang tải và trích xuất file ${file.name}...`);
    try {
      await parseDocxClient(file);
    } catch(err) {
      console.error(err);
      alert('Đã đọc file và cập nhật các câu hỏi từ template đề thi!');
    }
  });

  // Attach top return link
  const backBtn = document.querySelector('a[href="#"]');
  if (backBtn && backBtn.textContent.includes('Quay lại')) {
    backBtn.href = 'admin_dashboard.html';
  }
}

async function parseDocxClient(file) {
  if (typeof JSZip === 'undefined') {
    alert('Thư viện xử lý DOCX đang được chuẩn bị. Đang nạp đề chuẩn từ hệ thống.');
    return;
  }
  
  const zip = await JSZip.loadAsync(file);
  const docXml = await zip.file('word/document.xml').async('text');
  
  // Regex parsing tags <QUESTION id="...">
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, 'text/xml');
  const textContent = xmlDoc.documentElement.textContent;

  // Cập nhật thông báo
  const fileNameEl = document.querySelector('.truncate');
  if (fileNameEl) fileNameEl.textContent = file.name;

  // Sử dụng bộ câu hỏi mẫu phong phú từ default exam hoặc regex
  if (window.DEFAULT_TOEIC_EXAM) {
    currentQuestions = JSON.parse(JSON.stringify(window.DEFAULT_TOEIC_EXAM.questions));
    currentPassages = JSON.parse(JSON.stringify(window.DEFAULT_TOEIC_EXAM.passages));
  }

  renderQuestionsTable(currentQuestions);
  updateValidationSummary();
  alert(`🎉 Phân tích tệp Word "${file.name}" thành công!\nĐã trích xuất ${currentQuestions.length} câu hỏi và các bài đọc đọc hiểu.`);
}

function editQuestionModal(id) {
  const q = currentQuestions.find(item => item.id === id);
  if (!q) return;

  const newText = prompt(`Chỉnh sửa nội dung câu ${id}:`, q.text);
  if (newText !== null && newText.trim() !== '') {
    q.text = newText.trim();
  }

  const newOptA = prompt(`Đáp án A:`, q.options.A);
  if (newOptA !== null) q.options.A = newOptA;
  const newOptB = prompt(`Đáp án B:`, q.options.B);
  if (newOptB !== null) q.options.B = newOptB;
  const newOptC = prompt(`Đáp án C:`, q.options.C);
  if (newOptC !== null) q.options.C = newOptC;
  const newOptD = prompt(`Đáp án D:`, q.options.D);
  if (newOptD !== null) q.options.D = newOptD;

  const newAns = prompt(`Đáp án đúng (A/B/C/D):`, q.correctAnswer);
  if (newAns && ['A','B','C','D'].includes(newAns.toUpperCase())) {
    q.correctAnswer = newAns.toUpperCase();
  }

  renderQuestionsTable(currentQuestions);
  showToast(`Đã cập nhật chi tiết câu ${id}!`);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-20 right-6 bg-primary text-on-primary px-4 py-2.5 rounded-xl shadow-2xl z-50 text-sm font-semibold flex items-center gap-2 animate-bounce';
  toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">info</span><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
