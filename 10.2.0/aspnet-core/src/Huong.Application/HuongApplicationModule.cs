using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Huong.Authorization;

namespace Huong;

[DependsOn(
    typeof(HuongCoreModule),
    typeof(AbpAutoMapperModule))]
public class HuongApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<HuongAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(HuongApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
