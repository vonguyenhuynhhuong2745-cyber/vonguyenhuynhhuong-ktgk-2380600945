using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Huong.Controllers
{
    public abstract class HuongControllerBase : AbpController
    {
        protected HuongControllerBase()
        {
            LocalizationSourceName = HuongConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
