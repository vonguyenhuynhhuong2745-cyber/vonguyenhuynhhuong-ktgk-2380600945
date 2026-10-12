using Huong.Configuration.Dto;
using System.Threading.Tasks;

namespace Huong.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
