using Abp.Zero.EntityFrameworkCore;
using Huong.Authorization.Roles;
using Huong.Authorization.Users;
using Huong.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Huong.EntityFrameworkCore;

public class HuongDbContext : AbpZeroDbContext<Tenant, Role, User, HuongDbContext>
{
    /* Define a DbSet for each entity of the application */

    public HuongDbContext(DbContextOptions<HuongDbContext> options)
        : base(options)
    {
    }
}
