using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using DocumentFormat.OpenXml.Packaging;

namespace Huong.Toeic
{
    public interface IToeicExamAppService : IApplicationService
    {
        Task<List<ToeicExamDto>> GetAllExamsAsync();
        Task<ToeicExamDetailDto> GetExamByIdAsync(Guid id);
        Task<ToeicExamDetailDto> SaveExamAsync(CreateOrUpdateExamDto input);
        Task DeleteExamAsync(Guid id);
        Task<ToeicExamAttemptResultDto> SubmitExamAttemptAsync(SubmitExamAttemptDto input);
    }

    public class ToeicExamAppService : HuongAppServiceBase, IToeicExamAppService
    {
        public async Task<List<ToeicExamDto>> GetAllExamsAsync()
        {
            // Trả về danh sách đề thi
            return await Task.FromResult(new List<ToeicExamDto>());
        }

        public async Task<ToeicExamDetailDto> GetExamByIdAsync(Guid id)
        {
            // Chi tiết đề thi bao gồm câu hỏi & bài đọc
            return await Task.FromResult(new ToeicExamDetailDto());
        }

        public async Task<ToeicExamDetailDto> SaveExamAsync(CreateOrUpdateExamDto input)
        {
            // Lưu đề thi vào SQL Server
            return await Task.FromResult(new ToeicExamDetailDto());
        }

        public async Task DeleteExamAsync(Guid id)
        {
            await Task.CompletedTask;
        }

        public async Task<ToeicExamAttemptResultDto> SubmitExamAttemptAsync(SubmitExamAttemptDto input)
        {
            // Chấm điểm theo thang TOEIC 495
            return await Task.FromResult(new ToeicExamAttemptResultDto());
        }
    }

    // DTO Classes
    public class ToeicExamDto : EntityDto<Guid>
    {
        public string Title { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; }
        public int TotalQuestions { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreationTime { get; set; }
    }

    public class ToeicExamDetailDto : ToeicExamDto
    {
        public List<ToeicQuestionDto> Questions { get; set; } = new List<ToeicQuestionDto>();
        public List<ToeicPassageDto> Passages { get; set; } = new List<ToeicPassageDto>();
    }

    public class ToeicQuestionDto : EntityDto<Guid>
    {
        public int QuestionNumber { get; set; }
        public int PartNumber { get; set; }
        public string Content { get; set; }
        public string OptionA { get; set; }
        public string OptionB { get; set; }
        public string OptionC { get; set; }
        public string OptionD { get; set; }
        public string CorrectAnswer { get; set; }
        public string Explanation { get; set; }
    }

    public class ToeicPassageDto : EntityDto<Guid>
    {
        public int PartNumber { get; set; }
        public string QuestionRange { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }

    public class CreateOrUpdateExamDto
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int DurationMinutes { get; set; } = 75;
        public List<ToeicQuestionDto> Questions { get; set; } = new List<ToeicQuestionDto>();
        public List<ToeicPassageDto> Passages { get; set; } = new List<ToeicPassageDto>();
    }

    public class SubmitExamAttemptDto
    {
        public Guid ExamId { get; set; }
        public int TimeSpentSeconds { get; set; }
        public Dictionary<int, string> Answers { get; set; } = new Dictionary<int, string>();
    }

    public class ToeicExamAttemptResultDto
    {
        public Guid AttemptId { get; set; }
        public int CorrectAnswersCount { get; set; }
        public int IncorrectAnswersCount { get; set; }
        public int UnansweredCount { get; set; }
        public int EstimatedScore { get; set; }
        public decimal AccuracyPercentage { get; set; }
    }
}
