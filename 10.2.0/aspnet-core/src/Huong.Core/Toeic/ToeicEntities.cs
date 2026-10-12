using System;
using System.Collections.Generic;
using Abp.Domain.Entities.Auditing;

namespace Huong.Toeic
{
    /// <summary>
    /// Thực thể Quản lý Đề thi TOEIC Reading
    /// </summary>
    public class ToeicExam : FullAuditedEntity<Guid>
    {
        public string Title { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; } = 75;
        public int TotalQuestions { get; set; } = 100;
        public string SourceFileName { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<ToeicPassage> Passages { get; set; } = new List<ToeicPassage>();
        public virtual ICollection<ToeicQuestion> Questions { get; set; } = new List<ToeicQuestion>();
        public virtual ICollection<ToeicExamAttempt> Attempts { get; set; } = new List<ToeicExamAttempt>();
    }

    /// <summary>
    /// Thực thể Bài đọc hiểu (Part 6 & Part 7)
    /// </summary>
    public class ToeicPassage : FullAuditedEntity<Guid>
    {
        public Guid ExamId { get; set; }
        public int PartNumber { get; set; } // 6 hoặc 7
        public string QuestionRange { get; set; } // "131-134" hoặc "151-155"
        public string Title { get; set; }
        public string Content { get; set; }
    }

    /// <summary>
    /// Thực thể Câu hỏi trắc nghiệm Part 5, 6, 7
    /// </summary>
    public class ToeicQuestion : FullAuditedEntity<Guid>
    {
        public Guid ExamId { get; set; }
        public int QuestionNumber { get; set; } // 101 -> 200
        public int PartNumber { get; set; } // 5, 6, 7
        public string Content { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string CorrectAnswer { get; set; } // "A", "B", "C", "D"
        public string Explanation { get; set; }
        public Guid? PassageId { get; set; }
    }

    /// <summary>
    /// Thực thể Lượt thi của Thí sinh / Học viên
    /// </summary>
    public class ToeicExamAttempt : FullAuditedEntity<Guid>
    {
        public Guid ExamId { get; set; }
        public long UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? SubmitTime { get; set; }
        public int TimeSpentSeconds { get; set; }
        public int CorrectAnswersCount { get; set; }
        public int IncorrectAnswersCount { get; set; }
        public int UnansweredCount { get; set; }
        public int EstimatedScore { get; set; } // Thang điểm 495
        public decimal AccuracyPercentage { get; set; }
        public string UserAnswersJson { get; set; }
    }
}
