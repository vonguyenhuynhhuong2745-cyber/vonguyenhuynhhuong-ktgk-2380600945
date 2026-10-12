using Abp.Authorization;
using Abp.Runtime.Session;
using Huong.Configuration.Dto;
using System.Threading.Tasks;

namespace Huong.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : HuongAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
