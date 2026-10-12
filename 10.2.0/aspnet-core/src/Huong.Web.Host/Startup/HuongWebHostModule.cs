using Abp.Modules;
using Abp.Reflection.Extensions;
using Huong.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Huong.Web.Host.Startup
{
    [DependsOn(
       typeof(HuongWebCoreModule))]
    public class HuongWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public HuongWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(HuongWebHostModule).GetAssembly());
        }
    }
}
