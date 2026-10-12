// TOEIC Storage & State Management Helper
const TOEIC_STORAGE_KEY = 'TOEIC_ASSESSMENT_EXAMS_V1';
const TOEIC_RESULTS_KEY = 'TOEIC_ASSESSMENT_RESULTS_V1';

const ToeicDB = {
  // Lấy toàn bộ danh sách đề thi
  getExams() {
    let data = localStorage.getItem(TOEIC_STORAGE_KEY);
    if (!data) {
      const initial = [window.DEFAULT_TOEIC_EXAM];
      localStorage.setItem(TOEIC_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(data);
    } catch(e) {
      console.error(e);
      return [window.DEFAULT_TOEIC_EXAM];
    }
  },

  // Lấy 1 đề thi theo ID
  getExamById(id) {
    const exams = this.getExams();
    return exams.find(e => e.id === id) || exams[0] || window.DEFAULT_TOEIC_EXAM;
  },

  // Lưu hoặc cập nhật 1 đề thi
  saveExam(exam) {
    const exams = this.getExams();
    const idx = exams.findIndex(e => e.id === exam.id);
    if (idx >= 0) {
      exams[idx] = exam;
    } else {
      exams.unshift(exam);
    }
    localStorage.setItem(TOEIC_STORAGE_KEY, JSON.stringify(exams));
    return exam;
  },

  // Xóa đề thi
  deleteExam(id) {
    let exams = this.getExams();
    exams = exams.filter(e => e.id !== id);
    localStorage.setItem(TOEIC_STORAGE_KEY, JSON.stringify(exams));
    return exams;
  },

  // Lưu kết quả làm bài
  saveResult(result) {
    let results = [];
    try {
      results = JSON.parse(localStorage.getItem(TOEIC_RESULTS_KEY) || '[]');
    } catch(e) {}
    results.unshift(result);
    localStorage.setItem(TOEIC_RESULTS_KEY, JSON.stringify(results));
    localStorage.setItem('TOEIC_LATEST_RESULT', JSON.stringify(result));
    return result;
  },

  // Lấy kết quả mới nhất
  getLatestResult() {
    try {
      const res = localStorage.getItem('TOEIC_LATEST_RESULT');
      if (res) return JSON.parse(res);
      const all = JSON.parse(localStorage.getItem(TOEIC_RESULTS_KEY) || '[]');
      return all[0] || null;
    } catch(e) {
      return null;
    }
  },

  // Tính điểm TOEIC Reading chuẩn theo số câu đúng (thang điểm 495)
  calculateToeicScore(correctCount) {
    if (correctCount >= 96) return 495;
    if (correctCount >= 90) return 470;
    if (correctCount >= 85) return 440;
    if (correctCount >= 80) return 415;
    if (correctCount >= 75) return 390;
    if (correctCount >= 70) return 360;
    if (correctCount >= 65) return 330;
    if (correctCount >= 60) return 300;
    if (correctCount >= 50) return 250;
    if (correctCount >= 40) return 200;
    if (correctCount >= 30) return 150;
    if (correctCount >= 20) return 100;
    return Math.max(10, correctCount * 5);
  }
};

window.ToeicDB = ToeicDB;
