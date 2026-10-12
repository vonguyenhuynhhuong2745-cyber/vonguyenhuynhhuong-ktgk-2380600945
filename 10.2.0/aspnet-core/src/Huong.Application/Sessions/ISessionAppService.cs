using Abp.Application.Services;
using Huong.Sessions.Dto;
using System.Threading.Tasks;

namespace Huong.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
