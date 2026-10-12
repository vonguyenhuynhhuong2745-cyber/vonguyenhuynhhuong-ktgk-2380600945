using Abp.Application.Services;
using Huong.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace Huong.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
