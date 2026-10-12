using System.ComponentModel.DataAnnotations;

namespace Huong.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
