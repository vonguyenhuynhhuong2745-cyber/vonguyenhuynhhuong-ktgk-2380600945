using Abp.Authorization;
using Huong.Authorization.Roles;
using Huong.Authorization.Users;

namespace Huong.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
