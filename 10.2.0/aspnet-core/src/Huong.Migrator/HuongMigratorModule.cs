using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Huong.Configuration;
using Huong.EntityFrameworkCore;
using Huong.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace Huong.Migrator;

[DependsOn(typeof(HuongEntityFrameworkModule))]
public class HuongMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public HuongMigratorModule(HuongEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(HuongMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            HuongConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(HuongMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
