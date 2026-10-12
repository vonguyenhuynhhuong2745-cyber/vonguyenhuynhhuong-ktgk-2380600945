using Abp.Application.Services;
using Huong.MultiTenancy.Dto;

namespace Huong.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

