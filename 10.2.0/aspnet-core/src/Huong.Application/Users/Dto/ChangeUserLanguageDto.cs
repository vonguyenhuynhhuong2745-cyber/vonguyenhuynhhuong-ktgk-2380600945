using System.ComponentModel.DataAnnotations;

namespace Huong.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}